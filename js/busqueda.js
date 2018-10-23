'use strict'

let url = 'https://vpc-es-sbsearch-qas-u4pht5gehqu3pmsc4x5srachwu.us-east-1.es.amazonaws.com',
    edge310 = 'edge310_producto_cr_201816',
    edge33 = 'edge33_producto_cr_201816',
    ngram310 = 'ngram310_producto_cr_201816',
    ngram33 = 'ngram33_producto_cr_201816';

function cuerpo(textoBusqueda, ) {
    return {
        "size": 100,
        "query": {
            "multi_match" : {
                  "query":  textoBusqueda,
                  "type": "best_fields",
                  "fields": [ "textoBusqueda^7", "textoBusqueda.ngram^4", "marcas^2", "marcas.ngram" ]
                  //,"operator": "and"
                }
          },
          "sort": [
            { 
                "orden" : {"order" : "asc"}
            },
            "_score"
          ]
       };
}

function Buscador(index, texto) {
    let body = cuerpo(texto);
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
        tabla += '</tr>' ;
    }

    return tabla;

}