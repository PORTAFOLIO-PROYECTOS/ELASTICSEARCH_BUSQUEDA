"use strict";

const filtroOfertaParaTi = (function () {

    function filtrar(parametros, personalizaciones, filtro) {
        let personalizacion = personalizaciones;
        if (!config.flags.logicaOPT) return personalizacion;

        let must = [],
            consultoraX = config.constantes.consultoraX,
            consultoraY = config.constantes.consultoraY,
            consultora0 = config.constantes.consultora0,
            RD = (parametros.rd === "1" || parametros.rd.toLowerCase() === "true") ? true : false,
            SuscripcionActiva = (parametros.suscripcionActiva === "1" || parametros.suscripcionActiva.toLowerCase() === "true") ? true : false,
            MDO = (parametros.mdo === "1" || parametros.mdo.toLowerCase() === "true") ? true : false,
            RDI = (parametros.rdi === "1" || parametros.rdi.toLowerCase() === "true") ? true : false,
            isDummyOPM = isDummy(parametros.personalizaciones, "OPM"),
            isDummyPAD = isDummy(parametros.personalizaciones, "PAD");

        if (isDummyOPM && isDummyPAD) {
            must.push({ terms: { "codigoConsultora": [consultoraX, consultoraY] } });
        } else {
            must.push({ terms: { "codigoConsultora": [parametros.codigoConsultora, consultoraY, consultora0] } });
        }

        if (RD && MDO && SuscripcionActiva) {
            return personalizacion.filter(per => per !== "OPT");
        }

        if (RD && MDO && !SuscripcionActiva) {

            must.push({ terms: { "tipoPersonalizacion": ["OPM", "PAD"] } });
            must.push({ term: { "revistaDigital": "0" } });

            filtro.push({ bool: { must } });

            personalizacion = personalizacion.filter(per => per !== "OPM");
            personalizacion = personalizacion.filter(per => per !== "PAD");
            return personalizacion.filter(per => per !== "OPT");

        }

        if (RD && !MDO && SuscripcionActiva) {
            return personalizacion.filter(per => per !== "OPT");
        }

        if (RD && !MDO && !SuscripcionActiva) {
            personalizacion = personalizacion.filter(per => per !== "OPM");
            return personalizacion.filter(per => per !== "PAD");
        }

        if (RDI) {
            personalizacion = personalizacion.filter(per => per !== "OPM");
            return personalizacion.filter(per => per !== "PAD");
        }

        return personalizacion;
    }

    return {
        filtrar: filtrar
    };

})();