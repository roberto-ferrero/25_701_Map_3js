//import gsap from "gsap"
import * as THREE from 'three'
import Datos from '../../../core/utils/Datos'

class SpotsLib{ //this.stage.spots
    constructor (obj){
        // console.log("(SpotsLib.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        //-----------------------------
        this.DATA = new Datos()
        //-----------------------------
    }
    //----------------------------------------------
    // PUBLIC:
    addItem(spotId, obj3D){
        // console.log("(SpotsLib.add_spot): ", spotId);
        this.DATA.nuevoItem(spotId, obj3D)
    }
    add_cameraspot(spotId, cameraObj){
        // console.log("(SpotsLib.add_cameraspot): ", cameraObj);
        this.DATA.nuevoItem(spotId, cameraObj)
    }
    //--------
    getItemPosition(spotId){
        // console.log("(SpotsLib.get_spot): ", spotId);
        return this.DATA.getItem(spotId).position.clone();
    }
    getItem(spotId){
        // console.log("(SpotsLib.get_spot): ", spotId);
        return this.DATA.getItem(spotId)
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default SpotsLib