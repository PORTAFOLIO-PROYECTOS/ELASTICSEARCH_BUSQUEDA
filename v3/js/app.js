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
        btnLimpiar: "#btnLimpiar",
        btnMostarBusquedaAvanzada: "#btnMostarBusquedaAvanzada",
        btnBuscarAvanzado: "#btnBuscarAvanzado",
        btnCancelarAvanzado: "#btnCancelarAvanzado",
        tablaResultados: "#tabladatos",
        contadorResultados: "#contadorResultados",
        seccionButtons: "#seccionButtons",
        searchAdvanceSeccion: "#searchAdvance"
    }

    const _funciones = {
        InicializarEventos: function () {
            $(document).on("click", _elementos.btnBuscarAvanzado, _eventos.buscarAvanzado);
            $(document).on("click", _elementos.btnMostarBusquedaAvanzada, _eventos.botonBusquedaAvanzada);
            $(document).on("click", _elementos.btnCancelarAvanzado, _eventos.botonCancelarAvanzado);
            _eventos.valoresDefault();
        },

        error: function (val) {
            return val ? $(_elementos.errorMensaje).fadeIn("slow") : $(_elementos.errorMensaje).fadeOut("slow");
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

            let multi_match = _funciones.obtenerMultiMatch()

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
            return retorno;
        },

        obtenerIndice: function () {
            return $(_elementos.opcionIndex).find("option:selected").val();
        },

        obtenerMultiMatch: function () {
            let query = null;
            let opcion = $(_elementos.opcionQuery).find("option:selected").val();
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
        },

        obtenerDatosHits: function (data) {
            var documentos = [];
            var i = 0;

            for (const key in data.hits.hits) {
                const res = data.hits.hits[key];
                const element = res._source
                i += 1;

                let documentoResumido = {
                    space: '',
                    top: i,
                    id: res._id,
                    textoBusqueda: element.textoBusqueda,
                    marcas: JSON.stringify(element.marcas),
                    categorias: JSON.stringify(element.categorias),
                    grupoArticulos: JSON.stringify(element.grupoArticulos),
                    lineas: JSON.stringify(element.lineas),
                    seccion: element.seccion,
                    tipoPersonalizacion: element.tipoPersonalizacion,
                    score: res._score,
                    codigoEstrategia: element.codigoEstrategia,
                    cuv: element.cuv
                };

                documentos.push(documentoResumido);
            }

            return documentos;
        },

        llenarTabla: function (datos) {
            return $(_elementos.tablaResultados).DataTable({
                data: datos,
                searching: false,
                bDestroy: true,
                responsive: {
                    details: {
                        type: 'column'
                    }
                },
                columnDefs: [{
                    className: 'control',
                    orderable: false,
                    targets: 0
                }],
                order: [1, 'asc'],
                columns: [
                    { data: 'space' },
                    { data: 'top' },
                    { data: 'textoBusqueda' },
                    { data: 'score' },
                    { data: 'cuv' },
                    { data: 'tipoPersonalizacion' },
                    { data: 'marcas' },
                    { data: 'categorias' },
                    { data: 'grupoArticulos' },
                    { data: 'lineas' },
                    { data: 'seccion' },
                    { data: 'codigoEstrategia' }
                ]
            });
        }
    }

    const _eventos = {
        buscarAvanzado: function () {
            try {
                _funciones.cargando(true);
                _funciones.error(false);

                let query = _funciones.construirQueryAvanzado();
                _funciones.ejecutarQuery(query).then((r) => {
                    $(_elementos.contadorResultados).text("Documentos encontrados: " + r.hits.total);
                    let datos = _funciones.obtenerDatosHits(r);
                    _funciones.llenarTabla(datos);
                    _funciones.cargando(false);
                }, (e) => {
                    console.error(e);
                    _funciones.error(true);
                    _funciones.cargando(false);
                });

            } catch (error) {
                console.log("error", error);
                _funciones.cargando(false);
                _funciones.error(true);
            }
        },

        botonBusquedaAvanzada: function () {
            $(_elementos.seccionButtons).fadeOut("slow");
        },

        botonCancelarAvanzado: function () {
            $(_elementos.seccionButtons).fadeIn("slow");
            $(_elementos.searchAdvanceSeccion).collapse("hide");
        },

        valoresDefault: function () {
            $(_elementos.codigoConsultora).val("043370634");
            $(_elementos.codigoZona).val("0825");
            $(_elementos.personalizaciones).val("OPM");
            $(_elementos.diaFacturacion).val("-10");
            $(_elementos.sociaEmpresaria).attr('checked', false);
            $(_elementos.chkSuscripcionActiva).attr('checked', true);
            $(_elementos.chkMdo).attr('checked', true);
            $(_elementos.chkRd).attr('checked', true);
            $(_elementos.chkRdi).attr('checked', false);
            $(_elementos.chkRdr).attr('checked', false);
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