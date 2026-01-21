import gsap from "gsap"
import * as THREE from 'three'
import MeshUtils from '../../../core/utils/MeshUtils'

import Travellings from "./Travellings"

class StageCamera{
    // this.app.project.stage.stageCamera
    constructor (obj){ 
        console.log("(StageCamera.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        //-----------------------------
        
        //-----------------------------
        // MAIN CAMERA STATES:
        this.CAMERA_POSITION = new THREE.Vector3()
        this.CAMERA_FOV = 22
        this.CAMERA_OFFSET = new THREE.Vector2(0,0)
        this.TARGET_POSITION = new THREE.Vector3()
        //-----------------------------

        //-----------------------------
        // CAMERA CREATION:
        this.camera = new THREE.PerspectiveCamera(22, this.app.size.CURRENT.aspect, 0.1, 1000);
        this.camera.name = "main_camera"
        this._create_structure()
        //-----------------------------
        //CAMERA REGISTRATION
        this.app.render.set_stageCamera(this.camera)
        //-----------------------------
        
        
        //-----------------------------
        this.travellings = new Travellings({
            app:this.app,
            project:this.project,
            stage:this.stage,
            stageCamera:this,
        })
        //-----------------------------

        //-----------------------------
        // HELPERS:
        this.camera_helper = new THREE.CameraHelper( this.camera );
        this.parent3D.add( this.camera_helper );
        this.app.register_helper(this.camera_helper)
    }
    //----------------------------------------------
    // PUBLIC:
    init(){
        console.log("(StageCamera.init)!")
    }
    build(){
        console.log("(StageCamera.build)!")
    }
    //------------
    placeAt(spotId){
        console.log("(StageCamera.placeAt): ", spotId);
        this.travellings.placeAt(spotId)
    }
    travelTo(spotId){
        console.log("(StageCamera.travelTo): ", spotId);
        this.travellings.travelTo(spotId)

    }

    get_position(){
        return this.holder.position
    }
    get_targetPosition(){
        return this.target.position
    }
    //----------------------------------------------
    // UPDATES:
    update_RAF(){
        this.travellings?.update_RAF()
        this._update()
    }
    _update(){
        this.holder.position.copy(this.CAMERA_POSITION)
        this.target.position.copy(this.TARGET_POSITION)
        //--
        this.camera.lookAt(this.target.position)
        this.camera.aspect = this.app.size.CURRENT.width/this.app.size.CURRENT.height
        this.camera.fov = this.CAMERA_FOV
        //--
        const offset_x = this.app.size.CURRENT.width*this.CAMERA_OFFSET.x
        const offset_y = this.app.size.CURRENT.height*this.CAMERA_OFFSET.y
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
        //--
        if(this.camera_helper) this.camera_helper.update()
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

    }
    //----------------------------------------------
    // AUX:

  
}
export default StageCamera