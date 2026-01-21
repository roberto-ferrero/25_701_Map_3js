//import gsap from "gsap"
import * as THREE from 'three'
import { Object3D, Plane } from 'three'


class SimpleFustrumFrame{
    constructor (obj){
        //console.log("(SimpleFustrumFrame.CONSTRUCTORA): ", obj)
        this.id = obj.id
        this.app = obj.app
        this.anim = obj.anim
        this.parent3D = obj.parent3D
        this.posZ = obj.posZ
        this.item3D = obj.item3D
        this.itemWidth = obj.itemWidth
        this.itemHeight = obj.itemHeight
        //--
        this.contentScale = null
        this.fustrumScaleX = null
        this.fustrumScaleY = null
        //--
        this.cont3D = new THREE.Object3D()
        this.parent3D.add(this.cont3D)
        this.cont3D.position.set(0, 0, this.posZ)
        this.cont3D.add(this.item3D)
        
        
        //--
        // We fit item width to fit the viewport width:
        this.contentScale = this.app.size.REF.width/this.itemWidth
        this.item3D.scale.set(this.contentScale, this.contentScale, this.contentScale)
        //--
        if(this.app.dev.HELPERS){
            const geometry = new THREE.PlaneGeometry(this.app.size.REF.width, this.app.size.REF.height);
            const material = new THREE.MeshBasicMaterial( {
                color: 0xff0000,
                wireframe: true,
            } );
            this.helper = new THREE.Mesh( geometry, material );
            this.cont3D.add(this.helper);
            this.app.dev.register_helper(this.helper.material)
        }
        //--
        
        this._update_fustrumScale()





        //-------------
        // APP EVENTS:
        this.app.emitter.on("onShowBackstage", this._eval_showBackstage = () =>{
            this.helper.material.visible = this.app.show_backstage
        })
        /*
        this.app.emitter.on("on_change_incrY", (event) =>{
            this.dev_incrY = event.value
            this._update_panY(this.last_pan_ratio)
        })
        */
        //-----------------------------
        this._eval_showBackstage()
        
    }
    //----------------------------------------------
    // PUBLIC:
    update_resize(){
        // const scale = this.__get_fustrum_scale(this.posZ, this.app.width, this.app.width)
        this._update_fustrumScale()
        //--
        this.item3D.position.set(0, 0, 0)
    }
    get_scale(){
        const obj = {
            x: this._get_fustrum_scale(this.posZ, this.app.size.REF.width, this.app.width),
            y: this._get_fustrum_scale(this.posZ, this.app.size.REF.height, this.app.height),
        }
        ////console.log("fustrum sacle: ", obj)
        return obj
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _update_fustrumScale(){
        this.fustrumScaleX = this._get_fustrum_scale(this.posZ, this.app.size.REF.width, this.app.width)
        this.fustrumScaleY = this._get_fustrum_scale(this.posZ, this.app.size.REF.height, this.app.height)

        this.cont3D.scale.set(this.fustrumScaleX, this.fustrumScaleY, this.fustrumScaleY)

    }

    _get_fustrum_scale(distanceToItem, itemWidth, widthToMatch){
        //console.log("(SimpleFustrumFrame._get_fustrum_scale)!");
        //console.log("distanceToItem: "+distanceToItem);
        //console.log("itemWidth: "+itemWidth);
        //console.log("widthToMatch: "+widthToMatch);
        //console.log("cameraDistance: "+this.anim.tripod.get_position().z);

        const half_vp_width = widthToMatch*0.5
        const half_item_width = itemWidth*0.5
        const anguloRad = Math.atan2(half_vp_width, this.anim.tripod.get_position().z)
        const result_half_width = Math.tan(anguloRad)*(this.anim.tripod.get_position().z-distanceToItem)
        const scale = result_half_width/half_item_width
        return scale
    }
    //----------------------------------------------
    // AUX:

  
}
export default SimpleFustrumFrame