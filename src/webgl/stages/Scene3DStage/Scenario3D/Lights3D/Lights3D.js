//import gsap from "gsap"
import * as THREE from 'three'

import PointLight3D from './PointLight3D' 
import AreaLight3D from './AreaLight3D'
import SunLight3D from './SunLight3D'
// import { distance } from 'three/src/nodes/TSL.js'

class Light3D{
    // this.app.project.stage.scenario3D.lights3D
    constructor (obj){
        console.log("(Light3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        this.parent3D = obj.parent3D
        //-----------------------------
        const intensity_mod = 0.0
        this.PRESETS = {
            samplePointLight: {
                color: 0xFDC274,
                intensity: 90*0,
                distance: 50,
                decay: 2
            },
            drugstoreLight: {
                color: 0xFDC274,
                intensity: 90*0,
                distance: 60,
                decay: 2
            },
            kioskLight: {
                color: 0xFDC274,
                intensity: 90*1,
                distance: 50,
                decay: 2
            },
            sampleAreaLight: {
                color: 0xd5b99f,
                intensity: 5,
                distance: 100,
                decay: 2,
                width: 1,
                height: 1
            },
            drugstoreAL: {
                color: 0xd5b99f,
                intensity: 100*0,
                distance: 10,
                decay: 3,
                width: 6,
                height: 0.5
            },
            kioskoAL: {
                color: 0xd5b99f,
                intensity: 100*0,
                distance: 10,
                decay: 2,
                width: 0.5,
                height: 3
            }
        }
        this.REFS = []
        //-----------------------------
        // SUN:
        this.sun = new SunLight3D({
            app:this.app,
            project:this.project,
            stage:this.stage,
            parent3D:this.parent3D,
            sunId:"sun"
        })
        //-----------------------------
        // HEMISPHERIC LIGHT:
        // const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcfd3d8, 2);
        hemiLight.position.set(0, 200, 0);
        this.parent3D.add(hemiLight);
        //-----------------------------
        // AMBIENT:
        // const dev_ambientLight = new THREE.AmbientLight(0xffffff, 3.0); 
        // // dev_ambientLight.castShadow = true; // Soft white light
        // this.parent3D.add(dev_ambientLight);
        //-----------------------------
        // EXTRA POINT LIGHT:
        // const extra_pointLight = new THREE.PointLight(0xffaa55, 5, 100, 2) // color, intensity, distance, decay
        // extra_pointLight.position.copy(this.stage.spot.get_spot("archlight"))
        // this.parent3D.add(extra_pointLight)
        //-----------------------------
        // IMPORTED Light3D:
        
        //-----------------------------
        // this.stage.GLB_PROJECT.children.map((child)=>{
        //     // console.log("child.name: ", child.name, child);
        //     if(child.name.includes("_pointlight")){
        //         const objectId = child.name
        //         const lightId = child.name.split("_")[0]
        //         const light = new PointLight3D({
        //             app:this.app,
        //             project:this.project,
        //             stage:this.stage,
        //             scenario:this.scenario,
        //             parent3D:this.parent3D,
        //             itemId: objectId,
        //             // importedObj: child,
        //             // pointLight: new THREE.PointLight(0xffffff, 40, 100, 2) // color, intensity, distance, decay
        //             pointLight: new THREE.PointLight(this.PRESETS[lightId].color, this.PRESETS[lightId].intensity, this.PRESETS[lightId].distance, this.PRESETS[lightId].decay) // color, intensity, distance, decay
        //         })
        //         this.Light3D.push(light)
        //     }else if(child.name.includes("_arealight")){
        //         const objectId = child.name
        //         const lightId = child.name.split("_")[0]
        //         const light = new AreaLight3D({
        //             app:this.app,
        //             project:this.project,
        //             stage:this.stage,
        //             scenario:this.scenario,
        //             parent3D:this.parent3D,
        //             itemId: objectId,
        //             lightData: this.PRESETS[lightId]
        //         })
        //         this.Light3D.push(light)
        //     }
        // })
    }
    init(){
        //--------------------
        // SUN LIGHTS
        this.sun.init()
        //--------------------
        // POINT LIGHTS
        for(let i=0; i<this.stage.libs.pointlights.arrayIds.length; i++){
            const lightId = this.stage.libs.pointlights.arrayIds[i]
            const importedLight = this.stage.libs.pointlights.getItem(lightId)
            const light = new PointLight3D({
                app:this.app,
                project:this.project,
                stage:this.stage,
                scenario:this.scenario,
                parent3D:this.parent3D,
                itemId: lightId,
                position: importedLight.position.clone(),
                pointLight: new THREE.PointLight(this.PRESETS[lightId].color, this.PRESETS[lightId].intensity, this.PRESETS[lightId].distance, this.PRESETS[lightId].decay) // color, intensity, distance, decay
            })
            // light.pointLight.castShadow = true;
            this.REFS.push(light)
        }
        //--------------------
        // AREA LIGHTS
        for(let i=0; i<this.stage.libs.arealights.arrayIds.length; i++){
            const lightId = this.stage.libs.arealights.arrayIds[i]
            const importedLight = this.stage.libs.arealights.getItem(lightId)
            const light = new AreaLight3D({
                app:this.app,
                project:this.project,
                stage:this.stage,
                scenario:this.scenario,
                parent3D:this.parent3D,
                itemId: lightId,
                position: importedLight.position.clone(),
                rotation: importedLight.rotation.clone(),
                lightData: this.PRESETS[lightId]
            })
            this.REFS.push(light)
        }
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
export default Light3D