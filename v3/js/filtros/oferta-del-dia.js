"use strict";

const filtroOfertaDelDia = (function () {

    function filtrar(parametros, personalizacion, filtro) {

        if (!config.flags.logicaODD) return personalizacion;

        let consultoraX = config.constantes.consultoraX,
            consultoraY = config.constantes.consultoraY,
            consultora0 = config.constantes.consultora0,
            isDummy = isDummyFunction(parametros.personalizaciones, "ODD"),
            must = [
                { term: { "tipoPersonalizacion": "ODD" } },
                { term: { "diaInicio": parametros.diaFacturacion } }
            ];

        if (isDummy) {
            must.push({ terms: { "codigoConsultora": [consultoraX, consultoraY] } });
        } else {
            must.push({ terms: { "codigoConsultora": [parametros.codigoConsultora, consultoraY, consultora0] } });
        }

        filtro.push(
            {
                bool: {
                    must
                }
            }
        );

        return personalizacion.filter(per => per !== "ODD");
    }

    return {
        filtrar: filtrar
    };

})();