//import gsap from "gsap"
import * as THREE from 'three'

class PointLight3D{
    constructor (obj){
        console.log("(PointLight3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        this.itemId = obj.itemId
        this.position = obj.position
        this.pointLight = obj.pointLight
        //-----------------------------
        //-----------------------------
        // this.pointLight = new THREE.PointLight(0xffffff, 50, 100); // color, intensity, distance
        this.pointLight.position.copy(this.position);
        this.parent3D.add(this.pointLight);;
        
        this.parent3D.add(this.pointLight)
        //-----------------------------
        this.pointLight_helper = new THREE.PointLightHelper(this.pointLight, 1); // size of the helper
        this.app.register_helper(this.pointLight_helper);
        this.parent3D.add(this.pointLight_helper);
        //-----------------------------
    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default PointLight3D