import gsap from "gsap"
import * as THREE from 'three'
import MeshUtils from '../../../core/utils/MeshUtils'

import DragMovingMouse from "./DragMovingMouse"

import CameraPlane from "./CameraPlane"


class StageCamera{
    constructor (obj){ 
        // console.log("------------------- (StageCamera.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        //-----------------------------
        this.GSAP_ANIM = null
        this.ANIM_PROGRESS = 0
        //--
        this.OFFSET_ANIM = null
        this.OFFSET_PROGRESS = 0
        this.OFFSETTED = false

        this.CAMERA_WORLD_POSITION = new THREE.Vector3()
        //-----------------------------
        this.STATES ={}
        this.STATES.CURRENT ={
            camera_position: new THREE.Vector3(),
            camera_fov: 0,
            camera_offset: new THREE.Vector2(0,0),
            target_position: new THREE.Vector3(),
        }
        this.STATES.INITIAL ={
            camera_position: new THREE.Vector3(),
            camera_fov: 0,
            camera_offset: new THREE.Vector2(0,0),
            target_position: new THREE.Vector3(),
        }
        this.STATES.FINAL ={
            camera_position: new THREE.Vector3(),
            camera_fov: 0,
            camera_offset: new THREE.Vector2(0,0),
            target_position: new THREE.Vector3(),
        }
        //-----------------------------



        //-----------------------------
        // CAMERA CREATION:
        this.camera = new THREE.PerspectiveCamera(22, this.app.size.CURRENT.aspect, 0.1, 10000);
        this.camera.name = "main_camera"
        this._create_structure()
        //-----------------------------
        //CAMERA REGISTRATION:
        this.app.render.set_stageCamera(this.camera)
        //-----------------------------
        this.forePlane = new CameraPlane({
            app:this.app,
            project:this.project,
            stage:this.stage,
            camera:this.camera
        })
        //-----------------------------
        this.dragMove = new DragMovingMouse({
            app:this.app,
            project:this.project,
            stage:this.stage,
            stageCamera:this,
            domElement: this.app.$mouseEvents
        })
        
        //-----------------------------
        // HEPLPERS:
        this.camera_helper = new THREE.CameraHelper( this.camera );
        this.parent3D.add( this.camera_helper );
        this.app.register_helper(this.camera_helper)
        //-----------------------------


        this.stage.emitter.on("onStartDragMoving", ()=>{
            console.log("(StageCamera.onStartDragMoving)!");
            this.resetOffset()
            this.GSAP_ANIM?.kill()
            this.stage.set_MODE("DRAGGING")
            this.STATES.INITIAL.camera_position.copy(this.STATES.CURRENT.camera_position)
            this.STATES.INITIAL.target_position.copy(this.STATES.CURRENT.target_position)
        })
        this.stage.emitter.on("onStopDragMoving", ()=>{
            console.log("(StageCamera.onStopDragMoving)!");
            this.stage.set_MODE("IDLE")
            this.STATES.CURRENT.camera_position.copy(this.holder.position)
            this.STATES.CURRENT.target_position.copy(this.target.position)
        })
        this.app.emitter.on("onAppZoomChange", (event)=>{
            if(event.doZoomingAnim){
                console.log("(StageCamera.onAppZoomChange)!");
                const spotId = "zoom"+this.stage.CURRENT_ZOOM
                this.zoomTo(spotId, 1)
            }
        })
        this.app.emitter.on("onCityClicked", (event)=>{
            this.applyOffset()
        })
        this.app.emitter.on("onShopClicked", (event)=>{
            this.applyOffset()
        })
        this.app.emitter.on("onEventClicked", (event)=>{
            this.applyOffset()
        })
        
    }
    //----------------------------------------------
    // PUBLIC:
    init(){

    }
    build(GLB_PROJECT){

    }
    // start(){

