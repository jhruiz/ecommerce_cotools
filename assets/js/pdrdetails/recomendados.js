var valDefecto = 'precio3';
var ivaIncDefecto = 'ivaincp3';

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
 var generarVistaDetalleItem = function( data, imgItems ) {

    // Valida el precio del producto basado en la lista a la cual pertenece el cliente
    var valNoList = '';
    if(localStorage.getItem('id') != null ) {

        var listaPrecio = 'precio' + localStorage.getItem('lista_benf');
        var valIvaInc = 'ivaincp' + localStorage.getItem('lista_benf');
        var valor = data['0'][listaPrecio];
        var ivaInc = data['0'][valIvaInc];            

        if( valDefecto != listaPrecio) {
            valNoList = precioProductoLista(data['0'].precio3);
        }

    } else {
        var valor = data['0'][valDefecto];
        var ivaInc = data['0'][ivaIncDefecto];
    }    

    var imgUrl = new Object();
    var imagenes = [];
    imgUrl.url = imgItems[data['0'].item_id];
    imagenes.push(imgUrl);
    var img = obtenerImagenProducto( imagenes );

    $('#formAgregarItemLabel').html( data['0'].descripcion );
    $('#codModal').html('Código ' + data['0'].codigo);
    $('#referenciaModal').html('Referencia ' + data['0'].referencia);
    $('#unidadFactorModal').html('Unidades por empaque ' + data['0'].unidad_factor);
    $('#uniFactorHidModal').val(data['0'].unidad_factor);
    $('#uniFactorModal').val(data['0'].unidad_factor);
    $('#descHidModal').val(data['0'].descripcion + '<br> Ref. ' + data['0'].referencia);
    $('#codHidModal').val(data['0'].codigo);
    if(valNoList != "") {
        $('#delPriceModal').html(valNoList);
    }        
    $('#precioPpalModal').html(obtenerPrecioProducto(valor, ivaInc));
    var detailHtml = '<img src="' + img + '" width="180" height="200"/>';
    $('#ppal_image_modal').html(detailHtml);  
} 

/**
 * Genera una vista previa del modal de agregar un producto al carrito
 */
 var generarVistaModal = function(id) {
    $('#formAgregarItemLabel').html($('#title_' + id).val());
    $('#codModal').html('Código');
    $('#referenciaModal').html('Referencia ');
    $('#unidadFactorModal').html('Unidades por empaque');
    $('#uniFactorHidModal').val('');
    $('#uniFactorModal').val('');
    $('#descHidModal').val('');
    $('#codHidModal').val('');
    $('#delPriceModal').html('');
    $('#precioPpalModal').html('');    
    var detailHtml = '<div class="cont_img_ppal"><img src="assets/images/empty.jpg" width="180" height="200"/>';
    detailHtml += '<div class="centrado"><i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i></div></div>'
    $('#ppal_image_modal').html(detailHtml);       
    $('#formAgregarItem').modal('toggle'); 
}

/**
 * Desplegar modal para agregar producto al carrito de compras
 * @param {*} data 
 */
 function agregarAlCarritoDesdeGrupo(data) {

     var arrData = data.id.split('_');
     generarVistaModal(arrData['1']);
     $.ajax({
         method: "GET",
         url: urlC + "item/obtener",
         data: { idItem: arrData['1'] },
         success: function(respuesta) {
             if ( respuesta.estado ) {
                 generarVistaDetalleItem( respuesta.data, respuesta.imgItems );
             } else {
                 bootbox.alert('no fue posible obtener el producto.')                
             }                
         },
         error: function() {
             bootbox.alert('Se presentó un error. Por favor, inténtelo nuevamente.');
         }
     });     
    
}