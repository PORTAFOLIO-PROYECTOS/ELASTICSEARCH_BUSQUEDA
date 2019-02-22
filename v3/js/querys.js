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