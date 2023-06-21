estadosPedido = {};

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

var generarTimeLine = function( estadoActual, mostrar ) {

    var htmlTimeLine = "";

    htmlTimeLine += '<ul class="timeline" id="timeline">';

    /** Si se debe mostrar el time line, se recorre y se crea, de lo contrario, se muestra el pago rechazado */
    if( mostrar ) {
        estadosPedido.forEach( element => {
            
            var complete = element.orden <= estadoActual ? 'complete' : '';
            var txtSuc = element.orden <= estadoActual ? 'text-success' : '';

            htmlTimeLine += '<li class="li ' + complete + '">';
            htmlTimeLine += '<div class="status">';
            htmlTimeLine += '<div class="ped-icon"><i class="' + element.fontawesome + ' ' + txtSuc + '"></i></div>';
            htmlTimeLine += '<span class="txt-tml"> ' + element.descripcion + ' </span>';
            htmlTimeLine += '</div>';
            htmlTimeLine += '</li>';
        });
    } else {
        htmlTimeLine += '<li class="li complete">';
        htmlTimeLine += '<div class="status">';
        htmlTimeLine += '<div class="ped-icon"><i class="fa fa-ban text-success"></i></div>';
        htmlTimeLine += '<span class="txt-tml"> PAGO RECHAZADO </span>';
        htmlTimeLine += '</div>';
        htmlTimeLine += '</li>';
    }

    htmlTimeLine += '</ul>'; 

    $('.time-line').html(htmlTimeLine);

}

/**
 * Genera la información del resumen del pedido
 * @param {*} data 
 */
var resumenPedido = function(respuesta) {

    var numeroPedido = generarNumeroPedido( respuesta.data['0'] );
    var htmlDetPed = "";
    $('#subtittle-pedido-ok').html('<span>Resumen del pedido.</span>');

    htmlDetPed += '<tr>';
    htmlDetPed += '<th class="text-right">Número del pedido</th>';
    htmlDetPed += '<td class="text-right">' + numeroPedido + '</td>';
    htmlDetPed += '</tr>';

    htmlDetPed += '<tr>';
    htmlDetPed += '<th class="text-right">Fecha del pedido</th>';
    htmlDetPed += '<td class="text-right">' + respuesta.data['0'].fechapedido + '</td>';
    htmlDetPed += '</tr>';

    htmlDetPed += '<tr>';
    htmlDetPed += '<th class="text-right">Valor a cancelar</th>';
    htmlDetPed += '<td class="text-right">' + formatearNumero(respuesta.ttles['4']) + '</td>';
    htmlDetPed += '</tr>';

    if( respuesta.data['0'].url_guia != null ) {
        htmlDetPed += '<tr>';
        htmlDetPed += '<th class="text-right">Guia transportadora</th>';
        htmlDetPed += '<td class="text-right"><a target="_blank" href="' + urlGuide + respuesta.data['0'].url_guia + '" ><i class="fa fa-file-pdf-o fa-2x text-danger" aria-hidden="true"></i></a></td>';
        htmlDetPed += '</tr>';
    }

    $('#det-res-pedido').html(htmlDetPed);
    $('#tbl-resumen-pedido').css('width', '80%');    
}

/**
 * Crea la tabla con el detalle del pedido
 */
var detallePedido = function(data) {
    // cabecera del detalle del pedido
    var htmlHead = "";
    htmlHead += '<br>';
    htmlHead += '<tr>';
    htmlHead += '<th scope="col">Item</th>';
    htmlHead += '<th scope="col">Cantidad</th>';
    htmlHead += '<th scope="col">Vlr. Unit.</th>';
    htmlHead += '<th scope="col">Imp. %.</th>';
    htmlHead += '<th scope="col">Subtotal</th>';
    htmlHead += '</tr>';
    $('#detHeadtable').html(htmlHead);

    // detalle del pedido
    var htmlDetPed = "";
    data.forEach(element => {

        htmlDetPed += '<tr>';
        htmlDetPed += '<td scope="row">' + element.desc_item +'</td>';
        htmlDetPed += '<td class="text-right">' + element.cantidad + '</input>';
        htmlDetPed += '<td class="text-right">' + formatearNumero(element.vlr_item) + '</td>';
        htmlDetPed += '<td class="text-center">' + element.vlr_impuesto + '% </td>';
        htmlDetPed += '<td class="text-right">' + formatearNumero(element.baseTtal) + '</td>';
        htmlDetPed += '</tr>';
    });

    $('#det_pedido').html(htmlDetPed);
}

