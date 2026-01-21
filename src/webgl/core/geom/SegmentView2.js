
//import gsap from "gsap"
import * as THREE from 'three'


//https://www.npmjs.com/package/@flatten-js/core

class SegmentView2{
    constructor (obj){
        //console.log("(SegmentView2.CONSTRUCTORA): ", obj)
        this.parent3D = obj.parent3D
        this.p1 = {
            x : obj.p1.x,
            y : obj.p1.y,
            z : obj.p1.z
        }
        this.p2 = {
            x : obj.p2.x,
            y : obj.p2.y,
            z : obj.p2.z
        }
        this.visible = obj.visible
        this.colorHex = obj.colorHex || 0xff0000
        //-----------
        //-----------
        // THREEJS
        this.material = new THREE.LineBasicMaterial({
            color: this.colorHex,
            visible:this.visible
        });
        const points = [];
        points.push( new THREE.Vector3( this.p1.x, this.p1.y, this.p1.z ) );
        points.push( new THREE.Vector3( this.p2.x, this.p2.y, this.p2.z ) );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        this.mesh = new THREE.Line( geometry, this.material );
        this.parent3D.add(this.mesh);
     }
     //----------------------------------------------
     // PUBLIC:
     setVisible(value){
        this.material.visible = value
     }
     show(){
        this.material.visible = true
     }
     hide(){
        this.material.visible = false
     }
     update(p1, p2){
        ////console.log("(SegmentView2.update)!")
        this.p1.x = p1.x
        this.p1.y = p1.y
        this.p1.z = p1.z
        this.p2.x = p2.x
        this.p2.y = p2.y
        this.p2.z = p2.z
        //--
        this.parent3D.remove(this.mesh)
        const points = [];
        points.push( new THREE.Vector3( this.p1.x, this.p1.y, this.p1.z ) );
        points.push( new THREE.Vector3( this.p2.x, this.p2.y, this.p2.z ) );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        this.mesh = new THREE.Line( geometry, this.material );
        this.parent3D.add(this.mesh);
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

}
export default SegmentView2