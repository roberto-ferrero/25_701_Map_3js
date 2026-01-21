//import gsap from "gsap"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import AppLoaders from "../core/app/AppLoaders"

const EventEmitter = require('events');

class StageSuper{
    constructor (obj){
        // console.log("(StageSuper.CONSTRUCTORA): ", obj)
        this.id = obj.id
        this.app = obj.app
        this.project = obj.project
        this.AUTO_LOAD = obj.autoLoad
        //--
        this.ACTIVE = this.autoActive
        this.INITIALISED = false
        this.LOADED = false
        this.BUILT = false
        this.SHOW_DEV_CAMERA = false
        //--
        this.show_dev_camera_token = "show_dev_camera_"+this.id
        this.gui_data = {}
        this.gui_data[this.show_dev_camera_token] = this.SHOW_DEV_CAMERA
        //--
        // EMITTER:
        this.emitter = new EventEmitter()
        this.emitter.setMaxListeners(2000)
        //--
        this.loader = new AppLoaders({
            app:this.app,
            pathPrefix: this.app.loader_pathPrefix
        })
        this.loader.emitter.on("onCompleted", ()=>{
            // console.log("STAGE LOADER COMPLETED: "+this.id);
            this.LOADED = true
            this.project.emitter.emit("onStageLoaded", {stageId:this.id})
            //if(this.AUTO_LOAD) this.project.core.eval_initial_loads()
        })
        //-----------------------
        if(this.app.USE_RENDER_PLANE){
            this.scene = new THREE.Scene()
            this.sceneRenderer = new THREE.WebGLRenderTarget(this.app.size.REF.width*2, this.app.size.REF.height*2, {
                minFilter:THREE.NearestFilter,
                magFilter:THREE.NearestFilter,
                // format: RGBAFormat,
                type: THREE.HalfFloatType,
                // colorSpace: THREE.LinearSRGBColorSpace //SRGBColorSpace 
            })
        }else{
            this.scene = this.app.scene
        }

        
        //-----------------------
        // APP EVENTS:
        this.app.emitter.on("onAppBuild", (data)=>{
            // console.log("(StageSuper.onAppBuild): ")
            this.__update_resize()
        })
        this.app.emitter.on("onAppSizeUpdate", (data)=>{
            // console.log("(StageSuper.onAppSizeUpdate): ")
            this.__update_resize()
        })
        this.app.emitter.on("onDevPrintState", (data)=>{
            // console.log("(StageSuper.onDevPrintState): ")
            // console.log("   this.sceneRenderer.width: "+this.sceneRenderer.width)
            // console.log("   this.sceneRenderer.height: "+this.sceneRenderer.height);
        })
        
        //-----------------------
        // PROJECTS EVENTS:
        this.project.emitter.on("onProjectInit", (data)=>{
            // console.log("(StageSuper.onProjectInit): ")
            this.__init()
        })
        this.project.emitter.on("onProjectBuilt", (data)=>{
            // console.log("(StageSuper.onProjectBuilt): ")
            this.__build()
        })
        this.project.emitter.on("onActivateStage", (data)=>{
            if(data.stageId == this.id){
                this.ACTIVE = true
                this.emitter.emit("onStageActivated")
            }else{
                this.ACTIVE = false
                this.emitter.emit("onStageDeactivated")
            }
        })


        //-----------------------
        // DEV:
        if(this.app.USE_RENDER_PLANE){
            this.devCamera = new THREE.PerspectiveCamera(70, this.app.size.REF.width / this.app.size.REF.height, 0.1, 20000 );
            this.devCamera.position.set(200, 200, 500)
            this.devCamera.lookAt(new THREE.Vector3(0, 0, 0))
            if(!this.app.state.MOBILE_MODE){
                this.devControls = new OrbitControls(this.devCamera, this.app.$mouseEvents)
                this.devControls.enabled = false
            }
            if(this.app.dev_gui){
                this.app.dev.gui.add(this.gui_data, this.show_dev_camera_token).listen().onChange((value) => {
                    if(value){
                        this._show_dev_camera()
                    }else{
                        this._hide_dev_camera()
                    }
                });
            }
        }

        //-----------------------
        // DEV:
    }
    //----------------------------------------------
    // INTERNAL:
    __init(){ 
        if(this.AUTO_LOAD && !this.INITIALISED){
            console.log("(StageSuper.__init): ------------- "+this.id)
            this.INITIALISED = true
            this.init()
            this.loader.start()
        }
    }
    
    __build(){
        if(this.LOADED && !this.BUILT){
            // console.log("(StageSuper.__build): ------------- "+this.id)
            this.BUILT = true
            //this.stage.build()
            this.build()
            this.__update_RAF(true)
        }
    }
    __update_RAF(force){
        // console.log("(StageSuper.__update_RAF): ------------- "+this.id)
        if(this.ACTIVE || force){
            if(this.app.USE_RENDER_PLANE){
                // console.log("this.scene: ",this.scene);
                this.app.render.renderer.setRenderTarget(this.sceneRenderer);
                this.app.render.renderer.render(this.scene, this._get_activeCamera());
                this.app.render.renderer.setRenderTarget(null);
            }
            this.update_RAF()
        }
    }
    __update_resize(){
        this.update_resize()
    }
    //----------------------------------------------
    // OVERRIDES:
    init(){
        // TO BE OVERRIDED
    }
    build(){
        // TO BE OVERRIDED
    }
    update_RAF(){
        // TO BE OVERRIDED
    }
    update_resize(){
        // TO BE OVERRIDED
    }
    //----------------------------------------------
    // PUBLIC:
    //--
    get_texture(){
        return this.sceneRenderer.texture
    }
    //----------------------------------------------
    // UPDATE:
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // PRIVATE:
   
    _get_activeCamera(){
        if(this.SHOW_DEV_CAMERA){
            return this.devCamera
        }else{
            return this.stageCamera.camera
        }
    }
    _show_dev_camera(){
        if(!this.SHOW_DEV_CAMERA){
            this.SHOW_DEV_CAMERA = true
            this.devControls.enabled = true
            //this.app.emitter.emit("onAppDevCamera", {show:this.SHOW_DEV_CAMERA})
            this.gui_data.show_dev_camera = this.SHOW_DEV_CAMERA
        }
    }
    _hide_dev_camera(){
        if(this.SHOW_DEV_CAMERA){
            this.SHOW_DEV_CAMERA = false
            this.devControls.enabled = false
            //this.app.emitter.emit("onAppDevCamera", {show:this.SHOW_DEV_CAMERA})
            this.gui_data.show_dev_camera = this.SHOW_DEV_CAMERA
        }
    }
    //----------------------------------------------
    // AUX:

  
}
export default StageSuper