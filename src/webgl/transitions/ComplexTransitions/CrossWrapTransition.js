// import gsap from "gsap"
import * as THREE from 'three'
import TransitionSuper from '../TransitionSuper'

class CrossWrapTransition extends TransitionSuper{
    constructor (obj){
        // console.log("(CrossWrapTransition.CONSTRUCTORA): ", obj)
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
                uniform vec2 uResolution;
                uniform float uTime;

                varying vec2 vUv;


                void main() {

                    // Normalized pixel coordinates (from 0 to 1)
                    // vec2 p = fragCoord/iResolution.xy;
                    vec2 uv = vUv;

                    // float t = mod(iTime,2.); // change this to alter the speed
                    float t = uProgress; // change this to alter the speed
                    
                    t = smoothstep(0.0, 1.0, (t*2.0+uv.x-1.0));

                    // Output to screen
                    vec4 col = mix(texture(uTexture1,(uv-.5)*(1.-t)+.5), texture(uTexture2,(uv-.5)*t+.5), t); 

                    gl_FragColor = vec4(col.rgb, 1.0);
                                    

                    #include <tonemapping_fragment>
                    #include <colorspace_fragment>
                }
            `
        });
    }
    //----------------------------------------------
    // AUX:

  
}
export default CrossWrapTransition