//import gsap from "gsap"
import * as THREE from 'three'

class Sun3D{
    constructor (obj){
        // console.log("(Sun3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        this.parent3D = obj.parent3D
        //-----------------------------
        this.itemId = "sun3D"
        //-----------------------------
        this.mesh = this.stage.get_mesh_from_GLB_PROJECT(this.itemId)
        // this.texture = this.stage.loader.get_texture("stairs")
        // this.texture.flipY = false;
        const marbleMaterial = new THREE.MeshBasicMaterial({
            // map: this.texture, // Use the loaded texture
            color: 0xffffff, // Ivory base color
            // color: 0xF6F1E7, // Ivory base color
            // roughness: 0.4,   // Moderate roughness for a soft shine
            // metalness: 0.0,   // Non-metallic
            fog: false
          });
        this.mesh.material = marbleMaterial
        // console.log("mesh",this.mesh);
        this.parent3D.add(this.mesh)

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
export default Sun3D