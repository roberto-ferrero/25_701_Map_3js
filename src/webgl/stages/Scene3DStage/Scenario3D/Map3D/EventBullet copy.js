import gsap from "gsap"
import * as THREE from 'three'

class EventBullet{
    constructor (obj){
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        this.marker = obj.marker

        // 1. Create a container Group to hold the composite parts (Blur, Ring, Core)
        this.mesh = new THREE.Group()

        // 2. Load Textures
        const base_texture = this.stage.loader.get_texture("event")
        base_texture.colorSpace = THREE.SRGBColorSpace
        
        const expand_texture = this.stage.loader.get_texture("event")
        expand_texture.colorSpace = THREE.SRGBColorSpace
        
        const blur_texture = this.stage.loader.get_texture("event_blur")
        blur_texture.colorSpace = THREE.SRGBColorSpace

        // Common Geometry
        const geometry = new THREE.PlaneGeometry(1, 1)

        // ------------------------------------------------
        // 3. LAYER 1: The Blur (Background Glow)
        // ------------------------------------------------
        this.matBlur = new THREE.MeshBasicMaterial({ 
            map: blur_texture,
            transparent: true,
            depthWrite: false,
        });
        this.meshBlur = new THREE.Mesh( geometry, this.matBlur );
        // this.meshBlur.scale.set(2.5, 2.5, 2.5); // Make the glow larger than the core
        this.meshBlur.position.z = -0.02; // Place behind
        this.mesh.add(this.meshBlur);

        // ------------------------------------------------
        // 4. LAYER 2: The Exapnd (Animated Pulse)
        // ------------------------------------------------
        this.matExpand1 = new THREE.MeshBasicMaterial({ 
            map: expand_texture,
            transparent: true,
            depthWrite: false,
        });
        this.meshExpand1 = new THREE.Mesh( geometry, this.matExpand1 );
        this.meshExpand1.position.z = -0.01; // Between blur and core
        this.mesh.add(this.meshExpand1);

        // ------------------------------------------------
        // 5. LAYER 3: The Core (Central Dot)
        // ------------------------------------------------
        this.matCore = new THREE.MeshBasicMaterial({ 
            map: base_texture,
            transparent: true,
            depthWrite: false,
        });
        this.meshCore = new THREE.Mesh( geometry, this.matCore );
        this.mesh.add(this.meshCore);

        // ------------------------------------------------
        // 6. User Data & Parent
        // ------------------------------------------------
        this.mesh.userData.city_id = this.marker.city_id;
        this.mesh.userData.city_type = this.marker.type;
        this.mesh.userData.parentInstance = this.marker;
        //-- 
        this.meshCore.userData.city_id = this.marker.city_id;
        this.meshCore.userData.city_type = this.marker.type;
        this.meshCore.userData.parentInstance = this.marker; 
        //-- 
        this.meshExpand1.userData.city_id = this.marker.city_id;
        this.meshExpand1.userData.city_type = this.marker.type;
        this.meshExpand1.userData.parentInstance = this.marker; 
        //-- 
        this.meshBlur.userData.city_id = this.marker.city_id;
        this.meshBlur.userData.city_type = this.marker.type;
        this.meshBlur.userData.parentInstance = this.marker; 
        
        this.parent3D.add(this.mesh)

        // ------------------------------------------------
        // 7. Material Proxy (The Secret Sauce)
        // ------------------------------------------------
        // Marker3D updates "this.material.opacity" every frame. 
        // We create a proxy to intercept that value and apply it to all our layers.
        
        this.pulseData = { alpha: 1 }; // Internal animation value for the ring fade

        const scope = this;
        this.material = {
            set opacity(val) {
                // Apply global opacity (fade in/out of the map) to all parts
                scope.matCore.opacity = val;
                scope.matBlur.opacity = val * scope.pulseData.alpha; // Keep blur slightly softer
                
                // For the ring, we multiply the Global Opacity (val) by the Pulse Animation (scope.pulseData.alpha)
                scope.matExpand1.opacity = val * scope.pulseData.alpha; 
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

    updateRAF(){
        this.material.opacity = this.marker.TYPE_OPACITY_FACTOR*this.marker.INTRO_OPACITY_FACTOR
    }

    _initAnimations(){
        // 1. Expand the Ring Scale
        gsap.to(this.meshExpand1.scale, {
            x: 1.5, 
            y: 1.5,
            duration: 2.0,
            ease: "power1.out",
            repeat: -1
        });
        // 2. Fade out the Ring Opacity
        gsap.to(this.pulseData, {
            alpha: 0, 
            duration: 2.0,
            ease: "power1.out",
            repeat: -1
        });

        gsap.to(this.meshBlur.scale, {
            x: 1.5, 
            y: 1.5,
            duration: 2.0,
            ease: "power1.out",
            repeat: -1
        });


    }
}
export default EventBullet