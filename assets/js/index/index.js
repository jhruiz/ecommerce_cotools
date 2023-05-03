var pagActual = "1";
// var urlImg = 'https://admin.cotools.co/dist/img/';
// var urlC = 'https://cotoolsback.cotools.co/public/';
// var urlEC = 'https://cotools.co/';
var urlImg = 'http://localhost:85/cotoolsadmfront/dist/img/';
var urlC = 'http://localhost:85/cotoolsback/public/';
var urlEC = 'http://localhost:85/ecommerce_cotools/';
var cantItems = 20;
var cantidadItems = 0;
var valDefecto = 'precio3';
var ivaIncDefecto = 'ivaincp3';

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
var obtenerImagenProducto = function(item_id, imgItems) {
    var img = "";
    if( typeof(imgItems[item_id]) == "undefined" ){
        img = 'assets/images/empty.jpg'
    } else {
        img = urlImg + imgItems[item_id];
    }    

    return img;
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

    var img = obtenerImagenProducto(data['0'].item_id ,imgItems);

    $('#formAgregarItemLabel').html( data['0'].descripcion );
    $('#itmCodigo').html('Código ' + data['0'].codigo);
    $('#referencia').html('Referencia ' + data['0'].referencia);
    $('#unidadFactor').html('Unidades por empaque ' + data['0'].unidad_factor);
    $('#uniFactorHid').val(data['0'].unidad_factor);
    $('#descHid').val(data['0'].descripcion + '<br> Ref. ' + data['0'].referencia);
    $('#uniFactor').val(data['0'].unidad_factor);
    $('#codHid').val(data['0'].codigo);
    if(valNoList != "") {
        $('#delPrice').html(valNoList);
    }        
    $('#precioPpal').html(obtenerPrecioProducto(valor, ivaInc));
    var detailHtml = '<img src="' + img + '" width="180" height="200"/>';
    $('#ppal_image').html(detailHtml);    
} 

/**
 * Genera una vista previa del modal de agregar un producto al carrito
 */
var generarVistaModal = function(id) {
    $('#formAgregarItemLabel').html($('#title_' + id).val());
    $('#itmCodigo').html('Código');
    $('#referencia').html('Referencia ');
    $('#unidadFactor').html('Unidades por empaque');
    $('#uniFactorHid').val('');
    $('#descHid').val('');
    $('#uniFactor').val('');
    $('#codHid').val('');
    $('#delPrice').html('');
    $('#precioPpal').html('');    
    var detailHtml = '<div class="cont_img_ppal"><img src="assets/images/empty.jpg" width="180" height="200"/>';
    detailHtml += '<div class="centrado"><i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i></div></div>'
    $('#ppal_image').html(detailHtml);       
    $('#formAgregarItem').modal('toggle'); 
}

/**
 * Desplegar modal para agregar producto al carrito de compras
 * @param {*} data 
 */
function agregarAlCarrito(data) {

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

    var listPdrHtml = "";

    data.data.forEach(element => {

        // Valida si existen imagenes para el producto, de no ser asi, agrega una por defecto
        var img = obtenerImagenProducto(element.item_id, data.imgItems);
        
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

        var valPdr = obtenerPrecioProducto(valor, ivaInc);

        // Formatea la descripcion extensa del producto
        var descExt = obtenerNombreProducto(element.desc_extensa, 25);

        var codRef = '<br><p>Cod ' + element.codigo + '. Ref ' + element.referencia +  '</p>';

        listPdrHtml += '<div class="col-md-3">';
        listPdrHtml += '<div class="product-item">';
        listPdrHtml += '<a href="#" data-idProd="' + element.item_id + '" onclick="redirectItemDetail(this)"><img src="' + img + '" alt="" title="' + element.descripcion + '" width="357" height="260"></a>';
        listPdrHtml += '<div class="down-content" style="height: 250px !important;">';
        listPdrHtml += '<a href="#" data-idProd="' + element.item_id + '" onclick="redirectItemDetail(this)"><h4 title="' + element.descripcion + '">' + element.descripcion + codRef + '</h4></a>';
        listPdrHtml += '<input type="hidden" id="title_' + element.item_id + '" value="' + element.descripcion + '">';
        listPdrHtml += valNoList + '<h6>' + valPdr + '</h6>';
        listPdrHtml += '<p title="' + element.desc_extensa + '">' + descExt + '</p>';
        listPdrHtml += '</div>';        
        listPdrHtml += '<div class="text-right" style="margin:10px;"><i class="fa fa-shopping-cart fa-lg text-secondary" id="carritoCompras_' + element.item_id + '" title="Agregar al carrito" onmouseleave="leaveCar(this)" onmouseover="overCar(this)" onclick="agregarAlCarrito(this)"></i></div>';
        listPdrHtml += '</div>';
        listPdrHtml += '</div>';
    });
    $('#ul_paginator').html('');
    $('#prods_availables').html(listPdrHtml);
}

/**
 * Obtiene los productos disponibles para el e-commerce
 * @param {*} pag 
 */
var getImages = function(pag) {

    if(pag == ""){
        pag = 1;
    }

    //se obtienen los productos
    $.ajax({
        method: "GET",
        url: urlC + "itemsecommerce/obtener",
        data: { pagina: pag, cantidad: cantItems },
        async: true,
        success: function(respuesta) {            

            if ( respuesta.estado ) {
                /** Genera la grilla de imagenes */
                generarVistaImagenes(respuesta); 

                /** Obtiene la cantidad total de items en stock */
                cantidadItems = respuesta.cantidad;

                /** Agrega el paginador */
                paginador();                             
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

    putLoaders(20);
    getImages(pagActual);
    paginador();
}

/**
 * Cambia a la siguiente pagina basado en la actual
 */
function nextPage() {
    $('.li_paginate').removeClass("active");
    pagActual = parseInt(pagActual) + 1;
    
    putLoaders(20);
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

    putLoaders(20);
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
    var descProd = $('#inpProductoPC').val();
    putLoaders(8);
    if(descProd != "") {
        $.ajax({
            method: "GET",
            url: urlC + "items/buscaritem",
            data: { descripcion: descProd },
            success: function(respuesta) {
    
                if ( respuesta.estado ) {
                    generarVistaImagenes(respuesta);                    
                } else {
                    bootbox.alert('no fue posible obtener los productos.', function(){
                        $('#ul_paginator').html('');
                        $('#prods_availables').html('');
                    });
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

/**
 * Crea un loader en forma de grilla de imagenes
 */
var putLoaders = function(cant = 20) {
    var listPdrHtml = "";    

    for( var i = 0; i < cant; i++) {

        listPdrHtml += '<div class="col-md-3">';
        listPdrHtml += '<div class="product-item">';
        listPdrHtml += '<div style="position: relative">';
        listPdrHtml += '<a href="#"><img src="assets/images/empty.jpg" width="357" height="260"></a>';                
        listPdrHtml += '</div>';
        listPdrHtml += '<div class="down-content text-center">';
        listPdrHtml += '<i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i>';
        listPdrHtml += '</div>';        
        listPdrHtml += '</div>';
        listPdrHtml += '</div>';    
    }

    $('#prods_availables').html(listPdrHtml);

}


$( document ).ready(function() {   

    /**Agrega los loaders */
    putLoaders(20);

    /**Obtiene los items y sus imagenes */
    getImages(pagActual);  

    /**Agrega el evento de presionar enter cuando se encuentra en el input de buscar productos */
    $('#inpProductoPC').keypress(function(e){
        if(e.keyCode == 13){
            buscarProductos();
        }
    });

});