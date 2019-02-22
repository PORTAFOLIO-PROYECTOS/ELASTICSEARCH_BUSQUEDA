'use strict'

let url = 'https://vpc-es-sbsearch-qa-6lqloaf2kfljixcaekbyqxu2aa.us-east-1.es.amazonaws.com',
    size = 250;

function getElasticResult(index, texto, opcion) {
    let query = null;
    switch (opcion) {
        case "1":
            query = getQuery1(texto);
            break;
        case "2":
            query = getQuery2(texto);
            break;
        case "3":
            query = getQuery3(texto);
            break;
        case "4":
            query = getQuery4(texto);
            break;
    }
    //let body = cuerpo(texto);
    console.log(JSON.stringify(query));
    return $.ajax({
        url: `${url}/${index}/_search`,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(query)
    });
}

function llenaTabla(r) {
    var documentos = [];
    var i = 0;
    
    for (const key in r.hits.hits) {
        const res = r.hits.hits[key];
        const element = res._source
        i += 1;

        let documentoResumido = {
            space: '',
            top: i,
            id: res._id,
            textoBusqueda: element.textoBusqueda,
            marcas: element.marcas,
            categorias: element.categorias,
            grupoArticulos: element.grupoArticulos,
            lineas: element.lineas,
            seccion: element.seccion,
            tipoPersonalizacion: element.tipoPersonalizacion,
            score: res._score,
        };

        documentos.push(documentoResumido);
    }
    
    return documentos;
}
function showCount(count) {
    $("#th-contador").text("Documentos encontrados: ".concat(count));
}

function ejecutarBusqueda(texto, tbl, index, opcion) {
    cargando(true);
    $('.alert-danger').fadeOut('slow');
    getElasticResult(index, texto, opcion).then((r) => {
        var tabla = llenaTabla(r);
        console.log("Data", tabla);
        showCount(r.hits.total);

        $('#tabladatos').DataTable( {
            data: tabla,
            searching: false,
            responsive: {
                details: {
                    type: 'column'
                }
            },
            columnDefs: [ {
                className: 'control',
                orderable: false,
                targets:   0
            } ],
            order: [ 1, 'asc' ],
            columns: [
                { data: 'space'},
                { data: 'top' },
                { data: 'textoBusqueda' },
                { data: 'score' },
                { data: 'marcas' },
                { data: 'categorias'},
                { data: 'grupoArticulos'},
                { data: 'lineas'},
                { data: 'seccion'},
                { data: 'tipoPersonalizacion'}
            ]
        } );
        //$('#' + tbl).html(tabla);
        cargando(false);
    }, (e) => {
        console.error(e);
        $('.alert-danger').fadeIn('slow');
        cargando(false);
    });
}

function getSelectedIndex() {
    let index = $('#opcion-index').find("option:selected").val();
    console.log(index);
    return index;
}

function resultado() {
    var textoBusqueda = $('#textoBusqueda').val();
    if (textoBusqueda == '') return false;

    let opcion = $('#opcion-query').find("option:selected").val();

    ejecutarBusqueda(textoBusqueda, 'resultado', getSelectedIndex(), opcion);
    if (!$('#tabla-datos tbody tr').length) {
        if ($('#chk-intentar').is(":checked")) {
            opcion = "4";
            ejecutarBusqueda(textoBusqueda, 'resultado', getSelectedIndex(), opcion);
        }
    }
}

function limpiar(elemento, texto) {
    $('#' + elemento).html('');
    $('#' + texto).val('');
    $('#' + texto).focus();
    $('th[name=th-contador]').text("Documentos encontrados: 0");
}

function cargando(val) {
    if (val) {
        $('.cargaPantalla').fadeIn('slow');
    } else {
        $('.cargaPantalla').fadeOut('slow');
    }
}