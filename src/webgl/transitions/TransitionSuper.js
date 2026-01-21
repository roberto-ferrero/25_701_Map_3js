import gsap from "gsap"
import * as THREE from 'three'

class TransitionSuper{
    constructor (obj){
        // console.log("(TransitionSuper.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        //--
        this.TEXTURE1
        this.TEXTURE2
        //--
        this.ACTIVE = false
        this.DURATION = 1
        this.EASED_VALUE = 0
        this.gsap_anim = null
        //--
        this._set_material()
    }
    //----------------------------------------------
    // PUBLIC:
    get_material(){
        // console.log("(TransitionSuper.get_material)!")
        this._update_uniforms()
        return this.material
    }
    doTextureTransition(texture1, texture2){
        // console.log("(TransitionSuper.doTextureTransition)!")
        this.TEXTURE1 = texture1
        this.TEXTURE2 = texture2
        this.ACTIVE = true
        //--
        this.project.emitter.emit("onTransitionStarted", {})
        //--
        this._start()
    }

    //----------------------------------------------
    // UPDATE RAF:
    
    //----------------------------------------------
    // PRIVATE:
    _set_material(){
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture1: { value: null },
                uTexture2: { value: null },
                uProgress: { value: 0.0 },
                uResolution: { value: [this.app.size.CURRENT.width, this.app.size.CURRENT.height]},
                uTime: { value: 0.0 }
                // uAspect: { value: this.app.size.CURRENT.aspect },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture1;
                uniform sampler2D uTexture2;
                uniform float uProgress;
                uniform float uAspect;

                varying vec2 vUv;

                void main() {

                    vec4 texture1 = texture(uTexture1, vUv);
                    vec4 texture2 = texture(uTexture2, vUv);

                    vec4 finalColor = mix(texture1, texture2, uProgress);
                    gl_FragColor = vec4(finalColor.rgb, 1.0);

                    #include <tonemapping_fragment>
                    #include <colorspace_fragment>
                }
            `
        });
    }
    _update_uniforms(){
        this.material.uniforms.uProgress.value = this.EASED_VALUE
        this.material.uniforms.uTexture1.value = this.TEXTURE1
        this.material.uniforms.uTexture2.value = this.TEXTURE2
        this.material.uniforms.uResolution.value = [this.app.size.CURRENT.width, this.app.size.CURRENT.height]
        this.material.uniforms.uTime.value = this.app.clock.getElapsedTime()
        // this.material.uniforms.uAspect.value = this.app.size.CURRENT.aspect
    }
    _start(){
        // console.log("(TransitionSuper._start)!")
        //--
        this.gsap_anim?.kill()
        this.gsap_anim = gsap.to(this, {
            EASED_VALUE:1,
            duration:this.DURATION,
            ease:"power0",
            onComplete:()=>{
                // console.log("TRANSITION FINISHED!");
                this.EASED_VALUE = 0
                this.ACTIVE = false
                this.TEXTURE1 = null
                this.TEXTURE2 = null
                this.project.emitter.emit("onTransitionFinished", {})
            }
        })
    }
    //----------------------------------------------
    // AUX:

  
}
export default TransitionSuper