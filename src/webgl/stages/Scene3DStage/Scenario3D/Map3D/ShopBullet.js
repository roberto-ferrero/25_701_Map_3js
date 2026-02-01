import gsap from "gsap"
import * as THREE from 'three'

class ShopBullet{
    constructor (obj){
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        this.marker = obj.marker
        //---
        this.BULLET_ALPHA = 0
        this.GSAP_ANIM = null
        this.SHOWING_BULLET = false

        // 1. Create a container Group to hold the composite parts (Blur, Ring, Core)
        this.mesh = new THREE.Group()
        

        // 2. Load Textures
        const base_texture = this.stage.loader.get_texture("shop")
        base_texture.colorSpace = THREE.SRGBColorSpace
        
        // const ring_texture = this.stage.loader.get_texture("shop_ring")
        // ring_texture.colorSpace = THREE.SRGBColorSpace
        
        // const blur_texture = this.stage.loader.get_texture("shop_blur")
        // blur_texture.colorSpace = THREE.SRGBColorSpace

        // Common Geometry
        const geometry = new THREE.PlaneGeometry(1, 1)

        // ------------------------------------------------
        // 3. LAYER 1: The Blur (Background Glow)
        // ------------------------------------------------
        // this.matBlur = new THREE.MeshBasicMaterial({ 
        //     map: blur_texture,
        //     transparent: true,
        //     depthWrite: false,
        //     opacity: 0.8,
        // });
        // this.meshBlur = new THREE.Mesh( geometry, this.matBlur );
        // // this.meshBlur.scale.set(2.5, 2.5, 2.5); // Make the glow larger than the core
        // this.meshBlur.position.z = 0.02; // Place behind
        // this.mesh.add(this.meshBlur);

        // ------------------------------------------------
        // 4. LAYER 2: The Ring (Animated Pulse)
        // ------------------------------------------------
        // this.matRing = new THREE.MeshBasicMaterial({ 
        //     map: ring_texture,
        //     transparent: true,
        //     depthWrite: false,
        // });
        // this.meshRing = new THREE.Mesh( geometry, this.matRing );
        // this.meshRing.position.z = 0.03; // Between blur and core
        // this.mesh.add(this.meshRing);
        
        // // ------------------------------------------------
        // // 5. LAYER 3: The Core (Central Dot)
        // // ------------------------------------------------
        this.matCore = new THREE.MeshBasicMaterial({ 
            map: base_texture,
            transparent: true,
            depthWrite: false,
            combine : THREE.MixOperation
        });
        this.meshCore = new THREE.Mesh( geometry, this.matCore );
        this.meshCore.position.z = 0.04; // In front of ring and blur
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
        // this.meshRing.userData.city_id = this.marker.city_id;
        // this.meshRing.userData.city_type = this.marker.type;
        // this.meshRing.userData.parentInstance = this.marker; 
        // //-- 
        // this.meshRing.userData.city_id = this.marker.city_id;
        // this.meshRing.userData.city_type = this.marker.type;
        // this.meshRing.userData.parentInstance = this.marker; 
        // //-- 
        // this.meshBlur.userData.city_id = this.marker.city_id;
        // this.meshBlur.userData.city_type = this.marker.type;
        // this.meshBlur.userData.parentInstance = this.marker; 
        
        this.parent3D.add(this.mesh)

        // ------------------------------------------------
        // 8. Animations
        // ------------------------------------------------
        //this._initAnimations();

        this.app.emitter.on("onAppZoomChange", (zoomLevel)=>{
            // console.log("Zoom level changed:", zoomLevel);
            if(this.stage.CURRENT_ZOOM == 0 || this.stage.CURRENT_ZOOM == 1 || this.stage.CURRENT_ZOOM == 2){
                this._hideBullet()
            }else{
                this._showBullet()
            }
        });
    }
    _hideBullet(){
        // console.log("(ShopBullet._hideBullet)!");
        if(this.SHOWING_BULLET){
            this.SHOWING_BULLET = false
            this.GSAP_ANIM?.kill()
            this.GSAP_ANIM= gsap.to(this, {
                BULLET_ALPHA: 0.0,
                duration: 0.5,
                ease: "none",
                onComplete: ()=>{
                    this.mesh.visible = false
                }
            });
                
        }
    }
    _showBullet(){
        // console.log("(ShopBullet._showBullet)!");
        if(!this.SHOWING_BULLET){
            this.SHOWING_BULLET = true
            this.GSAP_ANIM?.kill()
            this.mesh.visible = true
            this.GSAP_ANIM= gsap.to(this, {
                BULLET_ALPHA: 1.0,
                duration: 0.5,
                ease: "none"
            });
        }
    }

    updateRAF(){
        this.matCore.opacity = this.marker.TYPE_OPACITY_FACTOR*this.marker.INTRO_OPACITY_FACTOR*this.BULLET_ALPHA
        // this.matBlur.opacity = this.marker.TYPE_OPACITY_FACTOR*this.marker.INTRO_OPACITY_FACTOR*this.BULLET_ALPHA*0.8
        // this.matRing.opacity = this.marker.TYPE_OPACITY_FACTOR*this.marker.INTRO_OPACITY_FACTOR*this.BULLET_ALPHA
    }
}
export default ShopBullet