/**
 * Obtiene la categoria seleccionada y redirecciona a la pagina de grupos de datax
 */
 function obtenerGruposCategoria(data) {
    var categoria = data.id.replace('cat_', '');
    var textCat = $('#' + data.id).data('name');
    sessionStorage.setItem('categoriaId', categoria);
    sessionStorage.setItem('categoriaName', textCat);
    window.location.href = urlEC + "list-groups.php";
}

/**
 * Crea el input tipo select de las categorias
 * @param {*} data 
 */
var crearSelectCategorias = function(data) {
    var htmlCatM = "";

    data.forEach( element => {
        htmlCatM += '<a class="dropdown-item" id="cat_' + element.id + '" data-name="' + element.descripcion + '" href="#" onclick="obtenerGruposCategoria(this);">' + element.descripcion + '</a>'
    });

    $('.drp-menu-categorias').html(htmlCatM);
}

/**
 * Obtiene las categorias configuradas en cotools
 */
 var obtenerCategorias = function() {
    $.ajax({
        method: "GET",
        url: urlC + "categorias/obtener",
        success: function(respuesta) {
            if ( respuesta.estado ) {
                crearSelectCategorias(respuesta.data);                
            } else {
                bootbox.alert('no fue posible obtener las categorías.')                
            }
            
        },
        error: function() {
            console.log('hubo un error');
        }
      });     
}

$( document ).ready(function() {  
    obtenerCategorias();
});