//import gsap from "gsap"
//import * as THREE from 'three'

// import cities_data from './cities2.json'
// import cities_data from './model1_data.json'
// import cities_data from './cities_v4.json'
import MarkerData from './MarkerData'

class MarkersPackData{
    constructor (obj){
        // console.log("(MarkersPackData.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.type = obj.type
        //--
        this.arrayItems = []
        this.arrayTiers = {
            1: [],
            2: [],
            3: [],
        }
        //--
        this.max_posts_node = 0
        this.max_posts_city = 0
        //------------
    }
    init(){
        // console.log("(MarkersPackData.init_cities)!");
        //--
        const cities_data = this.stage.loader.get_json(this.type+"_data")
        //--
        cities_data.forEach( (item) => {
            //console.log("item: ", item);
            const itemData = new MarkerData({
                app: this.app,
                project: this.project,
                stage: this.stage,
                stageData: this,
                data: item
            })
            this.arrayItems[Number(item.city_id)] = itemData
            this.arrayTiers[item.city_tier][Number(item.city_id)] = itemData
        })

        //----
        this.arrayTiers[1].forEach(item => item.init())
        this.arrayTiers[2].forEach(item => item.init())
        this.arrayTiers[3].forEach(item => item.init())
        //--
        this.arrayItems.forEach(item => item.evalData())
        // console.log("this.max_posts_node: ", this.max_posts_node);
        // console.log("this.max_posts_city: ", this.max_posts_city);
    }
    //----------------------------------------------
    // INTERNAL:
    getItemById(id){
        return this.arrayItems[Number(id)]
    }
    evalCityData(cityPosts, nodePosts){
        if(cityPosts > this.max_posts_city) this.max_posts_city = cityPosts
        if(nodePosts > this.max_posts_node) this.max_posts_node = nodePosts 
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
export default MarkersPackData