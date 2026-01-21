//import gsap from "gsap"
import * as THREE from 'three'

import Datos from "../../../core/utils/Datos"
import MeshUtils from "../../../core/utils/MeshUtils"

class CameraSpots{
    constructor (obj){
        console.log("(CameraSpots.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        //-----------------------------
        this.SPOTS = new Datos()
        //-----------------------------
    }
    //----------------------------------------------
    // PUBLIC:
    build(GLB_PROJECT){
        GLB_PROJECT.children.map((child)=>{
            // console.log("child.name: ", child.name, child);
            if(child.name.includes("_camera")){
                const spotId = child.name.split("_")[0]
                if(!this.SPOTS.evalExiste(spotId)){
                    const spot = {
                        spotId: spotId,
                        camera_position: child.position,
                        camera_rotation: child.rotation,
                        camera_fov: child.fov,
                        target_position: new THREE.Vector3(),
                        camera_offset: new THREE.Vector2(0,0),
                    }
                    this.SPOTS.nuevoItem(spotId, spot)
                    //--
                    spot.camera_helper = MeshUtils.get_sphere(0.1, 8, 8, 0xff0000)
                    spot.camera_helper.position.copy(spot.camera_position)
                    this.app.register_helper(spot.camera_helper)
                    this.parent3D.add(spot.camera_helper)
                    //--
                    spot.target_helper = MeshUtils.get_sphere(0.1, 8, 8, 0x00ff00)
                    // spot.target_helper.position.copy(spot.target_position)
                    this.app.register_helper(spot.target_helper)
                    this.parent3D.add(spot.target_helper)
                }else{
                    const spot = this.SPOTS.getItem(spotId)
                    spot.camera_position.copy(child.position)
                    spot.camera_rotation.copy(child.rotation)
                    spot.camera_fov = child.fov
                    //--
                    spot.camera_helper.position.copy(spot.camera_position)
                }
            }else if(child.name.includes("_target")){
                const spotId = child.name.split("_")[0]
                if(!this.SPOTS.evalExiste(spotId)){
                    const spot = {
                        spotId: spotId,
                        camera_position: new THREE.Vector3(),
                        camera_rotation: new THREE.Vector3(),
                        camera_fov: null,
                        target_position: child.position,
                    }
                    this.SPOTS.nuevoItem(spotId, spot)
                    //--
                    spot.camera_helper = MeshUtils.get_sphere(0.1, 8, 8, 0xff0000)
                    // spot.camera_helper.position.copy(spot.camera_position)
                    this.app.register_helper(spot.camera_helper)
                    this.parent3D.add(spot.camera_helper)
                    //--
                    spot.target_helper = MeshUtils.get_sphere(0.1, 8, 8, 0x00ff00)
                    spot.target_helper.position.copy(spot.target_position)
                    this.app.register_helper(spot.target_helper)
                    this.parent3D.add(spot.target_helper)
                }else{
                    const spot = this.SPOTS.getItem(spotId)
                    // console.log("spot: ", spot);
                    spot.target_position.copy(child.position)
                    //--
                    spot.target_helper.position.copy(spot.target_position)
                }
            }
        })
        //--------------------------
        // ADDING EXTRA PARAMS:
        // const spot0 = this.SPOTS.getItem("spot0")
        // spot0.camera_offset.set(0, 0)
        // const spot1 = this.SPOTS.getItem("spot1")
        // spot1.camera_offset.set(0, 0)
        // const spot2 = this.SPOTS.getItem("spot2")
        // spot2.camera_offset.set(0, 0)
        // const spot3 = this.SPOTS.getItem("spot3")
        // spot3.camera_offset.set(0, 0)
        // const spot4 = this.SPOTS.getItem("spot4")
        // spot4.camera_offset.set(0, 0)
        // const spot5 = this.SPOTS.getItem("spot5")
        // spot5.camera_offset.set(0.2, 0) 
        // const spot6 = this.SPOTS.getItem("spot6")
        // spot6.camera_offset.set(0.2, 0) 
        // const spot7 = this.SPOTS.getItem("spot7")
        // spot7.camera_offset.set(0.0, 0) 
        // const spot8 = this.SPOTS.getItem("spot8")
        // spot8.camera_offset.set(0.0, 0)
        //--------------------------

        console.log("this.SPOTS: ", this.SPOTS);
    }
    get_spot(spotId){
        return this.SPOTS.getItem(spotId)
    }
    add_param(spotId, param, value){
        const spot = this.SPOTS.getItem(spotId)
        spot[param] = value
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default CameraSpots