//import gsap from "gsap"
//import * as THREE from 'three'

import MarkersPackData from "./MarkersPackData"

class StageData{
    constructor (obj){
        // console.log("(StageData.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        //---
        this.settings = null // To be loaded in init()
        //---
        this.city_data = new MarkersPackData({
            app: this.app,
            project: this.project,
            stage: this.stage,
            type: "city",
        })
        this.event_data = new MarkersPackData({
            app: this.app,
            project: this.project,
            stage: this.stage,
            type: "event",
        })
        this.shop_data = new MarkersPackData({
            app: this.app,
            project: this.project,
            stage: this.stage,
            type: "shop",
        })
        //------------
    }
    init(){
        // this.settings = this.stage.loader.get_json("settings_data")
        this.settings = this.app.data.settings
        // console.log("Settings loadsed: ", this.settings);
        //--
        this.city_data.init()
        this.event_data.init()
        this.shop_data.init()
    }
    //----------------------------------------------
    // PUBLIC:
    get_arrayItems(type){
        if(type === "city"){
            return this.city_data.arrayItems
        }else if(type === "event"){
            return this.event_data.arrayItems
        }else if(type === "shop"){
            return this.shop_data.arrayItems
        }
    }
    getItemById(id, type){
        if(type === "city"){
            return this.city_data.getItemById(id)
        }else if(type === "event"){
            return this.event_data.getItemById(id)
        }else if(type === "shop"){
            return this.shop_data.getItemById(id)
        }
    }
    get_max_posts_node(type){
        if(type === "city"){
            return this.city_data.max_posts_node
        }else if(type === "event"){
            return this.event_data.max_posts_node
        }else if(type === "shop"){
            return this.shop_data.max_posts_node
        }
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default StageData