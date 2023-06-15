// var urlImg = 'https://admin.cotools.co/dist/img/';
// var urlC = 'https://cotoolsback.cotools.co/public/';
// var urlEC = 'https://cotools.co/';
// var urlImg = 'http://localhost:85/cotoolsadmfront/dist/img/';
var urlC = 'https://torqueracing.com.co/public/';
var urlEC = 'http://localhost:85/ecommerce/';
var valDefecto = 'precio3';
var ivaIncDefecto = 'ivaincp3';

/**
 * Valida que el campo sea numérico
 */
 function validarNumeros() {
    valor = $('#uniFactor').val();
    if( isNaN(valor) ) {
        $('#uniFactor').val($('#uniFactorHid').val());
    }
}

/**
 * Si el campo cantidad se deja vacio o se pone en cero, se agrega 
 * la unidad de factor por defecto configurada en datax
 */
function restaurarUniFactor() {
    var uniFactor = $('#uniFactor').val();

    if( uniFactor == "" || uniFactor == 0 ) {
        $('#uniFactor').val($('#uniFactorHid').val());
    }

}

/**
 * Agrega zoom a la imagen principal
 * @param {*} idImg 
 */
var zoomImagen = function(idImg){
    if( idImg != "" ) {
        $('#' + idImg).elevateZoom({
            cursor: "crosshair",
            zoomWindowOffetx: 30,
            zoomWindowWidth: 800,
            borderSize: 0
        });
    }
}

/**
 * Obtiene el precio del producto en la lista 3
 * @returns 
 */
 var precioProductoLista = function(precio) {
    var valorProducto = "";

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      });

    if (precio != "" ) {
        valorProducto = '<del>' + formatter.format(precio).toString() + '</del>';
    } else {
        valorProducto = '$0'
    }

    return valorProducto;    
}

/**
 * Redirecciona a la pagina de detalles del producto y guarda en sesion el id de producto
 * @param {*} id 
 */
 var redirectItemDetail = function(data) {

    sessionStorage.setItem('idProd', $(data).data('idprod'));
    window.location.href = urlEC + "product-details.php";
}

/**
 * Obtiene y formatea el precio del producto a pesos.
 * Valida si el iva se encuentra incluido o no
 * @param {*} precio 
 * @param {*} ivaInc 
 * @returns 
 */
 var  obtenerPrecioProducto = function(precio, ivaInc) {
    var valorProducto = "";

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      });

    if (precio != "" ) {
        var iva = ivaInc == '1' ? ' IVA incluido' : ' + IVA';
        valorProducto = '<b>' + formatter.format(precio).toString() + "</b> COP" + '<p>' + iva + '</p>';
    }

    return valorProducto;
}

/**
 * Valida el tamaño de la descripcion del producto y formatea un tamaño estandar
 * @param {*} descripcion 
 * @returns 
 */
 var obtenerNombreProducto = function(descripcion, limite) {
    var nDescripcion = "";
    
    if(descripcion != '') {
        if( descripcion.length > limite ) {
            nDescripcion = descripcion.substring(0,limite) + "...";
        } else {
            nDescripcion = descripcion;
        }
    }

    return nDescripcion;
}

/**
 * Valida si el producto tiene una imagen o agrega una por defecto
 * @param {*} imagen 
 * @returns 
 */
 var obtenerImagenProducto = function(imagen) {
    var img = "";
    if( imagen == null ){
        img = 'assets/images/empty.jpg';
    } else {
        img = urlImg + imagen['0'].url;
    }    

    return img;
}

/**
 * Obtiene el id de la imagen principal
 * @param {*} imagen 
 * @returns 
 */
var obtenerIdImagenProducto = function(imagen) {
    var id = "";

    if( imagen == null ) {
        id = "";        
    } else {
        id = "ppal_" + imagen['0'].id;
    }

    return id;
}

/**
 * Se agrega la imagen principal del detalle del producto
 * @param {*} imagenes 
 */
