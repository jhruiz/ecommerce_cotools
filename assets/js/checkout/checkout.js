var urlImg = 'https://admin.cotools.co/dist/img/';
var urlC = 'https://cotoolsback.cotools.co/public/';
var urlD = 'https://dataxback.cotools.co/public/';

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
            url: urlC + "change-cant-item",
            data: { codItem : codItem, idPed : idPed, cant : cant },
            success: function(respuesta) {
    
                if( respuesta.estado ) {
                    obtenerInformacionPedido();               
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
    const date = new Date()
    const options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: true,
      timeZone: 'America/Mexico_City' 
    };

    var htmlDetPed = "";

    $('#tittle-pedido-ok').html('<h4>Su pedido se registró exitósamente.</h4><br>');
    $('#subtittle-pedido-ok').html('<span>Gracias por elegirnos. A continuación encuentrará el resumen del pedido.</span><br>');
    $('#email-pedido-ok').html('<span>En su bandeja de correo encontrará un mensaje con el detalle de su compra.</span>');
    
    htmlDetPed += '<tr>';
    htmlDetPed += '<th class="text-right">Número del pedido</th>';
    htmlDetPed += '<td class="text-right">' + respuesta.data['0'].nro_pdweb + '</td>';
    htmlDetPed += '</tr>';

    htmlDetPed += '<tr>';
    htmlDetPed += '<th class="text-right">Fecha del pedido</th>';
    htmlDetPed += '<td class="text-right">' + new Intl.DateTimeFormat('es-MX', options).format(date) + '</td>';
    htmlDetPed += '</tr>';

    htmlDetPed += '<tr>';
    htmlDetPed += '<th class="text-right">Valor a cancelar</th>';
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
        url: urlC + "delete-item",
        data: { idItem : idItem, idPed : idPed },
        success: function(respuesta) {

            if( respuesta.estado ) {
                $('#tr_' + idItem).fadeOut("normal", function() {
                    $(this).remove();
                });      
                obtenerInformacionPedido();               
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
    $('#locUser').html(localStorage.getItem('lugar_benf'));
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

        htmlDetPed += '<tr id="tr_' + element.cod_item + '">';
        htmlDetPed += '<td><img src="' + img + '" alt="" width="100" height="60"></img><br>';
        htmlDetPed += '<i class="fa fa-times-circle text-secondary" id="item_' + element.cod_item + '" data-idped="' + element.pedido_id + '" title="Eliminar item" onmouseleave="leaveDel(this)" onmouseover="overDel(this)" onclick="eliminarItem(this)"></i></td>'        
        htmlDetPed += '<th scope="row">' + element.descripcion +'</th>';
        htmlDetPed += '<td><input type="text" class="form-control" value="' + element.cantidad + '" id="cant_' + element.cod_item + '" data-idped="' + element.pedido_id  + '" onblur="cambiarCantidadItem(this)" onkeyup="validarNumeros(this)"></input>';
        htmlDetPed += '<input type="hidden" value="' + element.cantidad + '" id="cant_' + element.cod_item + '_h" ></input></td>';
        htmlDetPed += '<td class="text-right">' + formatearNumero(element.precioventaunit) + '</td>';
        // htmlDetPed += '<td class="text-center"> 0% </td>';
        htmlDetPed += '<td class="text-center">' + element.tasaiva + '% </td>';
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
    var codBenf = localStorage.getItem('cod_benf');

    // valida si existe un usuario logueado
    if( userId != null ) {
        $.ajax({
            method: "GET",
            url: urlC + "get-order-detail",
            data: { userId : userId, codBenf : codBenf },
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
var actualizarPedidoWeb = function(pdWeb) {
    //se obtiene la información del cliente para registrar el pedido en datax
    var userId = localStorage.getItem('id');

    $.ajax({
        method: "GET",
        url: urlC + "approve-order",
        data: { userId : userId, pdWeb : pdWeb },
        success: function(respuesta) {

            if( respuesta.estado ) {
                bootbox.alert('El pedido fue confirmado de manera exitosa.', function(){
                    resumenPedido(respuesta);
                });
            } else {
                bootbox.alert('Se presento un error. POr favor, inténtelo nuevamente.');
            }
            
        },
        error: function() {
            bootbox.alert('Se produjo un error. Por favor, inténtelo nuevamente.');
        }
    });   
}

/**
 * Si todos los productos se encuentran habilitados para la venta, 
 * se realiza el registro en datax
 */
var procesarPedidoDatax = function() {
    //se obtiene la información del cliente para registrar el pedido en datax
    var userId = localStorage.getItem('id');

    $.ajax({
        method: "GET",
        url: urlD + "save-order",
        data: { userId : userId },
        success: function(respuesta) {

            if( respuesta.estado ) {
                actualizarPedidoWeb(respuesta.data);
            } else {
                bootbox.alert('Se presento un error. POr favor, inténtelo nuevamente.');
                $('.bnt-send-units').prop('disabled', false);
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
        url: urlC + "validate-order",
        data: { userId : userId },
        success: function(respuesta) {

            if( respuesta.estado ) {
                procesarPedidoDatax();
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
        url: urlC + "update-units-order",
        data: { userId : userId },
        success: function(respuesta) {

            bootbox.alert(respuesta.mensaje, function() {
                $('#formCheckOrder').modal('hide');
                procesarPedidoDatax();
            })
            
        },
        error: function() {
            bootbox.alert('Se produjo un error. Por favor, inténtelo nuevamente.');
        }
    });
}

$( document ).ready(function() {
    obtenerInformacionPedido();

    // se deshabilita el boton de confirmar pedido
    $(".btn-confirm").prop('disabled', true);
});