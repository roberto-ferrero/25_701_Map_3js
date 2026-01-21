import * as THREE from 'three';

class SphericalPanning {
    constructor(obj) {
        this.MAX_PAN_RADS = obj.maxPanRads || Math.PI / 4;
        
        // Reutilizamos objetos para evitar GC (Garbage Collection)
        this._offset = new THREE.Vector3();
        this._rotation = new THREE.Euler();
        this._matrix = new THREE.Matrix4();
        //--
        this.mouseV2 = new THREE.Vector2();
    }

    /**
     * Calcula la nueva posición de la cámara basada en el movimiento del ratón.
     * @param {THREE.Vector2} mouseV2 - Coordenadas (-1 a 1)
     * @param {THREE.Vector3} cameraPositionV3 - Posición actual cámara
     * @param {THREE.Vector3} targetPositionV3 - Posición del objetivo (lookAt)
     * @returns {THREE.Vector3} Nueva posición relativa/absoluta calculada
     */
    getPanRel(mouseX, mouseY, cameraPositionV3, targetPositionV3) {
        this.mouseV2.x = mouseX;
        this.mouseV2.y = mouseY;
        // 1. Obtener el vector desde el objetivo a la cámara
        this._offset.copy(cameraPositionV3).sub(targetPositionV3);
        
        // 2. Calcular ángulos basados en la entrada del ratón
        // El eje Y del ratón rota sobre el eje X de la cámara (Pitch)
        // El eje X del ratón rota sobre el eje Y de la cámara (Yaw)
        const angleX = -this.mouseV2.y * this.MAX_PAN_RADS;
        const angleY = -this.mouseV2.x * this.MAX_PAN_RADS;

        // 3. Crear matriz de rotación
        // Usamos el orden 'YXZ' para un comportamiento tipo gimbal estándar
        this._rotation.set(angleX, angleY, 0, 'YXZ');
        this._matrix.makeRotationFromEuler(this._rotation);

        // 4. Aplicar rotación al offset
        this._offset.applyMatrix4(this._matrix);

        // 5. Retornar la posición final (Target + Offset rotado)
        return new THREE.Vector3().addVectors(targetPositionV3, this._offset);
    }
}

export default SphericalPanning;