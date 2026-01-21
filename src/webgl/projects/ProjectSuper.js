//import gsap from "gsap"
import * as THREE from 'three'

import AppLoaders from "../core/app/AppLoaders"
import Datos from "../core/utils/Datos"


import vertexShader from './_shaders/vertex_simple.glsl'; // Just generates varying vUv
import fragmentShader from './_shaders/frag_simple.glsl'; // Final shader


const EventEmitter = require('events');

class ProjectSuper{
    constructor (obj){
        // console.log("(ProjectSuper.CONSTRUCTORA): ", obj)
        this.id = obj.id
        //--
        this.BUILT = false
        this.ACTIVE = true
        this.CORE_LOADED = false
        this.INITIAL_STAGES_LOADED = false
        this.ALL_STAGES_LOADED = false
        this.STARTED = false
        //--
        this.CURRENT_STAGE_ID = ""
        this.TRANSITION_STAGE_IN = ""
        this.TRANSITION_STAGE_OUT = ""
        this.TRANSITION_REF = null
        this.TRANSITIONING = false
        //--
        // EMITTER:
        this.emitter = new EventEmitter()
        this.emitter.setMaxListeners(2000)
        //--
        this.transitions = new Datos()
        this.stages = new Datos()
        this.initial_loading_stages = []
        this.gui_data = {}
    }
    //----------------------------------------------
    registerApp(app){ // Called by WEBGLApp on Construct
        // console.log("(ProjectSuper.registerApp)!", app)
        this.app = app
        // console.log("this.app.emitter: ", this.app.emitter);
        //-----------------------
        // APP EVENTS:
        this.app.emitter.on("onAppInit", (event)=>{
            //--
            this.loader = new AppLoaders({
                app:this.app,
                pathPrefix: this.app.loader_pathPrefix
            })
            this.__init()
        })
        this.app.emitter.on("onAppBuilt", (event)=>{
            this.__build()
        })
        this.app.emitter.on("onUpdateRAF", (event)=>{
            this.__update_RAF()
        })
        
        //-----------------------
    }
    //----------------------------------------------
    // SUPER INTERNAL:
    __init(){ 
        console.log("(ProjectSuper.__init)!")
        //--------------
        // PROJECT EVENTS
        this.emitter.on("onShowStage", (data)=>{
            // console.log("(ProjectSuper.onShowStage): ", data)
            this.CURRENT_STAGE_ID = data.stageId
        })
        this.emitter.on("onTransitionStarted", (data)=>{
            // console.log("(ProjectSuper.onTransitionStarted): ")
            this.TRANSITIONING = true
        })  
        this.emitter.on("onTransitionFinished", (data)=>{
            // console.log("(ProjectSuper.onTransitionFinished): ")
            this.TRANSITIONING = false
            this._activate_and_show_stage(this.TRANSITION_STAGE_IN)
            this.TRANSITION_STAGE_IN = ""
            this.TRANSITION_STAGE_OUT = ""
            this.TRANSITION_REF = null

        }) 
        this.emitter.on("onStageLoaded", (event)=>{
            // console.log("STAGE LOADER COMPLETED!");
            this._eval_initial_loads()
        })
        //--------------
        // LODER EVENTS:
        this.loader.emitter.on("onCompleted", ()=>{
            // console.log("PROJECT LOADER COMPLETED!");
            this.CORE_LOADED = true
            this._eval_initial_loads()
        })
        //--------------
        this.init()
        //--------------
        this.loader.start()
        this.emitter.emit("onProjectInit", {})
    }
    __build(){
        console.log("(ProjectSuper.__build)!")
        this.build_renderPlane()
        this.build()
        this.BUILT = true
        this.emitter.emit("onProjectBuilt", {})
    }
    __update_RAF(){
        // console.log("(ProjectSuper.__update_RAF): "+this.ACTIVE)
        if(this.ACTIVE){
            this.stages.callAll("__update_RAF", {}) 
            //--
            if(this.app.USE_RENDER_PLANE){
                if(this.TRANSITIONING){
                    this.CURRENT_MATERIAL= this.TRANSITION_REF.get_material()
                    this.renderPlane.material = this.CURRENT_MATERIAL
                }else{
                    this.CURRENT_MATERIAL= this.IDLE_MATERIAL
                    this.renderPlane.material = this.CURRENT_MATERIAL
                    this.CURRENT_MATERIAL.uniforms.u_in_texture.value = this.get_stageTexture(this.CURRENT_STAGE_ID)
                }
            }
            //--
            this.update_RAF()
        }
    }

