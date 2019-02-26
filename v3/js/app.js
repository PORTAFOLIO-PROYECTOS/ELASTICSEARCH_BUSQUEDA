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
        construirQuery: function () {

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
        }
    }

    const _eventos = {
        buscar: function () {
            alert("busqueda");
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