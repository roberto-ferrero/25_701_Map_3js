//import gsap from "gsap"
import * as THREE from 'three'
import { MathUtils } from 'three'

import vertex from "./shaders/LensFlare_vertex.glsl"
import fragment from "./shaders/LensFlare_fragment.glsl"

import EasedOutValue from '../../../../core/utils/EasedOutValue'

class LensFlare{
    constructor (obj){
        console.log("(LensFlare.CONSTRUCTORA): ", obj)

        this.id = obj.id
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        this.stageCamera = obj.stageCamera
        this.width = obj.width
        this.height = obj.height

        this.progress = obj.progress || 0
        this.USE_MOUSE = obj.USE_MOUSE
        this.X_RANGE = obj.X_RANGE
        this.Y_RANGE = obj.Y_RANGE
        this.AZIMOUTH_FACTOR = 0 // -1 to 1
        this.ELEVATION_FACTOR = 0 // -1 to 1
        //------------------
        this.cont3D = new THREE.Object3D()
        this.parent3D.add(this.cont3D)
        //--
        this.geometry= new THREE.PlaneGeometry(this.width, this.height, 10, 10 );
        this.dev_material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})
        this.material = new THREE.ShaderMaterial({
            uniforms:{
                uMousePosition: {value: [-0.5, -0.5]},
                uSize: {value: [this.width, this.height]},
                uFadeInProgress: {value: 1},
            },
            
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            // blending: THREE.MultiplyBlending,
            //blending: THREE.NormalBlending,
            side: THREE.DoubleSide,
            vertexShader:  vertex,
            fragmentShader:  fragment,
            visible:true,
            // wireframe: true
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.cont3D.add(this.mesh)
        //------------------
        let origin_x = 0
        let origin_y = 0
        let ease = 0.1
        if(!this.USE_MOUSE){
            origin_x = MathUtils.lerp(this.X_RANGE[0], this.X_RANGE[1], this.progress)
            origin_y = MathUtils.lerp(this.Y_RANGE[0], this.Y_RANGE[1], this.progress)
            ease = 1
        }
        this.influence_position_norm_eased = {
            x: new EasedOutValue(origin_x, ease, 0.001, this.app.emitter, "onUpdateRAF"),
            y: new EasedOutValue(origin_y, ease, 0.001, this.app.emitter, "onUpdateRAF")
        }
        //-------------------
        const plane_helper_geo = new THREE.PlaneGeometry(this.width, this.height, 1, 1 );
        const plane_helper_material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true})
        this.plane_helper = new THREE.Mesh(plane_helper_geo, plane_helper_material)
        this.app.register_helper(this.plane_helper)
        this.cont3D.add(this.plane_helper)

    }
    //----------------------------------------------
    // RAF:
    update_RAF(){
        if(this.USE_MOUSE) this._update_mouse()
        this._update_uniforms()
    }
    //----------------------------------------------
    // PUBLIC:
    update_progress(azimuth, elevation){
        // console.log("azimuth: "+ azimuth+", elevation: "+elevation);
        const azimuth_arch = [-4-Math.PI, 4-Math.PI]
        const elevation_arch = [0, -2.3]
        this.AZIMOUTH_FACTOR = this._get_rangeFactor(azimuth, azimuth_arch)
        this.ELEVATION_FACTOR = 0.2+this._get_rangeFactor(elevation, elevation_arch)
        // this.ELEVATION_FACTOR = 0.5
    }
    // update_progress(value){
    //     // console.log("CURRENT_PAN_AZIMUTH: "+this.stageCamera.CURRENT_PAN_AZIMUTH); // +/- -1.25 to 1.25
    //     // console.log("CURRENT_PAN_ELEVATION: "+this.stageCamera.CURRENT_PAN_ELEVATION); // -0.094 to 0.280
    //     console.log("this.stageCamera.CURRENT_PAN_AZIMUTH: "+this.stageCamera.CURRENT_PAN_AZIMUTH); // +/- -1.25 to 1.25
    //     const azimuth_rangeFactor = this._get_rangeFactor(this.stageCamera.CURRENT_PAN_AZIMUTH, [-1.25, 1.25])
    //     const elevation_rangeFactor = this._get_rangeFactor(this.stageCamera.CURRENT_PAN_ELEVATION, [-0.094, 0.280])
    //     // console.log(azimuth_rangeFactor+" , "+elevation_rangeFactor);
    //     const azimuth_incr = 0.4*azimuth_rangeFactor
    //     const elevation_incr = 0.4*elevation_rangeFactor

    //     this.progress = value
    //     const x_value = MathUtils.lerp(this.X_RANGE[0], this.X_RANGE[1], this.progress)+azimuth_incr
    //     const y_value = MathUtils.lerp(this.Y_RANGE[0], this.Y_RANGE[1], this.progress)+elevation_incr

    //     this.influence_position_norm_eased.x.set(x_value)
    //     this.influence_position_norm_eased.y.set(y_value)
    // }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _update_mouse(){
        this.influence_position_norm_eased.x.set(this.app.mouse_position_norm.x)
        this.influence_position_norm_eased.y.set(this.app.mouse_position_norm.y)
    }

    _update_uniforms(){
        

        // const pos_x = (this.influence_position_norm_eased.x.get()*0.5) // change from -1to1 to -0.5 to 0.5
        // const pos_y = (this.influence_position_norm_eased.y.get()*0.5) // change from -1to1 to -0.5 to 0.5
        //console.log("--");
        //console.log(this.influence_position_norm_eased.x.get()+" , "+this.influence_position_norm_eased.y.get());
        //console.log(pos_x+" , "+pos_y);
        //this.material.uniforms.uMousePosition.value = [-this.app.mouse_position_norm.x, this.app.mouse_position_norm.y]
        this.material.uniforms.uMousePosition.value = [this.AZIMOUTH_FACTOR, this.ELEVATION_FACTOR]
        this.material.uniforms.uFadeInProgress.value = 1
        //console.log(" this.stage.FADEIN_PROGRESS: ", this.stage.FADEIN_PROGRESS);
        //console.log("this.material.uniforms.uFadeInProgress.value: ", this.material.uniforms.uFadeInProgress.value);
    }

    _get_rangeFactor(value, range){
        const factor_0to1 = (value - range[0]) / (range[1] - range[0])
        const factor_minus1to1 = factor_0to1 * 2 - 1

        return factor_minus1to1
    }
    //----------------------------------------------
    // AUX:


  
}
export default LensFlare