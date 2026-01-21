//import gsap from "gsap"
//import * as THREE from 'three'

class AppSocket{
    constructor (obj){
        //console.log("(AppSocket.CONSTRUCTORA): ", obj)
        this.app = obj.app
        //--
        this.CURRENT_PAGE_ID = null
        this.APP_CORE = null
        this.APP_STORE = null
        this.APP_UI = null
        this.APP_CANVAS = null
        //--
        if(this.app.component){
            this.APP_CORE = this.app.component.appCore
            this.APP_STORE = this.app.component.appStore
            this.APP_UI = this.app.component.appUi
            this.APP_CANVAS = this.app.component.appCanvas
            //--
            this.CURRENT_PAGE_ID = this.APP_STORE.currentPage
            this.APP_STORE.webgl.wait = true
            this.APP_CANVAS.registerApp(this.CURRENT_PAGE_ID, this.app.id, this.app)
        }
    }
    //----------------------------------------------
    // PUBLIC:
    set_ready(){
        //console.log("(AppSocket.set_ready): "+this.app.id);
        if(this.app.dev) //console.log("(AppSocket.onWebglAppReady): "+this.app.id);
        this.app.emitter.emit("onWebglAppReady")
        if(this.APP_CANVAS){
            this.APP_CANVAS.setAppReady(this.CURRENT_PAGE_ID, this.app.id)
            if(this.APP_CANVAS.getPageReadiness(this.CURRENT_PAGE_ID)){
                //this.APP_STORE.webgl.wait = false
                if(this.app.dev) //console.log("(AppSocket.onWebglLayerReady): "+this.app.id);
                this.app.emitter.emit("onWebglLayerReady")
            }
        }
    }
    kill(){
        if(this.APP_CANVAS){
            this.APP_CANVAS.resetPage(this.CURRENT_PAGE_ID)
        }
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:
    /*
        this.emitter.emit("onWebglAppReady")
        if(this.component) {
            this.component.appCanvas.setAppReady(this.currentPageId, this.id)
            if(this.component.appCanvas.getPageReadiness(this.currentPageId)){
                this.component.appStore.webgl.wait = false
                //console.log("(WebGLApp.onWebglLayerReady): "+this.id)
                this.emitter.emit("onWebglLayerReady")
            }  
        }
    */

  
}
export default AppSocket