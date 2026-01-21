//import gsap from "gsap"
import * as THREE from 'three'
import Datos from './Datos'

class ColorPicker{
    constructor (){
        //console.log("(ColorPicker.CONSTRUCTORA)!")
        this.data = new Datos()
        this.counter = 0
    }
    //----------------------------------------------
    // PUBLIC:
    add(param, id){
        const color = new THREE.Color(param)
        this.addColor(color, id)
    }
    addColor(color, id = "color_"+this._get_autoNum()){
        if(!this.data.evalExiste(id)){
            const item = {
                id: id,
                color:color // THREE.Color
            }
            this.data.nuevoItem(item.id, item)
        }
    }
    getColor(id){
        if(!this.data.evalExiste(id)){
            return this.data.getItem(id)
        }else{
            return null
        }
    }
    getRandom(){
        const dice = Math.floor(Math.random()*this.data.arrayItems.length)
        return this.data.getItemAt(dice).color
    }
    getRandom256(){
        const color = this.getRandom()
        return this.to256(color)
    }
    to256(color){
        const array256 = [
            color.r*255,
            color.g*255,
            color.b*255,
        ]
        return array256
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _get_autoNum(){
        this.counter++
        return this.counter
    }
    //----------------------------------------------
    // AUX:
  
}
export default ColorPicker

/*
empty constructor - will default white
const color1 = new THREE.Color();

Hexadecimal color (recommended)
const color2 = new THREE.Color( 0xff0000 );

RGB string
const color3 = new THREE.Color("rgb(255, 0, 0)");
const color4 = new THREE.Color("rgb(100%, 0%, 0%)");

X11 color name - all 140 color names are supported.
Note the lack of CamelCase in the name
const color5 = new THREE.Color( 'skyblue' );

HSL string
const color6 = new THREE.Color("hsl(0, 100%, 50%)");

Separate RGB values between 0 and 1
const color7 = new THREE.Color( 1, 0, 0 )
*/