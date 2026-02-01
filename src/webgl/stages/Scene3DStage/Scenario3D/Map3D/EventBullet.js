import gsap from "gsap"
import * as THREE from 'three'

class EventBullet {
    constructor(obj) {
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        this.marker = obj.marker

        // 1. Create a container Group
        this.mesh = new THREE.Object3D()
        this.parent3D.add(this.mesh)
        this.scale3D = new THREE.Object3D()
        this.scale3D.scale.set(0.9, 0.9, 1)
        this.mesh.add(this.scale3D)

        // 2. Load Textures
        const base_texture = this.stage.loader.get_texture("event")
        base_texture.colorSpace = THREE.SRGBColorSpace

        const blur_texture = this.stage.loader.get_texture("event_blur")
        blur_texture.colorSpace = THREE.SRGBColorSpace

        // Common Geometry
        const geometry = new THREE.PlaneGeometry(1, 1)

        // ------------------------------------------------
        // 3. LAYER 1: The Blur (Background Glow)
        // ------------------------------------------------
        // this.matBlur = new THREE.MeshBasicMaterial({
        //     map: blur_texture,
        //     transparent: true,
        //     depthWrite: false,
        //     combine : THREE.MixOperation
        // });
        // this.meshBlur = new THREE.Mesh(geometry, this.matBlur);
        // this.meshBlur.position.z = 0.05; // Furthest back
        // this.meshBlur.scale.set(1.0, 1.0, 1.0); // Initial big glow
        // this.scale3D.add(this.meshBlur);

        // ------------------------------------------------
        // 4. LAYER 2: The Waves (Expanding Rings)
        // ------------------------------------------------
        // We need multiple rings to create the "ripple" effect shown in the video
        this.waves = [];
        const waveCount = 3; 

        for (let i = 0; i < waveCount; i++) {
            // Each wave needs a unique material to handle independent fading
            const mat = new THREE.MeshBasicMaterial({
                map: base_texture,
                transparent: true,
                depthWrite: false,
                combine : THREE.MixOperation
            });
            const mesh = new THREE.Mesh(geometry, mat);
            // Stack them slightly in Z so they don't z-fight, but all behind core
            mesh.position.z = -0.02 - (i * 0.001); 
            
            // Initialize custom data for the animation proxy
            mesh.userData.animAlpha = 0; 
            mesh.userData.city_id = this.marker.city_id;
            mesh.userData.city_type = this.marker.type;
            
            this.scale3D.add(mesh);
            this.waves.push(mesh);
        }

        // ------------------------------------------------
        // 5. LAYER 3: The Core (Central Dot)
        // ------------------------------------------------
        this.matCore = new THREE.MeshBasicMaterial({
            map: base_texture,
            transparent: true,
            depthWrite: false,
            combine : THREE.MixOperation
        });
        this.meshCore = new THREE.Mesh(geometry, this.matCore);
        this.scale3D.add(this.meshCore);

        // ------------------------------------------------
        // 6. User Data & Parent
        // ------------------------------------------------
        this.mesh.userData.city_id = this.marker.city_id;
        this.mesh.userData.city_type = this.marker.type;
        this.mesh.userData.parentInstance = this.marker;
        
        this.meshCore.userData.city_id = this.marker.city_id;
        this.meshCore.userData.city_type = this.marker.type;
        this.meshCore.userData.parentInstance = this.marker;

        // this.meshBlur.userData.city_id = this.marker.city_id;
        // this.meshBlur.userData.city_type = this.marker.type;
        // this.meshBlur.userData.parentInstance = this.marker;

       

        // ------------------------------------------------
        // 7. Material Proxy
        // ------------------------------------------------
        // We store the current "global" opacity from the marker logic
        this.globalAlpha = 1;

        const scope = this;
        this.material = {
            set opacity(val) {
                scope.globalAlpha = val;
                
                // 1. Core Opacity
                scope.matCore.opacity = val;
                
                // 2. Blur Opacity (keep it subtle)
                // scope.matBlur.opacity = val * 0.8; 

                // 3. Waves Opacity
                // Combine global marker opacity (fade in/out) with local animation opacity (ripple fade)
                scope.waves.forEach(wave => {
                    wave.material.opacity = val * wave.userData.animAlpha;
                });
            },
            get opacity() {
                return scope.matCore.opacity;
            }
        };

        // ------------------------------------------------
        // 8. Animations
        // ------------------------------------------------
        this._initAnimations();
    }

    updateRAF() {
        // console.log("this.mesh.scale:", this.mesh.scale);
        this.material.opacity = this.marker.TYPE_OPACITY_FACTOR * this.marker.INTRO_OPACITY_FACTOR
    }

    _initAnimations() {
        // 1. Core Pulse (Subtle heartbeat)
        gsap.to(this.meshCore.scale, {
            x: 1.15,
            y: 1.15,
            duration: 1,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });

        // 2. Blur Pulse (Slow breathing)
        // gsap.to(this.meshBlur.scale, {
        //     x: 2.5,
        //     y: 2.5,
        //     duration: 2.0,
        //     yoyo: true,
        //     repeat: -1,
        //     ease: "sine.inOut"
        // });

        // 3. Wave Ripples
        const duration = 3;
        
        this.waves.forEach((wave, i) => {
            // Distribute start times evenly
            const delay = i * (duration / this.waves.length); 

            // Create a timeline for each wave
            const tl = gsap.timeline({ 
                repeat: -1, 
                delay: delay 
            });

            // Init state
            tl.set(wave.scale, { x: 1.0, y: 1.0 });
            tl.set(wave.userData, { animAlpha: 1.0 });

            // Animate Scale (Expand outwards)
            tl.to(wave.scale, {
                x: 2.0,
                y: 2.0,
                duration: duration,
                ease: "power1.out"
            }, 0);

            // Animate Opacity (Fade out)
            // We animate the userData property, which is applied to the material in updateRAF via the proxy
            tl.to(wave.userData, {
                animAlpha: 0.0,
                duration: duration,
                ease: "power1.out" 
            }, 0);
        });
    }
}
export default EventBullet