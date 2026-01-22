//import gsap from "gsap"
import * as THREE from 'three'

import MeshUtils from '../../../core/utils/MeshUtils'


import Lights3D from './Lights3D/Lights3D'

import Map3D from './Map3D/Map3D'

class Scenario3D{
    // this.app.project.stage.scenario3D
    constructor (obj){
        // console.log("(Scenario3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        //-----------------------------
        //-----------------------------
        this.cont3D = new THREE.Object3D()
        this.cont3D.name = "scenario3D"
        this.parent3D.add(this.cont3D)
        //-----------------------------
        // this.stage.scene.background = new THREE.Color(0xeeeeee)s
        // this.app.render.renderer.shadowMap.enabled = true;
        // this.app.render.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Or VSMShadowMap for softer falls
        // this.app.render.renderer.outputColorSpace = THREE.SRGBColorSpace;
        // this.app.render.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // this.app.render.renderer.toneMappingExposure = 1.2; // Over-expose slightly for that bright look
        //-----------------------------
        this.lights3D = new Lights3D({
            app:this.app,
            project:this.project,
            stage:this.stage,
            scenario:this,
            parent3D:this.cont3D,
        })
        //-----------------------------
        this.map3D = new Map3D({
            app:this.app,
            project:this.project,
            stage:this.stage,
            scenario:this,
            parent3D:this.cont3D,
        })


        //------------------------------
        // HELPERS:
        this.axis_helper = new THREE.AxesHelper( 150 )
        this.stage.scene.add(this.axis_helper)
        this.app.register_helper(this.axis_helper)
        //--
        this.gridHelper = new THREE.GridHelper( 150, 10, 0xdddddd, 0xdddddd );
        this.stage.scene.add( this.gridHelper );
        this.app.register_helper(this.gridHelper)
        //------------------------------


    }
    init(){
        this.lights3D?.init()
        this.map3D.init()

    }


    build_mesh(meshId, cont3D, positionOffset=new THREE.Vector3(0,0,0)){
        // console.log("(Scenario3D.build_mesh): ", meshId);

        // const mesh = this.stage.libs.meshes.getItem(meshId) // LOOKS GREAT!
        const mesh = this.stage.libs.meshes.getItem2(meshId) // LOKKS DIFFERENT!

        // console.log("materialId: ", mesh.__materialId);
        if(mesh.__materialId && mesh.__materialId!="imported"){
            const material = this.stage.libs.materials.getItem(mesh.__materialId)
            mesh.material = material
        }
        mesh.castShadow = true; // <--- The crucial line
        mesh.receiveShadow = true; // Optional: if you want self-shadowing
        mesh.position.add(positionOffset)
        cont3D.add(mesh)
    }

    build_meshGroup(groupId){
        const groupMeshes = this.stage.libs.meshgroups.getGroupMeshes(groupId)
        // console.log("groupMeshes: ", groupMeshes);
        groupMeshes.map( (mesh) => {
            mesh.material.castShadow = true
            mesh.material.receiveShadow = true
            // mesh.material.wireframe = true
            this.cont3D.add(mesh)
        })
    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        this.map3D.updateRAF()
    }
    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default Scenario3D