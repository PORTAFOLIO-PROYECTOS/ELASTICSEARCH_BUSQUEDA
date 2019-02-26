"use strict";

const filtroLanzamiento = (function() {

    function filtrar(parametros, personalizacion) {
        if (!config.flags.logicaLanzamiento) return personalizacion;

        if (parametros.suscripcionActiva === "0" || parametros.suscripcionActiva.toLowerCase() === "false") {
            return personalizacion.filter(per => per !== "LAN");
        }

        return personalizacion;
    }

    return {
        filtrar: filtrar
    };

})();