var agregarImagenPrincipal = function(imagenes) {

    var detailHtml = "";

    // Obtiene la imagen principal
    var imgPpal = obtenerImagenProducto(imagenes);

    var idImg = obtenerIdImagenProducto(imagenes);
    
    // Agrega la imagen principal
    detailHtml += '<img id="' + idImg + '" src="' + imgPpal + '" class="img-fluid " width="450" height="355" data-zoom-image="' + imgPpal + '"/>';
    $('#ppal_image').html(detailHtml);

    zoomImagen(idImg);
}

/**
 * Cambia la imagen que se muestra en la vista principal
 * @param {*} data 
 */
function cambiarImagenPrincipal(data) {

    // Elimina clase que agrega sombreado al listado de imagenes
    $('.second-img').each( function() {
        $(this).removeClass('img-border');
    })

    // Agrega sobreado a la imagen seleccionada
    $('#' + data.id).addClass('img-border');

    // Obtener el id de la nueva imagen principal
    var nArrId = data.id.split('_');
    var ppalId = "ppal_" + nArrId['1'];

    // Cambia la imagen del visor principal
    var detailHtml = "";
    detailHtml += '<img id="' + ppalId + '" src="' + data.src + '" class="img-fluid wc-image" width="450" height="355" data-zoom-image="' + data.src + '"/>';
    $('#ppal_image').html(detailHtml);

    zoomImagen(ppalId);
}

/**
 * Se agregan las imagenes secundarias del item principal
 * @param {*} imagenes 
 */
var agregarImagenesSecundarias = function(imagenes) {
    
    // Se recorren las imagenes relacionadas con el item principal 
    var detailHtml = "";
    imagenes.forEach(function callback(currentValue, index, array) {

        var img = "";
        if ( currentValue.url == null ) {
            img = 'assets/images/empty.jpg';
        } else {
            img = urlImg + currentValue.url;
        }
        
        detailHtml += '<div>';
        detailHtml += '<div>';
        detailHtml += '<img src="' + img + '" alt="" id="secimg_' + currentValue.id + '" onmouseover="cambiarImagenPrincipal(this)" class="img-fluid second-img" width="100" height="79">';
        detailHtml += '</div>';
        detailHtml += '<br>';
        detailHtml += '</div>';

    });

    $('#sec_images').html(detailHtml);
}

/**
 * Se agrega la información detallada del producto
 */
var agregarInformacionItemPpal = function(detalles) {

    // Valida el precio del producto basado en la lista a la cual pertenece el cliente
    var valNoList = '';
    if(localStorage.getItem('id') != null ) {

        var listaPrecio = 'precio' + localStorage.getItem('lista_benf');
        var valIvaInc = 'ivaincp' + localStorage.getItem('lista_benf');
        var valor = detalles[listaPrecio];
        var ivaInc = detalles[valIvaInc];            

        if( valDefecto != listaPrecio) {
            valNoList = precioProductoLista(detalles.precio3);
        }

    } else {
        var valor = detalles[valDefecto];
        var ivaInc = detalles[ivaIncDefecto];
    }  
        
    // Nombre del producto
    $('#tituloPpal').html(detalles.descripcion);

    $('#codItem').html('Código ' + detalles.codigo);
    $('#referencia').html('Referencia ' + detalles.referencia);
    $('#unidadFactor').html('Unidades por empaque ' + detalles.unidad_factor);

    if(valNoList != "") {
        $('#delPrice').html(valNoList);
    }

    // Precio de venta del producto
    $('#precioPpal').html(formatearNumero(valor, ivaInc));

    // Descripcion extendida del producto
    $('#descripcionPpal').html(detalles.desc_extensa);

    // Se agrega la cantidad del producto por defecto
    $('#uniFactor').val(detalles.unidad_factor);
    $('#uniFactorHid').val(detalles.unidad_factor);
    $('#codHid').val(detalles.codigo);
    $('#descHid').val(detalles.descripcion + '<br> Ref. ' + detalles.referencia);
    
}

// Agrega o quita el resaltado del carrito de ventas
var overCar = function(data) {
    $('#' + data.id).removeClass('text-secondary');
}
var leaveCar = function(data) {
    $('#' + data.id).addClass('text-secondary');
}

