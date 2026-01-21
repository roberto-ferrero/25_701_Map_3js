import gsap from "gsap"
import * as THREE from 'three'

class CameraPlane{
    constructor (obj){
        // console.log("(CameraPlane.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.camera = obj.camera
        //-----------------------------
        this.DISTANCE_TO_CAMERA = 5; // Set your desired distance here
        //-----------------------------
        const geometry = new THREE.PlaneGeometry(1, 1);
        this.material = new THREE.MeshBasicMaterial({ 
            color: 0x2b181c, 
            wireframe: false, // Wireframe helps verify it's working
            side: THREE.DoubleSide, // Ensures visibility from any angle
            transparent: true,
            opacity: 1.0
        });
        this.frustumPlane = new THREE.Mesh(geometry, this.material);
        this.frustumPlane.position.set(0, 0, -this.DISTANCE_TO_CAMERA);
        this.camera.add(this.frustumPlane);
        const dimensions = this._get_planeSizeAtDistance(this.camera, this.DISTANCE_TO_CAMERA);
        this.frustumPlane.scale.set(dimensions.width, dimensions.height, 1);
        
        // Store distance for updates if needed later
        this.frustumPlane.userData.distance = this.DISTANCE_TO_CAMERA;
        //-----------------------------
        this.app.emitter.on("onStartIntro", ()=>{
            gsap.to(this.material, {
                opacity: 0.0,
                duration: 1.0,
                ease: "none",
                delay: 0,
            })
        })
    }

    //----------------------------------------------
    // PUBLIC:
    updateRAF(){
        if(this.frustumPlane) {
            const dist = this.frustumPlane.userData.distance;
            
            // Recalculate dimensions based on current FOV and Aspect Ratio
            const dims = this._get_planeSizeAtDistance(this.camera, dist);
            
            // Apply new scale
            this.frustumPlane.scale.set(dims.width, dims.height, 1);
        }
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _get_planeSizeAtDistance(camera, distance) {
        // Vertical field of view in radians
        const vFov = THREE.MathUtils.degToRad(camera.fov);
    
        // Height of the viewport at the given distance
        const height = 2 * Math.tan(vFov / 2) * distance;
    
        // Width is determined by the aspect ratio
        const width = height * camera.aspect;
    
        return { width, height };
    }
    //----------------------------------------------
    // AUX:

  
}
export default CameraPlane