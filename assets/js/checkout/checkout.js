// var urlImg = 'https://admin.cotools.co/dist/img/';
// var urlC = 'https://cotoolsback.cotools.co/public/';
// var urlD = 'https://dataxback.cotools.co/public/';
var urlImg = 'http://localhost:85/cotoolsadmfront/dist/img/';
var urlC = 'https://torqueracing.com.co/public/';
var urlD = 'http://localhost:85/dataxback/';

/**
 * Modifica la cantidad solicitada de un item específico
 * @param {*} data 
 */
var cambiarCantidadItem = function(data) {

    var cant = $('#' + data.id).val();
    var cantH = $('#' + data.id + '_h').val();

    if( cant == 0 || cant == cantH ) {
        $('#' + data.id).val(cantH);
    } else {
        var idPed = $('#' + data.id).data('idped');
        var codItem = data.id.replace('cant_', '');
        $.ajax({
            method: "GET",
            url: urlC + "pedidodetalle/cambiarcantidad",
            data: { codItem : codItem, idPed : idPed, cant : cant },
            success: function(respuesta) {
    
                if( respuesta.estado ) {
                    goToShopping();
                    // obtenerInformacionPedido();               
                } else {
                    bootbox.alert(respuesta.mensaje);
                }
                
            },
            error: function() {
                bootbox.alert('Se produjo un error. Por favor, inténtelo nuevamente.');
            }
        });
    }

}

/**
 * Se muestra el resumen del pedido una vez este fue aprovado
 * @param {*} respuesta 
 */
var resumenPedido = function(respuesta) {

    // se elimina el div de mercado pago
    $('#wallet_container').remove();

    // se elimina el botón para editar información de contacto
    $('#editClient').remove();

    // Actualiza la cantidad de items en el menú principal
    $('#cntItems').html('0');
    
    // genera el número de pedido que mostrará al cliente
    var numPedido = generarNumeroPedido(respuesta.data['0']);

    const date = new Date()
    const options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: true,
      timeZone: 'America/Mexico_City' 
    };

    var htmlDetPed = "";

    $('#tittle-pedido-ok').html('<h4>Su pedido se encuentra pendiente por validación de pago.</h4><br>');
    $('#subtittle-pedido-ok').html('<span>Gracias por elegirnos. A continuación encontrará el resumen del pedido.</span><br>');
    $('#email-pedido-ok').html('<span>En su bandeja de correo encontrará un mensaje con el detalle de su pedido.</span>');
    
    htmlDetPed += '<tr>';
    htmlDetPed += '<th class="text-right">Número del pedido</th>';
    htmlDetPed += '<td class="text-right">' + numPedido + '</td>';
    htmlDetPed += '</tr>';

    htmlDetPed += '<tr>';
    htmlDetPed += '<th class="text-right">Fecha del pedido</th>';
    htmlDetPed += '<td class="text-right">' + new Intl.DateTimeFormat('es-MX', options).format(date) + '</td>';
    htmlDetPed += '</tr>';

    htmlDetPed += '<tr>';
    htmlDetPed += '<th class="text-right">Valor del pedido</th>';
    htmlDetPed += '<td class="text-right">' + formatearNumero(respuesta.total) + '</td>';
    htmlDetPed += '</tr>';

    $('#det_pedido').html(htmlDetPed);
    $('#headtable').html('');
    $('#det_pago').html('');
    
    $('.tblData').css('width', '50%');
    $('.btn-confirm').hide();

}

/**
 * Valida que el campo sea numérico
 */
 function validarNumeros(data) {
    valor = $('#' + data.id).val();
    if( isNaN(valor) ) {
        $('#' + data.id).val($('#' + data.id + '_h').val());
    }
}

// Constante para formatear numeros
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });

/**
 * Formatea los valores de precio
 * @param {*} numero 
 * @returns 
 */
var formatearNumero = function(numero) {
    return formatter.format(numero).toString();    
}

// Cambiar el color del icono de eliminar cuando se tiene el foco y cuando no sobre este
var leaveDel = function(data) {
    $('#' + data.id).removeClass('text-danger').addClass('text-secondary');    
}
var overDel = function(data) {
    $('#' + data.id).removeClass('text-secondary').addClass('text-danger');
}

/**
 * Elimina el registro del item
 * @param {*} idItem 
 */
var eliminarItemPedido = function(idItem, idPed) {
    // valida si existe un usuario logueado
    $.ajax({
        method: "GET",
        url: urlC + "pedidodetalle/eliminaritem",
        data: { idItem : idItem, idPed : idPed },
        success: function(respuesta) {

            if( respuesta.estado ) {
                $('#tr_' + idItem).fadeOut("normal", function() {
                    // $(this).remove();
                    eliminarItemMenu();
                });      
                goToShopping();
                // obtenerInformacionPedido();               
            } else {
                bootbox.alert(respuesta.mensaje);
            }
            
        },
        error: function() {
            bootbox.alert('Se produjo un error. Por favor, inténtelo nuevamente.');
        }
    });           
}