/**
 * Se agrega la información de los items relacionados por grupo
 * @param {*} grupo 
 */
var agregarItemsPorGrupo = function(grupo) {
    var gruposHtml = "";

    grupo.forEach( element => {
        var imagenes = [];
        var urlImagen = new Object();
        urlImagen.url = element.url_imagen;
        imagenes['0'] = urlImagen;

        // Se obtiene la imagen principal si existe
        var img = obtenerImagenProducto(imagenes);
        
        // Valida el precio del producto basado en la lista a la cual pertenece el cliente
        var valNoList = '';
        if(localStorage.getItem('id') != null ) {

            var listaPrecio = 'precio' + localStorage.getItem('lista_benf');
            var valIvaInc = 'ivaincp' + localStorage.getItem('lista_benf');
            var valor = element[listaPrecio];
            var ivaInc = element[valIvaInc];            

            if( valDefecto != listaPrecio) {
                valNoList = precioProductoLista(element.precio3);
            }

        } else {
            var valor = element[valDefecto];
            var ivaInc = element[ivaIncDefecto];
        }

        // Formatea la descripcion extensa del producto
        var descExt = obtenerNombreProducto(element.desc_extensa, 21);        

        // Se obtiene el valor de venta del producto formateado
        var valPdr = obtenerPrecioProducto(valor, ivaInc);

        var codRef = '<br><p>Cod ' + element.codigo + '. Ref ' + element.referencia +  '</p>';

        // Se crea el html de los productos relacionados por grupo
        gruposHtml += '<div class="col-md-3">';
        gruposHtml += '<div class="product-item">';
        gruposHtml += '<a href="#" data-idProd="' + element.item_id + '" onclick="redirectItemDetail(this)"><img src="' + img + '" alt="" title="' + element.descripcion + '" width="215" height="170"></a>';
        gruposHtml += '<div class="down-content" style=" height: 220px !important;">';
        gruposHtml += '<a href="#" data-idProd="' + element.item_id + '" onclick="redirectItemDetail(this)"><h4 title="' + element.descripcion + '">' + element.descripcion + codRef + '</h4></a>';
        gruposHtml += '<input type="hidden" id="title_' + element.item_id + '" value="' + element.descripcion + '">';
        gruposHtml += valNoList + '<h6>' + valPdr + '</h6>';
        gruposHtml += '<p title="' + element.desc_extensa + '">' + descExt + '</p>';
        gruposHtml += '</div>';
        gruposHtml += '<div class="text-right" style="margin:10px;"><i class="fa fa-shopping-cart fa-lg text-secondary" id="carritoCompras_' + element.item_id + '" title="Agregar al carrito" onmouseleave="leaveCar(this)" onmouseover="overCar(this)" onclick="agregarAlCarritoDesdeGrupo(this)"></i></div>';
        gruposHtml += '</div>';
        gruposHtml += '</div>';
    })

    $('#imgGrupos').html(gruposHtml);
}

/**
 * Se agrega la información de los items relacionados por linea
 * @param {*} linea
 */
var agregarItemsPorLinea = function(linea) {
    var lineaHtml = "";

    linea.forEach( element => {

        // Se obtiene la imagen principal si existe
        var img = obtenerImagenProducto(imagenes);

        // Se obtiene la descripcion del producto formateada para un tamaño adecuado
        var descripcion = obtenerNombreProducto(element.descrip);

        // Se obtiene el valor de venta del producto formateado
        var valPdr = obtenerPrecioProducto(element.precio3, element.iva_inc_p3);

        // Se crea el html de los productos relacionados por linea
        lineaHtml += '<div class="col-md-3">';
        lineaHtml += '<div class="product-item">';
        lineaHtml += '<a href="#" data-idProd="' + element.cod_item + '" onclick="redirectItemDetail(this)"><img src="' + img + '" alt="" title="' + element.descrip + '" width="215" height="170"></a>';
        lineaHtml += '<div class="down-content">';
        lineaHtml += '<a href="#" data-idProd="' + element.cod_item + '" onclick="redirectItemDetail(this)"><h4 title="' + element.descrip + '">' + descripcion + '</h4></a>';
        lineaHtml += '<h6>' + valPdr + '</h6>';
        lineaHtml += '</div>';
        lineaHtml += '</div>';
        lineaHtml += '</div>';
    })

    $('#imgLineas').html(lineaHtml);
}

