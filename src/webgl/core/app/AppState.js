//import gsap from "gsap"
//import * as THREE from 'three'

class AppState{
    constructor (obj){
        //console.log("(AppState.CONSTRUCTORA): ", obj)
        this.app = obj.app
        //--
        this.ACTIVE = true
        this.BUILT = false
        this.MOBILE_MODE = obj.data.mobileMode
        this.READY = false
        this.RENDER_COUNT = 0
        this.DEVICE = this._getDeviceType()
        //--
        this.app.emitter.on("onAppBuilt", ()=>{
            if(this.BUILT) //console.warn("WebGLApp SHOULD ONLY BE BUILT ONCE!!")
            this.BUILT = true
        })
    }
    //----------------------------------------------
    // PUBLIC:
    activate(){
        let hasChanged = false
        if(!this.ACTIVE){
            hasChanged = true
        }
        this.ACTIVE = true
        if(hasChanged) this.app.emitter.emit("onAppStateActivate")
    }
    deactivate(){
        let hasChanged = false
        if(this.ACTIVE){
            hasChanged = true
        }
        this.ACTIVE = false
        if(hasChanged) this.app.emitter.emit("onAppStateDeactivate")
    }

    update_MOBILE_MODE(value){
        let hasChanged = false
        if(value != this.MOBILE_MODE){
            hasChanged = true
        }
        this.MOBILE_MODE = value
        if(hasChanged) this.app.emitter.emit("onAppStateNewMobileMode")
    }
    set_ready(){
        if(this.READY) //console.warn("WebGLApp SHOULD ONLY SET TO READY ONCE!!")
        this.READY = true
        this.app.emitter.emit("onAppStateReady")
    }
    update_RAF(){
        this.RENDER_COUNT++
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _getDeviceType = () => {
        const ua = navigator.userAgent;
        
        // 1. Detect Tablet (iPad, Android Tablets)
        // Note: specific check for iPads running iPadOS 13+ (which report as Mac Intel)
        const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua) || 
                        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0 && /Macintosh/.test(ua));

        if (isTablet) {
            return 'tablet';
        }

        // 2. Detect Mobile (Standard phones)
        const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua);

        if (isMobile) {
            return 'mobile';
        }

        // 3. Default to Desktop
        return 'desktop';
    };

    //----------------------------------------------
    // AUX:

  
}
export default AppState