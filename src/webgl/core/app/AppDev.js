import * as dat from 'dat.gui';
//import gsap from "gsap"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class AppDev{
    constructor (obj){
        //console.log("(AppDev.CONSTRUCTORA): ", obj)
        this.app = obj.app
        //--
        this.SHOW_DEV_CAMERA = false
        this.SHOW_BACKSTAGE = false
        this.HELPERS = this.app.dev_helpers
        //--
        this.helpers_array = []
        this.camera = null
        //--
        this.gui = null
        this.gui_data = {
            show_dev_camera: false,
            show_backstage:false,
            scroll_progress1:0,
            scroll_progress2:0
        }
    }
    //----------------------------------------------
    // PUBLIC:
    init(){
        this.camera = new THREE.PerspectiveCamera(70, this.app.size.CURRENT.width / this.app.size.CURRENT.height, 0.1, 20000 );
        this.camera.position.set(0, 25, 100)
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))
        //--
        //--

        if(!this.app.state.MOBILE_MODE){
            //console.log("-------------- OrbitControls");
            //this.controls = new OrbitControls(this.camera_dev, this.renderer.domElement)
            this.controls = new OrbitControls(this.camera, this.app.$mouseEvents)
            // this.controls.enabled = false
        }
        //--
        if(this.app.dev_gui){
            //console.log("-------------- GUI");
            this.gui = new dat.GUI({
                width: 400
            })
            this.gui.add(this.gui_data, 'show_dev_camera').listen().onChange((value) => {
                this.app.emitter.emit("onAppDevCamera", {show:this.SHOW_DEV_CAMERA})
                if(value){
                    this.show_dev_camera()
                    if(this.controls) this.controls.enabled = true
                }else{
                    this.hide_dev_camera()
                    if(this.controls) this.controls.enabled = false
                }
            });

            this.gui.add(this.gui_data, 'show_backstage').listen().onChange((value) => {
                if(value){
                    this.show_backstage()
                }else{
                    this.hide_backstage()
                }
            });

            


            if(this.app.scroll_1_active){
                this.gui.add(this.gui_data, 'scroll_progress1', 0, 1, 0.001).listen().onChange((value) => {
                    ////console.log("(FaceGlitterApp.scroll_progress): "+value)
                    this.app.update_scrollProgress1(value)
                });
                //--
                this.app.emitter.on("onAppScrollUpdate", (e)=>{
                    if(e.id == "scroll_1" && this.gui_data.scroll_progress1 != this.app.scroll_1.PROGRESS){
                        this.gui_data.scroll_progress1 = this.app.scroll_1.PROGRESS
                    }
                })
            }
            if(this.app.scroll_2_active){
                this.gui.add(this.gui_data, 'scroll_progress2', 0, 1, 0.001).listen().onChange((value) => {
                    ////console.log("(FaceGlitterApp.scroll_progress): "+value)
                    this.app.update_scrollProgress2(value)
                });
                //--
                this.app.emitter.on("onAppScrollUpdate", (e)=>{
                    if(e.id == "scroll_1" && this.gui_data.scroll_progress2 != this.app.scroll_2.PROGRESS){
                        this.gui_data.scroll_progress2 = this.app.scroll_2.PROGRESS
                    }
                })
            }


            this.gui.open();
            const $dg = document.querySelector(".dg")
            //console.log("domElement: ",this.gui.domElement);
            //console.log("$dg: ",$dg );
            $dg.style.zIndex = "10"
            //$dg.style.height = "100%"
 
        }
        //--
        
        //--
        document.addEventListener("keydown", this.listener_keypress = (self) =>{
            if(self.key == "b"){
                this.switch_backstage()
            }else if(self.key == "c"){
                if(this.SHOW_DEV_CAMERA){
                    this.SHOW_DEV_CAMERA = false
                }else{
                    this.SHOW_DEV_CAMERA = true

                }
                //this.emitter.emit("onUseCameraDev", {show:this.SHOW_DEV_CAMERA})
            }
        }, false)
    }
    kill(){
        document.removeEventListener('keydown', this.listener_keypress)
    }
    show_backstage(){
        if(!this.SHOW_BACKSTAGE){
            if(this.app.dev) //console.log("(AppDev.show_backstage):",this.helpers_array);
            this.SHOW_BACKSTAGE = true
            this.app.emitter.emit("onAppDevBackstage", {show:this.SHOW_BACKSTAGE})
            for(var i=0; i<this.helpers_array.length; i++){
                const ref = this.helpers_array[i]
                //console.log(ref);
                ref.visible = true
            }
            if(this.gui) this.gui_data.show_backstage = this.SHOW_BACKSTAGE
        }
    }
    hide_backstage(){
        if(this.SHOW_BACKSTAGE){
            if(this.app.dev) //console.log("(AppDev.hide_backstage):",this.helpers_array);
            this.SHOW_BACKSTAGE = false
            this.app.emitter.emit("onAppDevBackstage", {show:this.SHOW_BACKSTAGE})
            for(var i=0; i<this.helpers_array.length; i++){
                const ref = this.helpers_array[i]
                ref.visible = false
            }
            if(this.gui) this.gui_data.show_backstage = this.SHOW_BACKSTAGE
        }
    }
    switch_backstage(){
        if(this.SHOW_BACKSTAGE){
            this.hide_backstage()
        }else{
            this.show_backstage()
        }
    }
    show_dev_camera(){
        if(!this.SHOW_DEV_CAMERA){
            this.SHOW_DEV_CAMERA = true
            this.app.emitter.emit("onAppDevCamera", {show:this.SHOW_DEV_CAMERA})
            if(this.gui) this.gui_data.show_dev_camera = this.SHOW_DEV_CAMERA
        }
    }
    hide_dev_camera(){
        if(this.SHOW_DEV_CAMERA){
            this.SHOW_DEV_CAMERA = false
            this.app.emitter.emit("onAppDevCamera", {show:this.SHOW_DEV_CAMERA})
            if(this.gui) this.gui_data.show_dev_camera = this.SHOW_DEV_CAMERA
        }
    }

    register_helper(ref){
        this.helpers_array.push(ref)
        if(this.SHOW_BACKSTAGE){
            ref.visible =true
        }else{
            ref.visible =false
        }
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default AppDev