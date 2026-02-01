//import gsap from "gsap"
import * as THREE from 'three'

class CityBullet{
    constructor (obj){
        // console.log("(CityBullet.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        this.marker = obj.marker
        //------------
        const geometry = new THREE.PlaneGeometry(1, 1)
        const texture = this.stage.loader.get_texture(this.marker.type)
        texture.colorSpace = THREE.SRGBColorSpace
        //--
        this.material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true,
            depthWrite: false,
            combine : THREE.MixOperation,
            opacity: this.marker.TYPE_OPACITY_FACTOR*this.marker.INTRO_OPACITY_FACTOR,
        });
        this.mesh = new THREE.Mesh( geometry, this.material );
        //--
        this.mesh.userData.city_id = this.marker.city_id;
        this.mesh.userData.city_type = this.marker.type;
        this.mesh.userData.parentInstance = this.marker; // Opcional, por si quieres acceder a la clase completa
        //--
        this.parent3D.add(this.mesh)
    }
    //----------------------------------------------
    // PUBLIC:
    updateRAF(){
        this.material.opacity = this.marker.TYPE_OPACITY_FACTOR*this.marker.INTRO_OPACITY_FACTOR
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default CityBullet