    // }
    //----------------------------------------------
    get_CAMERA_WORLD_POSITION(){
        return this.CAMERA_WORLD_POSITION
    }
    get_position(){
        return this.holder.position
    }
    get_targetPosition(){
        return this.target.position
    }
    //----------------------------------------------
    moveAndZoom(positionV3, newZoomLevel, secs = 1, ease="power2.inOut"){
        console.log("(StageCamera.moveAndZoom) positionV3:", positionV3, " newZoomLevel:", newZoomLevel);
        this.GSAP_ANIM?.kill()
        this.stage.set_MODE("TRAVELLING")
        //--
        const spotId = "zoom"+newZoomLevel
        const cameraRef = this.stage.libs.cameraspots.getItem(spotId)
        const zoomIncrV3 = this.stage.cameraManager["RELATIVE_POSITIONS_ZOOM_"+newZoomLevel] // Relative position vector of camera to target
        //--
        this.STATES.INITIAL.camera_position.copy(this.STATES.CURRENT.camera_position)
        this.STATES.INITIAL.target_position.copy(this.STATES.CURRENT.target_position)
        this.STATES.INITIAL.camera_fov = this.STATES.CURRENT.camera_fov
        //--
        this.STATES.FINAL.target_position.copy(positionV3)
        this.STATES.FINAL.camera_position.copy(positionV3).add(zoomIncrV3) // We copy the target position and add the relative vector
        this.STATES.FINAL.camera_fov = cameraRef.fov
        //--
        console.log("-------------------------");
        console.log("   zoomIncrV3:", zoomIncrV3);
        console.log("   STATES.INITIAL.target_position:", this.STATES.INITIAL.target_position);
        console.log("   STATES.INITIAL.camera_position:", this.STATES.INITIAL.camera_position);
        console.log("   -");
        console.log("   STATES.FINAL.target_position:", this.STATES.FINAL.target_position);
        console.log("   STATES.FINAL.camera_position:", this.STATES.FINAL.camera_position);
        console.log("-------------------------");

        //-----------------
        // GSAP ANIM:
        this.ANIM_PROGRESS = 0
        this.GSAP_ANIM = gsap.to(this, {
            ANIM_PROGRESS:1,
            duration:secs,
            ease:ease,
            onUpdate:()=>{
                // this._drawSTATE()
            },
            onComplete:()=>{
                console.log("GSAP ANIM onComplete!");
                this.stage.set_MODE("IDLE")
            },
        })

    }
    zoomTo(spotId, secs = 3, ease="power2.inOut"){
        console.log("(StageCamera.zoomTo) spotId: ", spotId);
        this.GSAP_ANIM?.kill()
        this.stage.set_MODE("ZOOMING")
        //--
        const cameraRef = this.stage.libs.cameraspots.getItem(spotId)
        const zoomIncrV3 = this.stage.cameraManager["RELATIVE_POSITIONS_ZOOM_"+this.stage.CURRENT_ZOOM] // Relative position vector of camera to target
        //--
        this.STATES.INITIAL.camera_position.copy(this.STATES.CURRENT.camera_position)
        this.STATES.INITIAL.target_position.copy(this.STATES.CURRENT.target_position)
        this.STATES.INITIAL.camera_fov = this.STATES.CURRENT.camera_fov
        
        this.STATES.FINAL.camera_position.copy(this.STATES.CURRENT.target_position).add(zoomIncrV3) // We copy the target position and add the relative vector
        this.STATES.FINAL.target_position.copy(this.STATES.CURRENT.target_position)
        this.STATES.FINAL.camera_fov = cameraRef.fov
        //--
        //-----------------
        // GSAP ANIM:
        this.ANIM_PROGRESS = 0
        this.GSAP_ANIM = gsap.to(this, {
            ANIM_PROGRESS:1,
            duration:secs,
            ease:ease,
            onUpdate:()=>{
                // this._drawSTATE()
            },
            onComplete:()=>{
                console.log("GSAP ANIM onComplete!");
                this.stage.set_MODE("IDLE")
            },
        })
    }
    placeInSpot(spotId){
        // console.log("(StageCamera.placeInSpot) spotId: ", spotId);
        this.GSAP_ANIM?.kill()
        this.stage.set_MODE("IDLE")
        //--
        const cameraRef = this.stage.libs.cameraspots.getItem(spotId)
        const cameraPos = this.stage.libs.cameraspots.getItemPosition(spotId)
        const targetPos = this.stage.libs.cameratargets.getItemPosition(spotId)
        //--
        this.STATES.CURRENT.camera_position.copy(cameraPos)
        this.STATES.CURRENT.target_position.copy(targetPos)
        //this.STATES.CURRENT.camera_offset.copy(spot.camera_offset)
        
        this.STATES.CURRENT.camera_fov = cameraRef.fov
        //--
        //--
        this._drawSTATE()
    }
    travelToSpot(spotId, secs = 3, ease="power2.inOut"){
        console.log("(StageCamera.travelToSpot) spotId: ", spotId);
        this.GSAP_ANIM?.kill()
        this.stage.set_MODE("TRAVELLING")
        //const spot = this.SPOTS.get_spot(spotId)
        const cameraRef = this.stage.libs.cameraspots.getItem(spotId)
        const cameraPos = this.stage.libs.cameraspots.getItemPosition(spotId)
        const targetPos = this.stage.libs.cameratargets.getItemPosition(spotId)
        //-----------------
        // INITIAL:
        this.STATES.INITIAL.camera_position.copy(this.STATES.CURRENT.camera_position)
        this.STATES.INITIAL.target_position.copy(this.STATES.CURRENT.target_position)
        // this.STATES.INITIAL.camera_offset.copy(this.STATES.CURRENT.camera_offset)
        this.STATES.INITIAL.camera_fov = this.camera.fov
        //-----------------
        // FINAL
        this.STATES.FINAL.camera_position.copy(cameraPos)
        this.STATES.FINAL.target_position.copy(targetPos)
        // this.STATES.FINAL.camera_offset.copy(spot.camera_offset)
        this.STATES.FINAL.camera_fov = cameraRef.fov
        //-----------------
        // GSAP ANIM:
        this.ANIM_PROGRESS = 0
        this.GSAP_ANIM = gsap.to(this, {
            ANIM_PROGRESS:1,
            duration:secs,
            ease:ease,
            onUpdate:()=>{
                // this._drawSTATE()
            },
            onComplete:()=>{
                this.stage.set_MODE("IDLE")
            },
        })
    }
   
    
    //----------------------------------------------

   
    //----------------------------------------------
    // UPDATES:
    update_RAF(){
        this.forePlane.updateRAF()
        this.camera.getWorldPosition(this.CAMERA_WORLD_POSITION)
        this._drawSTATE()
        this._update_camera_data()
    }
    applyOffset(){
        if(!this.OFFSETTED){
            console.log("(StageCamera.applyOffset)!");
            this.OFFSETTED = true
            this.STATES.INITIAL.camera_offset.copy(this.STATES.CURRENT.camera_offset)
            this.STATES.FINAL.camera_offset.set(0, 0.33)
            this.OFFSET_ANIM?.kill()
            this.OFFSET_PROGRESS = 0
            this.OFFSET_ANIM = gsap.to(this, {
                OFFSET_PROGRESS:1,
                duration:1,
                ease:"power2.inOut",
                onUpdate:()=>{
                    this.STATES.CURRENT.camera_offset.lerpVectors(this.STATES.INITIAL.camera_offset, this.STATES.FINAL.camera_offset, this.OFFSET_PROGRESS)
                    // console.log("applying offset...", this.STATES.CURRENT.camera_offset);
                },
                onComplete:()=>{
                },
            })
        }
    }
    resetOffset(){
        if(this.OFFSETTED){
            console.log("(StageCamera.resetOffset)!");
            this.OFFSETTED = false
            this.STATES.INITIAL.camera_offset.copy(this.STATES.CURRENT.camera_offset)
            this.STATES.FINAL.camera_offset.set(0, 0.0)
            console.log("this.STATES.CURRENT.camera_offset before reset: ", this.STATES.CURRENT.camera_offset);
            console.log("this.STATES.INITIAL.camera_offset: ", this.STATES.INITIAL.camera_offset);
            console.log("this.STATES.FINAL.camera_offset: ", this.STATES.FINAL.camera_offset);

            this.OFFSET_ANIM?.kill()
            this.OFFSET_PROGRESS = 0
            this.OFFSET_ANIM = gsap.to(this, {
                OFFSET_PROGRESS:1,
                duration:1,
                ease:"power2.inOut",
                onUpdate:()=>{
                    this.STATES.CURRENT.camera_offset.lerpVectors(this.STATES.INITIAL.camera_offset, this.STATES.FINAL.camera_offset, this.OFFSET_PROGRESS)
                    // console.log("resetting offset...", this.STATES.CURRENT.camera_offset);
                },
                onComplete:()=>{
                },
            })
        }
    }
     _drawSTATE(){
        // console.log("this.stage.get_MODE(): ", this.stage.get_MODE());
        if(this.stage.get_MODE() == "TRAVELLING"){
            // console.log("travelling...");
            this.STATES.CURRENT.camera_position.lerpVectors(this.STATES.INITIAL.camera_position, this.STATES.FINAL.camera_position, this.ANIM_PROGRESS) 
            this.STATES.CURRENT.target_position.lerpVectors(this.STATES.INITIAL.target_position, this.STATES.FINAL.target_position, this.ANIM_PROGRESS)
            this.STATES.CURRENT.camera_fov = THREE.MathUtils.lerp(this.STATES.INITIAL.camera_fov, this.STATES.FINAL.camera_fov, this.ANIM_PROGRESS)
            // this.STATES.CURRENT.camera_offset.lerpVectors(this.STATES.INITIAL.camera_offset, this.STATES.FINAL.camera_offset, this.ANIM_PROGRESS)
        }else if(this.stage.get_MODE() == "DRAGGING"){
            // console.log("dragging...", this.dragMove.DRAG_POSITION);
            this.STATES.CURRENT.camera_position.x = this.STATES.INITIAL.camera_position.x+this.dragMove.DRAG_POSITION.x
            this.STATES.CURRENT.camera_position.z = this.STATES.INITIAL.camera_position.z+this.dragMove.DRAG_POSITION.y
            this.STATES.CURRENT.target_position.x = this.STATES.INITIAL.target_position.x+this.dragMove.DRAG_POSITION.x
            this.STATES.CURRENT.target_position.z = this.STATES.INITIAL.target_position.z+this.dragMove.DRAG_POSITION.y
        }else if(this.stage.get_MODE() == "ZOOMING"){
            // console.log("zooming...");
            this.STATES.CURRENT.camera_position.lerpVectors(this.STATES.INITIAL.camera_position, this.STATES.FINAL.camera_position, this.ANIM_PROGRESS) 
            this.STATES.CURRENT.target_position.lerpVectors(this.STATES.INITIAL.target_position, this.STATES.FINAL.target_position, this.ANIM_PROGRESS)
            this.STATES.CURRENT.camera_fov = THREE.MathUtils.lerp(this.STATES.INITIAL.camera_fov, this.STATES.FINAL.camera_fov, this.ANIM_PROGRESS)
            // this.STATES.CURRENT.camera_offset.lerpVectors(this.STATES.INITIAL.camera_offset, this.STATES.FINAL.camera_offset, this.ANIM_PROGRESS)
        }
        //------
        this.holder.position.copy(this.STATES.CURRENT.camera_position)
        this.target.position.copy(this.STATES.CURRENT.target_position)
        this.camera.fov = this.STATES.CURRENT.camera_fov
    }

