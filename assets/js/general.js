var mostrarTexto1Banner = function() {
    var spanWidth = $('#text_1_banner span').width();
    $('#text_1_banner').animate( { width: spanWidth }, 4000);
}

var mostrarTexto2Banner = function() {
    var spanWidth = $('#text_2_banner span').width();
    $('#text_2_banner').animate( { width: spanWidth }, 4000);
}

/**
 * Suma 1 a la cantidad de items mostrados en el menu
 */
var agregarItemMenu = function() {
    var cant = parseInt($('#cntItems').text());
    $('#cntItems').text(cant + 1);
}

/**
 * Obtiene los items agregados por el cliente al carrito de compras y lo setea en el menu
 */
var obtenerItems = function() {
    var userId = localStorage.getItem('id');
    var codBenf = localStorage.getItem('cod_benf');

    // valida si existe un usuario logueado
    if( userId != null ) {
        $.ajax({
            method: "GET",
            url: urlC + "get-order-detail",
            data: { userId : userId, codBenf : codBenf },
            success: function(respuesta) {
                if(respuesta.estado) {
                    $('#cntItems').html(respuesta.data.length);
                }                
            },
            error: function() {
                console.log('Error al obtener los items')
            }
        });             
    }    
}

$( document ).ready(function() {   
    setTimeout(function(){ 
        mostrarTexto1Banner();
        mostrarTexto2Banner();
    }, 2000);
    
    obtenerItems();
});