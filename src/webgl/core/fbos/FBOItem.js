//import gsap from "gsap"
import * as THREE from 'three'

class FBOItem{
    constructor (obj){
        //console.log("(FBOItem.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.anim = obj.anim
        this.id = obj.id
        this.size = obj.size
        this.uniforms = obj.uniforms
        this.vertexShader = obj.vertexShader
        this.fragmentShader = obj.fragmentShader
        //--
        this.fbo1 = this._getRenderTarget()
        this.fbo2 = this._getRenderTarget()
        this.fbo = this.fbo1
        //--
        this.fboScene = new THREE.Scene()
        this.fboCamera = new THREE.OrthographicCamera(-this.size.width*0.5, this.size.width*0.5, this.size.height*0.5, -this.size.height*0.5, -10, 10)
        this.fboCamera.position.set(0, 0, 1)
        this.fboCamera.lookAt(0, 0, 0)
        //--
        let geometry = new THREE.PlaneGeometry(this.size.width,this.size.height, 1, 1)
        this.fboMaterial = new THREE.ShaderMaterial({
            //transparent: true,
            uniforms: this.uniforms,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        })
        this.fboMesh = new THREE.Mesh(geometry, this.fboMaterial)
        this.fboMesh.position.set(0, 0, 0)
        this.fboScene.add(this.fboMesh)

    }
    //----------------------------------------------
    // PUBLIC:
    getTexture(){
        return this.fbo.texture
    } 

    updateUniforms(uniforms){
        Object.keys(uniforms).forEach(key => {  
            this.fboMaterial.uniforms[key].value = uniforms[key]
        })
    }

    render(){
        this.app.render.renderer.setRenderTarget(this.fbo);
        this.app.render.renderer.render(this.fboScene, this.fboCamera);
        this._swapFBO()
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _swapFBO(){
        let temp = this.fbo1
        this.fbo1 = this.fbo2
        this.fbo2 = temp
        this.fbo = this.fbo1
    }
    _getRenderTarget(){
        // Akella function
        const float_type = ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) ? THREE.HalfFloatType : THREE.FloatType;
        // const renderTarget = new THREE.WebGLRenderTarget(this.app.size.REF.width, this.app.size.REF.height, {
        const renderTarget = new THREE.WebGLRenderTarget(this.size.width, this.size.height, {
        minFilter:THREE.NearestFilter,
            magFilter:THREE.NearestFilter,
            format: THREE.RGBAFormat,
            // type: THREE.FloatType
            type: THREE.HalfFloatType
            //type: float_type
        })
        return renderTarget
    }
    //----------------------------------------------
    // AUX:

  
}
export default FBOItem