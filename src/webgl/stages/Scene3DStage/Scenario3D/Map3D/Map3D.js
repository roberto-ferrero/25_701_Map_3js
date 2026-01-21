//import gsap from "gsap"
import * as THREE from 'three'
import MeshUtils from '../../../../core/utils/MeshUtils'

import MapProjector from './MapProjector'
import MarkersPack3D from './MarkersPack3D'
// import City3D from './City3D'

// import data from './fakeData.json'

class Map3D{
    constructor (obj){
        console.log("(Map3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario3D = obj.scenario
        this.parent3D = obj.parent3D
        //--
        this.tooltip = document.getElementById('tooltip');
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        // Rastrear el objeto interceptado actualmente
        this.hoveredObjectId = null;
        //--
        this.projector = new MapProjector({ app: this.app });
        // this.markers = []
    }
    init(){
        console.log("(Map3D.init)!")
        this.map_cont3D = new THREE.Object3D()
        this.map_cont3D.name = "map3D"
        this.parent3D.add(this.map_cont3D)
        
        this.markers_cont3D = new THREE.Object3D()
        this.markers_cont3D.name = "markers3D"
        this.markers_cont3D.rotation.x = -Math.PI /2
        this.parent3D.add(this.markers_cont3D)
        //--    
        // this._create_devMap()
        this._create_map()
        //--
        this.cities = new MarkersPack3D({
            app: this.app,
            project: this.project,
            stage: this.stage,
            scenario3D: this.scenario3D,
            map3D: this,
            type: "city",
            parent3D: this.markers_cont3D,
        })
        this.events = new MarkersPack3D({
            app: this.app,
            project: this.project,
            stage: this.stage,
            scenario3D: this.scenario3D,
            map3D: this,
            type: "event",
            parent3D: this.markers_cont3D,
        })
        this.shops = new MarkersPack3D({
            app: this.app,
            project: this.project,
            stage: this.stage,
            scenario3D: this.scenario3D,
            map3D: this,
            type: "shop",
            parent3D: this.markers_cont3D,
        })
        //--
        // this._createMarkersFromData()
        //--
        window.addEventListener('pointerdown', (event)=>{
            this.onPointerDown(event)
        });
        window.addEventListener('pointermove', (event) => {
            this.onPointerMove(event);
        });
    }
    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------
    // EVENTS:
    updateRAF(){
        this.cities?.updateRAF()
        this.events?.updateRAF()
        this.shops?.updateRAF()
        // this.markers.forEach( marker => {
        //     marker.updateRAF()
        // })
    }
    onPointerDown(event) {
        // 1. Normalizar coordenadas del puntero (-1 a +1)
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 2. Actualizar el rayo con la cámara del escenario
        // Nota: Asegúrate de que 'this.scenario3D.camera' sea accesible
        this.raycaster.setFromCamera(this.pointer, this.stage.stageCamera.camera);

        // 3. Calcular intersecciones (solo contra los hijos del contenedor de marcadores)
        const intersects = this.raycaster.intersectObjects(this.markers_cont3D.children);

        if (intersects.length > 0) {
            const hoveredMesh = intersects[0].object;
            const cityId = hoveredMesh.userData.city_id;
            const city_type = hoveredMesh.userData.city_type;

            
            console.log("CLICK on:", cityId);
            console.log("city_type:", city_type);

            if(city_type == "city"){
                this.app.emitter.emit("onCityClicked", { id: cityId });
            }else if(city_type == "shop"){
                this.app.emitter.emit("onShopClicked", { id: cityId });
            }else if(city_type == "event"){
                this.app.emitter.emit("onEventClicked", { id: cityId });

            }


            // if (this.hoveredObjectId !== null) {
            this.tooltip.style.left = (event.clientX + 15) + 'px';
            this.tooltip.style.top = (event.clientY + 15) + 'px';
            // }
            if (this.hoveredObjectId !== cityId) {
                
                // Si antes estábamos sobre otro, disparamos rollout del anterior
                if (this.hoveredObjectId !== null) {
                    this._handleRollOut(this.hoveredObjectId);
                }

                this.hoveredObjectId = cityId;
                this._handleRollOver(cityId, hoveredMesh);
            }
        }else{
            console.log("CLICK on: nothing");
            if (this.hoveredObjectId !== null) {
                this._handleRollOut(this.hoveredObjectId);
                this.hoveredObjectId = null;
            }
        }
    }
    onPointerMove(event) {
        // 1. Normalizar coordenadas
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 2. Raycasting
        this.raycaster.setFromCamera(this.pointer, this.stage.stageCamera.camera);
        const intersects = this.raycaster.intersectObjects(this.markers_cont3D.children);

        

        if (intersects.length > 0) {
            const hoveredMesh = intersects[0].object;
            const cityId = hoveredMesh.userData.city_id;

            // Actualizar posición del tooltip si es visible
            if (this.hoveredObjectId !== null) {
                this.tooltip.style.left = (event.clientX + 15) + 'px';
                this.tooltip.style.top = (event.clientY + 15) + 'px';
            }

            // ¿Es un objeto nuevo? (ROLLOVER)
            if (this.hoveredObjectId !== cityId) {
                
                // Si antes estábamos sobre otro, disparamos rollout del anterior
                if (this.hoveredObjectId !== null) {
                    this._handleRollOut(this.hoveredObjectId);
                }

                this.hoveredObjectId = cityId;
                this._handleRollOver(cityId, hoveredMesh);
            }
        } else {
            // Si no hay intersecciones pero teníamos un objeto guardado (ROLLOUT)
            if (this.hoveredObjectId !== null) {
                this._handleRollOut(this.hoveredObjectId);
                this.hoveredObjectId = null;
            }
        }
    }

    _handleRollOver(cityId, mesh) {
        // // console.log("ROLLOVER en:", cityId);
        // document.body.style.cursor = 'pointer';
        // //--
        // //mesh.material.opacity = 1.0;
        // // Obtener los datos de la ciudad desde la instancia
        // const cityInstance = mesh.userData.parentInstance;
        // if (cityInstance && cityInstance.city) {
        //     this.tooltip.innerHTML = `<strong>${cityInstance.city.name || cityId}</strong>`;
        //     this.tooltip.style.display = 'block';
        // }
    }

    _handleRollOut(cityId) {
        // // console.log("ROLLOUT de:", cityId);
        // document.body.style.cursor = 'default';
        
        // // Si quieres restaurar la opacidad original de City3D:
        // //const marker = this.markers.find(m => m.city_id === cityId);
        // //if(marker) marker.mesh.material.opacity = 0.7; // u opacidad original
        // // Ocultar tooltip
        // this.tooltip.style.display = 'none';
    }
    //----------------------------------------------
    // PRIVATE:
    // _createMarkersFromData(){
    //     this.stage.stageData.array_cities.forEach( (cityItem) => {
    //         const city3D = new City3D({
    //             app: this.app,
    //             project: this.project,
    //             stage: this.stage,
    //             scenario3D: this.scenario3D,
    //             map3D: this,
    //             city_id: cityItem.id,
    //             parent3D: this.markers_cont3D,
    //         })
    //         this.markers.push(city3D)
    //     });    
    // }


    _create_map(){
        console.log("(Map3D._create_map)!")
        this.scenario3D.build_mesh("level1", this.map_cont3D)
        this.scenario3D.build_mesh("level2", this.map_cont3D)
        this.scenario3D.build_mesh("level3", this.map_cont3D)
        this.scenario3D.build_mesh("level4", this.map_cont3D)
    }
    // _create_devMap(){
    //     console.log("(Map3D._create_devMap)!")
    //     const texture = this.stage.loader.get_texture("map");
    //     // For Three.js > r152
    //     texture.colorSpace = THREE.SRGBColorSpace;
    //     const planeGeom = new THREE.PlaneGeometry(100, 100, 1, 1)
    //     const planeMat = new THREE.MeshBasicMaterial( {
    //         // color: 0xff0000,
    //         map: texture,
    //         side: THREE.DoubleSide,
    //         fog: false // Ignore scene fog
    //         // wireframe:trues
    //     });
    //     this.planeMesh = new THREE.Mesh( planeGeom, planeMat );
    //     // this.planeMesh.rotation.z = Math.PI/2 
    //     // this.planeMesh.rotation.x = - Math.PI /2
    //     this.parent3D.add( this.planeMesh );
    // }
    //----------------------------------------------
    // AUX:
    

  
}
export default Map3D