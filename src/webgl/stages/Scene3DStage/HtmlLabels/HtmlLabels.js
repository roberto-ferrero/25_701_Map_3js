//import gsap from "gsap"
import * as THREE from 'three'
import MeshUtils from '../../../core/utils/MeshUtils'
import HtmlItem from './HtmlItem'

class HtmlLabels{
    constructor (obj){
        // console.log("(HtmlLabels.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        //--
        this.LABELS_ARRAY = ["item1", "item2", "item3", "item4", "item5", "item6"]
        this.items = []
        //--
        for (let i = 0; i < this.LABELS_ARRAY.length; i++) {
            const itemId = this.LABELS_ARRAY[i]
            this.newItem(itemId)
        }
    }
    //----------------------------------------------
    // PUBLIC:
    newItem(itemId){
        const spotId = this._get_spotId(itemId)
        const spotPosition = this.stage.spots.get_spot(spotId)
        const item = new HtmlItem({
            app: this.app,
            anim: this.anim,
            itemId: itemId,
            position: spotPosition,
            parent3D: this.parent3D,
            element: document.querySelector('.point-'+itemId)
        })
        this.items.push(item)
    }
    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        this.items.map((item) =>{
            item.update_RAF()
        })
    }
    //----------------------------------------------
    // PRIVATE:
    _get_spotId(itemId){
        if(itemId == "item1"){
            return "label1"
        }else if(itemId == "item2"){
            return "label2"
        }else if(itemId == "item3"){
            return "label3"
        }else if(itemId == "item4"){
            return "label4"
        }else if(itemId == "item5"){
            return "label5"
        }else if(itemId == "item6"){
            return "label6"
        }
    }
    //----------------------------------------------
    // AUX:

  
}
export default HtmlLabels