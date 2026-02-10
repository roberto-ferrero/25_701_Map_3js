import gsap from "gsap"
import * as THREE from 'three'
import EasedOutValue from '../../../../core/utils/EasedOutValue'

import ShopBullet from "./ShopBullet"
import EventBullet from "./EventBullet"
import CityBullet from "./CityBullet"

class Marker3D{
    constructor (obj){
        // console.log("(Marker3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario3D = obj.scenario3D
        this.map3D = obj.map3D
        this.city_id = obj.city_id
        this.type = obj.type
        this.parent3D = obj.parent3D
        //-------------
        this.DEV_ITEM = false
        if(this.city_id == this.stage.DEV_ITEM_ID){
            this.DEV_ITEM = true
        }
        //-------------
        // console.log("this.stage.stageData.settings: ", this.stage.stageData.settings);
        if(this.type === "city"){
            // this.TYPE_SCALE_FACTOR = 1.0
            // this.TYPE_OPACITY_FACTOR = 1
            this.TYPE_SCALE_FACTOR = this.stage.stageData.settings.city_scale_factor
            this.TYPE_OPACITY_FACTOR = this.stage.stageData.settings.city_opacity_factor
        }else if(this.type === "event"){
            // this.TYPE_SCALE_FACTOR = 1.35
            // this.TYPE_OPACITY_FACTOR = 1
            this.TYPE_SCALE_FACTOR = this.stage.stageData.settings.event_scale_factor
            this.TYPE_OPACITY_FACTOR = this.stage.stageData.settings.event_opacity_factor
        }else if(this.type === "shop"){
            // this.TYPE_SCALE_FACTOR = 1.25
            // this.TYPE_OPACITY_FACTOR = 1
            this.TYPE_SCALE_FACTOR = this.stage.stageData.settings.shop_scale_factor*2
            this.TYPE_OPACITY_FACTOR = this.stage.stageData.settings.shop_opacity_factor
        }
        this.INTRO_OPACITY_FACTOR = 0.0
        //-------------
        this.cityData = this.stage.stageData.getItemById(this.city_id, this.type)
        this.cityData.position = this._getFilteredPosition(this.cityData.coordinates[0], this.cityData.coordinates[1])
        // console.log("cityData:", this.cityData);s
        //-------------
        this.Z_POS = 0.85
        this.POSITION_IN_TIER_MODE_1 = new THREE.Vector3(0, 0, this.Z_POS)
        this.POSITION_IN_TIER_MODE_2 = new THREE.Vector3(0, 0, this.Z_POS)
        this.POSITION_IN_TIER_MODE_3 = new THREE.Vector3(0, 0, this.Z_POS)
        //------------
        this.SCALE_IN_TIER_MODE_1 = 0
        this.SCALE_IN_TIER_MODE_2 = 0
        this.SCALE_IN_TIER_MODE_3 = 0
        //------------
        this._precalc_DATA()
        //------------
        this.EASED_POSITION_X = new EasedOutValue(this.POSITION_IN_TIER_MODE_1.x, 0.1, 0.001, this.app.emitter, "onUpdateRAF")
        this.EASED_POSITION_Y = new EasedOutValue(this.POSITION_IN_TIER_MODE_1.y, 0.1, 0.001, this.app.emitter, "onUpdateRAF")
        this.EASED_SCALE = new EasedOutValue(this.SCALE_IN_ZOOM_LEVEL_0, 0.1, 0.001, this.app.emitter, "onUpdateRAF")
        //------------
        

        //------------
        if(this.type === "city"){
            this.bullet = new CityBullet({
                app: this.app,
                project: this.project,
                stage: this.stage,
                parent3D: this.parent3D,
                marker: this
            })
        }else if(this.type === "event"){
            this.bullet = new EventBullet({
                app: this.app,
                project: this.project,
                stage: this.stage,
                parent3D: this.parent3D,
                marker: this
            })
        }else if(this.type === "shop"){
            this.bullet = new ShopBullet({
                app: this.app,
                project: this.project,
                stage: this.stage,
                parent3D: this.parent3D,
                marker: this
            })
        }
        this.mesh = this.bullet.mesh
        this.material = this.bullet.material
        //------------

        //------------
        this._drawPosition()
        this._drawScale()

        //------------
        this.app.emitter.on("onAppZoomChange", ()=>{
            if(this.DEV_ITEM) console.log("(Marker3D.onAppZoomChange) id:"+this.stage.DEV_ITEM_ID);
            if(this.stage.CURRENT_ZOOM == 0){
                if(this.DEV_ITEM) console.log("*1");
                this.EASED_POSITION_X.set(this.POSITION_IN_TIER_MODE_1.x)
                this.EASED_POSITION_Y.set(this.POSITION_IN_TIER_MODE_1.y)
                this.EASED_SCALE.set(this.SCALE_IN_ZOOM_LEVEL_0)
            }else if(this.stage.CURRENT_ZOOM == 1){
                if(this.DEV_ITEM) console.log("*2");
                this.EASED_POSITION_X.set(this.POSITION_IN_TIER_MODE_2.x)
                this.EASED_POSITION_Y.set(this.POSITION_IN_TIER_MODE_2.y)
                this.EASED_SCALE.set(this.SCALE_IN_ZOOM_LEVEL_1)
            }else if(this.stage.CURRENT_ZOOM == 2){
                if(this.DEV_ITEM) console.log("*3");
                this.EASED_POSITION_X.set(this.POSITION_IN_TIER_MODE_3.x)
                this.EASED_POSITION_Y.set(this.POSITION_IN_TIER_MODE_3.y)
                this.EASED_SCALE.set(this.SCALE_IN_ZOOM_LEVEL_2)
            }else if(this.stage.CURRENT_ZOOM == 3){
                if(this.DEV_ITEM) console.log("*4");
                this.EASED_POSITION_X.set(this.POSITION_IN_TIER_MODE_3.x)
                this.EASED_POSITION_Y.set(this.POSITION_IN_TIER_MODE_3.y)
                this.EASED_SCALE.set(this.SCALE_IN_ZOOM_LEVEL_3)
            }else if(this.stage.CURRENT_ZOOM == 4){
                if(this.DEV_ITEM) console.log("*5");
                this.EASED_POSITION_X.set(this.POSITION_IN_TIER_MODE_3.x)
                this.EASED_POSITION_Y.set(this.POSITION_IN_TIER_MODE_3.y)
                this.EASED_SCALE.set(this.SCALE_IN_ZOOM_LEVEL_4)
            }
        })

        this.app.emitter.on("onStartIntro", ()=>{
            gsap.to(this, {
                INTRO_OPACITY_FACTOR: 1.0,
                duration: 1.0,
                ease: "none",
                delay: 1+this.cityData.INTRO_PAUSE,
            })
        })
    }
    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------
    // UPDATES:
    updateRAF(){
        this._drawPosition()
        this._drawScale()
        //this.material.opacity = this.TYPE_OPACITY_FACTOR*this.INTRO_OPACITY_FACTOR
        // console.log(this.stage.stageCamera.camera.position);
        // this.mesh.lookAt(this.stage.stageCamera.get_CAMERA_WORLD_POSITION());
        this.bullet.updateRAF();
    }
    _drawPosition(){
        this.mesh.position.set(
            this.EASED_POSITION_X.get(),
            this.EASED_POSITION_Y.get(),
            this.Z_POS
        );
    }
    _drawScale(){
        const scaleFactor = this.EASED_SCALE.get();
        this.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
    //----------------------------------------------
    // PRIVATE:



    _precalc_DATA(){
        // TIER MODE 1:
        if(this.DEV_ITEM){
            console.log("Marker3D._precalc_DATA) for id:"+this.stage.DEV_ITEM_ID+" - tier:"+this.cityData.tier);
        }
        if(this.type === "shop"){
                const city_position = this._getFilteredPosition(this.cityData.coordinates[0], this.cityData.coordinates[1])
                this.POSITION_IN_TIER_MODE_1.copy(city_position)
                this.POSITION_IN_TIER_MODE_2.copy(city_position)
                this.POSITION_IN_TIER_MODE_3.copy(city_position)
                this.SCALE_IN_ZOOM_LEVEL_0 = this._getZoom0Scale()
                this.SCALE_IN_ZOOM_LEVEL_1 = this._getZoom0Scale()
                this.SCALE_IN_ZOOM_LEVEL_2 = this.TYPE_SCALE_FACTOR*this.stage.stageData.settings.tier_2_in_zoom_3_scale_factor
                this.SCALE_IN_ZOOM_LEVEL_3 = this.TYPE_SCALE_FACTOR*this.stage.stageData.settings.tier_3_in_zoom_3_scale_factor
                this.SCALE_IN_ZOOM_LEVEL_4 = this.TYPE_SCALE_FACTOR*this.stage.stageData.settings.tier_3_in_zoom_4_scale_factor
        }else{
            if(this.cityData.tier == 1){
                const city_position = this._getFilteredPosition(this.cityData.coordinates[0], this.cityData.coordinates[1])
                this.POSITION_IN_TIER_MODE_1.copy(city_position)
                this.POSITION_IN_TIER_MODE_2.copy(city_position)
                this.POSITION_IN_TIER_MODE_3.copy(city_position)
                //--
                this.SCALE_IN_ZOOM_LEVEL_0 = this._getZoom0Scale()
                this.SCALE_IN_ZOOM_LEVEL_1 = this._getFilteredScale(this.cityData.getCityAndChild3Posts())*this.stage.stageData.settings.tier_1_in_zoom_1_scale_factor
                this.SCALE_IN_ZOOM_LEVEL_2 = this._getFilteredScale(this.cityData.getCityPosts())*this.stage.stageData.settings.tier_1_in_zoom_2_scale_factor
                this.SCALE_IN_ZOOM_LEVEL_3 = this._getFilteredScale(this.cityData.getCityPosts())*this.stage.stageData.settings.tier_1_in_zoom_3_scale_factor
                this.SCALE_IN_ZOOM_LEVEL_4 = this._getFilteredScale(this.cityData.getCityPosts())*this.stage.stageData.settings.tier_1_in_zoom_4_scale_factor
            }else if(this.cityData.tier == 2){
                const parent_position = this._getFilteredPosition(this.cityData.parent.coordinates[0], this.cityData.parent.coordinates[1])
                const city_position = this._getFilteredPosition(this.cityData.coordinates[0], this.cityData.coordinates[1])
                this.POSITION_IN_TIER_MODE_1.copy(parent_position)
                this.POSITION_IN_TIER_MODE_2.copy(city_position)
                this.POSITION_IN_TIER_MODE_3.copy(city_position)
                //--            
                this.SCALE_IN_ZOOM_LEVEL_0 = this._getFilteredScale(0) // *this.stage.stageData.settings.tier_2_in_zoom_0_scale_factor
                this.SCALE_IN_ZOOM_LEVEL_1 = this._getFilteredScale(this.cityData.getCityAndChild3Posts())*this.stage.stageData.settings.tier_2_in_zoom_1_scale_factor
                this.SCALE_IN_ZOOM_LEVEL_2 = this._getFilteredScale(this.cityData.getCityPosts())*this.stage.stageData.settings.tier_2_in_zoom_2_scale_factor
                this.SCALE_IN_ZOOM_LEVEL_3 = this._getFilteredScale(this.cityData.getCityPosts())*this.stage.stageData.settings.tier_2_in_zoom_3_scale_factor
                this.SCALE_IN_ZOOM_LEVEL_4 = this._getFilteredScale(this.cityData.getCityPosts())*this.stage.stageData.settings.tier_2_in_zoom_4_scale_factor
            }else{
                const grandparent_position = this._getFilteredPosition(this.cityData.getGrandParent().coordinates[0], this.cityData.getGrandParent().coordinates[1])
                const parent_position = this._getFilteredPosition(this.cityData.parent.coordinates[0], this.cityData.parent.coordinates[1])
                const city_position = this._getFilteredPosition(this.cityData.coordinates[0], this.cityData.coordinates[1])
                this.POSITION_IN_TIER_MODE_1.copy(parent_position)
                this.POSITION_IN_TIER_MODE_2.copy(parent_position)
                this.POSITION_IN_TIER_MODE_3.copy(city_position)
                //--
                this.SCALE_IN_ZOOM_LEVEL_0 = this._getFilteredScale(0) // *this.stage.stageData.settings.tier_3_in_zoom_0_scale_factor
                this.SCALE_IN_ZOOM_LEVEL_1 = this._getFilteredScale(0) // *this.stage.stageData.settings.tier_3_in_zoom_1_scale_factor
                this.SCALE_IN_ZOOM_LEVEL_2 = this._getFilteredScale(this.cityData.getCityPosts())*this.stage.stageData.settings.tier_3_in_zoom_2_scale_factor
                this.SCALE_IN_ZOOM_LEVEL_3 = this._getFilteredScale(this.cityData.getCityPosts())*this.stage.stageData.settings.tier_3_in_zoom_3_scale_factor
                this.SCALE_IN_ZOOM_LEVEL_4 = this._getFilteredScale(this.cityData.getCityPosts())*this.stage.stageData.settings.tier_3_in_zoom_4_scale_factor
            }
        }
    }
    
    _getZoom0Scale(numPosts){
        return 5
    }

    _getFilteredScale(numPosts){
        let scaleFactor = 0
        if(numPosts > 0){
            scaleFactor = 1 + (numPosts / this.stage.stageData.get_max_posts_node(this.type)) * 10;
        }else{
            scaleFactor = 0.0;
        }
        if(scaleFactor > 3){
            scaleFactor = 3;
        }
        // console.log("Scale Factor:", scaleFactor);
        return scaleFactor*this.TYPE_SCALE_FACTOR
    }
    _getFilteredPosition(lat, lon){
        const uv = this.map3D.projector.geoToMap(lat, lon);
        const position = new THREE.Vector3(
            ((uv.x - 0.50) * 100),
            ((uv.y - 0.50) * 100),
            this.Z_POS
        );
        return position
    }
    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default Marker3D