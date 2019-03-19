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
							"type": "best_fields",
							"fields": [
								 "textoBusqueda^20",															
								 "textoBusqueda.synonym^15",	
								 "textoBusqueda.phonetic^4",
								 "textoBusqueda.ngram^13",
								
								 "marcas^8",
								 "marcas.synonym^6",
								 "marcas.phonetic^4",								
								 "marcas.ngram",
								
								 "categorias^8",
								 "categorias.synonym^6",
								 "categorias.phonetic^4",
								 "categorias.ngram",
								
								 "lineas^8",
								 "lineas.synonym^6",
								// "lineas.phonetic^4",
								 "lineas.ngram",
								
								 "grupoArticulos^8",
								 "grupoArticulos.synonym^8",
								 "grupoArticulos.phonetic^6",
								 "grupoArticulos.ngram",
								
								 "seccion1^8",
								 "seccion1.synonym^6",
								 "seccion1.phonetic^4",
								 "seccion1.ngram"
							]
							//,"operator": "and"
						}
					}
				],
				"filter": filter
			}
		},
		"sort": sort
	};
}