/**
 * Eliminar el item deseado
 * @param {*} data 
 */
var eliminarItem = function(data) {
    bootbox.confirm('¿Está seguro que desea eliminar el item?', function(result){ 
        if( result ) {
            var idItem = data.id.replace('item_', '');
            var idPed = $('#' + data.id).data('idped');
            eliminarItemPedido(idItem, idPed);
        }
    });
}

/**
 * Setea la información del cliente
 */
var setearInformacionCliente = function() {
    $('#nameUser').html(localStorage.getItem('nom_benf'));
    $('#emailUser').html(localStorage.getItem('email'));
    $('#telUser').html(localStorage.getItem('telef_benf'));
    $('#locUser').html(localStorage.getItem('ciudad') + ' ' + localStorage.getItem('direccion'));
}

/**
 * Genera la tabla con el detallade del pedido por cada item
 * @param {*} data 
 * @returns 
 */
var obtenerDetalleItems = function( data ) {

    var htmlDetPed = "";

    data.forEach(element => {
        var img = element.imagen == '' ? 'assets/images/empty.jpg' : urlImg + element.imagen;

        htmlDetPed += '<tr id="tr_' + element.id + '">';
        htmlDetPed += '<td><img src="' + img + '" alt="" width="100" height="60"></img><br>';
        htmlDetPed += '<i class="fa fa-times-circle text-secondary" id="item_' + element.id + '" data-idped="' + element.pedido_id + '" title="Eliminar item" onmouseleave="leaveDel(this)" onmouseover="overDel(this)" onclick="eliminarItem(this)"></i></td>'        
        htmlDetPed += '<th scope="row">' + element.descripcion +'</th>';
        htmlDetPed += '<td><input type="text" class="form-control" value="' + element.cantidad + '" id="cant_' + element.id + '" data-idped="' + element.pedido_id  + '" onblur="cambiarCantidadItem(this)" onkeyup="validarNumeros(this)"></input>';
        htmlDetPed += '<input type="hidden" value="' + element.cantidad + '" id="cant_' + element.id + '_h" ></input></td>';
        htmlDetPed += '<td class="text-right">' + formatearNumero(element.vlr_item) + '</td>';
        // htmlDetPed += '<td class="text-center"> 0% </td>';
        htmlDetPed += '<td class="text-center">' + element.vlr_impuesto + '% </td>';
        htmlDetPed += '<td class="text-right">' + formatearNumero(element.baseTtal) + '</td>';
        htmlDetPed += '</tr>';        
    });
    
    return htmlDetPed;

}

/**
 * Obtiene el detalle del pago a realizar
 * @param {*} ttles 
 * @returns 
 */
var obtenerDetallePago = function(ttles) {
    var htmlDetPag = "";
    
    // htmlDetPag += '<tr>';
    // htmlDetPag += '<th colspan="5" class="text-right">Subtotal Bruto</th>';
    // htmlDetPag += '<td class="text-right">' + formatearNumero(ttles['0']) + '</td>';
    // htmlDetPag += '</tr>';

    // htmlDetPag += '<tr>';
    // htmlDetPag += '<th colspan="5" class="text-right">Descuento comercial</th>';
    // htmlDetPag += '<td class="text-right">' + formatearNumero(ttles['1']) + '</td>';
    // htmlDetPag += '</tr>';

    htmlDetPag += '<tr>';
    htmlDetPag += '<th colspan="5" class="text-right">Subtotal neto</th>';
    htmlDetPag += '<td class="text-right">' + formatearNumero(ttles['2']) + '</td>';
    htmlDetPag += '</tr>';

    htmlDetPag += '<tr>';
    htmlDetPag += '<th colspan="5" class="text-right">IVA</th>';
    htmlDetPag += '<td class="text-right">' + formatearNumero(ttles['3']) + '</td>';
    htmlDetPag += '</tr>';

    htmlDetPag += '<tr>';
    htmlDetPag += '<th colspan="5" class="text-right">Total a pagar</th>';
    htmlDetPag += '<td class="text-right">' + formatearNumero(ttles['4']) + '</td>';
    htmlDetPag += '</tr>';
    
    return htmlDetPag;
}

/** 
 * Genera la tabla con el detalle del pedido y el pago
*/
var generarListaCheckout = function(data, ttles) {

    var htmlDetPed = "";
    var htmlDetPag = "";

    // setear informacion del cliente
    setearInformacionCliente();
    
    // obtiene la tabla con los items
    htmlDetPed += obtenerDetalleItems(data);

    // obtiene el detalle del pago
    htmlDetPed += obtenerDetallePago(ttles);

    $('#det_pedido').html(htmlDetPed);
    $('#det_pago').html(htmlDetPag);
    $(".btn-confirm").prop('disabled', false);
}

/**
 * Obtiene la informarmación del pedido de un cliente específico
 */
