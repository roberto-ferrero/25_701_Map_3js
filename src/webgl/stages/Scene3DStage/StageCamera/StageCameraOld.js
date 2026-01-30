import gsap from "gsap"
import * as THREE from 'three'
import MeshUtils from '../../../core/utils/MeshUtils'

import DragMovingMouse from "./DragMovingMouse"
import SphericalPanning from "./SphericalPanning"

import CameraPlane from "./CameraPlane"

// import CameraSpots from "./CameraSpots"

import LensFlare from './LensFlare/LensFlare'

class StageCamera{
    constructor (obj){ 
        // console.log("------------------- (StageCamera.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        this.initialShotId = obj.initialShotId || "shot0"
        //-----------------------------
        this.INITIALIZED = false
        this.BUILT = false
        this.MODE = "IDLE" // IDLE | TRAVELLING | DRAG&MOVE
        this.TRAVELLING = false
        this.DRAG_MOVING = false
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
        this.CAMERA_PROGRESS = 0
        this.TARGET_PROGRESS = 0
        //-----------------------------
        this.AZIMUTH_ARCH = [-0.05, 0.05]
        this.ELEVATION_ARCH = [-0.05, 0.05]
        //-----------------------------
        this.DRAG_EXTRA ={
            x: 0,
            y: 0
        }
        this.TRAVEL_EXTRA = new THREE.Vector3()
        //-----------------------------


        // this.TARGET_PROGRESS = 0
        this.HOLDER_REF_POSITION = new THREE.Vector3()
        this.LENSFLARE_DISTANCE = -0.12
        this.CURRENT_PAN_AZIMUTH = 0
        this.CURRENT_PAN_ELEVATION = 0
        //-----------------------------
        this.raycaster = new THREE.Raycaster();
        this.mouseV2 = new THREE.Vector2();


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
        this.dragMoving = new DragMovingMouse({
            app:this.app,
            project:this.project,
            stage:this.stage,
            stageCamera:this,
            domElement: this.app.$mouseEvents
        })
        this.sphericalPanning = new SphericalPanning({
            maxPanRads: Math.PI / 24
        })


        //-----------------------------
        // HEPLPERS:
        this.camera_helper = new THREE.CameraHelper( this.camera );
        this.parent3D.add( this.camera_helper );
        this.app.register_helper(this.camera_helper)
        //-----------------------------


        this.stage.emitter.on("onStartDragMoving", ()=>{
            console.log("(StageCamera.onStartDragMoving)!");
            this.DRAG_MOVING = true
            console.log("1 this.STATES.CURRENT.camera_position: ", this.STATES.CURRENT.camera_position);
            console.log("1 this.STATES.CURRENT.target_position: ", this.STATES.CURRENT.target_position);
        })
        this.stage.emitter.on("onStopDragMoving", ()=>{
            console.log("(StageCamera.onStopDragMoving)!");
            this.DRAG_MOVING = false
            this.STATES.CURRENT.camera_position.copy(this.holder.position)
            this.STATES.CURRENT.target_position.copy(this.target.position)
            console.log("3 this.STATES.CURRENT.camera_position: ", this.STATES.CURRENT.camera_position);
            console.log("3 this.STATES.CURRENT.target_position: ", this.STATES.CURRENT.target_position);
        })
        
    }
    //----------------------------------------------
    // PUBLIC:
    init(){
        // console.log("(StageCamera.init)!")
        this.INITIALIZED = true
        // this.placeInSpot(this.initialShotId)
    }
    build(GLB_PROJECT){
        //console.log("(StageCamera.build)!")
        //------------
        //------------
        // this.lensFlare = new LensFlare({
        //     app:this.app,
        //     project:this.project,
        //     stage:this.stage,
        //     parent3D:this.camera,
        //     stageCamera:this,
        //     width: this.app.size.REF.width,
        //     height: this.app.size.REF.height,
        //     progress: 0,
        //     USE_MOUSE: false,
        //     X_RANGE: [-2, 2], 
        //     Y_RANGE: [0.0, -0.4], 
        // })
        //--
        // this.app.emitter.on("onAppSizeUpdate", ()=>{
        //     this._update_lensflareScale()
        // })
        //------------
        //--
        this.BUILT = true

       
    }
    start(){

    }
    //----------------------------------------------
    get_POSITION(){
        return this.holder.position
    }
    get_CAMERA_WORLD_POSITION(){
        return this.CAMERA_WORLD_POSITION
    }
    //----------------------------------------------
    moveToPosition(endPosition, secs = 2, ease="power2.inOut"){
        this.cameraAnim?.kill()
        this.TRAVELLING = true
        this.MODE = "TRAVELLING"
        const initialPos = this.target.position.clone()
        console.log("initialPos: ", initialPos);
        console.log("endPosition: ", endPosition);
        // const holderOffset = new THREE.Vector3().subVectors(position, this.target.position)
        this.CAMERA_PROGRESS = 0
        this.cameraAnim = gsap.to(this, {
            CAMERA_PROGRESS:1,
            duration:secs,
            ease:ease,
            onUpdate:()=>{
                // this.TRAVEL_EXTRA.lerpVectors(initialPos, endPosition, this.CAMERA_PROGRESS)
                // console.log("this.TRAVEL_EXTRA: ", this.TRAVEL_EXTRA);
                // this.holder.position.lerpVectors(initialPos, position, this.CAMERA_PROGRESS)
                // this.target.positions.lerpVectors(initialPos, endPosition, this.CAMERA_PROGRESS)
                // .add.lo dejo AddEquation...
            },
            onComplete:()=>{
                this.TRAVELLING = false
                this.MODE = "IDLE"
            },
        })
    }
    start_dragMoving(){
        this.DRAG_MOVING = true
    }
    placeInSpot(spotId){
        // console.log("(StageCamera.placeInSpot) spotId: ", spotId);
        this.cameraAnim?.kill()
        this.TRAVELLING = false
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
        this.MODE = "IDLE"
        //--
        this._drawSTATE()
    }
    travelToSpot(spotId, secs = 3, ease="power2.inOut"){
        console.log("(StageCamera.travelToSpot) spotId: ", spotId);
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
        this.cameraAnim?.kill()
        this.CAMERA_PROGRESS = 0
        this.TRAVELLING = true
        this.MODE = "TRAVELLING"
        this.cameraAnim = gsap.to(this, {
            CAMERA_PROGRESS:1,
            duration:secs,
            ease:ease,
            onUpdate:()=>{
                // this._drawSTATE()
            },
            onComplete:()=>{
                this.TRAVELLING = false
                this.MODE = "IDLE"
            },
        })
    }
    _drawSTATE(){
        // console.log("this.CAMERA_PROGRESS: ", this.CAMERA_PROGRESS);
        if(this.TRAVELLING){
            console.log("travelling...");
            this.STATES.CURRENT.camera_position.lerpVectors(this.STATES.INITIAL.camera_position, this.STATES.FINAL.camera_position, this.CAMERA_PROGRESS) 
            this.STATES.CURRENT.target_position.lerpVectors(this.STATES.INITIAL.target_position, this.STATES.FINAL.target_position, this.CAMERA_PROGRESS)
            this.STATES.CURRENT.camera_fov = THREE.MathUtils.lerp(this.STATES.INITIAL.camera_fov, this.STATES.FINAL.camera_fov, this.CAMERA_PROGRESS)
            this.STATES.CURRENT.camera_offset.lerpVectors(this.STATES.INITIAL.camera_offset, this.STATES.FINAL.camera_offset, this.CAMERA_PROGRESS)
        }
        //------
        // OLD PANNING:
        // const PANNED_POSITION = this._update_pan(this.STATES.CURRENT.camera_position)
        // this.holder.position.copy(PANNED_POSITION)
        //------
        this.holder.position.copy(this.STATES.CURRENT.camera_position)
        this.target.position.copy(this.STATES.CURRENT.target_position)
        this.camera.fov = this.STATES.CURRENT.camera_fov
        //------
        
        // console.log("panningIncr: ", panningIncr);
        //------
        // NEW DRAGGING:
        // console.log("this.STATES.CURRENT.camera_position: ", this.STATES.CURRENT.camera_position);
        // console.log("this.STATES.CURRENT.camera_position: ", this.STATES.CURRENT.target_position);
        //--
        if(this.DRAG_MOVING){
            // console.log("dragging...");
            // this.DRAG_EXTRA.x = this.dragMoving.EASED_DRAG_POSITION_X.get()
            // this.DRAG_EXTRA.y = this.dragMoving.EASED_DRAG_POSITION_Y.get()
            this.DRAG_EXTRA.x = this.dragMoving.DRAG_POSITION.x
            this.DRAG_EXTRA.y = this.dragMoving.DRAG_POSITION.y
            // console.log("this.DRAG_EXTRA: ", this.DRAG_EXTRA);
            //--
            this.holder.position.x += this.DRAG_EXTRA.x
            this.holder.position.z += this.DRAG_EXTRA.y
            this.target.position.x += this.DRAG_EXTRA.x
            this.target.position.z += this.DRAG_EXTRA.y
            //--
            console.log("---");
            console.log("2 this.STATES.CURRENT.target_position: ", this.STATES.CURRENT.target_position);
            console.log("this.DRAG_EXTRA: ", this.DRAG_EXTRA);
            console.log("this.holder.position: ", this.holder.position);
            console.log("this.target.position: ", this.target.position);
        }else{
        }
        // // NEW PANNING:
        // const panningIncr = this.sphericalPanning.getPanRel(this.app.mouse.POSITION_EASED.x.get(), this.app.mouse.POSITION_EASED.y.get(), this.STATES.CURRENT.camera_position, this.STATES.CURRENT.target_position)
        // this.holder.position.add(panningIncr)
        //--
        //--
        //---
        console.log("this.holder.position: ", this.holder.position);
        //--
        // console.log("this.target.position: ", this.target.position);
        //--
        this._update_camera_data()
    }
    
