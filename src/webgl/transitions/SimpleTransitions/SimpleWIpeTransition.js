import gsap from "gsap"
import * as THREE from 'three'

import TransitionSuper from "../TransitionSuper"

class SimpleWipeTransition extends TransitionSuper{
    constructor (obj){
        // console.log("(SimpleWipeTransition.CONSTRUCTORA): ", obj)
        super(obj)
    }
    //----------------------------------------------
    // OVERRRIDE:
    _set_material(){
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture1: { value: null },
                uTexture2: { value: null },
                uProgress: { value: 0.0 },
                uResolution: { value: new THREE.Vector2(this.app.size.CURRENT.width, this.app.size.CURRENT.height) },
                uTime: { value: 0.0 }
                //uAspect: { value: this.app.size.CURRENT.aspect }
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
                uniform vec2 uResolution;
                uniform float uTime;

                varying vec2 vUv;

                void main() {

                    vec2 vUv_out = vUv;
                    //vUv_out.y = mix(0.0, 1.0, uProgress);
                    vec2 vUv_in = vUv;
                    //vUv_in.y = mix(-1.0, 0.0, uProgress);

                    vec4 texture1 = texture(uTexture1, vUv_out);
                    vec4 texture2 = texture(uTexture2, vUv_in);
                    vec4 finalColor;

                    if(vUv.y > uProgress){
                        finalColor = texture1;
                    }else{
                        finalColor = texture2;
                    }


                    // vec4 finalColor = mix(texture1, texture2, uProgress);

                    gl_FragColor = vec4(finalColor.rgb, 1.0);
                    //gl_FragColor = vec4(1.0, uProgress, 0.0, 1.0);
                    #include <tonemapping_fragment>
                    #include <colorspace_fragment>
                }
            `
        });
    }
    //----------------------------------------------
    // AUX:

  
}
export default SimpleWipeTransition