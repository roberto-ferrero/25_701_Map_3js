import gsap from "gsap"
import * as THREE from 'three';
// import EasedOutValue from '../../../core/utils/EasedOutValue';

class DragMovingMouse {
    constructor(obj) {
        this.app = obj.app;
        this.project = obj.project;
        this.stage = obj.stage;
        this.domElement = obj.domElement;
        
        this.DRAG_POSITION = new THREE.Vector2(0, 0);
        // this.EASED_DRAG_POSITION_X = new EasedOutValue(0, 0.1, 0.001, this.app.emitter, "onUpdateRAF");
        // this.EASED_DRAG_POSITION_Y = new EasedOutValue(0, 0.1, 0.001, this.app.emitter, "onUpdateRAF");
        
        // --- Gestión de Punteros para Mobile ---
        this.activePointers = new Map(); // Para rastrear múltiples dedos
        this.prevPinchDistance = -1;
        
        this.isDragging = false;
        this.pointerStart = new THREE.Vector2();
        this.positionStart = new THREE.Vector2();

        this.app.emitter.on("onAppZoomChange", ()=>{
            this.reset();
        })
        

        this._initListeners();
    }

    _initListeners() {
        this.domElement.addEventListener('pointerdown', (event)=>{
            gsap.delayedCall(0.0, ()=>{
                this.onPointerDown(event)
            });
        });
        this.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
        this.domElement.addEventListener('pointerup', this.onPointerUp.bind(this));
        this.domElement.addEventListener('pointercancel', this.onPointerUp.bind(this)); // Importante para mobile

        this.domElement.addEventListener('contextmenu', (e) => e.preventDefault()); // Previene el menú contextual al hacer clic derecho
        
        // CSS crítico para que el navegador no interfiera con el zoom nativo
        this.domElement.style.touchAction = 'none';
    }

    onPointerDown(event) {
        console.log("(DragMovingMouse.onPointerDown) event.pointerId:", event.pointerId+"/"+this.activePointers.size);
        const currentMode = this.stage.get_MODE();
        console.log("   MODE:", currentMode);
        if(currentMode === "IDLE" && this.activePointers.size == 0){
            console.log("START DRAG. MODE IS IDLE");
            // Añadimos el puntero al mapa
            this.reset()
            this.activePointers.set(event.pointerId, event);

            if (this.activePointers.size === 1) {
                this.isDragging = true;
                this.pointerStart.set(event.clientX, event.clientY);
                this.positionStart.copy(this.DRAG_POSITION);
            }
            
            this.domElement.setPointerCapture(event.pointerId);
            this.stage.emitter.emit("onStartDragMoving");
        }else if(this.activePointers.size == 1){
            console.log("ADDING POINTER FOR ZOOM. MODE IS DRAGGING");
            // this.reset()s
            this.activePointers.set(event.pointerId, event);
            this.isDragging = false;
            this.pointerStart.set(event.clientX, event.clientY);
            this.positionStart.copy(this.DRAG_POSITION);
            this.domElement.setPointerCapture(event.pointerId);
            this.stage.emitter.emit("onStopDragMoving");
        }else{
            console.log("   NO DRAG. MODE IS NOT IDLE OR DRAGGING");
        }
    }

    onPointerMove(event) {
        // Actualizamos la posición del puntero en nuestro mapa
        if (!this.activePointers.has(event.pointerId)) return;
        console.log("(DragMovingMouse.onPointerMove) event.pointerId:", event.pointerId+"/"+this.activePointers.size);
        this.activePointers.set(event.pointerId, event);

        // CASO 1: Pinch-to-Zoom (2 dedos)
        if (this.activePointers.size === 2) {
            this.isDragging = false; // Deshabilitamos el drag mientras hacemos zoom
            this._handlePinchZoom();
            return;
        }

        // CASO 2: Drag (1 dedo) - Tu lógica original
        if (this.isDragging && this.activePointers.size === 1) {

            // Ajuste de sensibilidad dinámico
            // En móviles (touch) solemos necesitar un multiplicador distinto
            const isTouch = event.pointerType === 'touch';
            // const mobileMultiplier = 7.5; // Ajusta según el "feeling" que busques

            //console.log("this.app.size.CURRENT.aspect:", this.app.size.CURRENT.aspect);
            
            // let zoom_mod = [0.072, 0.0400, 0.0285, 0.0150, 0.0100];
            let zoom_mod = this.stage.stageData.settings.drag_factors;
            let responsive_mod_x = 947/this.app.size.CURRENT.height;

            let responsive_mod_y = 1920/this.app.size.CURRENT.width;

            let deltaMod_x = zoom_mod[this.stage.CURRENT_ZOOM]*responsive_mod_x;
            let deltaMod_y = zoom_mod[this.stage.CURRENT_ZOOM]*responsive_mod_x;
            
            // if (isTouch){
                // deltaMod_x *= mobileMultiplier;
                // deltaMod_y *= 4;
                
            // }
            
            const deltaX = (event.clientX - this.pointerStart.x) * deltaMod_x;
            const deltaY = (event.clientY - this.pointerStart.y) * deltaMod_y;
            // console.log("deltaX, deltaY: ", deltaX, deltaY);
            let posX = this.positionStart.x - deltaX;
            if(posX > 40) posX = 40;
            if(posX < -40) posX = -40;
            let posY = this.positionStart.y - deltaY;
            if(posY > 35) posY = 35;
            if(posY < -35) posY = -35;
            
            // Actualizamos la posición de drag
            this.DRAG_POSITION.x = posX;
            this.DRAG_POSITION.y = posY;
            // this.EASED_DRAG_POSITION_X.set(posX);
            // this.EASED_DRAG_POSITION_Y.set(posY);
        }
    }

    _handlePinchZoom() {
        const pointers = Array.from(this.activePointers.values());
        const p1 = pointers[0];
        const p2 = pointers[1];

        // Calculamos la distancia actual entre los dos dedos (hipotenusa)
        const currentDistance = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);

        if (this.prevPinchDistance > 0) {
            const delta = currentDistance - this.prevPinchDistance;

            if (Math.abs(delta) > 1) { // Pequeño umbral de tolerancia
                if (delta > 0) {
                    console.log("👉 [GESTO]: AMPLIAR (Zoom In)", delta.toFixed(2));
                    // Aquí podrías llamar a una función de la Stage para cambiar el zoom
                    this.stage.zoomIn()
                } else {
                    console.log("👈 [GESTO]: REDUCIR (Zoom Out)", delta.toFixed(2));
                    this.stage.zoomOut()
                }
            }
        }

        this.prevPinchDistance = currentDistance;
    }
    
    onPointerUp(event) {
        if(this.stage.get_MODE() == "DRAGGING"){
            this.activePointers.delete(event.pointerId);
            
            if (this.activePointers.size < 2) {
                this.prevPinchDistance = -1; // Resetear distancia de zoom
            }
            
            if (this.activePointers.size === 0) {
                this.isDragging = false;
            }
            
            this.domElement.releasePointerCapture(event.pointerId);
            this.reset();
            this.stage.emitter.emit("onStopDragMoving");
        }
    }

    reset() {
        this.DRAG_POSITION.set(0, 0);
        // this.EASED_DRAG_POSITION_X.setNoEasing(0);
        // this.EASED_DRAG_POSITION_Y.setNoEasing(0);
        this.activePointers.clear();
        this.prevPinchDistance = -1;
    }
}

export default DragMovingMouse;