    //----------------------------------------------
    // PRIVATE:
    _create_structure(){
        this.holder = new THREE.Object3D()
        this.parent3D.add(this.holder)
        this.holder.add(this.camera)
        //---------
        this.holder_helper = MeshUtils.get_box(0.2, 0.2, 0.2, 0xffff00)
        this.holder_helper.name = "holder_helper"
        this.app.register_helper(this.holder_helper)
        this.holder.add(this.holder_helper)


        // this.holder.position.set(0, 20, 300)
        //this.holder.position.set(-87, 126, -392)
        // x: -87.54139709472656, y: 126.45600128173828, z: -392.69500732421875
        // this.parent3D.add(this.holder)
        // //--
        // this.looker = new THREE.Object3D()
        // this.holder.add(this.looker)
        // //--
        // this.panX = new THREE.Object3D()
        // this.looker.add(this.panX)
        // //--
        // this.panY = new THREE.Object3D()
        // this.panX.add(this.panY)
        // //--
        // this.panY.add(this.camera)
        //----------
        //----------
        // this.planeGeometry = new THREE.PlaneGeometry(1, 1, 10, 10);
        // this.planeMaterial = new THREE.MeshBasicMaterial({
        //     color: 0x0000ff,
        //     wireframe: true,
        //     side: THREE.DoubleSide
        // });
        // this.bgPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        // this.bgPlane.position.set(0, 0, -250)
        // this.bgPlane.rotation.z = Math.PI / 2; // Rotate to make it vertical
        // this.camera.add(this.bgPlane);
        //----------
        //----------
        this.target = new THREE.Object3D()
        this.parent3D.add(this.target)
        //---------
        this.target_helper = MeshUtils.get_box(0.2, 0.2, 0.2, 0xffff00)
        this.target_helper.name = "target_helper"
        this.app.register_helper(this.target_helper)
        this.target.add(this.target_helper)

        

        // if(this.app.dev_helpers){
        //     this.holder_test = MeshUtils.get_sphere(0.5, 10, 10, 0xffff00)
        //     this.holder.add(this.holder_test)
        //     this.app.dev.register_helper(this.holder_test)
        //     //--
        //     this.camera_helper = new THREE.CameraHelper( this.camera );
        //     this.parent3D.add( this.camera_helper );
        //     this.app.dev.register_helper(this.camera_helper)
        //     //--
        //     // --
        //     // --
        //     this.holder_helper = MeshUtils.get_box(2, 2, 2, 0xff0000)
        //     this.holder.add(this.holder_helper)
        //     this.app.dev.register_helper(this.holder_helper)
        //     // --
        //     this.panX_helper = MeshUtils.get_box(1, 2, 1, 0xff0000)
        //     this.panX.add(this.panX_helper)
        //     this.app.dev.register_helper(this.panX_helper)
        //     // --
        //     this.panY_helper = MeshUtils.get_box(1, 1, 1, 0xff0000)
        //     this.panY.add(this.panY_helper)
        //     this.app.dev.register_helper(this.panY_helper)
        //     // --
        //     this.target_helper = MeshUtils.get_box(1, 1, 1, 0x0000ff)
        //     this.target.add(this.target_helper)
        //     this.app.dev.register_helper(this.target_helper)
            
        // }
        this._update_camera_data()
    }
    _update_camera_data(){
        ////console.log("this.camera.rotation: ", this.camera.rotation);
        this.camera.lookAt(this.target.position)
        this.camera.aspect = (this.app.size.CURRENT.width)/this.app.size.CURRENT.height
        //--
        const offset_x = this.app.size.CURRENT.width*this.STATES.CURRENT.camera_offset.x
        const offset_y = this.app.size.CURRENT.height*this.STATES.CURRENT.camera_offset.y
        this.camera.setViewOffset(
            this.app.size.CURRENT.width,
            this.app.size.CURRENT.height,
            offset_x,
            offset_y,
            this.app.size.CURRENT.width,
            this.app.size.CURRENT.height,
        )
        //--
        this.camera.updateProjectionMatrix();
        if(this.camera_helper) this.camera_helper.update()
    }

   
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
export default StageCamera