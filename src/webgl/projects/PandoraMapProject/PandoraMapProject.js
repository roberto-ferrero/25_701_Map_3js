import gsap from "gsap"
import * as THREE from 'three'

import ProjectSuper from "../ProjectSuper";
// import HerosStage from "../../stages/pwc_heros/HerosStage";
import Scene3DStage from "../../stages/Scene3DStage/Scene3DStage";

import SampleTransition from "../../transitions/SimpleTransitions/SampleTransition";




class PandoraMapProject extends ProjectSuper{
    constructor (obj){ // Step 0: Instantiated in Platform and passed to WebGLApp by argument
        // console.log("(PandoraMapProject.CONSTRUCTORA): ", obj)
        super(obj)
    }
    //---------------------------------------------
    // INTERNAL:
    init(){ // Step 1: Called directly by App on Construct
        // console.log("(PandoraMapProject.init)!")

        //-------------------
        // PROJECT SHARED ASSETS MANISFEST:
        // this.loader.add_texture("sample", this.app.loader_pathPrefix+"/img/sample.jpg")
        // this.loader.add_texture("peaks_FRONT", this.app.loader_pathPrefix+"/img/peaks_FRONT.jpg")
        //-------------------
        // this.MODE = this.app.data.MODE
        // this.app.trace("STARTING_MODE: ", this.MODE);
        //-------------------
        // STAGES:
        this._addStage(new Scene3DStage({
            id:"current_stage",
            app:this.app,
            project:this,
            autoLoad:true,
            autoActive:false,
        }))
        //--
        this._addTransition("simple_transition", new SampleTransition({app:this.app, project:this}))
        //--
        this.stage = this.stages.getItem("current_stage")
        //--
        this._activate_and_show_stage("current_stage")
    }
    build(){ // Step:4 Called by ProjectCore when it recieves onAppBuild
        // console.log("(PandoraMapProject.build)!")
    }


    //----------------------------------------------
    // RAF UPDATES:
    update_RAF(){

    }
    //----------------------------------------------
    // PUBLIC API:
    setMode(mode){
        // this.app.trace("(PandoraMapProject.setMode): "+mode);
        if(mode != this.MODE){
            this.MODE = mode
            this.emitter.emit("onProjectSetMode", {mode:mode})
        }
    }
    //----------------------------------------------
    // PRIVATE:
    //----------------------------------------------
    //----------------------------------------------
    // AUX:

}
export default PandoraMapProject