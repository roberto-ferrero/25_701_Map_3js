import gsap from "gsap"

import * as THREE from 'three'


import ProjectSuper from "../ProjectSuper";
import LighthouseStage from "../../stages/pwc_lighthouse/LighthouseStage";


import SampleTransition from "../../transitions/SimpleTransitions/SampleTransition";
import SimpleWipeTransition from "../../transitions/SimpleTransitions/SimpleWIpeTransition";
import NoiseFadeTransition from "../../transitions/ComplexTransitions/NoiseFadeTransition";
import CrossWrapTransition from "../../transitions/ComplexTransitions/CrossWrapTransition";




class SampleProject extends ProjectSuper{
    constructor (obj){ // Step 0: Instantiated in Platform and passed to WebGLApp by argument
        console.log("(SampleProject.CONSTRUCTORA): ", obj)
        super(obj)
    }
    //---------------------------------------------
    // INTERNAL:
    init(){ // Step 1: Called directly by App on Construct
        console.log("(SampleProject.init)!")

        //-------------------
        // PROJECT SHERED ASSETS MANISFEST:
        this.loader.add_texture("sample", this.app.loader_pathPrefix+"/img/sample.jpg")
        this.loader.add_texture("sample2", this.app.loader_pathPrefix+"/img/sample2.jpg")
        //-------------------
        // STAGES:
        this._addStage(new LighthouseStage({
            id:"lighthouse",
            app:this.app,
            project:this,
            autoLoad:true,
            autoActive:true,
        }))
        //--
        this._addTransition("simple_transition", new SampleTransition({app:this.app, project:this}))
        this._addTransition("wipe_transition", new SimpleWipeTransition({app:this.app, project:this}))
        this._addTransition("noisefade_transition", new NoiseFadeTransition({app:this.app, project:this}))
        this._addTransition("crosswrap_transition", new CrossWrapTransition({app:this.app, project:this}))


        // this.noisefade_transition = new NoiseFadeTransition({app:this.app, project:this})
        // this.crosswrap_transition = new CrossWrapTransition({app:this.app, project:this})
        //--
        this._activate_and_show_stage("lighthouse")
    }
    build(){ // Step:4 Called by ProjectCore when it recieves onAppBuild
        console.log("(SampleProject.build)!")
    }


    //----------------------------------------------
    // RAF UPDATES:
    update_RAF(){

    }
    //----------------------------------------------
    // PUBLIC API:
    //----------------------------------------------
    // PRIVATE:
    //----------------------------------------------
    //----------------------------------------------
    // AUX:

}
export default SampleProject