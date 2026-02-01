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
        this.cityPosts = this.data.posts
        this.tier2_childPosts = 0
        this.tier3_childPosts = 0
        this.grandchildPosts = 0
        //------------
        this.MAP_CENTER = [52.218905, -0.911451] // Northampton
        this.DIST_FROM_CENTER_KM = this.getDistanceFromLatLonInKm(this.coordinates, this.MAP_CENTER)
        this.INTRO_PAUSE = Math.min(1, this.DIST_FROM_CENTER_KM / 600)*4
        // console.log(this.name+": " + this.DIST_FROM_CENTER_KM+" pause: "+this.INTRO_PAUSE);
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
    hasTier2Childs(){
        return this.tier2_childs.length > 0
    }
    hasTier3Childs(){
        return this.tier3_childs.length > 0
    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:
    /**
     * Calculates the distance between two coordinates in kilometers.
     * @param {number[]} coord1 - [latitude, longitude]
     * @param {number[]} coord2 - [latitude, longitude]
     * @returns {number} Distance in kilometers
     */
    getDistanceFromLatLonInKm(coord1, coord2) {
        const [lat1, lon1] = coord1;
        const [lat2, lon2] = coord2;
        
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
}
export default MarkerData