import gsap from "gsap"
import * as THREE from 'three'

import EasedOutValue from "../../core/utils/EasedOutValue"

import StageSuper from '../StageSuper'

import CameraManager from "./CameraManager"

import StageCamera from "./StageCamera/StageCamera"
import StageLibraries from "./StageLib/StageLibraries"
import Scenario3D from "./Scenario3D/Scenario3D"

// import MarkersPackData from "./StageData/MarkersPackData"
import StageData from "./StageData/StageData"

//https://github.com/mrdoob/three.js/blob/e32c522ec5086d8c7c12b7cb4b029a222d534225/examples/jsm/objects/Water2.js#L49-L50

class Scene3DStage extends StageSuper{
    // this.app.project.stage
    constructor (obj){
        console.log("(Scene3DStage.CONSTRUCTORA) 20260210_0930: ", obj)
        super(obj)
        //-------------------
        this.START_REQUESTED = true
        this.STARTED = false
        this.PRE_BUILT = false 
        //-------------------
        this.STAGE_SIZE = this.app.size.CURRENT
        //-------------------
        this.MODE = "IDLE" // IDLE | TRAVELLING | DRAGGING | ZOOMING | SELECTING
        this.ZOOM_LEVELS = 5
        this.CURRENT_ZOOM = 0
        this.CURRENT_TIER_MODE = 1 // 1,2,3
        //-------------------
        this.MOUSE_PAN_FACTOR_EASED = new EasedOutValue(1, 0.05, 0.005, this.app.emitter, "onUpdateRAF")
        //--------------------
        this.DEV_ITEM_ID = 166
        //--------------------
        //this.background_color = [ 246, 246, 246, 1 ]
        //const newColor = new THREE.Color(this.background_color[0]/255, this.background_color[1]/255, this.background_color[2]/255)
        //this.app.render.renderer.setClearColor(newColor, 1)
        //---------------------
        // BASIC STRUCTURE:
        this.world3D = new THREE.Object3D()
        this.world3D.name = "world3D"
        // this.world3D.rotation.set(0, Math.PI*0.2, 0) //
        this.scene.name = "stage_scene"
        this.scene.add(this.world3D)
        //------------------------

        //------------------------
        // LIBS:
        this.libs = new StageLibraries({
            app:this.app,
            project:this.project,
            stage:this,
        })
        //---------
        // CAMERA:
        this.stageCamera = new StageCamera({
            app:this.app,
            project:this.project,
            stage:this,
            parent3D:this.world3D
        })
        this.cameraManager = new CameraManager({
            app:this.app,
            project:this.project,
            stage:this,
        })
        //---------
        // DATA:
        // this.stageData = new MarkersPackData({
        //     app:this.app,
        //     project:this.project,
        //     stage:this,
        //     type: "city",
        // })
        this.stageData = new StageData({
            app:this.app,
            project:this.project,
            stage:this,
        })
        //---------
        // SCENARIO:
        this.scenario3D = new Scenario3D({
            app:this.app,
            project:this.project,
            stage:this,
            parent3D:this.world3D,
        })
        //------------------------


        //------------------------------
        // LOADING MANIFEST:
        // console.log("--");
        // console.log("cities_dataPath: ", this.app.data.cities_dataPath);
        // console.log(this.app.loader_pathPrefix+"data/cities.json");
        // console.log("--");
        // console.log("events_dataPath: ", this.app.data.events_dataPath);
        // console.log(this.app.loader_pathPrefix+"data/events.json");
        // console.log("--");
        // console.log("shops_dataPath: ", this.app.data.shops_dataPath);
        // console.log(this.app.loader_pathPrefix+"data/shops.json");
        // console.log("--");


        
        // this.loader.add_gltf("scene", this.app.loader_pathPrefix+"glbs/pandora_scene_20260203_1730.glb", true)    
        this.loader.add_gltf("scene", this.app.loader_pathPrefix+"glbs/pandora_scene_20260204_1400.glb", true)    
        
        const texture_options = {
            // TODO
        }

        // this.loader.add_texture("map", this.app.loader_pathPrefix+"img/map.jpg", true)
        this.loader.add_texture("city", this.app.loader_pathPrefix+"img/city2x.png", true, texture_options)

        this.loader.add_texture("event", this.app.loader_pathPrefix+"img/event.png", true, texture_options)
        // this.loader.add_texture("event_ring", this.app.loader_pathPrefix+"img/event_ring.png", true, texture_options)
        this.loader.add_texture("event_blur", this.app.loader_pathPrefix+"img/event_blur.png", true, texture_options)

        this.loader.add_texture("shop", this.app.loader_pathPrefix+"img/store2x.png", true, texture_options)
        // this.loader.add_texture("shop_ring", this.app.loader_pathPrefix+"img/shop_ring2.png", true, texture_options)
        // this.loader.add_texture("shop_blur", this.app.loader_pathPrefix+"img/shop_blur2.png", true, texture_options)
        //--
        // this.loader.add_json("city_data", this.app.loader_pathPrefix+"data/cities.json")
        // this.loader.add_json("event_data", this.app.loader_pathPrefix+"data/events.json")
        // this.loader.add_json("shop_data", this.app.loader_pathPrefix+"data/shops.json")
        this.loader.add_json("city_data", this.app.data.cities_dataPath)
        this.loader.add_json("event_data", this.app.data.events_dataPath)
        this.loader.add_json("shop_data", this.app.data.shops_dataPath)
        this.loader.add_json("settings_data", this.app.data.settings_dataPath)
        //------------------------------
        


        //------------------------------
        // APP EVENTS:
        this.app.emitter.on("onAppScrollUpdate",(e)=>{
            // this.progress.set_GENERAL_PROGRESS(e.scroll.PROGRESS)
        })
        this.app.emitter.on("onItemSelected",(e)=>{
            // this.CURRENT_SELECTED_ITEM_ID = e.ITEM_ID
        })
        this.app.emitter.on("onItemRollover",(e)=>{
            // this.CURRENT_ROLLOVER_ITEM_ID = e.ITEM_ID
            // console.log("(Scene3DStage.onItemRollover): ", e.ITEM_ID);
        })
        this.app.emitter.on("onItemRollout",(e)=>{
            // this.CURRENT_ROLLOVER_ITEM_ID = e.ITEM_ID
            // console.log("(Scene3DStage.onItemRollout): ", e.ITEM_ID);
        })
    }
    //----------------------------------------------
    // PUBLIC API:
    printState(){
        console.log("------- Scene3DStage STATE -------");
        console.log(" CURRENT_ZOOM:", this.CURRENT_ZOOM);
        console.log(" CURRENT_TIER_MODE:", this.CURRENT_TIER_MODE);
        console.log(" CAMERA_MODE:", this.get_MODE());
        console.log("----------------------------------");
    }
    get_MODE(){
        return this.MODE
    }
    get_ZOOM(){
        return this.CURRENT_ZOOM
    }
    get_TIER_LEVEL(){
        return this.CURRENT_ZOOM
    }
    set_MODE(newMode){
        if(this.MODE != newMode){
            console.log("CHANGE MODE TO: " + newMode);
            this.MODE = newMode
        }
    }
    zoomIn(){
        if(!this.stageCamera.TRAVELLING && this.MODE == "IDLE"){
            console.log("(Scene3DStage.zoomIn)!");
            if(this.CURRENT_ZOOM<this.ZOOM_LEVELS-1){
                const newZoom = this.CURRENT_ZOOM + 1
                this.zoomToLevel(newZoom)
            }
        }
    }
    zoomOut(){
        if(!this.stageCamera.TRAVELLING  && this.MODE == "IDLE"){
            console.log("(Scene3DStage.zoomOut)!");
            if(this.CURRENT_ZOOM>0){
                const newZoom = this.CURRENT_ZOOM - 1
                this.zoomToLevel(newZoom)
            }
        }
    }
    
