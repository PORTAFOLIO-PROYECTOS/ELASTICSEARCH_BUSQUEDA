"use strict";

const app = (function () {

    const _config = {
        urlES: "https://vpc-es-sbsearch-qa-6lqloaf2kfljixcaekbyqxu2aa.us-east-1.es.amazonaws.com",
        sizeES: 250
    }

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