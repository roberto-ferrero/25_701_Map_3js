import './style.css';
import gsap from "gsap"
import ScrollTrigger from 'gsap/ScrollTrigger';

import Platform from './Platform';

gsap.registerPlugin(ScrollTrigger);


const Library = {
    init: (config) => {
        console.log("Inicializando PandoraMap...", config);

        // window.platform = new Platform({
        //     $container: config.$container || document.querySelector('#webgl_app'),
        //     $mouseEvents: config.$mouseEvents || document.querySelector('#webgl_app'),
        //     loader_pathPrefix: config.loader_pathPrefix || "./",
        //     cities_dataPath: "./data/cities.json",
        //     shops_dataPath: "./data/shops.json",
        //     events_dataPath: "./data/events.json"
        // });

        window.platform = new Platform({
            $container: config.$container,
            $mouseEvents: config.$mouseEvents,
            loader_pathPrefix: config.loader_pathPrefix,
            cities_dataPath: config.cities_dataPath,
            shops_dataPath: config.shops_dataPath,
            events_dataPath: config.events_dataPath
        });

                
        function update_RAF(){
            //meter.tick();
            window.requestAnimationFrame(update_RAF);
        }
        update_RAF();

        return window.platform; 
    }
};

// 2. ASIGNACIÓN MANUAL: Nos aseguramos de que existe en window sí o sí
window.PandoraMap = Library;

// Mantenemos el export por si acaso, pero la línea de arriba es la que salva el día
export default Library;