    //----------------------------------------------

    get_position(){
        return this.holder.position
    }
    get_targetPosition(){
        return this.target.position
    }
    //----------------------------------------------
    // UPDATES:
    update_RAF(){
        this._drawSTATE()
        // console.log("this.holder.position: ", this.holder.position);
        // this._update_positions()
        // this._update_pan()
        // this._update_camera_data()
        // this._update_lensFlare()
        // this._update_lensflareScale()
        // if(this.bgPlane) this._update_bgPlane()
        //--
        this.forePlane.updateRAF()
        //--
        this.camera.getWorldPosition(this.CAMERA_WORLD_POSITION)
        this.camera.updateProjectionMatrix();
        // console.log("this.camera.rotation: ", this.camera.rotation);
    }
    _update_lensflareScale(){
        const dimensions = this._get_planeSizeAtDistance(this.camera, this.LENSFLARE_DISTANCE)
        // console.log("dimensions: ", dimensions);
        const xscale = dimensions.width/this.app.size.REF.width
        const yscale = dimensions.height/this.app.size.REF.height
        // console.log("xscale: ", xscale, " yscale: ", yscale);
        this.lensFlare.cont3D.scale.set(xscale, yscale, 1)
        //----------
        this.lensFlare.cont3D.position.x = -this.STATES.CURRENT.camera_offset.x*dimensions.width
        this.lensFlare.cont3D.position.y = this.STATES.CURRENT.camera_offset.y*dimensions.height
    }

