//import gsap from "gsap"
//import * as THREE from 'three'


class MarkerData{
    constructor (obj){
        // console.log("(MarkerData.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.stageData = obj.stageData
        this.data = obj.data
        //------------
        this.name = this.data.city_name
        this.id = this.data.city_id
        this.tier = this.data.city_tier
        this.coordinates = this.data.coordinates  // [lat, lon]
        //--
        this.parent = null
        this.grandparent = null
        this.tier2_childs = [] 
        this.tier3_childs = [] 
        this.grandchilds = [] // All tier3
        //--
        this.cityPosts = this.data.posts+((Math.random()*0.5-0.25)*this.data.posts)
        this.tier2_childPosts = 0
        this.tier3_childPosts = 0
        this.grandchildPosts = 0
        //------------
    }
    init(){
        // console.log("(MarkerData.init): ", this.id);
        // console.log("this.stageData: ", this.stageData);
        if(this.data.parent_node != null && this.data.parent_node != undefined){
            this.parent = this.stageData.getItemById(this.data.parent_node)
            this.parent.addChild(this)
            if(this.parent.data.parent_node != null && this.parent.data.parent_node != undefined){
                this.grandparent = this.stageData.getItemById(this.parent.data.parent_node)
                this.grandparent.addGrandchild(this)
            } 
        }
    }
    //----------------------------------------------
    // INTERNAL:
    addChild(cityItem){
        if(cityItem.tier == 3){
            this.tier3_childs.push(cityItem)
            this.tier3_childPosts += cityItem.cityPosts
        }else if(cityItem.tier == 2){
            this.tier2_childs.push(cityItem)
            this.tier2_childPosts += cityItem.cityPosts
        }
    }
    addGrandchild(cityItem){
        this.grandchilds.push(cityItem)
        this.grandchildPosts += cityItem.cityPosts
    }
    evalData(){
        // console.log(this);
        this.stageData.evalCityData(this.cityPosts, this.cityPosts +this.tier2_childPosts + this.tier3_childPosts + this.grandchildPosts)
    }
    //--
    getGrandParent(){
        if(this.grandparent != null){
            return this.grandparent
        }else{
            return this.parent
        }
    }
    //--
    getTotalPosts(){
        return this.cityPosts + this.tier2_childPosts + this.tier3_childPosts + this.grandchildPosts
    }
    getCityAndChild2Posts(){
        return this.cityPosts + this.tier2_childPosts
    }
    getCityAndChild3Posts(){
        return this.cityPosts + this.tier3_childPosts
    }
    getCityAndChild23Posts(){
        return this.cityPosts + this.tier2_childPosts + this.tier3_childPosts
    }
    getCityPosts(){
        return this.cityPosts
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
export default MarkerData