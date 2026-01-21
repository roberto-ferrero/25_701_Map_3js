//import gsap from "gsap"
//import * as THREE from 'three'

import City3D from './City3D'

class MarkersPack{
    constructor (obj){
        console.log("(MarkersPack.CONSTRUCTORA): ", obj)
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
            const city3D = new City3D({
                app: this.app,
                project: this.project,
                stage: this.stage,
                scenario3D: this.scenario3D,
                map3D: this.map3D,
                city_id: cityItem.id,
                type: this.type,
                parent3D: this.parent3D,
            })
            this.items.push(city3D)
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
export default MarkersPack