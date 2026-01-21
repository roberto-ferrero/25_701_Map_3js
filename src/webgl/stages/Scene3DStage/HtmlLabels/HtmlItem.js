//import gsap from "gsap"
import * as THREE from 'three'
import MeshUtils from '../../../core/utils/MeshUtils'

class HtmlItem{
    constructor (obj){
        //console.log("(HtmlItem.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.anim = obj.anim
        // this.asset = obj.asset
        this.itemId = obj.itemId
        this.groupId = obj.groupId
        this.position = obj.position
        this.element = obj.element
        // console.log("element: ", this.element);
        this.parent3D = obj.parent3D
        //--
        this.GROUP_VISIBLE = true
        this.INSIGHT = true
        //--
        this.element.addEventListener('click', (e)=>{
            this.app.emitter.emit("onItemSelected", {
                ITEM_ID: this.itemId, 
            })
        })
        //--
        this.point_worldPosition = new THREE.Vector3()
        this.raycaster = new THREE.Raycaster()
        //--
        this.item3D = MeshUtils.get_sphere(1, 2, 2, 0x00ff00)
        this.item3D.position.copy(this.position)
        this.item3D.material.transparent = true
        this.item3D.material.opacity = 0.0
        this.item3D.material.depthWrite  = false
        this.item3D.material.side = THREE.BackSide
        this.item3D.name = "html_"+this.itemId
        this.parent3D.add(this.item3D)

        //--
        // this.app.emitter.on("onGroupSelected", (e)=>{
        //     // console.log("HtmlItem.onGroupSelected: ", e);
        //     // console.log("this.groupId: "+this.groupId);
        //     const data = this.anim.dataGroups.get_groupData(e.groupId)
        //     // console.log("data: ",data);
        //     if(data.hide_groups_array.includes(this.groupId)){
        //         // console.log("HIDE "+this.groupId+"!");
        //         this.GROUP_VISIBLE = false
        //     }else{
        //         // console.log("SHOW "+this.groupId+"!");
        //         this.GROUP_VISIBLE = true
        //     }
        // })
    }
    //----------------------------------------------
    // PUBLIC:
    update_RAF(){
        this.item3D.getWorldPosition(this.point_worldPosition)
        this.point_worldPosition.project(this.app.render.get_activeCamera())
        const x = this.point_worldPosition.x * this.app.size.CURRENT.width * 0.5
        const y = - this.point_worldPosition.y * this.app.size.CURRENT.height * 0.5
        this.element.style.transform = `translateX(${x}px) translateY(${y}px)`
        //--
        this._eval_visibility()
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _eval_visibility(){
        if(this.GROUP_VISIBLE && this.INSIGHT){
            this._show()
        }else{
            this._hide()
        }
    }
    _show(){
        this.element.classList.add('visible')
    }
    _hide(){
        this.element.classList.remove('visible')
    }

    //----------------------------------------------
    // AUX:

  
}
export default HtmlItem