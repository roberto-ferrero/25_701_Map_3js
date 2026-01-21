//import gsap from "gsap"
//import * as THREE from 'three'

import {fpsObserver} from 'fps-observer';
import NumberUtils from '../utils/NumberUtils';
import Sections from '../utils/Sections';

class AppFPS{
    constructor (obj){
        //console.log("(AppFPS.CONSTRUCTORA): ", obj)
        this.app = obj.app
        //--
        this.TESTING = false
        this.TEST_DONE = false
        this.TEST_CHECKS = 0
        this.TEST_CHECKS_MAX = 60*1
        //--
        this.fpsObserver = new fpsObserver();
        this.fpsObserver.sampleSize = 10;

        this.CHECKS = 0
        this.PERFORMANCE = 1 // 0 to 1 value 0: 0fps and 1: 60fps
        this.QUALITY = 4 // 0 to 4 
        
        this.BUFFER_LIMIT = this.TEST_CHECKS_MAX
        this.BUFFER = []
        this.BUFFER_AVERAGE = 0
        this.BUFFER_POS = 0

        //--
        this.test_start_date = null
        this.test_start_date = null
        
        // this.LAST_ALERT_CHECK = 0
        // this.FPS = 0
        // this.FPS_DELTA = 0
        // this.EXTREMLY_LOW_LIMIT = 15
        // this.VERY_LOW_LIMIT = 30
        // this.LOW_LIMIT = 45
        // this.EXCELENT_LIMIT = 58

       
    }
    //----------------------------------------------
    // PUBLIC:
    startTest(){
        //console.log("(AppFPS.startTest)!")
        this.test_start_date = Date.now()
        if(!this.TEST_DONE) this.TESTING = true
    }
    update_RAF(){
        //console.log("fps: "+this.fpsObserver.value);
        this.CHECKS++
        this.FPS = this.fpsObserver.value
        this.PERFORMANCE = NumberUtils.map01Mod(this.FPS, 0, 60)

        if(this.TESTING) this._do_test()
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _do_test(){
        const timelapse = Date.now() - this.test_start_date
        ////console.log(timelapse)
        if(timelapse <= 1000){
            this._update_BUFFER(this.FPS)
        }else{
            this.TESTING = false
            this.TEST_DONE = true
            let sections = new Sections([0, 25, 30, 40, 55])
            this.QUALITY = sections.get_section(this.BUFFER_AVERAGE);
            this.app.emitter.emit("onFPSTestDone")
            //console.log("TEST RESULT: "+this.BUFFER_AVERAGE+"fps  QUALITY:"+this.QUALITY);
        }
    }

    // _do_eval_QUALITY(fps){
    //     if(this.CHECKS > 60*3 && this.CHECKS > this.LAST_ALERT_CHECK+(60*2)){
    //         if(this.QUALITY > 0){
    //             if(fps < this.EXTREMLY_LOW_LIMIT){
    //                 this.FPS_DELTA -= 10
    //                 if(this.FPS_DELTA <= -30){
    //                     this.FPS_DELTA = 0
    //                     this.LAST_ALERT_CHECK = this.CHECKS
    //                     this.QUALITY -= 3
    //                     this.QUALITY = NumberUtils.clamp(this.QUALITY, 0, 4)
    //                     //console.log("EXTREMLY_LOW_LIMIT Q:"+this.QUALITY+" fps: "+fps);
    //                 }
    //             }else if(fps < this.VERY_LOW_LIMIT){
    //                 this.FPS_DELTA -= 6
    //                 if(this.FPS_DELTA <= -30){
    //                     this.FPS_DELTA = 0
    //                     this.LAST_ALERT_CHECK = this.CHECKS
    //                     this.QUALITY -= 2
    //                     this.QUALITY = NumberUtils.clamp(this.QUALITY, 0, 4)
    //                     //console.log("VERY_LOW_LIMIT Q:"+this.QUALITY+" fps: "+fps);
    //                 }
    //             }else if(fps < this.LOW_LIMIT){
    //                 this.FPS_DELTA -= 3
    //                 if(this.FPS_DELTA <= -30){
    //                     this.LAST_ALERT_CHECK = this.CHECKS
    //                     this.QUALITY -= 1
    //                     this.QUALITY = NumberUtils.clamp(this.QUALITY, 0, 4)
    //                     //console.log("LOW_LIMIT Q:"+this.QUALITY+" fps: "+fps);
    //                 }
    //             }else if(this.BUFFER_AVERAGE > this.EXCELENT_LIMIT){
    //                 this.FPS_DELTA += 3
    //                 this.FPS_DELTA = 0
    //                 if(this.FPS_DELTA >= 30){
    //                     this.QUALITY += 1
    //                     this.QUALITY = NumberUtils.clamp(this.QUALITY, 0, 4)
    //                     //console.log("EXCELENT_LIMIT Q:"+this.QUALITY+" fps: "+fps);
    //                 }
    //                 //console.log("this.BUFFER_AVERAGE: "+this.BUFFER_AVERAGE);
    //             }
    //             this.FPS_DELTA = NumberUtils.clamp(this.FPS_DELTA, -30, 30)
    //             //console.log("this.FPS_DELTA: "+this.FPS_DELTA);
    //         }
    //     }
    // }
    _update_BUFFER(fps){
        this.BUFFER[this.BUFFER_POS] = fps
        this.BUFFER_AVERAGE = this._calculateAverage(this.BUFFER)
        this.BUFFER_POS++
        if(this.BUFFER_POS >= this.BUFFER_LIMIT) this.BUFFER_POS = 0
    }


    _calculateAverage(arr) {
        if (arr.length === 0) return 0; // Handle empty array
    
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return Math.round(sum / arr.length);
    }
    _averageLowest20Percent(arr) {
        if (arr.length === 0) return 0; // Handle empty array
    
        // Sort the array in ascending order
        arr.sort((a, b) => a - b);
    
        // Calculate the number of elements in the lowest 20%
        const count = Math.ceil(arr.length * 0.2);
    
        // Sum the lowest 20% of values
        let sum = 0;
        for (let i = 0; i < count; i++) {
            sum += arr[i];
        }
    
        // Calculate the average
        return sum / count;
    }
    
    //----------------------------------------------
    // AUX:

  
}
export default AppFPS