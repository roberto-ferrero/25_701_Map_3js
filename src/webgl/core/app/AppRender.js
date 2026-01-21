//import gsap from "gsap"
import * as THREE from 'three'

class AppRender{
    constructor (obj){
        //console.log("(AppRender.CONSTRUCTORA): ", obj)
        this.app = obj.app

        //----
        this.app.emitter.on("onDevPrintState", (data)=>{
            //console.log("(AppRender.onDevPrintState): ")
            //console.log("   this.camera.left: "+this.camera.left)
            //console.log("   this.camera.right: "+this.camera.right)
            //console.log("   this.camera.width: "+(this.camera.right-this.camera.left))
            //console.log("   this.camera.top: "+this.camera.top)
            //console.log("   this.camera.bottom: "+this.camera.bottom)
            //console.log("   this.camera.height: "+(this.camera.top-this.camera.bottom))
            //console.log("   this.camera.aspect: "+(this.camera.right-this.camera.left)/(this.camera.top-this.camera.bottom))
            const size = new THREE.Vector2()    
            this.renderer.getSize(size) 
            //console.log("   this.renderer.size: ", size)
            //console.log("   this.renderer.aspect: ", size.x/size.y)
        })
    }
    //----------------------------------------------
    // PUBLIC:
    init(){
        //console.log("(AppRender.init)!")
        //----------------------
        // SCENE:
        this.scene = new THREE.Scene();
        //----------------------
        // MAIN CAMERA:
        if(this.app.USE_RENDER_PLANE){
            this.camera = new THREE.OrthographicCamera(-this.app.size.REF.width*0.5, this.app.size.REF.width*0.5, this.app.size.REF.height*0.5, -this.app.size.REF.height*0.5, 0, 1005)
            this.camera.name = "main_camera"
            this.camera.position.set(0, 0, 1000)
            this.camera.lookAt(0, 0, 0)

            // this.camera = new THREE.PerspectiveCamera(70, this.app.size.CURRENT.aspect, 0.1, 1000);
            // this.camera.name = "main_camera"
            // this.camera.far = 5000

            if(this.app.dev_helpers){
                this.camera_helper = new THREE.CameraHelper( this.camera );
                this.scene.add( this.camera_helper );
                this.app.dev.register_helper(this.camera_helper)
            }
        }

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            precision: "highp",
            //precision: "lowp",
            alpha: true,
            sortObjects: true
        });


        //--
        //this.renderer.autoClear = false // Vamos a usar 2 scenas (una para el background y otra para los puntos) que implicarán usar 2 acciones de render. Con autoclear false permitimos que la segunda no borre la primera.
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
        //this.renderer.outputEncoding = THREE.sRGBEncoding;

        // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // this.renderer.toneMappingExposure = 1;
        // this.renderer.toneMapping = THREE.LinearToneMapping ;
        // this.renderer.toneMappingExposure = 0.25;

        this.renderer.setClearColor(this.app.render_background_color, this.app.render_background_alpha )
        this.renderer.setSize( this.app.size.CURRENT.width, this.app.size.CURRENT.height );
        //--
        this.app.$container.appendChild(this.renderer.domElement)

    }
    update_RAF(){
        const active_camera = this.get_activeCamera()
        this.renderer.render( this.scene, active_camera);
    }
    update_resize(){
        // if(this.app.dev) //console.log("(AppRender.update_resize)!")
        this.renderer.setSize( this.app.size.CURRENT.width, this.app.size.CURRENT.height );
        // this.camera.left = -this.app.size.CURRENT.width*0.5
        // this.camera.right = this.app.size.CURRENT.width*0.5
        // this.camera.top = this.app.size.CURRENT.height*0.5
        // this.camera.bottom = -this.app.size.CURRENT.height*0.5
        // this.camera.updateProjectionMatrix()
        // const v2 = new THREE.Vector2()
        // this.renderer.getSize(v2)
        //console.log("this.renderer: ", v2);
    }
    get_activeCamera(){
        if(this.app.dev){
            if(this.app.dev.SHOW_DEV_CAMERA){
                return this.app.dev.camera
            }else{
                if(!this.app.USE_RENDER_PLANE && this.stageCamera){
                    return this.stageCamera
                }else{
                    return this.camera
                }
            }
        }else{
            return this.camera
        }
    }
    set_stageCamera(stageCamera){
        this.stageCamera = stageCamera
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default AppRender