    _update_pan(REF_POSITION){
        // console.log("this.stage.MOUSE_PAN_FACTOR_EASED.get()", this.stage.MOUSE_PAN_FACTOR_EASED.get());
        const rad180 = Math.PI*0.5

        const pan_azimuth_range = this.AZIMUTH_ARCH[1]-this.AZIMUTH_ARCH[0]
        const pan_azimuth_half = this.AZIMUTH_ARCH[0]+(pan_azimuth_range*0.5)
        const pan_azimuth_incr = (this.app.mouse.POSITION_EASED.x.get()*pan_azimuth_range)
        const pan_azimuth = pan_azimuth_half + (pan_azimuth_incr)
        this.CURRENT_PAN_AZIMUTH = pan_azimuth
        // const pan_azimuth_half = this.AZIMUTH_ARCH[1]-this.AZIMUTH_ARCH[0]
        // const pan_azimuth = this.AZIMUTH_ARCH[0] + (this.app.mouse.POSITION2_EASED.x.get()*(this.AZIMUTH_ARCH[1] - this.AZIMUTH_ARCH[0])*this.stage.MOUSE_PAN_FACTOR_EASED.get() )
        
        const pan_elevation_range = this.ELEVATION_ARCH[1]-this.ELEVATION_ARCH[0]
        const pan_elevation_half  =this.ELEVATION_ARCH[0]+(pan_elevation_range*0.5)
        // const pan_elevation_incr = (this.app.mouse.POSITION_EASED.y.get()*pan_elevation_range*this.stage.MOUSE_PAN_FACTOR_EASED.get())
        const pan_elevation_incr = (this.app.mouse.POSITION_EASED.y.get()*pan_elevation_range*1)
        const pan_elevation = pan_elevation_half + (pan_elevation_incr)
        this.CURRENT_PAN_ELEVATION = pan_elevation

        const distance = REF_POSITION.distanceTo(this.target.position)
        const holder_azimuth = -this._get_azimuth( this.target.position, REF_POSITION)
        const holder_elevation = this._get_elevation(this.target.position, REF_POSITION)
        //--
        const PANNED_POSITION = this._get_star(this.target.position, holder_azimuth+rad180+pan_azimuth, holder_elevation+pan_elevation, distance)
        return PANNED_POSITION
        // console.log("PANNED_POSITION: ", PANNED_POSITION);
        //this.holder.position.copy(this._get_star(this.target.position, holder_azimuth+rad180+pan_azimuth, holder_elevation+pan_elevation, distance))
        // console.log("this.holder.position: ", this.holder.position);
    }

