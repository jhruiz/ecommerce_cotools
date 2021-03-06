var urlC = 'https://cotoolsback.cotools.co/public/';
// var urlC = 'http://localhost:85/cotoolsback/public/';

/**
 * Valida si hay un usuario logueado
 */
var validarUsuario = function() {
    var codBenf = localStorage.getItem('cod_benf');

    if( codBenf == null ) {
        return false;
    }

    return true;
}

/**
 * Valida si el usuario ingreso una cantidad de productos a comprar
 * @returns 
 */
var validarDatos = function() {
    var msg = '';
    var cant = $('#uniFactor').val();

    if ( cant == '' ) {
        msg = '- La cantidad del producto no puede ser vacia o cero.';
    }

    return msg;
}

/**
 * Valida si el usuario ingreso una cantidad de productos a comprar
 * @returns 
 */
var validarDatosModal = function() {
    var msg = '';
    var cant = $('#uniFactorModal').val();

    if ( cant == '' ) {
        msg = '- La cantidad del producto no puede ser vacia o cero.';
    }

    return msg;
}


/**
 * Agrega productos al carrito de compras
 */
var salvarAlCarrito = function(data) {

    // valida si hay un usuario logueado
    var resp = validarUsuario();

    // valida que los datos esten completos
    var msg = validarDatos();

    if( resp ) {

        if ( msg == '' ) {

            var item = $('#codHid').val();
            var cant = $('#uniFactor').val();
            var desc = $('#descHid').val();
            var codBenf = localStorage.getItem('cod_benf');
            var usuarioId = localStorage.getItem('id');            
            
            $.ajax({
                method: "GET",
                url: urlC + "add-items-to-car",
                data: { item : item, cant : cant, codBenf : codBenf, usuarioId : usuarioId, desc : desc },
                success: function(respuesta) {
        
                    if ( respuesta.estado ) {
                        agregarItemMenu();
                        bootbox.alert('Producto agregado al carrito de compras.');
                    } else {
                        bootbox.alert(respuesta.mensaje);
                    }

                    $('#formAgregarItem').modal('hide'); 
                    
                },
                error: function() {
                    bootbox.alert('Se presento un error. Por favor, comun??quese con el administrador');
                }
            });

        } else {
            bootbox.alert(msg);
        }
        
    } else {
        bootbox.alert('Para realizar pedidos es necesario loguearte. Si aun no tienes usuario y contrase??a, puedes suscribirte.');
    }
}

/**
 * Agrega productos al carrito de compras
 */
 var salvarAlCarritoModal = function(data) {

    // valida si hay un usuario logueado
    var resp = validarUsuario();

    // valida que los datos esten completos
    var msg = validarDatosModal();

    if( resp ) {

        if ( msg == '' ) {

            var item = $('#codHidModal').val();
            var cant = $('#uniFactorModal').val();
            var desc = $('#descHidModal').val();
            var codBenf = localStorage.getItem('cod_benf');
            var usuarioId = localStorage.getItem('id');
            
            $.ajax({
                method: "GET",
                url: urlC + "add-items-to-car",
                data: { item : item, cant : cant, codBenf : codBenf, usuarioId : usuarioId, desc : desc },
                success: function(respuesta) {
        
                    if ( respuesta.estado ) {
                        bootbox.alert('Producto agregado al carrito de compras.');
                    } else {
                        bootbox.alert(respuesta.mensaje);
                    }

                    $('#formAgregarItem').modal('toggle'); 
                    
                },
                error: function() {
                    bootbox.alert('Se presento un error. Por favor, comun??quese con el administrador');
                }
            });

        } else {
            bootbox.alert(msg);
        }
        
    } else {
        bootbox.alert('Para realizar pedidos es necesario loguearte. Si aun no tienes usuario y contrase??a, puedes suscribirte.');
    }
}

$( document ).ready(function() {
});