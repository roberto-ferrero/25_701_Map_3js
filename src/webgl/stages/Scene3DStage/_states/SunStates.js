//import gsap from "gsap"
//import * as THREE from 'three'

import Datos from "../../../core/utils/Datos"
import NumberUtils from "../../../core/utils/NumberUtils"


class SunStates{
    constructor (obj){
        //console.log("(SunStates.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        //-----------------------------
        //-----------------------------
        this.data = new Datos()
        //-----------------------------
    }
    //----------------------------------------------
    // PUBLIC:
    /*
    build(GLB_PROJECT){
        GLB_PROJECT.children.map((child)=>{
            if(child.name.includes("camera")){
                const itemId = child.name.split("_")[0]
                //console.log(itemId, child);
                const item = {
                    itemId: itemId,
                    position: child.position,
                    rotation: child.rotation,
                    fov: child.fov,
                }
                this.data.nuevoItem(itemId, item)
            }
        })
    }
    */
    get_state(itemId){
        return this.data.getItem(itemId)
    }
    get_mix(stateId_0, stateId_1, progress){
        const newState = this._get_emptyState()
        newState.DAY_PROGRESS = NumberUtils.lerp(this.data.getItem(stateId_0).DAY_PROGRESS, this.data.getItem(stateId_1).DAY_PROGRESS, progress)
        newState.YEAR_PROGRESS = NumberUtils.lerp(this.data.getItem(stateId_0).YEAR_PROGRESS, this.data.getItem(stateId_1).YEAR_PROGRESS, progress)
        return newState
    }

    add_state(itemId, state){
        this.data.nuevoItem(itemId, state)
    }
    add_param(itemId, param, value){
        const item = this.data.getItem(itemId)
        item[param] = value
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _get_emptyState(){
        return {
            itemId: "empty",
            DAY_PROGRESS: 0,
            YEAR_PROGRESS: 0,
        }
    }
    //----------------------------------------------
    // AUX:

  
}
export default SunStates