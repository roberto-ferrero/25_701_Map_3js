import gsap from "gsap"
import * as THREE from 'three'

import AppLoaders from './AppLoaders';
import AppSize from './AppSize';

import AppState from './AppState';
import AppRender from './AppRender';
import AppScroll from './AppScroll';

import AppDev from './AppDev';
import AppMouse from './AppMouse';
import AppFPS from './AppFPS';
import Datos from '../utils/Datos';

const EventEmitter = require('events');

class WebGLApp{
    constructor (obj){
        this.rnd = Math.random()
        this.app = this
        // console.log("(WebGLApp.CONSTRUCTORA): "+this.rnd, obj)
        //----------------------
        this.DO_TRACE = obj.data.debug
        this.ACTIVE = true;
        this.BUILT = false;
        //----------------------


        this.id= obj.id
        this.$container = obj.$container
        this.$mouseEvents = obj.$mouseEvents
        this.loader_pathPrefix = obj.loader_pathPrefix
        this.project = obj.project
        this.initObj = obj
        //--
        this.appStore = obj.appStore
        this.appUi = obj.appUi
        //--
        this.render_background_color = obj.render_background_color
        this.render_background_alpha = Number(obj.render_background_alpha)
        //--
        this.dev_active = obj.dev_active                            // Indicates if AppDev is instantiated
        this.dev_gui = this.dev_active? obj.dev_gui : false         // Indicates if dat.gui is created (only if dev_active=true)
        this.dev_helpers = this.dev_active? obj.dev_helpers : false // Indicates if helpers are instantiated  (only if dev_active=true) (false in prod)
        //----------------------
        this.size_internal_event = true
        //----------------------
        this.USE_RENDER_PLANE = obj.use_render_plane
        this.STAND_ALONE = obj.stand_alone
        //----------------------
        // DATA:
        this.data = obj.data
        //----------------------
        // EMITTER:
        this.emitter = new EventEmitter()
        this.emitter.setMaxListeners(2000)
        //----------------------
        // CLOCK:
        this.clock = new THREE.Clock()
        this.DELTA_TIME = 0
        this.ELAPSED_TIME = 0
        //----------------------
        // APP STATE:
        this.state = new AppState({app:this, data:obj.data})
        //----------------------
        // APP SIZE:
        this.size = new AppSize({app:this})
        //----------------------
        // APP RENDER:
        this.render = new AppRender({app:this})
        //----------------------
        // APP FPS:
        this.fps = new AppFPS({app:this})
        //----------------------
        // LOADER:
        this.loader = new AppLoaders({
            app:this,
            pathPrefix: this.loader_pathPrefix
        })
        //----------------------
        // MOUSE:
        if(obj.mouse_active) this.mouse = new AppMouse({app:this})
        //----------------------
        // APP SCROLL:
        this.scrolls = new Datos()
        for(var i=0; i<obj.scrolls.length; i++){
            const scroll_id = obj.scrolls[i]
            const scroll_item = new AppScroll({
                app:this,
                id:scroll_id,
                emit:true,
                makeEased:true
            })
            this.scrolls.nuevoItem(scroll_id, scroll_item)
        }
        // if(obj.scroll_1_active) this.scroll_1 = new AppScroll({app:this, id:"scroll_1", emit:true})
        // if(obj.scroll_2_active) this.scroll_2 = new AppScroll({app:this, id:"scroll_2", emit:true})
        //----------------------
        // APP DEV:
        if(obj.dev_active) this.dev = new AppDev({app:this})
        //--------------------



        //----------------------
        this.bindedRAF = this._update_RAF.bind(this)
        //----------------------
        this.init()
        //----------------------
    }
    //----------------------------------------------
    // PUBLIC API:
    request_start(){
        //console.log("(WebGLApp.request_start)!");
        this.project.stage.request_start()
    }
    updateMode(active, colorMode, inmediate=false){
        if(active){
            this.activate()
        }else{
            this.deactivate()
        }
        //--
        this.project.setMode(colorMode, inmediate)

    }
    // setMode(mode){
    //     // console.log("(WebGLApp.setMode): "+mode);
    // }
    setMouseListener(domTarget){
        // console.log("(WebGLApp.setMouseListener): ", domTarget);
        this.emitter.emit("onAppSetMouseListener", {domTarget:domTarget})
    }
    trace(string, obj, ref=""){
        if(this.DO_TRACE){
            console.log(string, obj, ref);
        }
    }
    filter_blender_position(position){
        return new THREE.Vector3(position.x, position.y, position.z)
    }
    register_helper(ref){
        this.dev?.register_helper(ref)
    }
    //----------------------------------------------
    init(){
        // console.log("(WebGLApp.init)-------------------------------------------------------!")
        this.project.registerApp(this)
        this.clock.start()
        this.render.init()
        this.scene = this.render.scene
        this.dev?.init()
        this.emitter.emit("onAppInit")
    }
    resize(resize_data){
        // console.log("(WebGLApp.resize): ",resize_data )
        this.state.update_MOBILE_MODE(resize_data.mobileMode) // If changes emits: onAppStateNewMobileMode
        this.size.update() // Emits: onAppSizeUpdate
    }
    update_scrollProgress(scroll_id, value, offsetY){
        // console.log("(WebGLAPP.update_scrollProgress): "+scroll_id+": "+value);
        this.scrolls.getItem(scroll_id).update(value, offsetY) // Emits: onAppScrollUpdate
        //this.scroll_1.update(value, offsetY) // Emits: onAppScrollUpdate
    }
    update_bodyHeight(bodyHeight){
        this.project.update_BODY_HEIGHT(bodyHeight)
    }