    _update_bgPlane(){
        // const fov = this.camera.fov * (Math.PI / 180); // Convert FOV to radians
        // const distance = Math.abs(this.bgPlane.position.z); // Distance from camera to plane
        // const aspect = this.app.size.CURRENT.aspect;
        
        // const height = 2 * distance * Math.tan(fov / 2);
        // const width = height * aspect;
        // this.bgPlane.scale.set(height, width, 1);
        // //--
        // const cameraWorldPosition = new THREE.Vector3();
        // this.camera.getWorldPosition(cameraWorldPosition);
        // console.log("cameraWorldPosition: ", cameraWorldPosition);
        // //--
        // this.mouseV2.x = this.app.mouse.POSITION_NORM.x
        // this.mouseV2.y = this.app.mouse.POSITION_NORM.y
        // this.raycaster.setFromCamera(this.mouseV2, this.camera)
        // this.intersects = this.raycaster.intersectObjects(this.holder);
        // console.log("intersects: ", this.intersects);
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

    _get_star(_observer, _azimuthX, _elevationY, _distance) {
        /**
         * Calculates the position of a star given an observer's position, azimuth, elevation, and distance.
         * 
         * @param {THREE.Vector3} _observer - The position of the observer.
         * @param {number} _azimuthX - Azimuth angle in radians (rotation around the Y-axis).
         * @param {number} _elevationY - Elevation angle in radians (angle above the XZ-plane).
         * @param {number} _distance - Distance to the star.
         * @returns {THREE.Vector3} The position of the star as a THREE.Vector3.
         */
        // Calculate the position of the star relative to the origin
        const x = _distance * Math.cos(_elevationY) * Math.sin(_azimuthX);
        const y = _distance * Math.sin(_elevationY);
        const z = _distance * Math.cos(_elevationY) * Math.cos(_azimuthX);

        // Create a Vector3 for the star's position relative to the observer
        const starPosition = new THREE.Vector3(x, y, z);

        // Add the observer's position to the star's relative position
        return starPosition.add(_observer);
    }

    _get_azimuth(_center, _position) {
        /**
         * Calculate the azimuth angle (in radians) between a center point and a position in 3D space
         * relative to the x-z reference plane.
         * 
         * @param {THREE.Vector3} _center - The center point in 3D space (THREE.Vector3).
         * @param {THREE.Vector3} _position - The position point in 3D space (THREE.Vector3).
         * @returns {number} - The azimuth angle in radians.
         */
        // Calculate the vector from the center to the position
        const direction = new THREE.Vector3().subVectors(_position, _center);
        
        // Project the direction vector onto the x-z plane
        direction.y = 0;

        // Normalize the direction vector
        direction.normalize();

        // Calculate the azimuth angle
        // atan2 gives the angle in the range [-π, π]
        const azimuth = Math.atan2(direction.z, direction.x);

        // Return the azimuth angle in radians
        return azimuth;
    }
    _get_elevation(_center, _position) {
        /**
         * Calculate the elevation angle (in radians) between a center point and a position in 3D space
         * relative to the x-z reference plane.
         * 
         * @param {THREE.Vector3} _center - The center point in 3D space (THREE.Vector3).
         * @param {THREE.Vector3} _position - The position point in 3D space (THREE.Vector3).
         * @returns {number} - The elevation angle in radians.
         */
        // Calculate the vector from the center to the position
        const direction = new THREE.Vector3().subVectors(_position, _center);
        
        // Calculate the magnitude of the projection onto the x-z plane
        const projectedLength = Math.sqrt(direction.x ** 2 + direction.z ** 2);
        
        // Calculate the elevation angle
        // atan2 gives the angle in the range [-π/2, π/2]
        const elevation = Math.atan2(direction.y, projectedLength);

        // Return the elevation angle in radians
        return elevation;
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