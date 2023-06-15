var urlC = 'https://torqueracing.com.co/public/';
var urlEC = 'http://localhost:85/ecommerce/';
// var urlImg = 'http://localhost:85/cotoolsadmfront/dist/img/'
// var urlGuide = 'http://localhost:85/cotoolsadmfront/docs/assets/guides/';
var urlImg = 'https://sellers.miggo.com.co/dist/img/'
var urlGuide = 'https://sellers.miggo.com.co/docs/assets/guides'

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
 * Resta 1 a la cantidad de items mostrados en el menu
 */
var eliminarItemMenu = function () {
    var cant = parseInt($('#cntItems').text());
    $('#cntItems').text(cant - 1);
}

/**
 * Obtiene los items agregados por el cliente al carrito de compras y lo setea en el menu
 */
var obtenerItems = function() {
    // valida si existe un usuario logueado
    var userId = localStorage.getItem('id');
    
    if( userId != null ) {
        $.ajax({
            method: "GET",
            url: urlC + "pedido/cantidaditems",
            data: { userId : userId },
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

/**
 * Genera el número de pedido que muestra al cliente tras aprobarlo
 * @param {*} data 
 */
 var generarNumeroPedido = function( data ) {
    
    var numPedido = '';

    // separa la fecha por el espacio entre la fecha y la hora
    var arrDate = data.fechapedido.split(' ');

    // genera el número de pedido con el id del pedido, el id del usuario y la hora sin los dos puntos
    numPedido = data.id.toString() + data.usuario_id.toString() + arrDate['1'].replaceAll(':', '');

    return numPedido;
}

/**
 * Obtiene los artículos en el carrito y redirecciona a la página de checkout
 */
var goToShopping = function() {

    var userId = localStorage.getItem('id');

    // valida si existe un usuario logueado
    if( userId != null ) {
        $.ajax({
            method: "GET",
            url: urlC + "pedido/detallepedido",
            data: { userId : userId },
            success: function(respuesta) {
                if( respuesta.estado ) {                    
                    $.redirect("checkout.php", respuesta.data, "POST", "");               
                } else if( respuesta.mensaje != "" ){
                    bootbox.alert( respuesta.mensaje );
                } else {
                    bootbox.alert( 'No fue posible obtener los artículos del carrito de compras.' );
                }
            },
            error: function() {
                bootbox.alert('Se produjo un error. Por favor, inténtelo nuevamente.');
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