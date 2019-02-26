//original
function getQuery1(textoBusqueda) {
	return [{
		multi_match: {
			query: textoBusqueda,
			type: "cross_fields",
			fields: ["textoBusqueda.ngram^5", "marcas.ngram", "categorias.ngram", "lineas.ngram", "grupoArticulos.ngram", "seccion.ngram"],
			operator: "and"
		}
	}];
}

//textoBusqueda OR (marcas & categorias & lineas & grupoArticulos & seccion)
function getQuery2(textoBusqueda) {
	return {
		should: [
			{
				match: { "textoBusqueda.ngram": textoBusqueda }
			},
			{
				multi_match: {
					query: textoBusqueda,
					type: "cross_fields",
					field: ["marcas.ngram", "categorias.ngram", "lineas.ngram", "grupoArticulos.ngram", "seccion.ngram"],
					operator: "and"
				}
			}
		]
	};
}

//original sin AND
function getQuery3(textoBusqueda) {
	return {
		should: [
			{
				multi_match: {
					query: textoBusqueda,
					type: "cross_fields",
					fields: ["textoBusqueda.ngram^5", "marcas.ngram", "categorias.ngram", "lineas.ngram", "grupoArticulos.ngram", "seccion.ngram"]
				}
			}
		]
	};
}

//textoBusqueda OR (marcas & categorias & lineas & grupoArticulos & seccion)
function getQuery4(textoBusqueda) {
	return {
		should: [
			{
				multi_match: {
					query: textoBusqueda,
					type: "best_fields",
					fields: ["textoBusqueda^5", "textoBusqueda.ngram^2"]
				}
			},
			{
				multi_match: {
					query: textoBusqueda,
					type: "cross_fields",
					fields: ["marcas.ngram", "categorias.ngram", "lineas.ngram", "grupoArticulos.ngram", "seccion.ngram"],
					operator: "and"
				}
			}
		]
	};
}