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
							"type": "cross_fields",
							"fields": [
								"textoBusqueda^10",
								"textoBusqueda.phonetic^7",
								"textoBusqueda.ngram^5",
								"marcas^3",
								"marcas.phonetic^2",
								"marcas.ngram",
								"categorias^3",
								"categorias.phonetic^2",
								"categorias.ngram",
								"lineas^3",
								"lineas.phonetic^2",
								"lineas.ngram",
								"grupoArticulos^3",
								"grupoArticulos.phonetic^3",
								"grupoArticulos.ngram",
								"seccion^3",
								"seccion.phonetic^3",
								"seccion.ngram"
							],
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