    activate(){
        console.log("(WebGLApp.activate)!");
        this.emitter.emit("onAppActivate")
        gsap.delayedCall(0.1, ()=>{
            this.ACTIVE = true;
            if(this.BUILT){
                this._update_RAF();
            }
        })
    }
    deactivate(){
        console.log("(WebGLApp.deactivate)!");
        this.emitter.emit("onAppDeactivate")
        gsap.delayedCall(0.1, ()=>{
            this.ACTIVE = false;

        })
    }
    kill(){
        // console.log("(WebGLApp.kill)!");
        cancelAnimationFrame(this.raf_request); // TO BE TESTED
        this.deactivate()
        this.emitter.emit("onAppKill")
        gsap.delayedCall(0.1, ()=>{
            this.stage = null
            this.emitter.removeAllListeners()
            // this = null
        })
    }
    get_render(){
        if(this.render.renderer){
            return this.render.renderer
        }else{
            console.warn("WebGLApp.get_render: No renderer available!")
            return null
        }
    }
    //----------------------------------------------
    // INTERNAL:
    _build(){
        // console.log("(WebGLApp._build)-------------------------------------------------------!")
        // this.render.update_resize()
        this.emitter.emit("onAppBuilt")
        this.BUILT = true;
        //--
        this._update_RAF()
    }
    _initial_stages_loaded(){
        //console.log("(WebGLApp._initial_stages_loaded)!", this.data)
        this._build()
        this.emitter.emit("onAppBuild")
    }

    //----------------------------------------------
    // UPDATE RAF:
    _update_RAF(){
        // console.log("(WebGLApp._update_RAF)!")
        // console.log("this.state.ACTIVE", this.state.ACTIVE);
        // console.log("this.state.READY", this.state.READY);

        if(!this.ACTIVE)
            return;

        // this.raf_request = requestAnimationFrame(this._update_RAF.bind(this))
        this.raf_request = requestAnimationFrame(this.bindedRAF)
        //--
        if(this.state.RENDER_COUNT != 0){
            if(!this.state.ACTIVE && this.state.READY){
                return
            }
        }
        if(this.state.RENDER_COUNT == 2){
            //console.log("this.state.RENDER_COUNT == 2  <-------------------", this.socket);
            this.state.set_ready()
            this.socket?.set_ready()
        }
        //--
        this.DELTA_TIME = this.clock.getDelta();
        this.ELAPSED_TIME = this.clock.getElapsedTime();
        //--
        this.state.update_RAF()
        this.size.update_RAF()
        this.project.update_RAF()
        this.render.update_RAF()
        this.fps.update_RAF()
        this.mouse?.update_RAF()
        //--
        this.scrolls.callAll("update_RAF")
        //--
        this.emitter.emit("onUpdateRAF", {time: this.ELAPSED_TIME, delta: this.DELTA_TIME})
    }

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:


}
export default WebGLApp