    _eval_initial_loads(){ // Called by StageCore when loader is completed
        let all_initials_loaded = true
        this.initial_loading_stages.map((stage)=>{
            if(!stage.LOADED){
                all_initials_loaded = false
            }
        })
        if(this.CORE_LOADED && all_initials_loaded && !this.INITIAL_STAGES_LOADED){
            // console.log("ALL INITIALS LOADED", all_initials_loaded);
            this.INITIAL_STAGES_LOADED = true
            this.app._initial_stages_loaded()
        }
    }
    _activate_and_show_stage(stageId){
        // console.log("(ProjectSuper._activate_and_show_stage): ", stageId)
        this.CURRENT_STAGE_ID = stageId
        this.emitter.emit("onActivateStage", {stageId:stageId})
        this.emitter.emit("onShowStage", {stageId:stageId})
    }
    _addStage(stage){
        // console.log("(ProjectSuper._addStage): ", stage)
        this.stages.nuevoItem(stage.id, stage)
        if(stage.AUTO_LOAD){
            this.initial_loading_stages.push(stage)
        }
    }
    _addTransition(transitionId, transition){
        this.transitions.nuevoItem(transitionId, transition)
    }
    _getTransition(transitionId){
        return this.transitions.getItem(transitionId)
    }
    _do_transition(transitionId){
        this.TRANSITION_STAGE_OUT = this.CURRENT_STAGE_ID
        this.TRANSITION_STAGE_IN = this._getNextStageId(this.CURRENT_STAGE_ID)
        this.TRANSITION_REF = this._getTransition(transitionId)
        this.TRANSITION_REF.doTextureTransition(this.get_stageTexture(this.TRANSITION_STAGE_OUT), this.get_stageTexture(this.TRANSITION_STAGE_IN))
    }
    _getNextStageId(currentStageId){
        let nextStageId = ""
        this.stages.arrayItems.map((stageId, index)=>{
            if(stageId == currentStageId){
                if(index == this.stages.arrayItems.length-1){
                    nextStageId =  this.stages.arrayItems[0]
                }else{
                    nextStageId = this.stages.arrayItems[index+1]
                }
            }
        })
        return nextStageId
    }
    //----------------------------------------------




    //----------------------------------------------
    // OVERRIDES:
    init(){
        // TO BE OVERRRIDED
    }
    build_renderPlane(){
        // TO BE OVERRRIDED IF NECESSARY
        if(this.app.USE_RENDER_PLANE){
            const geometry = new THREE.PlaneGeometry(this.app.size.REF.width,this.app.size.REF.height, 1, 1)
            this.IDLE_MATERIAL = new THREE.ShaderMaterial({
                uniforms: {
                    u_in_texture: { value: null},
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
            })
            this.CURRENT_MATERIAL = this.IDLE_MATERIAL
            this.renderPlane = new THREE.Mesh(geometry, this.CURRENT_MATERIAL)
            this.renderPlane.position.set(0, 0, 0)
            this.app.scene.add(this.renderPlane)
        }
    }
    build(){
        // TO BE OVERRRIDED

    }
    update_RAF(){
        // TO BE OVERRRIDED
    }
    //----------------------------------------------



    //----------------------------------------------
    // PUBLIC:
    
    get_stageTexture(stage_id){
        return this.stages.getItem(stage_id).get_texture()
    }
    get_arrayStageIds(){
        return this.stages.arrayItems
    }
    //----------------------------------------------
    // UPDATE:
    
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default ProjectSuper