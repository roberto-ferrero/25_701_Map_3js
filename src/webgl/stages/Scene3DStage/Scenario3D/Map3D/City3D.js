//import gsap from "gsap"
import * as THREE from 'three'
import EasedOutValue from '../../../../core/utils/EasedOutValue'

class City3D{
    constructor (obj){
        // console.log("(City3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario3D = obj.scenario3D
        this.map3D = obj.map3D
        this.city_id = obj.city_id
        this.type = obj.type
        this.parent3D = obj.parent3D
        //-------------
        if(this.type === "city"){
            this.TYPE_SCALE_FACTOR = 1.0
            this.TYPE_OPACITY_FACTOR = 0.7+Math.random()*0.3
        }else if(this.type === "event"){
            this.TYPE_SCALE_FACTOR = 0.65
            this.TYPE_OPACITY_FACTOR = 1
        }else if(this.type === "shop"){
            this.TYPE_SCALE_FACTOR = 0.65
            this.TYPE_OPACITY_FACTOR = 2
        }
        //-------------
        this.city = this.stage.stageData.getItemById(this.city_id, this.type)
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
        this.EASED_SCALE = new EasedOutValue(this.SCALE_IN_TIER_MODE_1, 0.1, 0.001, this.app.emitter, "onUpdateRAF")
        //------------


        //------------
        const geometry = new THREE.PlaneGeometry(1, 1)
        const texture = this.stage.loader.get_texture(this.type)
        const material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true,
            depthWrite: false,
            combine : THREE.MixOperation,
            opacity: this.TYPE_OPACITY_FACTOR,
        });
        this.mesh = new THREE.Mesh( geometry, material );
        //--
        this.mesh.userData.city_id = this.city_id;
        this.mesh.userData.city_type = this.type;
        this.mesh.userData.parentInstance = this; // Opcional, por si quieres acceder a la clase completa
        //--
        // this.mesh.rotation.x = - Math.PI /2
        this.parent3D.add(this.mesh)
        this._drawPosition()
        this._drawScale()

        //------------
        this.app.emitter.on("onAppTierModeChange", ()=>{
            console.log("*");
            if(this.stage.CURRENT_TIER_MODE == 1){
                this.EASED_POSITION_X.set(this.POSITION_IN_TIER_MODE_1.x)
                this.EASED_POSITION_Y.set(this.POSITION_IN_TIER_MODE_1.y)
                this.EASED_SCALE.set(this.SCALE_IN_TIER_MODE_1)
            }else if(this.stage.CURRENT_TIER_MODE == 2){
                this.EASED_POSITION_X.set(this.POSITION_IN_TIER_MODE_2.x)
                this.EASED_POSITION_Y.set(this.POSITION_IN_TIER_MODE_2.y)
                this.EASED_SCALE.set(this.SCALE_IN_TIER_MODE_2)
            }else if(this.stage.CURRENT_TIER_MODE == 3){
                this.EASED_POSITION_X.set(this.POSITION_IN_TIER_MODE_3.x)
                this.EASED_POSITION_Y.set(this.POSITION_IN_TIER_MODE_3.y)
                this.EASED_SCALE.set(this.SCALE_IN_TIER_MODE_3)
            } 
        })
    }
    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------
    // UPDATES:
    updateRAF(){
        this._drawPosition()
        this._drawScale()
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
        if(this.city.tier == 1){
            const city_position = this._getFilteredPosition(this.city.coordinates[0], this.city.coordinates[1])
            this.POSITION_IN_TIER_MODE_1.copy(city_position)
            this.POSITION_IN_TIER_MODE_2.copy(city_position)
            this.POSITION_IN_TIER_MODE_3.copy(city_position)
            //--
            this.SCALE_IN_TIER_MODE_1 = this._getFilteredScale(this.city.getTotalPosts())
            this.SCALE_IN_TIER_MODE_2 = this._getFilteredScale(this.city.getCityAndChild3Posts())*0.8
            this.SCALE_IN_TIER_MODE_3 = this._getFilteredScale(this.city.getCityPosts())*0.4
        }else if(this.city.tier == 2){
            const parent_position = this._getFilteredPosition(this.city.parent.coordinates[0], this.city.parent.coordinates[1])
            const city_position = this._getFilteredPosition(this.city.coordinates[0], this.city.coordinates[1])
            this.POSITION_IN_TIER_MODE_1.copy(parent_position)
            this.POSITION_IN_TIER_MODE_2.copy(city_position)
            this.POSITION_IN_TIER_MODE_3.copy(city_position)
            //--
            this.SCALE_IN_TIER_MODE_1 = this._getFilteredScale(0)
            this.SCALE_IN_TIER_MODE_2 = this._getFilteredScale(this.city.getCityAndChild3Posts())
            this.SCALE_IN_TIER_MODE_3 = this._getFilteredScale(this.city.getCityPosts())*0.8
        }else{
            const grandparent_position = this._getFilteredPosition(this.city.getGrandParent().coordinates[0], this.city.getGrandParent().coordinates[1])
            const parent_position = this._getFilteredPosition(this.city.parent.coordinates[0], this.city.parent.coordinates[1])
            const city_position = this._getFilteredPosition(this.city.coordinates[0], this.city.coordinates[1])
            this.POSITION_IN_TIER_MODE_1.copy(parent_position)
            this.POSITION_IN_TIER_MODE_2.copy(parent_position)
            this.POSITION_IN_TIER_MODE_3.copy(city_position)
            //--
            this.SCALE_IN_TIER_MODE_1 = this._getFilteredScale(0)
            this.SCALE_IN_TIER_MODE_2 = this._getFilteredScale(0)
            this.SCALE_IN_TIER_MODE_3 = this._getFilteredScale(this.city.getCityPosts())
        }
    }
    
    _getFilteredScale(numPosts){
        let scaleFactor = 0
        if(numPosts > 0){
            scaleFactor = 0.5 + (numPosts / this.stage.stageData.get_max_posts_node(this.type)) * 10;
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
export default City3D