/**
 * Formatea el número a un precio
 * @param {*} precioVenta 
 */
var formatearNumero = function(precioVenta, ivaInc) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      });
    
    if (precioVenta != "" ) {
        var iva = ivaInc == '1' ? ' IVA incluido' : ' + IVA';
        precioVenta = '<b>' + formatter.format(precioVenta).toString() + "</b> COP" + '<p>' + iva + '</p>';
    }

    return precioVenta;
}

/**
 * General el html con la información del detalle del producto
 * @param {*} data 
 */
var generarVistaDetalladaItem = function(data, grupo, imagenes) {

    // Se agrega la imagen principal
    agregarImagenPrincipal(imagenes);

    // Se agregan las imagenes secundarias
    if( imagenes != null ){
        agregarImagenesSecundarias(imagenes);
    } else {
        $('#sec_images').html('');
    }
     
    // Se agrega información detallada del producto
    agregarInformacionItemPpal(data['0']);

    // Se agrega la informacion de los items por grupo
    agregarItemsPorGrupo(grupo);

    // // Se agrega la información de los items por linea
    // agregarItemsPorLinea(data.data.linea);
}

/**
 * Funcion para obtener un producto especifico, detalles y 
 * productos similares relacionados
 */
var obtenerInfoDetalladaProducto = function() {
    var id = sessionStorage.getItem('idProd');

    if( id == null) {
        bootbox.alert('Debe seleccionar un producto');
        window.location.href = urlEC + "index";
    } else {
        //se obtienen los productos
        $.ajax({
            method: "GET",
            url: urlC + "item/obtener",
            data: { idItem: id },
            success: function(respuesta) {
                if ( respuesta.estado ) {
                    generarVistaDetalladaItem(respuesta.data, respuesta.grupo, respuesta.imagenes);
                } else {
                    bootbox.alert('no fue posible obtener el producto.')                
                }                
            },
            error: function() {
                bootbox.alert('Se presentó un error. Por favor, inténtelo nuevamente.');
            }
        });
    }      
}

var putLoaders = function( cant = 3, cantGrp = 8 ) {

    // Se crean los loaders para las imagenes secundarias
    var detailHtml = "";
    for( var i = 0; i < cant; i++ ){
        
        detailHtml += '<div>';
        detailHtml += '<div class="cont_img_ppal2">';
        detailHtml += '<img src="assets/images/empty.jpg" class="img-fluid" width="100" height="79">';
        detailHtml += '<div class="centrado2"><i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i></div>';
        detailHtml += '</div>';
        detailHtml += '<br>';
        detailHtml += '</div>';

    }

    $('#sec_images').html(detailHtml);    

    // Se crea el loader para la imagen principal
    var detailHtml = "";
    detailHtml += '<div class="cont_img_ppal"><img src="assets/images/empty.jpg" class="img-fluid " width="450" height="355"/>';
    detailHtml += '<div class="centrado"><i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i></div></div>'
    $('#ppal_image').html(detailHtml);

    // Se crea el loader para la seccion de productos de interes
    var gruposHtml = "";    

    for( var i = 0; i < cantGrp; i++) {       

        gruposHtml += '<div class="col-md-3">';
        gruposHtml += '<div class="product-item">';
        gruposHtml += '<div style="position: relative">';
        gruposHtml += '<a href="#"><img src="assets/images/empty.jpg" width="215" height="170"></a>';                
        gruposHtml += '</div>';
        gruposHtml += '<div class="down-content text-center">';
        gruposHtml += '<i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i>';
        gruposHtml += '</div>';        
        gruposHtml += '</div>';
        gruposHtml += '</div>';    
    }
  
    $('#imgGrupos').html(gruposHtml);

}


$( document ).ready(function() {
    putLoaders(3, 8);
    obtenerInfoDetalladaProducto();
});