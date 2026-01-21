//import gsap from "gsap"
//import * as THREE from 'three'

class AppSize{
    constructor (obj){
        // this.app.trace("(AppSize.CONSTRUCTORA): ", obj)
        this.app = obj.app
        //--
        this.REF = {
            width:0,
            height:0,
            aspect:0,
        }
        this.CURRENT = {
            width:0,
            height:0,
            aspect:0,
        }
        this.camvasElem = document.getElementById("canvas")
        //console.log("camvasElem : ", this.camvasElem);
        this.CANVAS = {
            width:0,
            height:0,
            aspect:0,
            scaleX:1,
            scaleY:1,
        }
        this.RESPONSIVE_SCALE = {
            x:0,
            y:0
        }
        //--
        if(this.app.size_overwrite_REF){
            this.set_REF_width(this.app.$container.offsetWidth)
            this.set_REF_height(this.app.$container.offsetHeight)
        }else{
            this.set_REF_width(1920)
            this.set_REF_height(947)
        }
        //--
        if(this.app.size_internal_event){
            window.addEventListener('resize', this.listener_resize = ()=>{
                this.update()
            })
        }
        //--
        this.update()
    }
    //----------------------------------------------
    // PUBLIC:
    update(){
        this.app.trace("(AppSize.update)!")
        let newWidth
        let newHeight
        //----
        // this.CANVAS.width = this.camvasElem.offsetWidth
        // this.CANVAS.height = this.camvasElem.offsetHeight
        this.CANVAS.aspect = this.CANVAS.width/this.CANVAS.height
        this.CANVAS.scaleX = this.CANVAS.width/this.REF.width
        this.CANVAS.scaleY = this.CANVAS.height/this.REF.height
        //----
        if(this.app.size_use_window_inner){
            // this.app.trace("1111111111111111111111111111");
            // newWidth = window.innerWidth
            // newHeight = window.innerWHeight 
            newWidth = document.documentElement.clientWidth
            newHeight = document.documentElement.clientHeight
        }else{
            // this.app.trace("222222222222222222222222222222");
            // newWidth = this.app.$container.offsetWidth
            // newHeight = this.app.$container.offsetHeight
            newWidth = document.documentElement.clientWidth
            newHeight = document.documentElement.clientHeight
        }
        if(newWidth != this.CURRENT.width || newHeight != this.CURRENT.height){
            this.CURRENT.width = newWidth
            this.CURRENT.height = newHeight
            this.CURRENT.aspect = this.CURRENT.width/this.CURRENT.height
            this.RESPONSIVE_SCALE.x = this.CURRENT.width/this.REF.width
            this.RESPONSIVE_SCALE.y = this.CURRENT.height/this.REF.height
            if(this.app.render) this.app.render.update_resize();
            //--
            // if(this.app.dev) this.app.emitter.emit("onAppSizeUpdate")
            this.app.emitter.emit("onAppSizeUpdate")
        }
    }
    kill(){
        window.removeEventListener('resize', this.listener_resize, false)
    }
    set_REF_width(value){
        this.REF.width = value
        if(this.REF.height != 0){
            this.REF.aspect = this.REF.width/this.REF.height
        }
    }
    set_REF_height(value){
        this.REF.height = value
        if(this.REF.height != 0){
            this.REF.aspect = this.REF.width/this.REF.height
        }
    }
    update_RAF(){
        // this.app.trace("window.innerWHeight : "+window.innerWHeight );
        // this.app.trace("document.documentElement.clientHeight : "+document.documentElement.clientHeight);
        // this.app.trace("this.app.$container.offsetHeight : "+this.app.$container.offsetHeight);
        if(!this.app.size_use_window_inner){
            if(this.CURRENT.height != this.app.$container.offsetHeight){
                this.update()
            }
        }
    }
    get_CANVAS_size(){
        // this.CANVAS.width = this.camvasElem.offsetWidth
        // this.CANVAS.height = this.camvasElem.offsetHeight
        // this.CANVAS.aspect = this.CANVAS.width/this.CANVAS.height
        // this.CANVAS.scaleX = this.CANVAS.width/this.REF.width
        // this.CANVAS.scaleY = this.CANVAS.height/this.REF.height

        return this.CANVAS
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default AppSize