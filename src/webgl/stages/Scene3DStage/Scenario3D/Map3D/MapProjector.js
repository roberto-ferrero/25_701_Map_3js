//import gsap from "gsap"
//import * as THREE from 'three'

class MapProjector{
    constructor(obj) {
        this.app = obj.app;
        // CONFIGURACIÓN BASADA EN TU IMAGEN (Aproximada)
        // ----------------------------------------------------
        // 1. ¿Qué longitud se ve como una línea perfectamente vertical en el mapa?
        // En tu mapa, parece estar alrededor de 4° Oeste (-4.0).
        this.centralMeridian = -4.0 * (Math.PI / 180);

        // 2. ¿Qué latitud es el centro "focal" de la distorsión?
        // Para UK suele ser 54°N o cerca. Determina la curvatura del cono.
        this.standardParallel = 54.0 * (Math.PI / 180);
        
        // 3. Constantes de Calibración (Scale y Offset)
        // Estos valores transforman la proyección matemática abstracta a tu espacio UV 0-1.
        // Tendrás que ajustarlos ligeramente probando con puntos conocidos (ej. Londres).
        this.scale = 5.364; 
        this.offsetX = 0.518;
        this.offsetY = -3.363;

        //--
    }
    //----------------------------------------------
    // PUBLIC:
    foo(){
        console.log("foo");

    }

    initGUI(gui, onUpdate) {
        const folder = gui.addFolder("Map Projector");
        
        // Adjust min/max/step values as needed for your specific map sensitivity
        folder.add(this, 'scale', 4, 6).step(0.0001).name('Scale').onChange(onUpdate);
        folder.add(this, 'offsetX', 0, 1).step(0.0001).name('Offset X').onChange(onUpdate);
        folder.add(this, 'offsetY', -5, -2).step(0.0001).name('Offset Y').onChange(onUpdate);
        
        // Add a manual "Redraw" button if you want to trigger it explicitly, 
        // though .onChange handles it automatically.
        const params = { redraw: onUpdate };
        folder.add(params, 'redraw').name('Force Redraw');

        folder.open();
    }

    /**
     * Convierte Lat/Lon a coordenadas UV de la imagen (0 a 1)
     * @param {number} lat - Latitud en grados
     * @param {number} lon - Longitud en grados (Greenwich = 0)
     * @returns {object} {x, y} - Coordenadas normalizadas 0-1 (Top-Left es 0,0)
     */
    geoToMap(lat, lon) {
        // Conversión a radianes
        const rLat = lat * (Math.PI / 180);
        const rLon = lon * (Math.PI / 180);

        // --- MATEMÁTICA DE PROYECCIÓN CÓNICA ---
        
        // n: Factor de convergencia del cono (sin(lat_referencia))
        const n = Math.sin(this.standardParallel);
        
        // F: Factor de escala en la latitud de referencia (simplificado para visualización)
        // Para precisión topográfica es más complejo, pero para WebGL esto basta.
        const F = Math.cos(this.standardParallel) * Math.pow(Math.tan(Math.PI / 4 + this.standardParallel / 2), n) / n;
        
        // rho: Radio polar (distancia desde el vértice del cono)
        // A mayor latitud, menor radio.
        const rho = F * Math.pow(1 / Math.tan(Math.PI / 4 + rLat / 2), n);
        
        // theta: Ángulo en el cono
        const theta = n * (rLon - this.centralMeridian);

        // Coordenadas Cartesianas Proyectadas (Espacio abstracto)
        // x crece hacia el este, y crece hacia el norte
        const xProj = rho * Math.sin(theta);
        const yProj = rho * Math.cos(theta); // En LCC estándar, el polo es el centro (0,0)

        // --- NORMALIZACIÓN A ESPACIO IMAGEN (UV 0-1) ---
        
        // Invertimos Y porque en la proyección rho apunta al centro del cono (Polo Norte),
        // pero en coordenadas de pantalla/imagen (0,0) suele ser arriba-izquierda.
        // Ajustamos con scale y offset.
        
        const u = (xProj * this.scale) + this.offsetX;
        const v = 1.0 - ((this.offsetY - yProj) * this.scale * -1); // Pequeño truco de inversión
        
        // console.log("u,v: ", u, v);s
        // Simplificación visual más directa para tu ajuste:
        // x final = xProyectada * escala + centroX
        // y final = yProyectada * escala + centroY
        
        const finalX = (xProj * this.scale) + this.offsetX;
        const finalY = 1.0 - ((yProj * this.scale) +this.offsetY); // El 0.9 es un offset vertical base aproximado

        return { x: finalX, y: finalY };
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default MapProjector