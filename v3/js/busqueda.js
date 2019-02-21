'use strict'

let url = 'https://vpc-es-sbsearch-qa-6lqloaf2kfljixcaekbyqxu2aa.us-east-1.es.amazonaws.com',
size = 250,
documents = [];

//original
function getQuery1(textoBusqueda) {
    return {
        "size": size,
        "query": {
			"bool": {
				"must": [
					{
						"multi_match": {
							"query": textoBusqueda,
							"type": "cross_fields",
							"fields": ["textoBusqueda.ngram^5", "marcas.ngram", "categorias.ngram", "lineas.ngram", "grupoArticulos.ngram", "seccion.ngram"],
							"operator": "and"
						}
					}
				]
			}
		},
        "sort": [
			"_score",
			{
                "orden": {
                    "order": "asc"
                }
            }
            
        ]
    };
}

//textoBusqueda OR (marcas & categorias & lineas & grupoArticulos & seccion)
function getQuery2(textoBusqueda) {
    return {
        "size": size,
        "query": {
			"bool": {
				"should": [
                    {
                        "match":{"textoBusqueda.ngram": textoBusqueda}
                    },
					{
						"multi_match": {
							"query": textoBusqueda,
							"type": "cross_fields",
							"fields": ["marcas.ngram", "categorias.ngram", "lineas.ngram", "grupoArticulos.ngram", "seccion.ngram"],
							"operator": "and"
						}
					}
				]
			}
		},
        "sort": [
			"_score",
			{
                "orden": {
                    "order": "asc"
                }
            }
            
        ]
    };
}

//original sin AND
function getQuery3(textoBusqueda) {
    return {
        "size": size,
        "query": {
			"bool": {
				"should": [
					{
						"multi_match": {
							"query": textoBusqueda,
							"type": "cross_fields",
							"fields": ["textoBusqueda.ngram^5", "marcas.ngram", "categorias.ngram", "lineas.ngram", "grupoArticulos.ngram", "seccion.ngram"]
						}
					}
				]
			}
		},
        "sort": [
			"_score",
			{
                "orden": {
                    "order": "asc"
                }
            }
            
        ]
    };
}

//textoBusqueda OR (marcas & categorias & lineas & grupoArticulos & seccion)
function getQuery4(textoBusqueda) {
    return {
        "size": size,
        "query": {
			"bool": {
				"should": [
                    {
						"multi_match": {
							"query": textoBusqueda,
							"type": "best_fields",
							"fields": ["textoBusqueda^5", "textoBusqueda.ngram^2"]
						}
					},
					{
						"multi_match": {
							"query": textoBusqueda,
							"type": "cross_fields",
                            "fields": ["marcas.ngram", "categorias.ngram", "lineas.ngram", "grupoArticulos.ngram", "seccion.ngram"],
                            "operator": "and"
						}
					}
				]
			}
		},
        "sort": [
			"_score",
			{
                "orden": {
                    "order": "asc"
                }
            }
            
        ]
    };
}

function getElasticResult(index, texto, opcion) {    
    let query = null;
    switch (opcion){
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
    var tabla = '';
    var i = 0;
    documents = [];
    for (const key in r.hits.hits) {        
        const res = r.hits.hits[key];
        const element = res._source
        i += 1;
        
        let documentoResumido = {
            num: i,
            id: res._id,
            textoBusqueda: element.textoBusqueda,
            marcas: element.marcas,
            categorias: element.categorias,
            grupoArticulos: element.grupoArticulos,
            lineas: element.lineas,
            seccion: element.seccion,
            tipoPersonalizacion: element.tipoPersonalizacion,
            score: res._score
        };
        documents.push(documentoResumido);

        tabla += `<tr data-id="${documentoResumido.id}">`;
        tabla += `<td>${documentoResumido.num}</td>`;
        tabla += `<td>${documentoResumido.textoBusqueda}</td>`;		
		//tabla += `<td>${documentoResumido.marcas.toString()}</td>`;
        //tabla += `<td>${documentoResumido.categorias.toString()}</td>`;
        //tabla += `<td>${documentoResumido.grupoArticulos.toString()}</td>`;
        //tabla += `<td>${element.lineas.toString()}</td>`;
        tabla += `<td class="text-center">${documentoResumido.tipoPersonalizacion}</td>`;
        tabla += `<td class="text-right">${documentoResumido.score}</td>`;
        tabla += '<td><button type="button" name="btn-ver-mas" class="btn btn-primary btn-sm">Ver más</button></td>';
        tabla += '</tr>';
    }

    return tabla;

}
function showCount(count){
    $("#th-contador").text("Documentos encontrados: ".concat(count));
}

function ejecutarBusqueda(texto, tbl, index, opcion) {
    cargando(true);
    $('.alert-danger').fadeOut('slow');
    getElasticResult(index, texto, opcion).then((r) => {
        var tabla = llenaTabla(r);        
        showCount(r.hits.total);
        $('#' + tbl).html(tabla);
        cargando(false);
    }, (e) => {
        console.error(e);
        $('.alert-danger').fadeIn('slow');
        cargando(false);
    });
}

function getSelectedIndex(){
    let index = $('#opcion-index').find("option:selected").val();
    console.log(index);
    return index;
}

function resultado() {
    var textoBusqueda = $('#textoBusqueda').val();
    if (textoBusqueda == '') return false;

    let opcion = $('#opcion-query').find("option:selected").val();
    
    console.log(opcion);
    ejecutarBusqueda(textoBusqueda, 'resultado', getSelectedIndex(), opcion);
    if(!$('#tabla-datos tbody tr').length){
        if($('#chk-intentar').is(":checked")){
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

function cargando(val){
    if (val){
        $('.cargaPantalla').fadeIn('slow');
    }else{
        $('.cargaPantalla').fadeOut('slow');
    }
}