    zoomToLevel(zoomLevel){
        console.log("(Scene3DStage.zoomToLevel): "+zoomLevel);
        this.CURRENT_ZOOM = zoomLevel
        this.eval_TIER_MODE()
        this.printState()
        this.app.emitter.emit("onAppZoomChange", {zoom:this.CURRENT_ZOOM, doZoomingAnim:true})
    }

    selectMarker(markerId, typeId, newZoomLevel){
        this.moveAndZoom(markerId, typeId, newZoomLevel)
        this.applyOffset()
    }

    deselectMarker(){
        this.resetOffset()
    }

    applyOffset(){
        this.stageCamera.applyOffset()
    }
    resetOffset(){
        this.stageCamera.resetOffset()
    }


    moveAndZoom(markerId, typeId, newZoomLevel){
        console.log("(Scene3DStage.moveAndZoom) markerId:", markerId, " typeId:", typeId, " newZoomLevel:", newZoomLevel);
        const markerData = this.stageData.getItemById(markerId, typeId)
        const filteredPosition = new THREE.Vector3(markerData.position.x, 1, -markerData.position.y)
        console.log("filteredPosition: ", filteredPosition);
        this.CURRENT_ZOOM = newZoomLevel
        this.eval_TIER_MODE()
        this.app.emitter.emit("onAppZoomChange", {zoom:this.CURRENT_ZOOM, doZoomingAnim:false})
        this.stageCamera.moveAndZoom(filteredPosition, newZoomLevel)

    }

    // moveToMarker(markerId, typeId){
    //     console.log("(Scene3DStage.moveToMarker) markerId:", markerId, " typeId:", typeId);
    //     console.log("markerData: ", markerData);
    //     // this.stageCamera.moveToPosition(filteredPosition)
    // }


