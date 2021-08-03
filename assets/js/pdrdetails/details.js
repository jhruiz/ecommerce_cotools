var urlImg = 'https://admin.cotools.co/dist/img/';
var urlC = 'https://cotoolsback.cotools.co/public/';
var urlEC = 'https://cotools.co/';

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
 var precioProductoLista3 = function(precio) {
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
    window.location.href = urlEC + "product-details.html";
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
    if(localStorage.getItem('cod_benf') != null ) {
        if( localStorage.getItem('lista_benf') == '1' ) {
            var valor = detalles.precio1;
            var ivaInc = detalles.iva_inc_p1;
            valNoList = precioProductoLista3(detalles.precio3);
        } else if( localStorage.getItem('lista_benf') == '2' ) {
            var valor = detalles.precio2;
            var ivaInc = detalles.iva_inc_p2;
            valNoList = precioProductoLista3(detalles.precio3);
        } else {
            var valor = detalles.precio3;
            var ivaInc = detalles.iva_inc_p3;
        }

    } else {
        var valor = detalles.precio3;
        var ivaInc = detalles.iva_inc_p3;
    }
        
    // Nombre del producto
    $('#tituloPpal').html(detalles.descrip);

    $('#referencia').html('Referencia ' + detalles.referencia);
    $('#unidadFactor').html('Unidades por empaque ' + detalles.uni_factor);

    if(valNoList != "") {
        $('#delPrice').html(valNoList);
    }

    // Precio de venta del producto
    $('#precioPpal').html(formatearNumero(valor, ivaInc));

    // Descripcion extendida del producto
    $('#descripcionPpal').html(detalles.itm_extens);

    // Se agrega la cantidad del producto por defecto
    $('#uniFactor').val(detalles.uni_factor);
    $('#uniFactorHid').val(detalles.uni_factor);
    $('#codHid').val(detalles.cod_item);
    $('#descHid').val(detalles.descrip + '<br> Ref. ' + detalles.referencia);
    
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

        // Se obtiene la imagen principal si existe
        var img = obtenerImagenProducto(element.imagenes);
        
        // Valida el precio del producto basado en la lista a la cual pertenece el cliente
        var valNoList = '';
        if(localStorage.getItem('cod_benf') != null ) {
            if( localStorage.getItem('lista_benf') == '1' ) {
                var valor = element.precio1;
                var ivaInc = element.iva_inc_p1;
                valNoList = precioProductoLista3(element.precio3);
            } else if( localStorage.getItem('lista_benf') == '2' ) {
                var valor = element.precio2;
                var ivaInc = element.iva_inc_p2;
                valNoList = precioProductoLista3(element.precio3);
            } else {
                var valor = element.precio3;
                var ivaInc = element.iva_inc_p3;
            }

        } else {
            var valor = element.precio3;
            var ivaInc = element.iva_inc_p3;
        }

        // Formatea la descripcion extensa del producto
        var descExt = obtenerNombreProducto(element.itm_extens, 21);        

        // Se obtiene el valor de venta del producto formateado
        var valPdr = obtenerPrecioProducto(valor, ivaInc);

        // Se crea el html de los productos relacionados por grupo
        gruposHtml += '<div class="col-md-3">';
        gruposHtml += '<div class="product-item">';
        gruposHtml += '<a href="#" data-idProd="' + element.cod_item + '" onclick="redirectItemDetail(this)"><img src="' + img + '" alt="" title="' + element.descrip + '" width="215" height="170"></a>';
        gruposHtml += '<div class="down-content">';
        gruposHtml += '<a href="#" data-idProd="' + element.cod_item + '" onclick="redirectItemDetail(this)"><h4 title="' + element.descrip + '">' + element.descrip + '</h4></a>';
        gruposHtml += valNoList + '<h6>' + valPdr + '</h6>';
        gruposHtml += '<p title="' + element.itm_extens + '">' + descExt + '</p>';
        gruposHtml += '<div class="text-right"><i class="fa fa-shopping-cart fa-lg text-secondary" id="carritoCompras_' + element.cod_item + '" title="Agregar al carrito" onmouseleave="leaveCar(this)" onmouseover="overCar(this)" onclick="agregarAlCarritoDesdeGrupo(this)"></i></div>';
        gruposHtml += '</div>';
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
        var img = obtenerImagenProducto(element.imagenes);

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
var generarVistaDetalladaItem = function(data) {

    // Se agrega la imagen principal
    agregarImagenPrincipal(data.data.principal.imagenes);

    // Se agregan las imagenes secundarias
    if(data.data.principal.imagenes != null){
        agregarImagenesSecundarias(data.data.principal.imagenes);
    }
     
    // Se agrega información detallada del producto
    agregarInformacionItemPpal(data.data.principal);

    // Se agrega la informacion de los items por grupo
    agregarItemsPorGrupo(data.data.grupo);

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
        alert('Debe seleccionar un producto');
        window.location.href = urlEC + "index.html";
    } else {
        //se obtienen los productos
        $.ajax({
            method: "GET",
            url: urlC + "get-item-detail",
            data: { idItem: id },
            success: function(respuesta) {
                if ( respuesta.estado ) {
                    generarVistaDetalladaItem(respuesta.data);
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


$( document ).ready(function() {
    obtenerInfoDetalladaProducto();
});