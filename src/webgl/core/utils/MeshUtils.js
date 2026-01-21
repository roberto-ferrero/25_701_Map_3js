//import gsap from "gsap"
import * as THREE from 'three'

class MeshUtils{
    constructor (obj){

    }

    //-------------------
    // STATICOS:
    static get_sphere(r, wSegs=32, hSegs=32, colorHex=0xff0000, wireframe=true){
        const geometry = new THREE.SphereGeometry( r, wSegs, hSegs); 
        const material = new THREE.MeshBasicMaterial( {
            color: colorHex,
            wireframe:wireframe
        } ); 
        const mesh = new THREE.Mesh( geometry, material ); 
        return mesh
    }

    static get_box(w, h, d, colorHex=0xff0000, wireframe=true){
        const geometry = new THREE.BoxGeometry( w, h, d, 1, 1); 
        const material = new THREE.MeshBasicMaterial( {
            color: colorHex,
            wireframe:wireframe
        } ); 
        const mesh = new THREE.Mesh( geometry, material ); 
        return mesh
    }

    static get_plane(w, h, colorHex=0xff0000, wireframe=true){
        const geometry = new THREE.PlaneGeometry(w, h, 2, 2)
        const material = new THREE.MeshBasicMaterial({
            color: colorHex,
            wireframe:wireframe,
        })
        const mesh = new THREE.Mesh( geometry, material ); 
        return mesh
    }
  
}
export default MeshUtils