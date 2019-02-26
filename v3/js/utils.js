function isDummyFunction(listaPersonalizacion, tipoPersonalizacion) {
    if (typeof listaPersonalizacion === "undefined" || listaPersonalizacion === "") return false;
    if (listaPersonalizacion === "XYZ") return true;
    var response = listaPersonalizacion.indexOf(tipoPersonalizacion);
    return !(response > -1);
}