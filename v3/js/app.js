"use strict";

const app = (function () {

    const _elementos = {
        cargarPantalla: ".cargaPantalla",
        errorMensaje: ".alert-danger",
        opcionIndex: "#opcion-index",
        opcionQuery: "#opcion-query",
        chkIntentar: "#chk-intentar",
        textoBusqueda: "#textoBusqueda",
        codigoConsultora: "#codigoConsultora",
        codigoZona: "#codigoZona",
        personalizaciones: "#personalizaciones",
        diaFacturacion: "#diaFacturacion",
        chkSociaEmpresaria: "#sociaEmpresaria",
        chkSuscripcionActiva: "#suscripcionActiva",
        chkMdo: "#mdo",
        chkRd: "#rd",
        chkRdi: "#rdi",
        chkRdr: "#rdr",
        btnBuscar: "#btnBuscar",
        btnLimpiar: "#btnLimpiar"
    }

    const _funciones = {
        InicializarEventos: function () {
            $(document).on("click", _elementos.btnBuscar, _eventos.buscar);
        },

        cargando: function (val) {
            return val ? $(_elementos.cargarPantalla).fadeIn("slow") : $(_elementos.cargarPantalla).fadeOut("slow");
        },

        ejecutarQuery: function (query) {
            let indice = _funciones.obtenerIndice();

            return $.ajax({
                url: `${config.elastic.urlES}/${indice}/_search`,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(query)
            });
        },

        construirQueryAvanzado: function () {
            let personalizaciones = config.constantes.Personalizacion;
            let must = _funciones.queryParametrosEnDuro();
            let parametros = _funciones.obtenerParametros();

            _funciones.queryPersonalizacionesCondiciones(parametros, personalizaciones, must);

            let multi_match = [];//parametros.textoBusqueda === "" || parametros.textoBusqueda === null ? [] : queryMultiMatch(parametros.textoBusqueda);

            let retorno = {
                from: 0,
                size: 1000,
                //sort: parametrosEntrada.sortValue,
                query: {
                    bool: {
                        "must": multi_match,
                        filter: must
                    }
                }
            };
            console.log(JSON.stringify(retorno));
        },

        obtenerIndice: function () {
            return $(_elementos.opcionIndex).find("option:selected").val();
        },

        obtenerMultiMatch: function (opcion) {
            let query = null;
            let textoBusqueda = $(_elementos.textoBusqueda).val();

            switch (opcion) {
                case "1":
                    query = getQuery1(textoBusqueda)
                    break;
                case "2":
                    query = getQuery2(textoBusqueda)
                    break;
                case "3":
                    query = getQuery3(textoBusqueda)
                    break;
                case "4":
                    query = getQuery4(textoBusqueda)
                    break;
            }

            return query;
        },

        queryParametrosEnDuro: function () {
            return [{
                term: {
                    "activo": true
                }
            },
            {
                range: {
                    "precio": {
                        "gt": 0
                    }
                }
            }];
        },

        queryPersonalizacionesCondiciones: function (parametros, dummyPersonalizaciones, retorno) {
            let should = [];
            let personalizaciones = dummyPersonalizaciones;

            personalizaciones = filtroShowroom.filtrar(parametros, personalizaciones, should);
            personalizaciones = filtroOfertaParaTi.filtrar(parametros, personalizaciones, should);
            personalizaciones = filtroOfertaDelDia.filtrar(parametros, personalizaciones, should);
            personalizaciones = filtroLanzamiento.filtrar(parametros, personalizaciones);
            personalizaciones = filtroGuiaNegocioDigital.filtrar(parametros, personalizaciones);

            _funciones.queryPersonalizaciones(parametros, personalizaciones, should);

            retorno.push({
                bool: {
                    should
                }
            });
        },

        queryPersonalizaciones: function (parametros, personalizaciones, should) {
            let consultoraX = config.constantes.consultoraX,
                consultoraY = config.constantes.consultoraY,
                consultora0 = config.constantes.consultora0;

            personalizaciones.forEach(element => {

                let isDummy = isDummyFunction(parametros.personalizaciones, element);
                let must_dummy = [];

                if (isDummy) {
                    must_dummy.push({
                        term: {
                            "tipoPersonalizacion": element
                        }
                    });

                    if (element === "CAT" || element === "LIQ" || element === "HV") {
                        must_dummy.push({
                            term: {
                                "codigoConsultora": consultora0
                            }
                        });
                    } else {
                        must_dummy.push({
                            terms: {
                                "codigoConsultora": [consultoraX, consultoraY]
                            }
                        });
                    }

                    should.push({
                        bool: {
                            "must": must_dummy
                        }
                    });

                } else {
                    must_dummy.push({
                        term: {
                            "tipoPersonalizacion": element
                        }
                    });
                    must_dummy.push({
                        terms: {
                            "codigoConsultora": [parametros.codigoConsultora, consultoraY, consultora0]
                        }
                    });

                    should.push({
                        bool: {
                            "must": must_dummy
                        }
                    });
                }
            });
        },

        obtenerParametros: function () {
            return {
                codigoConsultora: $(_elementos.codigoConsultora).val(),
                codigoZona: $(_elementos.codigoZona).val(),
                sociaEmpresaria: $(_elementos.sociaEmpresaria).is(":checked") ? "true" : "false",
                suscripcionActiva: $(_elementos.suscripcionActiva).is(":checked") ? "true" : "false",
                mdo: $(_elementos.chkMdo).is(":checked") ? "true" : "false",
                rd: $(_elementos.chkRd).is(":checked") ? "true" : "false",
                rdi: $(_elementos.chkRdi).is(":checked") ? "true" : "false",
                rdr: $(_elementos.chkRdr).is(":checked") ? "true" : "false",
                diaFacturacion: $(_elementos.diaFacturacion).val(),
                personalizaciones: $(_elementos.personalizaciones).val() === "" ? "XYZ" : $(_elementos.personalizaciones).val()
            }
        }
    }

    const _eventos = {
        buscar: function () {
            
            _funciones.construirQuery();
        }
    }

    function inicializar() {
        _funciones.InicializarEventos();
        _funciones.cargando(false);
    }

    return {
        inicializar: inicializar
    }

})();

$(document).ready(function () {
    app.inicializar();
});