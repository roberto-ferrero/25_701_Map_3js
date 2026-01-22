//import gsap from "gsap"
//import * as THREE from 'three'

import Marker3D from './Marker3D'

class MarkersPack3D{
    constructor (obj){
        // console.log("(MarkersPack3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario3D = obj.scenario3D
        this.map3D = obj.map3D
        this.type = obj.type
        this.parent3D = obj.parent3D
        //----
        this.items = []
        //---
        this.init()
    }
    init(){
        this.stage.stageData.get_arrayItems(this.type).forEach( (cityItem) => {
        // this.stage.stageData.array_cities.forEach( (cityItem) => {
            const marker3D = new Marker3D({
                app: this.app,
                project: this.project,
                stage: this.stage,
                scenario3D: this.scenario3D,
                map3D: this.map3D,
                city_id: cityItem.id,
                type: this.type,
                parent3D: this.parent3D,
            })
            this.items.push(marker3D)
        });
    }
    //----------------------------------------------
    // PUBLIC:
    updateRAF(){
        this.items.forEach( marker => {
            marker.updateRAF()
        })
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default MarkersPack3D