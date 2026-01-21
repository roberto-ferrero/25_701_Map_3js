// import gsap from "gsap"
import * as THREE from 'three'
import TransitionSuper from '../TransitionSuper'

class NoiseFadeTransition extends TransitionSuper{
    constructor (obj){
        // console.log("(NoiseFadeTransition.CONSTRUCTORA): ", obj)
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

                float seed = 16.0;
                float sinNoise(vec2 uv)
                {
                    return fract(abs(sin(uv.x * 180.0 + uv.y * 3077.0) * 53703.27));
                }

                float valueNoise(vec2 uv, float scale)
                {
                    vec2 luv = fract(uv * scale);
                    vec2 luvs = smoothstep(0.0, 1.0, fract(uv * scale));
                    vec2 id = floor(uv * scale);
                    float tl = sinNoise(id + vec2(0.0, 1.0));
                    float tr = sinNoise(id + vec2(1.0, 1.0));
                    float t = mix(tl, tr, luvs.x);
                    
                    float bl = sinNoise(id + vec2(0.0, 0.0));
                    float br = sinNoise(id + vec2(1.0, 0.0));
                    float b = mix(bl, br, luvs.x);
                    
                    return mix(b, t, luvs.y) * 2.0 - 1.0;
                }

                void main() {

                    // Normalized pixel coordinates (from 0 to 1)
                    // vec2 uv = fragCoord/iResolution.xy;
                    vec2 uv = vUv;

                    //uv.y /= uResolution.x/uResolution.y;
                    
                    float sinN = sinNoise(uv);
                    
                    float scale = 4.0;
                    
                    float fractValue = 0.0;
                    float amp = 1.0;
                    for(int i = 0; i < 16; i++)
                    {
                        fractValue += valueNoise(uv, float(i + 1) * scale) * amp;
                        amp /= 2.0;
                    }
                    
                    fractValue /= 2.0;
                    fractValue += 0.5;
                    
                    // float time = mix(-0.5, 1.0, cos(iTime)/2.0 +0.5);
                    float time = mix(-0.5, 1.0, uProgress);
                    //time = 1.0;
                    float cutoff = smoothstep(time+ 0.1, time- 0.1, fractValue);
                    
                    vec4 col = mix(texture(uTexture1, uv), texture(uTexture2, uv), cutoff);

                    // Output to screen
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
export default NoiseFadeTransition