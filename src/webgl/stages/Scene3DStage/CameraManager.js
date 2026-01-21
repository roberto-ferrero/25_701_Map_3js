import gsap from "gsap"
//import * as THREE from 'three'

class CameraManager{
    constructor (obj){
        // console.log("(CameraManager.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        //------------------------
        this.stageCamera = this.stage.stageCamera
        //------------------------
        this.SPOT_POS = 0
        this.CAMERA_SPOTS = ["zoom0", "zoom1", "zoom2", "zoom3"]
        //------------------------

        //------------------------
        this.app.emitter.on("onItemSelected", (data)=>{
            console.log("(CameraManager.onItemSelected): ", data.ITEM_ID);
            const spotId = this._get_SPOT(data.ITEM_ID)
            this.SPOT_POS = this.CAMERA_SPOTS.indexOf(spotId)
            this.stage.stageCamera.travelToSpot(spotId)
        })  
        //------------------------
        // this.app.dev.gui?.add(this, '_dev_nextSpot').name('NEXT CAMERA SPOT')
        // this.app.dev.gui?.add(this, '_dev_prevSpot').name('PREV CAMERA SPOT')
        this.app.dev.gui?.add(this, '_dev_zoomIn').name('ZOOM IN')
        this.app.dev.gui?.add(this, '_dev_zoomOut').name('ZOOM OUT')
        //------------------------
        this.app.emitter.on("onAppZoomChange", (event)=>{
            console.log("(CameraManager.onAppZoomChange): ", event.zoom);
            this.SPOT_POS = event.zoom
            this.stageCamera.travelToSpot(this.CAMERA_SPOTS[this.SPOT_POS], 1)
        })  

    }
    //----------------------------------------------
    // PUBLIC:
    init(){
        console.log("(CameraManager.init)!")
        this.stageCamera.placeInSpot("zoom0")  
        this.stageCamera.start_dragMoving()  

        // this.stageCamera.travelToSpot("shot0")
        gsap.delayedCall(1, ()=>{
            // this.stageCamera.travelToSpot(this.CAMERA_SPOTS[1])  
        })
    }

    //----------------------------------------------
    // PUBLIC API:
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    //----------------------------------------------
    _dev_zoomIn(){
        this.stage.zoomIn()
    }
    _dev_zoomOut(){
        this.stage.zoomOut()
    }
    _dev_nextSpot(){
        // PRIVATE:
        console.log("(CameraManager._dev_nextSpot): ", this.SPOT_POS);
        this.SPOT_POS = this.SPOT_POS+1
        if (this.SPOT_POS >= this.CAMERA_SPOTS.length) {
            this.SPOT_POS = 0
        }
        // const itemId = this._get_ITEM(this.CAMERA_SPOTS[nextSpot])
        this.stageCamera.travelToSpot(this.CAMERA_SPOTS[this.SPOT_POS])
    }
    _dev_prevSpot(){
        this.SPOT_POS = this.SPOT_POS-1
        if (this.SPOT_POS < 0) {
            this.SPOT_POS = this.CAMERA_SPOTS.length - 1
        }
        // const itemId = this._get_ITEM(this.CAMERA_SPOTS[nextSpot])
        this.stageCamera.travelToSpot(this.CAMERA_SPOTS[this.SPOT_POS])
    }
    //----------------------------------------------
    // AUX:

  
}
export default CameraManager