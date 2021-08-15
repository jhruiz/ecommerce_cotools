var pagActual = "1";
var urlImg = 'https://admin.cotools.co/dist/img/';
var urlC = 'https://cotoolsback.cotools.co/public/';
var urlEC = 'https://cotools.co/';
var cantItems = 15;
var cantidadItems = 0;

/**
 * Redirecciona a la pagina de detalles del producto y guarda en sesion el id de producto
 * @param {*} id 
 */
var redirectItemDetail = function(data) {

    sessionStorage.setItem('idProd', $(data).data('idprod'));
    window.location.href = urlEC + "product-details.html";
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
        img = 'assets/images/empty.jpg'
    } else {
        img = urlImg + imagen['0'].url;
    }    

    return img;
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
        valorProducto = formatter.format(precio).toString() + '<p>' + iva + '</p>';
    } else {
        valorProducto = '$0'
    }

    return valorProducto;
}

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
    $('#referencia').html('Referencia ' + data.referencia);
    $('#unidadFactor').html('Unidades por empaque ' + data.uni_factor);
    $('#uniFactorHid').val(data.uni_factor);
    $('#descHid').val(data.descrip + '<br> Ref. ' + data.referencia);
    $('#uniFactor').val(data.uni_factor);
    $('#codHid').val(data.cod_item);
    if(valNoList != "") {
        $('#delPrice').html(valNoList);
    }        
    $('#precioPpal').html(obtenerPrecioProducto(valor, ivaInc));
    var detailHtml = '<img src="' + img + '" width="180" height="200"/>';
    $('#ppal_image').html(detailHtml);    
} 


/**
 * Desplegar modal para agregar producto al carrito de compras
 * @param {*} data 
 */
