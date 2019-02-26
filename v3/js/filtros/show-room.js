"use strict";

const filtroShowroom = (function () {

    function filtrar(parametros, personalizacion, filtro) {

        if (!config.flags.logicaShowRoom) return personalizacion;

        let consultoraX = config.constantes.consultoraX,
            consultoraY = config.constantes.consultoraY,
            consultora0 = config.constantes.consultora0,
            isDummy = isDummyFunction(parametros.personalizaciones, "SR"),
            must = [];

        if (isDummy) {
            must.push({
                terms: { "codigoConsultora": [consultoraX, consultoraY] }
            });
        } else {
            must.push({
                terms: { "codigoConsultora": [parametros.codigoConsultora, consultoraY, consultora0] }
            });
        }

        if (((parametros.rd === "1" || parametros.rd.toLowerCase() === "true") &&
            (parametros.mdo === "1" || parametros.mdo.toLowerCase() === "true") &&
            (parametros.suscripcionActiva === "0" || parametros.suscripcionActiva.toLowerCase() === "false"))
            || (parametros.rd === "0" || parametros.rd.toLowerCase() === "false")) {

            must.push({
                term: { "tipoPersonalizacion": "SR" }
            });

            must.push({
                term: { "revistaDigital": 0 }
            });

            filtro.push({
                bool: {
                    must
                }
            });

            return personalizacion.filter(per => per !== "SR");
        }

        return personalizacion;
    }

    return {
        filtrar: filtrar
    };

})();