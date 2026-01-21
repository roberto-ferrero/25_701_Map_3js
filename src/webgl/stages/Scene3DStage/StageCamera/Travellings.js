import gsap from "gsap"
import * as THREE from 'three'

class Travellings{
    // this.app.project.stage.stageCamera.travellings
    constructor (obj){
        console.log("(Travellings.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.stageCamera = obj.stageCamera
        //-----------------------------
        this.camera = this.stageCamera.camera
        

        //-----------------------------
        this.STATES ={}
        this.STATES.CURRENT ={
            camera_position: new THREE.Vector3(),
            camera_fov: 0,
            camera_offset: new THREE.Vector2(),
            target_position: new THREE.Vector3(),
        }
        this.STATES.INITIAL ={
            camera_position: new THREE.Vector3(),
            camera_fov: 0,
            camera_offset: new THREE.Vector2(),
            target_position: new THREE.Vector3(),
        }
        this.STATES.FINAL ={
            camera_position: new THREE.Vector3(),
            camera_fov: 0,
            camera_offset: new THREE.Vector2(),
            target_position: new THREE.Vector3(),
        }
        this.TRAVELLING_ANIM = null // GSAP ANIM
        this.TRAVELLING_PROGRESS = 0
        this.TRAVELLING = false
        //-----------------------------

        //-----------------------------
        this.STATE_FROM = "camera0"
        this.STATE_TO = "camera0"
        this.TARGET_FROM = "target0"
        this.TARGET_TO = "target0"
        this.gsap_params = {
            control:0,
            fov_base: 20,
            fov_factor: 2,
            panX: 5,
            panY: 5,
            pan_azimuth_arch: [0, 0],
            pan_elevation_arch: [0, 0],
        }
        //-----------------------------
        
    }
    //----------------------------------------------
    // PUBLIC:
    placeAt(spotId){
        console.log("(Travellings.placeAt): ", spotId);
        // PLACING WITHOUT ANIMATION
        //--
        this.TRAVELLING_ANIM?.kill()
        this.TRAVELLING = false
        //--
        const cameraRef = this.stage.libs.cameraspots.getItem(spotId)
        const cameraPos = this.stage.libs.cameraspots.getItemPosition(spotId)
        const targetPos = this.stage.libs.cameratargets.getItemPosition(spotId)
        //--
        this.STATES.CURRENT.camera_position.copy(cameraPos)
        this.STATES.CURRENT.camera_fov = cameraRef.fov
        this.STATES.CURRENT.target_position.copy(targetPos)
        //--
        this._update()
    }
    travelTo(spotId, secs = 3, ease="power2.inOut"){
        console.log("(StageCamera.travelTo): ", spotId);
        //--
        this.STATES.INITIAL.camera_position.copy(this.STATES.CURRENT.camera_position)
        this.STATES.INITIAL.target_position.copy(this.STATES.CURRENT.target_position)
        this.STATES.INITIAL.camera_offset.copy(this.STATES.CURRENT.camera_offset)
        this.STATES.INITIAL.camera_fov = this.camera.fov
        //--
        const cameraRef = this.stage.libs.cameraspots.getItem(spotId)
        const cameraPos = this.stage.libs.cameraspots.getItemPosition(spotId)
        const targetPos = this.stage.libs.cameratargets.getItemPosition(spotId)
        this.STATES.FINAL.camera_position.copy(cameraPos)
        this.STATES.FINAL.target_position.copy(targetPos)
        this.STATES.FINAL.camera_offset.copy(this.STATES.CURRENT.camera_offset) // TO DO: ADD OFFSET TO SPOTS
        this.STATES.FINAL.camera_fov = cameraRef.fov
        //--
        this.TRAVELLING_ANIM?.kill()
        this.TRAVELLING_PROGRESS = 0
        this.TRAVELLING = true
        this.cameraAnim = gsap.to(this, {
            TRAVELLING_PROGRESS:1,
            duration:secs,
            ease:ease,
            onUpdate:()=>{
                this._update()
            },
            onComplete:()=>{
                this.TRAVELLING = false
            },
        })
    }
    //----------------------------------------------
    // EVENTS:
    update_RAF(){

    }
    //----------------------------------------------
    // PRIVATE:
    _update(){
        // console.log("this.TRAVELLING_PROGRESS: ", this.TRAVELLING_PROGRESS);
        if(this.TRAVELLING){
            this.STATES.CURRENT.camera_position.lerpVectors(this.STATES.INITIAL.camera_position, this.STATES.FINAL.camera_position, this.TRAVELLING_PROGRESS) 
            this.STATES.CURRENT.target_position.lerpVectors(this.STATES.INITIAL.target_position, this.STATES.FINAL.target_position, this.TRAVELLING_PROGRESS)
            this.STATES.CURRENT.camera_fov = THREE.MathUtils.lerp(this.STATES.INITIAL.camera_fov, this.STATES.FINAL.camera_fov, this.TRAVELLING_PROGRESS)
            this.STATES.CURRENT.camera_offset.lerpVectors(this.STATES.INITIAL.camera_offset, this.STATES.FINAL.camera_offset, this.TRAVELLING_PROGRESS)
        }
        //-----
        this.stageCamera.CAMERA_POSITION.copy(this.STATES.CURRENT.camera_position)
        this.stageCamera.CAMERA_FOV = this.STATES.CURRENT.camera_fov
        this.stageCamera.TARGET_POSITION.copy(this.STATES.CURRENT.target_position)
    }

    
    //----------------------------------------------
    // AUX:

  
}
export default Travellings