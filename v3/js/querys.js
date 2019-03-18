/**
 * QUERYS BUSQUEDA NORMAL
 */
//original
function getQueryAdvance1(textoBusqueda, filter, sort) {
	return {
		"size": config.elastic.sizeES,
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
				],
				"filter": filter
			}
		},
		"sort": sort
	};
}

//textoBusqueda OR (marcas & categorias & lineas & grupoArticulos & seccion)
function getQueryAdvance2(textoBusqueda, filter, sort) {
	return {
		"size": config.elastic.sizeES,
		"query": {
			"bool": {
				"should": [
					{
						"match": { "textoBusqueda.ngram": textoBusqueda }
					},
					{
						"multi_match": {
							"query": textoBusqueda,
							"type": "cross_fields",
							"fields": ["marcas.ngram", "categorias.ngram", "lineas.ngram", "grupoArticulos.ngram", "seccion.ngram"],
							"operator": "and"
						}
					}
				],
				"filter": filter
			}
		},
		"sort": sort
	};
}

//original sin AND
function getQueryAdvance3(textoBusqueda, filter, sort) {
	return {
		"size": config.elastic.sizeES,
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
				],
				"filter": filter
			}
		},
		"sort": sort
	};
}

//textoBusqueda OR (marcas & categorias & lineas & grupoArticulos & seccion)
function getQueryAdvance4(textoBusqueda, filter, sort) {
	return {
		"size": config.elastic.sizeES,
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
				],
				"filter": filter
			}
		},
		"sort": sort
	};
}

function getQueryAdvance5(textoBusqueda, filter, sort) {
	return {
		"size": config.elastic.sizeES,
		"query": {
			"bool": {
				"must": [
					{
						"multi_match": {
							"query": textoBusqueda,
							"type": "most_fields",
							"fields": [
								"textoBusqueda^20",															
								"textoBusqueda.synonym^10",	
								"textoBusqueda.phonetic^8",																
								"textoBusqueda.ngram^2",
								"marcas^12",
								"marcas.synonym^6",
								"marcas.phonetic^5",
								"marcas.ngram",
								"categorias^12",
								"categorias.synonym^6",
								"categorias.phonetic^5",
								"categorias.ngram",
								"lineas^12",
								"lineas.synonym^6",
								"lineas.phonetic^5",
								"lineas.ngram",
								"grupoArticulos^12",
								"grupoArticulos.synonym^6",
								"grupoArticulos.phonetic^5",
								"grupoArticulos.ngram",
								"seccion1^12",
								"seccion1.synonym^6",
								"seccion1.phonetic^5",
								"seccion1.ngram"
							]
							//,"operator": "and"
						}
					}
				],
				"filter": filter
			}
		}//,
		//"sort": sort
	};
}