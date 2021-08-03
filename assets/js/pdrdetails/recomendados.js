var urlImg = 'https://admin.cotools.co/dist/img/';
var urlC = 'https://cotoolsback.cotools.co/public/';

/**
 * Valida que el campo sea numérico
 */
function validarNumerosDetalle() {
    valor = $('#uniFactorModal').val();
    if( isNaN(valor) ) {
        $('#uniFactorModal').val($('#uniFactorHidModal').val());
    }
}

/**
 * Si el campo cantidad se deja vacio o se pone en cero, se agrega 
 * la unidad de factor por defecto configurada en datax
 */
function restaurarUniFactorDetalle() {
    var uniFactor = $('#uniFactorModal').val();

    if( uniFactor == "" || uniFactor == 0 ) {
        $('#uniFactorModal').val($('#uniFactorHidModal').val());
    }

}

/**
 * Genera la información de la vista del modal del carrito de compras
 * @param {*} data 
 */
 var generarVistaDetalleItem = function(data) {

    $('#formAgregarItem').modal('toggle'); 

    // Valida el precio del producto basado en la lista a la cual pertenece el cliente
    var valNoList = '';
    if(localStorage.getItem('cod_benf') != null ) {
        if( localStorage.getItem('lista_benf') == '1' ) {
            var valor = data.precio1;
            var ivaInc = data.iva_inc_p1;
            valNoList = precioProductoLista3(data.precio3);
        } else if( localStorage.getItem('lista_benf') == '2' ) {
            var valor = data.precio2;
            var ivaInc = data.iva_inc_p2;
            valNoList = precioProductoLista3(data.precio3);
        } else {
            var valor = data.precio3;
            var ivaInc = data.iva_inc_p3;
        }

    } else {
        var valor = data.precio3;
        var ivaInc = data.iva_inc_p3;
    }    

    var img = obtenerImagenProducto(data.imagenes);

    $('#formAgregarItemLabel').html( data.descrip );
    $('#referenciaModal').html('Referencia ' + data.referencia);
    $('#unidadFactorModal').html('Unidades por empaque ' + data.uni_factor);
    $('#uniFactorHidModal').val(data.uni_factor);
    $('#uniFactorModal').val(data.uni_factor);
    $('#descHidModal').val(data.descrip + '<br> Ref. ' + data.referencia);
    $('#codHidModal').val(data.cod_item);
    if(valNoList != "") {
        $('#delPriceModal').html(valNoList);
    }        
    $('#precioPpalModal').html(obtenerPrecioProducto(valor, ivaInc));
    var detailHtml = '<img src="' + img + '" width="180" height="200"/>';
    $('#ppal_image_modal').html(detailHtml);  
} 

/**
 * Desplegar modal para agregar producto al carrito de compras
 * @param {*} data 
 */
 function agregarAlCarritoDesdeGrupo(data) {

     var arrData = data.id.split('_');
     $.ajax({
         method: "GET",
         url: urlC + "get-item-detail",
         data: { idItem: arrData['1'] },
         success: function(respuesta) {
             if ( respuesta.estado ) {
                 generarVistaDetalleItem(respuesta.data.data.principal);
             } else {
                 bootbox.alert('no fue posible obtener el producto.')                
             }                
         },
         error: function() {
             bootbox.alert('Se presentó un error. Por favor, inténtelo nuevamente.');
         }
     });     
    
}