function agregarAlCarrito(data) {

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


// Agrega o quita el resaltado del carrito de ventas
var overCar = function(data) {
    $('#' + data.id).removeClass('text-secondary');
}
var leaveCar = function(data) {
    $('#' + data.id).addClass('text-secondary');
}

/**
 * Genera la vista de los productos obtenidos desde datax
 * @param {*} data 
 */
var generarVistaImagenes = function(data) {
    $('.spinner-products').hide();

    var listPdrHtml = "";

    data.forEach(element => {

        // Valida si existen imagenes para el producto, de no ser asi, agrega una por defecto
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

        var valPdr = obtenerPrecioProducto(valor, ivaInc);

        // Formatea la descripcion extensa del producto
        var descExt = obtenerNombreProducto(element.itm_extens, 25);

        listPdrHtml += '<div class="col-md-3">';
        listPdrHtml += '<div class="product-item">';
        listPdrHtml += '<a href="#" data-idProd="' + element.cod_item + '" onclick="redirectItemDetail(this)"><img src="' + img + '" alt="" title="' + element.descrip + '" width="357" height="260"></a>';
        listPdrHtml += '<div class="down-content">';
        listPdrHtml += '<a href="#" data-idProd="' + element.cod_item + '" onclick="redirectItemDetail(this)"><h4 title="' + element.descrip + '">' + element.descrip + '</h4></a>';
        listPdrHtml += valNoList + '<h6>' + valPdr + '</h6>';
        listPdrHtml += '<p title="' + element.itm_extens + '">' + descExt + '</p>';
        listPdrHtml += '<div class="text-right"><i class="fa fa-shopping-cart fa-lg text-secondary" id="carritoCompras_' + element.cod_item + '" title="Agregar al carrito" onmouseleave="leaveCar(this)" onmouseover="overCar(this)" onclick="agregarAlCarrito(this)"></i></div>';
        listPdrHtml += '</div>';        
        listPdrHtml += '</div>';
        listPdrHtml += '</div>';
    });
    $('.spinner-products').hide();
    $('#prods_availables').html(listPdrHtml);
}

/**
 * Obtiene los productos disponibles para el e-commerce
 * @param {*} pag 
 */
var getImages = function(pag) {
    $('#prods_availables').html("");
    $('.spinner-products').show();
    if(pag == ""){
        pag = 1;
    }

    //se obtienen los productos
    $.ajax({
        method: "GET",
        url: urlC + "get-items",
        data: { pagina: pag, cantidad: cantItems },
        async: false,
        success: function(respuesta) {

            if ( respuesta.estado ) {
                generarVistaImagenes(respuesta.data); 
                cantidadItems = respuesta.cantidad;                               
            } else {
                alert('no fue posible obtener los productos.')                
            }
            
        },
        error: function() {
            console.log('hubo un error');
        }
      });  
}

/**
 * Cambia a la anterior pagina basado en la actual
 */
function previusPage() {    
    $('.li_paginate').removeClass("active");
    pagActual = parseInt(pagActual) - 1;

    getImages(pagActual);
    paginador();
}

/**
 * Cambia a la siguiente pagina basado en la actual
 */
function nextPage() {
    $('.li_paginate').removeClass("active");
    pagActual = parseInt(pagActual) + 1;

    getImages(pagActual);
    paginador();
}

/**
 * Cambia de pagina actual por la selecionada
 * @param {*} data 
 */
function changePag(data) {
    var arrPg = data.id.split("_");
    pagActual = arrPg['1'];

    $('.li_paginate').removeClass("active");

    getImages(pagActual);
    paginador();
} 

/**
 * Pinta el full paginador en el html
 */
var paginador = function() {

    var cantPag = Math.ceil(cantidadItems/cantItems);
    var cantVisible = 5;

    var pagHtml = "";

    if(parseInt(pagActual) > 1){
        pagHtml += '<li><a href="#" onclick="previusPage()"><i class="fa fa-angle-double-left"></i></a></li>';
    }
    
    pagHtml += '<li class="li_paginate" id="li_1"><a href="#" onclick="changePag(this)" id="apg_1">1</a></li>';

    if(parseInt(pagActual) == 1 ) {
        for(var i = 2; i <= cantVisible; i++) {
            pagHtml += '<li class="li_paginate" id="li_' + i + '"><a href="#" onclick="changePag(this)" id="apg_' + i + '">' + i + '</a></li>';
        }
    }

    if(parseInt(pagActual) > 1 && parseInt(pagActual) < cantVisible) {
        for(var i = 2; i <= cantVisible; i++) {
            pagHtml += '<li class="li_paginate" id="li_' + i + '"><a href="#" onclick="changePag(this)" id="apg_' + i + '">' + i + '</a></li>';
        }
    }

    if(parseInt(pagActual) >= cantVisible) {
        pagHtml += '<li class="li_paginate"><a href="#">...</a></li>';
        pagHtml += '<li class="li_paginate" id="li_' + (parseInt(pagActual)-2) + '"><a href="#" onclick="changePag(this)" id="apg_' + (parseInt(pagActual)-2) + '">' + (parseInt(pagActual)-2) + '</a></li>';
        pagHtml += '<li class="li_paginate" id="li_' + (parseInt(pagActual)-1) + '"><a href="#" onclick="changePag(this)" id="apg_' + (parseInt(pagActual)-1) + '">' + (parseInt(pagActual)-1) + '</a></li>';
        pagHtml += '<li class="li_paginate" id="li_' + (parseInt(pagActual)) + '"><a href="#" onclick="changePag(this)" id="apg_' + (parseInt(pagActual)) + '">' + (parseInt(pagActual)) + '</a></li>';
        pagHtml += '<li class="li_paginate" id="li_' + (parseInt(pagActual)+1) + '"><a href="#" onclick="changePag(this)" id="apg_' + (parseInt(pagActual)+1) + '">' + (parseInt(pagActual)+1) + '</a></li>';
        pagHtml += '<li class="li_paginate" id="li_' + (parseInt(pagActual)+2) + '"><a href="#" onclick="changePag(this)" id="apg_' + (parseInt(pagActual)+2) + '">' + (parseInt(pagActual)+2) + '</a></li>';
    }

    if(pagActual != cantPag) {
        pagHtml += '<li class="li_paginate"><a href="#">...</a></li>';
    }

    // Agrega la ultima pagina
    pagHtml += '<li class="li_paginate" id="li_' + cantPag + '"><a href="#" onclick="changePag(this)" id="apg_' + cantPag + '">' + cantPag + '</a></li>';

    // Agrega el boton next
    pagHtml += '<li><a href="#" onclick="nextPage()"><i class="fa fa-angle-double-right"></i></a></li>';

    // Valida que la pagina no se encuentre entre las 5 finales
    if(parseInt(pagActual) >= ((parseInt(cantPag) - parseInt(cantVisible))+1)) {
        pagHtml = '<li><a href="#" onclick="previusPage()"><i class="fa fa-angle-double-left"></i></a></li>';    
        pagHtml += '<li class="li_paginate" id="li_1"><a href="#" onclick="changePag(this)" id="apg_1">1</a></li>';        
        pagHtml += '<li class="li_paginate"><a href="#">...</a></li>';

        if(parseInt(pagActual) < parseInt(cantPag)) {

            var k = parseInt(cantVisible - (parseInt(cantPag) - parseInt(pagActual)));
            
            for(k; k > 0 ; k--) {
                pagHtml += '<li class="li_paginate" id="li_' + (parseInt(pagActual) - k) + '"><a href="#" onclick="changePag(this)" id="apg_' + (parseInt(pagActual) - k) + '">' + (parseInt(pagActual) - k) + '</a></li>';
            }

            for(var i = parseInt(pagActual); i <= cantPag; i++) {
                pagHtml += '<li class="li_paginate" id="li_' + i + '"><a href="#" onclick="changePag(this)" id="apg_' + i + '">' + i + '</a></li>';
            }
        }

        // Valida si la pagina seleccionada es igual a la cantidad de paginas actual
        if(parseInt(pagActual) == parseInt(cantPag)) {
            pagHtml += '<li class="li_paginate" id="li_' + (parseInt(pagActual)-4) + '"><a href="#" onclick="changePag(this)" id="apg_' + (parseInt(pagActual)-4) + '">' + (parseInt(pagActual)-4) + '</a></li>';
            pagHtml += '<li class="li_paginate" id="li_' + (parseInt(pagActual)-3) + '"><a href="#" onclick="changePag(this)" id="apg_' + (parseInt(pagActual)-3) + '">' + (parseInt(pagActual)-3) + '</a></li>';
            pagHtml += '<li class="li_paginate" id="li_' + (parseInt(pagActual)-2) + '"><a href="#" onclick="changePag(this)" id="apg_' + (parseInt(pagActual)-2) + '">' + (parseInt(pagActual)-2) + '</a></li>';
            pagHtml += '<li class="li_paginate" id="li_' + (parseInt(pagActual)-1) + '"><a href="#" onclick="changePag(this)" id="apg_' + (parseInt(pagActual)-1) + '">' + (parseInt(pagActual)-1) + '</a></li>';
            pagHtml += '<li class="li_paginate" id="li_' + pagActual + '"><a href="#" onclick="changePag(this)" id="apg_' + pagActual + '">' + pagActual + '</a></li>';
        }

        if(parseInt(pagActual) != parseInt(cantPag)){
            pagHtml += '<li><a href="#" onclick="nextPage()"><i class="fa fa-angle-double-right"></i></a></li>';
        }
    }

    $('#ul_paginator').html(pagHtml);

    $('#li_' + pagActual).addClass("active");

}

/**
 * Buscar productos por palabra clave
 */
function buscarProductos() {
    $('.spinner-products').show();
    var descProd = $('#inpProductoPC').val();
    $('#prods_availables').html("");
    if(descProd != "") {
        $.ajax({
            method: "GET",
            url: urlC + "get-items-name",
            data: { descripcion: descProd },
            success: function(respuesta) {
    
                if ( respuesta.estado ) {
                    $('#ul_paginator').html("");
                    generarVistaImagenes(respuesta.data);                    
                } else {
                    bootbox.alert('no fue posible obtener los productos.')                
                }
                
            },
            error: function() {
                console.log('hubo un error');
            }
        });
    } else {
        getImages(pagActual);
        paginador();
    }
}

$( document ).ready(function() {  
    getImages(pagActual);   
    paginador(); 
});