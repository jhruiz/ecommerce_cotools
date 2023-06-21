/**
 * Valida si hay un usuario logueado
 */
var validarUsuario = function() {
    var userId = localStorage.getItem('id');

    if( userId == null ) {
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
var salvarAlCarrito = function() {

    // valida si hay un usuario logueado
    var resp = validarUsuario();

    // valida que los datos esten completos
    var msg = validarDatos();

    if( resp ) {
        
        if ( msg == '' ) {

            var item = $('#codHid').val();
            var cant = $('#uniFactor').val();
            var desc = $('#descHid').val();
            var usuarioId = localStorage.getItem('id'); 
            
            $.ajax({
                method: "GET",
                url: urlC + "pedido/agregaritem",
                data: { item : item, cant : cant, usuarioId : usuarioId, desc : desc },
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
                    bootbox.alert('Se presento un error. Por favor, comuníquese con el administrador');
                }
            });

        } else {
            bootbox.alert(msg);
        }
        
    } else {
        bootbox.alert('Para realizar pedidos es necesario loguearte. Si aun no tienes usuario y contraseña, puedes suscribirte.');
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
            var usuarioId = localStorage.getItem('id');
            
            $.ajax({
                method: "GET",
                url: urlC + "pedido/agregaritem",
                data: { item : item, cant : cant, usuarioId : usuarioId, desc : desc },
                success: function(respuesta) {
        
                    if ( respuesta.estado ) {
                        agregarItemMenu();
                        bootbox.alert('Producto agregado al carrito de compras.');
                    } else {
                        bootbox.alert(respuesta.mensaje);
                    }

                    $('#formAgregarItem').modal('toggle'); 
                    
                },
                error: function() {
                    bootbox.alert('Se presento un error. Por favor, comuníquese con el administrador');
                }
            });

        } else {
            bootbox.alert(msg);
        }
        
    } else {
        bootbox.alert('Para realizar pedidos es necesario loguearte. Si aun no tienes usuario y contraseña, puedes suscribirte.');
    }
}

$( document ).ready(function() {
});