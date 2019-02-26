"use strict";

const filtroGuiaNegocioDigital = (function () {

    function filtrar(parametros, personalizacion) {

        if(!config.flags.logicaGN) return personalizacion;

        if (parametros.sociaEmpresaria === "1" || parametros.sociaEmpresaria.toLowerCase() === "true") {
            return personalizacion.filter(per => per !== "GND"); 
        }

        if ((parametros.sociaEmpresaria === "0" || parametros.sociaEmpresaria.toLowerCase() === "false") && 
            (parametros.suscripcionActiva === "1" || parametros.suscripcionActiva.toLowerCase() === "true")) {

                return personalizacion.filter(per => per !== "GND"); 
        }

        return personalizacion; 
    }

    return {
        filtrar: filtrar
    };

})();