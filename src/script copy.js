import './style.css';
import gsap from "gsap"
import ScrollTrigger from 'gsap/ScrollTrigger';
import "fpsmeter" // Asumo que esto añade FPSMeter a window globalmente
import Platform from './Platform';

gsap.registerPlugin(ScrollTrigger);

// Función auxiliar interna (no expuesta)
function __get_mobileMode(){
    // Nota: asegúrate que el elemento existe antes de medirlo
    const el = document.querySelector('#webgl_app');
    if(!el) return false;
    
    const width = el.offsetWidth;
    const breakpoint = 750;
    return width <= breakpoint;
}

// Objeto principal que exportaremos
const Library = {
    
    // Esta es la función que llamará el cliente
    init: (config) => {
        console.log("Inicializando PandoraMap...", config);

        // 1. Lógica de UI / Mobile (movida aquí dentro para que corra al iniciar)
        if(__get_mobileMode()){
            console.log("*** Mobile Mode");
            document.querySelector('#navigation')?.classList.add('hidden');
        } else {
            console.log("*** Desktop Mode");
            document.querySelector('#navigation_mobile')?.classList.add('hidden');
        }

        // 2. Instanciar la Plataforma
        // Usamos la config del usuario o defaults si faltan
        window.platform = new Platform({
            $container: config.$container || document.querySelector('#webgl_app'),
            $mouseEvents: config.$mouseEvents || document.querySelector('#webgl_app'),
            loader_pathPrefix: config.loader_pathPrefix || "./",
        });

        // 3. Gestión del FPSMeter (Opcional: solo si quieres mantenerlo)
        // Lo movemos aquí dentro para no tener un loop corriendo sin app
        const meter = new FPSMeter({ position: 'fixed' });
        
        function update_RAF(){
            meter.tick();
            window.requestAnimationFrame(update_RAF);
        }
        update_RAF(); // Arrancamos el loop del meter

        return window.platform; // Devolvemos la instancia por si el cliente la quiere
    }
};

// Exportamos el objeto para que Webpack lo asigne a window.PandoraMap
export default Library;