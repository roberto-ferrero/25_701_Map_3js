//import gsap from "gsap"
//import * as THREE from 'three'

class Sections{
    // ----p0-----p1-----p2-----p3----
    // v<p0             : section: -1
    // v>=p0 && v<p1    : section0
    // v>=p1 && v<p2    : section1
    // v>=p2 && v<p3    : section2
    // v>=p3 > section:3
    // Breakpoint are start of saction
    //--
    constructor (_array){
        ////console.log("(Sections.CONSTRUCTOR):",_array);
        this.array = _array
    }
    //----------------------------------------------
    // PUBLIC:
    get_section(value){
        ////console.log("(Sections.get_section): "+value+" array:",this.array);
        if(value < this.array[0]){
            return -1
        }else if(value >= this.array[this.array.length-1]){
            return this.array.length-1
        }
        //--
        for(var i=0; i<this.array.length; i++ ){
            if(value >= this.array[i] && value <this.array[i+1]){
                return i
            }
        }
    }
    get_breakPoint(pos){
        return this.array[pos]
    }
    get_last_breakPoint(){
        return this.array[this.array.length-1]
    }

    get_sectionLimits(sectionNum){
        ////console.log("(Sections.get_sectionLimits): "+sectionNum);
        const limits = []
        if(sectionNum == -1){
            limits[0] = -Infinity
            limits[1] = 0
        }else if(sectionNum == this.array.length-1){
            limits[0] = this.array[this.array.length-1]
            limits[1] = Infinity
        }else{
            limits[0] = this.array[sectionNum]
            limits[1] = this.array[sectionNum+1]
        }
        ////console.log("   array: ",this.array);
        ////console.log("   limits: ",limits);
        return limits
    }
    get_sectionProgress(value){
        // Return a 0-1 value of the value given inside the CURRENT section limit.
        // If value <= min value it returns 0
        // If value >= min value it returns 1
        const sectionNum = this.get_section(value)
        ////console.log("sectionNum: "+sectionNum);
        const limits = this.get_sectionLimits(sectionNum)
        if(sectionNum == -1){
            return 0
        }else if(sectionNum >= this.array.length-1){
            return 1
        }else if(value <= limits[0]){
            return 0
        }else if(value >= limits[1]){
            return 1
        }else{
            const range = limits[1]-limits[0]
            const relative_value = value-limits[0]
            ////console.log("   range:"+range+"  relative_value:"+relative_value)
            return (relative_value)/(range)
        }
    }
    get_sectionProgress2(value, sectionNum){
        // Return a 0-1 value of the value given inside the SPECIFIED section limit.
        // If value <= min value it returns 0
        // If value >= min value it returns 1
        const limits = this.get_sectionLimits(sectionNum)
         if(value <= limits[0]){
            return 0
        }else if(value >= limits[1]){
            return 1
        }else{
            const range = limits[1]-limits[0]
            const relative_value = value-limits[0]
            ////console.log("   range:"+range+"  relative_value:"+relative_value)
            return (relative_value)/(range)
        }
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:
  
}
export default Sections