var obtenerInformacionPedido = function() {
    var userId = localStorage.getItem('id');

    // valida si existe un usuario logueado
    if( userId != null ) {
        $.ajax({
            method: "GET",
            url: urlC + "pedido/detallepedido",
            data: { userId : userId },
            success: function(respuesta) {
                if( respuesta.estado ) {
                    generarListaCheckout(respuesta.data, respuesta.ttles);
                } else if( respuesta.mensaje != "" ){
                    bootbox.alert( respuesta.mensaje );
                } else {
                    $('#det_pedido').html("");
                    $('#det_pago').html("");
                }
            },
            error: function() {
                bootbox.alert('Se produjo un error. Por favor, inténtelo nuevamente.');
            }
        });             
    }
}

/**
 * Despliega el modal para visualizar cantidades pedidas vs cantidades disponibles
 * @param {*} resp 
 */
var modalUnidadesDisponibles = function(resp) {
    $('#formCheckOrder').modal('show');

    $('#formCheckOrderLabel').html(resp.mensaje);

    var htmlItems = '';
    resp.data.forEach( function(element) {

        htmlItems += '<tr>';
        htmlItems += '<th scope="row">' + element.descripcion + '</th>';
        htmlItems += '<td class="text-center">' + element.cantidad + '</td>';
        htmlItems += '<td class="text-center">' + element.disponible + '</td>';
        htmlItems += '</tr>';

    });

    $('#det_check_order').html(htmlItems);
    $(".btn-confirm").prop('disabled', false);
}

/**
 * Actualiza el registro del pedido web
 * para validar el pedido tambien en 
 * la base de datos de cotools
 */
var actualizarPedidoWeb = function() {
    //se obtiene la información del cliente para registrar el pedido en datax
    var userId = localStorage.getItem('id');

    //id de pago de mercadopago
    var mpId = $('#preference_id').val();

    $.ajax({
        method: "GET",
        url: urlC + "pedido/aprobarpedido",
        data: { userId : userId, mpId : mpId },
        success: function(respuesta) {

            if( respuesta.estado ) {
                // bootbox.alert('Su pedido se encuentra pendiente de aprobación hasta confirmar pago.', function(){
                    resumenPedido(respuesta);
                // });
            } else {
                bootbox.alert('Se presento un error. Por favor, inténtelo nuevamente.');
            }
            
        },
        error: function() {
            bootbox.alert('Se produjo un error. Por favor, inténtelo nuevamente.');
        }
    });   
}

/**
 * Funcion para validar el pedido y confirmarlo o mostrar 
 * información de los items con stock menor al solicitado
 */
function confirmarPedido() {
    $(".btn-confirm").prop('disabled', true);

    //se obtiene la información del cliente para validar el pedido
    var userId = localStorage.getItem('id');    

    $.ajax({
        method: "GET",
        url: urlC + "pedido/validarorden",
        data: { userId : userId },
        success: function(respuesta) {

            if( respuesta.estado ) {
                actualizarPedidoWeb();
            } else if( !respuesta.estado && respuesta.data != null) {
                modalUnidadesDisponibles(respuesta);
            } else {
                bootbox.alert('Debe ingresar al menos un producto para confirmar un pedido.');
            }            
            
        },
        error: function() {
            bootbox.alert('Se produjo un error. Por favor, inténtelo nuevamente.');
        }
    });

}

/**
 * Actualizar unidades pedidas con existentes, si hay cero unidades disponibles,
 * el producto se elimina del listado
 */
function actualizarUnidadesPedidasExistencia() {
    $('.bnt-send-units').prop('disabled', true);
    //se obtiene la información del cliente para actualizar el pedido
    var userId = localStorage.getItem('id');

    $.ajax({
        method: "GET",
        url: urlC + "pedido/actualizarunidades",
        data: { userId : userId },
        success: function(respuesta) {

            bootbox.alert(respuesta.mensaje, function() {
                $('#formCheckOrder').modal('hide');
                actualizarPedidoWeb();
            })
            
        },
        error: function() {
            bootbox.alert('Se produjo un error. Por favor, inténtelo nuevamente.');
        }
    });
}

/**
 * Funcion para metodo de pago de mercado pago
 */
var mercadopago = function(){
    var preferenceId = $('#preference_id').val();

    // const mp = new MercadoPago('TEST-dad4f35d-9ae4-406b-86ba-8897cae91543', {
    const mp = new MercadoPago('APP_USR-38d4da16-ed19-48f0-bcec-32de02a3212a', {
        locale: 'es-CO'
      });
    const bricksBuilder = mp.bricks();

    mp.bricks().create("wallet", "wallet_container", {
    initialization: {
        preferenceId: preferenceId,
        redirectMode: "modal"
    },
    customization: {
        checkout: {
            theme: {
                elementsColor: "#4287F5",
                headerColor: "#4287F5",
            },
        },
    },    
    callbacks: {
        onSubmit: () => confirmarPedido(),
        onError: (error) => console.log(error),
      },    
    });
}

$( document ).ready(function() {
    obtenerInformacionPedido();
    mercadopago();

    // se deshabilita el boton de confirmar pedido
    $(".btn-confirm").prop('disabled', true);
});