/**
 * Crea el detalle del pago en la tabla del pedido
 * @param {*} data 
 */
var detallePago = function(ttles) {
    var htmlDetPag = "";

    htmlDetPag += '<tr>';
    htmlDetPag += '<th colspan="4" class="text-right">Subtotal neto</th>';
    htmlDetPag += '<td class="text-right">' + formatearNumero(ttles['2']) + '</td>';
    htmlDetPag += '</tr>';

    htmlDetPag += '<tr>';
    htmlDetPag += '<th colspan="4" class="text-right">IVA</th>';
    htmlDetPag += '<td class="text-right">' + formatearNumero(ttles['3']) + '</td>';
    htmlDetPag += '</tr>';

    htmlDetPag += '<tr>';
    htmlDetPag += '<th colspan="4" class="text-right">Total a pagar</th>';
    htmlDetPag += '<td class="text-right">' + formatearNumero(ttles['4']) + '</td>';
    htmlDetPag += '</tr>';
    
    $('#det_pago').html(htmlDetPag);
}


/**
 * Genera los detalles del pedido
 * @param {*} data 
 */
var generarDetallePedido = function( data ) {
    // genera el time line del pedido seleccionado
    generarTimeLine(data.data['0'].ordenpedido, data.data['0'].mostrar);

    // genera la información del resumen del pedido
    resumenPedido(data);

    // genera la información del detalle del pedido
    detallePedido(data.data);

    // genera la información cno el detalle del pago
    detallePago(data.ttles);
}

/**
 * Obtiene el detalle de un pedido específico
 * @param {*} data 
 */
function verDetallePedido(data) {
    
    $('#num_pedido').html('#' + $('#' + data.id).data('numero'));
    var pedId = data.id.replace('ped_', '');
    
    //se obtiene el detalle de un pedido específico
    $.ajax({
        method: "GET",
        url: urlC + "pedidodetalle/obtenerdetalle",
        data: { pedidoId: pedId },
        success: function(respuesta) {
            if ( respuesta.estado ) {
                generarDetallePedido(respuesta);
            } else {
                bootbox.alert('no fue posible obtener la información del pedido.')                
            }                
        },
        error: function() {
            bootbox.alert('Se presentó un error. Por favor, inténtelo nuevamente.');
        }
    });
}

/**
 * Genera la tabla con los datos del pedido
 * @param {*} data 
 */
var generarVistaPedidosCliente = function( data ) {

    var htmlDetPed = "";
    data.forEach(element => {
        var numeroPedido = generarNumeroPedido( element );

        htmlDetPed += '<tr>';
        htmlDetPed += '<td>' + numeroPedido + '</td>';
        htmlDetPed += '<td>' + element.descripcion + '</td>';
        htmlDetPed += '<td>' + element.updated_at.substring(0,10) + '</td>';
        htmlDetPed += '<td><i class="fa fa-eye" id="ped_' + element.id + '" data-numero="' + numeroPedido + '" title="Ver detalle" onclick="verDetallePedido(this)"></i></td>';
        htmlDetPed += '</tr>';        
    });
    
    $('#det_pedidos').html(htmlDetPed)
}

/**
 * Obtiene la información de los pedidos del cliente
 */
var obtenerPedidosCliente = function() {
    var userId = localStorage.getItem('id');

    //se obtienen los productos
    $.ajax({
        method: "GET",
        url: urlC + "pedido/obtenerpedidocliente",
        data: { userId: userId },
        success: function(respuesta) {
            if ( respuesta.estado ) {
                generarVistaPedidosCliente(respuesta.data);
            } else {
                bootbox.alert('no fue posible obtener el producto.')                
            }                
        },
        error: function() {
            bootbox.alert('Se presentó un error. Por favor, inténtelo nuevamente.');
        }
    });
}

/**
 * Obtiene los estados del pedido configurados en cotools
 */
var obtenerEstadosPedido = function() {
    $.ajax({
        method: "GET",
        url: urlC + "estadopedidos/obtener",
        data: { userId: userId },
        success: function(respuesta) {
            estadosPedido = respuesta.data;              
        },
        error: function() {
            bootbox.alert('Se presentó un error. Por favor, inténtelo nuevamente.');
        }
    });    
}

$( document ).ready(function() {
    obtenerPedidosCliente();
    obtenerEstadosPedido();
});