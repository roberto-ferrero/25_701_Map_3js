//import gsap from "gsap"
import * as THREE from 'three'


class SimpleAdaptativeFrame{
    constructor (obj){
        ////console.log("(SimpleAdaptativeFrame.CONSTRUCTORA): ", obj)
        this.id = obj.id
        this.app = obj.app
        this.anim = obj.anim
        this.parent3D = obj.parent3D
        this.position = obj.position
        this.item3D = obj.item3D
        this.itemWidth = obj.itemWidth
        this.itemHeight = obj.itemHeight
        //--
        this.itemAspect = this.itemWidth/this.itemHeight
        this.refAspect = this.app.size.REF.aspect
        this.distanceToItem = this.anim.tripod.get_position().z-this.position.z
        //--
        this.contentScale = null
        this.fustrumScaleX = null
        this.fustrumScaleY = null
        //--
        this.cont3D = new THREE.Object3D()
        this.cont3D.position.set(0, 0, this.position.z)
        this.parent3D.add(this.cont3D)
        this.cont3D.add(this.item3D)
        
        //-----------
        // Ajustamos primero las dimensiones del item para que cubra el marco de referencia. Habiendo dos casos
        let itemScale 
        if(this.itemAspect >= this.refAspect){
            ////console.log("1) EL ITEM ES MAS HORIZ QUE EL MARCO DE REFERENCIA");
            // 1) EL ITEM ES MAS HORIZ QUE EL MARCO DE REFERENCIA
            // AJUSTAMOS EL ALTO DEL ITEM AL ALTO DE REFERENCIA
            itemScale = this.app.size.REF.height/this.itemHeight
        }else{
            ////console.log("2) EL ITEM ES MAS VERT QUE EL MARCO DE REFERENCIA");
            // 2) EL ITEM ES MAS VERT QUE EL MARCO DE REFERENCIA
            // AJUSTAMOS EL ANCHO DEL ITEM AL ANCHO DE REFERENCIA
            itemScale = this.app.size.REF.width/this.itemWidth
        }
        //console.log("itemScale: "+itemScale);
        this.item3D.scale.set(itemScale, itemScale, itemScale)
        //-----------


        //--
        if(this.app.dev.HELPERS){
            const geometry = new THREE.PlaneGeometry(this.app.size.REF.width, this.app.size.REF.height);
            const material = new THREE.MeshBasicMaterial( {
                color: 0xff0000,
                wireframe: true,
            } );
            this.helper = new THREE.Mesh( geometry, material );
            this.cont3D.add(this.helper);
            this.app.dev.register_helper(this.helper.material)
        }
        //--
        
        this._update_fustrumScale()

        //-------------
        // APP EVENTS:
        this.app.emitter.on("onAppSizeUpdate", ()=>{
            this.update_resize()
        })
        
    }
    //----------------------------------------------
    // PUBLIC:
    update_resize(){
        this._update_fustrumScale()
    }
    get_scale(){
        const obj = {
            x: this._get_fustrum_scale(this.position.z, this.app.size.REF.width, this.app.size.CURRENT.width),
            y: this._get_fustrum_scale(this.position.z, this.app.size.REF.height, this.app.size.CURRENT.height),
        }
        ////console.log("fustrum sacle: ", obj)
        return obj
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _update_fustrumScale(){
        const fustrumScales = this._get_fustrumScales(this.itemWidth, this.itemHeight, this.position.z)
        this.fustrumScaleX = fustrumScales.x
        this.fustrumScaleY = fustrumScales.y
        ////console.log("fustrumScales: ", fustrumScales);
        this.cont3D.scale.set(fustrumScales.x, fustrumScales.x, fustrumScales.x)
    }

    _get_fustrumScales(itemWidth, itemHeight, posZ){
        const appAspect = this.app.size.CURRENT.aspect
        const itemAspect = itemWidth/itemHeight
        let fustrumScaleX
        let fustrumScaleY
        ////console.log("appAspect: "+appAspect);
        ////console.log("itemAspect: "+itemAspect);
        if(appAspect >= itemAspect){
            // EL VIEWPORT ES MAS HORIZONTAL QUE EL ITEM
            // EL ITEM ES MAS VERTICAL QUE EL VIEWPORT
            // AJUSTAMOS EL ANCHO DEL ITEM AL ANCHO DEL VIEWPORT, SOBNRANDO MARGEN VERTICAL
            //console.log("*1")
            fustrumScaleX = this._get_axisScale(posZ, this.app.size.REF.width, this.app.size.CURRENT.width)
            fustrumScaleY = this._get_axisScale(posZ, this.app.size.REF.height, this.app.size.CURRENT.height)
            ////console.log(fustrumScaleX);
        }else{
            // EL VIEWPORT ES MAS VERTICAL QUE EL ITEM
            // EL ITEM ES MAS HORIZONTAL QUE EL VIEWPORT
            // AJUSTAMOS EL ALTO DEL ITEM AL ALTO DEL VIEWPORT, SOBNRANDO MARGEN HORIZONTAL
            //console.log("*2")
            const fixedWidth = this.app.size.CURRENT.height*itemAspect
            fustrumScaleX = this._get_axisScale(posZ, this.app.size.REF.width, fixedWidth)
            fustrumScaleY = this._get_axisScale(posZ, this.app.size.REF.height, this.app.size.CURRENT.height)
        }
        const obj = {
            x:fustrumScaleX,
            y:fustrumScaleY
        }
        //console.log(obj);
        return obj
    }

    _get_axisScale(distanceToItem, itemValue, valueToMatch){
        // NOTE: itemValue and valueToMatch can be: itemHeight/heightToMatch or itemWidth/widthToMatch
        const half_valueToMatch = valueToMatch*0.5
        const half_itemValue = itemValue*0.5
        const anguloRad = Math.atan2(half_valueToMatch, this.anim.tripod.get_position().z)
        const result_half_itemValue = Math.tan(anguloRad)*(this.anim.tripod.get_position().z-distanceToItem)
        const scale = result_half_itemValue/half_itemValue
        return scale
    }
    //----------------------------------------------
    // AUX:

  
}
export default SimpleAdaptativeFrame