    eval_TIER_MODE(){
        if(this.CURRENT_ZOOM==0){
            this.CURRENT_TIER_MODE = 1
        }else if(this.CURRENT_ZOOM==1){
            this.CURRENT_TIER_MODE = 2
        }else if(this.CURRENT_ZOOM==2){
            this.CURRENT_TIER_MODE = 3
        }else if(this.CURRENT_ZOOM==3){
            this.CURRENT_TIER_MODE = 3
        }else if(this.CURRENT_ZOOM==4){
            this.CURRENT_TIER_MODE = 3
        }
        this.app.emitter.emit("onAppTierModeChange", {tier:this.CURRENT_TIER_MODE})
    }
    //----------------------------------------------
    // INTERNAL:
    init(){ // Called by ProjectSuper
        // console.log("(Scene3DStage.init): "+this.id)
    }
    build(){
        // console.log("(Scene3DStage.build): "+this.id)
        this.GLB_PROJECT = this.loader.get_gltf("scene")
        console.log("this.GLB_PROJECT: ", this.GLB_PROJECT);

        this.stageData.init()
        this.libs.init(this.GLB_PROJECT)
        this.scenario3D.init()
        this.cameraManager.init()


        //------------------- 
        this.app.emitter.on("onAppScrollUpdate",(e)=>{
            if(e.id == "scroll_main"){
                // this.stageCamera.set_PROGRESS(e.scroll.PROGRESS)
            }
        })
        this.app.emitter.on("onItemSelected",(e)=>{
            if(e.ITEM_ID == "item5"){
                const cardId = "item5-card"
                const card = document.getElementById(cardId)
                card.classList.add("visible");
            }else{
                const cardId = "item5-card"
                const card = document.getElementById(cardId)
                card.classList.remove("visible");
            }
        })
        //-------------------   
        this.BUILT2 = true
        //-------------------  
        // this.selectItem(null) 
        //-------------------   
        this.eval_start()
    }

    request_start(){ // Called from app
        this.START_REQUESTED = true
        this.eval_start()
    }
    eval_start(){
        if(this.BUILT && this.START_REQUESTED && !this.STARTED){
            this.STARTED = true
            this.start()
        }
    }
    start(){
        // console.log("(Scene3DStage.start)! <-----------------------------------------"+this.STARTED);
        // this.stageCamera.start()
        // this.stageCamera.animateStateFromTo("camera0", "camera1", 2)
        // this.stageCamera.animateTargetFromTo("target0", "target1", 2)
        this.app.emitter.emit("onStartIntro", {})

        gsap.delayedCall(0.5, ()=>{
            console.log("===============================");
            console.log("onReady!");
            console.log("===============================");
            this.app.emitter.emit("onReady", {})
        })
        
    }
    //----------------------------------------------
    // PUBLIC API:
    selectItem(itemId){
        // console.log("(Scene3DStage.selectItem): ", itemId);
        if(this.CURRENT_SELECTED_ITEM_ID != itemId){
            this.CURRENT_SELECTED_ITEM_ID = itemId
            this.app.emitter.emit("onItemSelected", {
                ITEM_ID: itemId, 
            })
        }
    }
    show(sectionId){
        // console.log("(Scene3DStage.start)!");
        this.progress.show(sectionId)
    }
    //----------------------------------------------
    // INTERNAL:
    // get_mesh_from_GLB_PROJECT(meshId){
    //     // console.log("_extract_mesh_from_GLB_PROJECT: ", meshId);
    //     const mesh = this.GLB_PROJECT.children.find((mesh)=>{
    //         const result = mesh.name == meshId
    //         return result
    //     })
    //     // console.log("PROJECT mesh: ", mesh);
    //     // if(mesh){
    //         if(mesh?.type == "Group"){ // DOC: Algunas veces la exportación de Blender genera un grupo en vez de un mesh. La posicion es del group y de la copiamos al mesh
    //             const position = mesh.position
    //             // console.log("!!!");
    //             // console.log("   mesh: ", mesh);
    //             const itemMesh = mesh.children[0]
    //             itemMesh.position.set(position.x, position.y, position.z)
    //             return itemMesh
    //         }
    //     // }
    //     return mesh
    // }
    get_mesh_from_GLB_PROJECT(meshId, PROJECT = this.GLB_PROJECT){
        // console.log("_extract_mesh_from_GLB_PROJECT: ", meshId);
        const mesh = PROJECT.children.find((mesh)=>{
            const result = mesh.name == meshId
            return result
        })
        // console.log("PROJECT mesh: ", mesh);
        // if(mesh){
            if(mesh?.type == "Group"){ // DOC: Algunas veces la exportación de Blender genera un grupo en vez de un mesh. La posicion es del group y de la copiamos al mesh
                const position = mesh.position
                // console.log("Group!!");
                // console.log("   mesh: ", mesh);
                const itemMesh = mesh.children[0]
                itemMesh.position.set(position.x, position.y, position.z)
                return itemMesh
            }
        // }
        // console.log("mesh: ", mesh);
        return mesh.clone()
    }
    //----------------------------------------------
    // UPDATES:
    update_RAF(){
        if(this.STARTED){
            this.stageCamera?.update_RAF()
            this.scenario3D?.update_RAF()
            // this.htmlLabels?.update_RAF()
        }
    }
    //----------------------------------------------
    // PRIVATE:
    _reconfigure_renderer(){

    }
    //----------------------------------------------
    // AUX:


}
export default Scene3DStage
