//import gsap from "gsap"
import * as THREE from 'three'
import Datos from '../../../core/utils/Datos'

class MeshesLib{ //this.stage.spots
    constructor (obj){
        // console.log("(MeshesLib.CONSTRUCTORA): ", obj)
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
    addItem(meshId, obj3D, materialId){
        console.log("(MeshesLib.addItem): ", meshId, materialId);
        obj3D.__materialId = materialId
        this.DATA.nuevoItem(meshId, obj3D)
    }
    getItem(meshId){
        // console.log("(MeshesLib.get_spot): ", meshId);
        return this.DATA.getItem(meshId);
    }
    // getItem2(meshId){
    //     // console.log("(MeshesLib.get_spot): ", meshId);
    //     return this.DATA.getItem(meshId).clone();
    // }
    getItem2(meshId){
    const original = this.DATA.getItem(meshId);
    const clon = original.clone();
    
    // Copiar propiedades custom manualmente
    if(original.__materialId) clon.__materialId = original.__materialId;
    
    return clon;
}
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    //----------------------------------------------
    // AUX:

  
}
export default MeshesLib