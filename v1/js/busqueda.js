'use strict'

let url = 'https://vpc-es-sbsearch-qas-u4pht5gehqu3pmsc4x5srachwu.us-east-1.es.amazonaws.com',
    edge310 = 'dev_producto_cr_201816',
    ngram310 = 'dev_producto_cr_201816';

function cuerpo(textoBusqueda) {
    return {
		"size": 100,
		"query": {
			"bool": {
				"must": {
					"multi_match": {
						"query": textoBusqueda,
						"type": "best_fields",
						"fields": ["textoBusqueda.ngram^2", "marcas.ngram", "categorias.ngram", "lineas.ngram", "grupoArticulos.ngram"]
					}
				},
				"filter":{
					"term": {"codigoConsultora": "YYYYYYYYY"}
				}
			}
		}
	};
}

function Buscador(index, texto) {
    let body = cuerpo(texto);
	console.log(JSON.stringify(body));
    return $.ajax({
        url: `${url}/${index}/_doc/_search`,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(body)
    });
}

function llenaTabla(r) {
    var tabla = '';
    var i = 0;

    for (const key in r.hits.hits) {
        const res = r.hits.hits[key];
        const element = res._source
        i += 1;
        tabla += '<tr>';
        tabla += `<td>${i}</td>`;
        tabla += `<td>${element.textoBusqueda}</td>`;
        tabla += `<td class="text-center">${element.tipoPersonalizacion}</td>`;
        tabla += `<td class="text-right">${res._score}</td>`;
        tabla += '</tr>';
    }

    return tabla;

}

function ejecutarBusqueda(texto, tbl, index) {
    cargando(true);
    $('.alert-danger').fadeOut('slow');
    Buscador(index, texto).then((r) => {
        var tabla = llenaTabla(r);
        $('#' + tbl).html(tabla);
        cargando(false);
    }, (e) => {
        console.error(e);
        $('.alert-danger').fadeIn('slow');
        cargando(false);
    });
}

function resultadosedge310() {
    var textoBusqueda = $('#textoBusquedaedge310').val();
    if (textoBusqueda == '') return false;
    ejecutarBusqueda(textoBusqueda, 'resultadosedge310', edge310);
}

function resultadosngram310() {
    var textoBusqueda = $('#textoBusquedangram310').val();
    if (textoBusqueda == '') return false;
    ejecutarBusqueda(textoBusqueda, 'resultadosngram310', ngram310);
}

function limpiar(elemento, texto) {
    $('#' + elemento).html('');
    $('#' + texto).val('');
    $('#' + texto).focus();
}

function cargando(val){
    if (val){
        $('.cargaPantalla').fadeIn('slow');
    }else{
        $('.cargaPantalla').fadeOut('slow');
    }
}