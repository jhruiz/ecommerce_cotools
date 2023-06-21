var valDefecto = 'precio3';
var ivaIncDefecto = 'ivaincp3';

/**
 * Redirecciona a la pagina de detalles del producto y guarda en sesion el id de producto
 * @param {*} id 
 */
 var redirectItemDetail = function(data) {
    sessionStorage.setItem('idProd', $(data).data('idprod'));
    window.location.href = urlEC + "product-details.php";
}

/**
 * Genera la información de la vista del modal del carrito de compras
 * @param {*} data 
 */
 var generarVistaDetalleItem = function(data, imgItems) {

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

    var imageUrl = new Object();
    var imagen = [];
    imageUrl.url = imgItems[data['0'].item_id];
    imagen.push(imageUrl);

    var img = obtenerImagenProducto(imagen);

    $('#formAgregarItemLabel').html( data['0'].descripcion );
    $('#itmCodigo').html('Código ' + data['0'].codigo);
    $('#referencia').html('Referencia ' + data['0'].referencia);
    $('#unidadFactor').html('Unidades por empaque ' + data['0'].unidad_factor);
    $('#uniFactorHid').val(data['0'].unidad_factor);
    $('#uniFactor').val(data['0'].unidad_factor);
    $('#descHid').val(data['0'].descripcion + '<br> Ref. ' + data['0'].referencia);
    $('#codHid').val(data['0'].codigo);
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
    generarVistaModal(arrData['1']);
    $.ajax({
        method: "GET",
        url: urlC + "item/obtener",
        data: { idItem: arrData['1'] },
        success: function(respuesta) {
            if ( respuesta.estado ) {                
                generarVistaDetalleItem(respuesta.data, respuesta.imgItems);
            } else {                
                bootbox.alert('no fue posible obtener el producto.');
            }                
        },
        error: function() {
            bootbox.alert('Se presentó un error. Por favor, inténtelo nuevamente.');
        }
    });
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
 var generarVistaImagenes = function( data, imgItems ) {

    var listPdrHtml = "";

    data.forEach(element => {

        var urlImg = new Object();
        var imagenes = [];
        urlImg.url = imgItems[element.item_id];
        imagenes.push(urlImg);

        // Valida si existen imagenes para el producto, de no ser asi, agrega una por defecto
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

        var valPdr = obtenerPrecioProducto(valor, ivaInc);        

        // Formatea la descripcion extensa del producto
        var descExt = obtenerNombreProducto(element.desc_extensa, 22);

        var codRef = '<br><p>Cod ' + element.codigo + '. Ref ' + element.referencia +  '</p>';

        listPdrHtml += '<div class="col-md-3">';
        listPdrHtml += '<div class="product-item">';
        listPdrHtml += '<a href="#" data-idProd="' + element.item_id + '" onclick="redirectItemDetail(this)"><img src="' + img + '" alt="" title="' + element.descripcion + '" width="200" height="150"></a>';
        listPdrHtml += '<div class="down-content" style="height: 220px !important;">';
        listPdrHtml += '<a href="#" data-idProd="' + element.item_id + '" onclick="redirectItemDetail(this)"><h4 title="' + element.descripcion + '">' + element.descripcion + codRef +'</h4></a>';
        listPdrHtml += '<input type="hidden" id="title_' + element.item_id + '" value="' + element.descripcion + '">';
        listPdrHtml += valNoList + '<h6>' + valPdr + '</h6>';
        listPdrHtml += '<p title="' + element.desc_extensa + '">' + descExt + '</p>';        
        listPdrHtml += '</div>';
        listPdrHtml += '<div class="text-right" style="margin:10px;"><i class="fa fa-shopping-cart fa-lg text-secondary" id="carritoCompras_' + element.item_id + '" title="Agregar al carrito" onmouseleave="leaveCar(this)" onmouseover="overCar(this)" onclick="agregarAlCarrito(this)"></i></div>';
        listPdrHtml += '</div>';
        listPdrHtml += '</div>';
    });

    $('#grd_items_grupos').html(listPdrHtml);
}

/**
 * Se obtienen las imagenes relacionadas al grupo
 * @param {*} data 
 */
function obtenerItemsGrupo(data) {

    putLoaders(4);

    setearUbicacionGrupo(data.id);
    
    var arrGrupoId = data.id.split('_');

    $.ajax({
        method: "GET",
        url: urlC + "itemsgrupo/obtener",
        data: { grupoId: arrGrupoId['1'] },
        success: function(respuesta) {

            if ( respuesta.estado ) {
                generarVistaImagenes(respuesta.data, respuesta.imgItems);
            } else {
                bootbox.alert('no fue posible obtener los items del grupo.', function(){
                    $('#grd_items_grupos').html('');
                });                
            }
            
        },
        error: function() {
            console.log('hubo un error');
        }
    }); 
    
}

/**
 * Crea la grilla con la información de los grupos de datax
 * @param {*} data 
 */
var crearGrillaGrupos = function(data) {
    var htmlGrupos = "";

    data.forEach(element => {

        htmlGrupos += '<div class="col-md-6">';
        htmlGrupos += '<button type="button" id="gru_' + element.id + '" class="button-group  btn-block" onclick="obtenerItemsGrupo(this)"><strong>' + element.descripcion + '</strong></button>'
        htmlGrupos += '</div>';    
        
    });

    $('#grd_grupos').html(htmlGrupos);
}

/**
 * Obtiene la información de los grupos filtrados por la categoria
 */
var obtenerGrupos = function() {

    var categoria = sessionStorage.getItem('categoriaId');

    $.ajax({
        method: "GET",
        url: urlC + "gruposcategorias/obtener",
        data: { categoriaId: categoria },
        success: function(respuesta) {
            if ( respuesta.estado ) {
                crearGrillaGrupos(respuesta.data);                
            } else {
                bootbox.alert('no fue posible obtener los grupos.');                
            }
            
        },
        error: function() {
            console.log('hubo un error');
        }
      });     
}

/**
 * Obtiene la categoria seleccionada y la guarda en el storage
 */
 function obtenerGruposCategoria(data) {
    // Obtiene el id de la categoria y el texto
    var arrCat = data.id.split('_');
    var nameCat = $('#' + data.id).text();

    // Guarda en el storage las variables de la categoria seleccionada
    sessionStorage.setItem('categoriaId', arrCat['1']);
    sessionStorage.setItem('categoriaName', nameCat);

    // Borra los productos de la categoria anteriormente seleccionada
    $('#grd_items_grupos').html("");

    // Funcion que obtiene los grupos y setea el indicador
    obtenerGrupos();
    setearValores();
}

/**
 * Crea el input tipo select de las categorias
 * @param {*} data 
 */
var crearListaCategorias = function(data) {
    var htmlCat = "";

    data.forEach( element => {
        htmlCat += '<button type="button" id="cat_' + element.id + '" class="list-group-item list-group-item-action" onclick="obtenerGruposCategoria(this)"><p><i class="fa fa-angle-double-right"></i> ' + element.descripcion + '</p></button>';
    });

    $('#listaCat').html(htmlCat);
}

/**
 * Obtiene las categorias configuradas en cotools
 */
 var obtenerCategorias = function() {
    $.ajax({
        method: "GET",
        url: urlC + "categorias/obtener",
        success: function(respuesta) {

            if ( respuesta.estado ) {
                crearListaCategorias(respuesta.data);
            } else {
                bootbox.alert('no fue posible obtener las categorías.')                
            }
            
        },
        error: function() {
            console.log('hubo un error');
        }
      });     
}

/**
 * Setea la información de ubicación del grupo seleccionado
 * @param {*} grupoId 
 */
var setearUbicacionGrupo = function(grupoId) {
    var nGrupo = $('#' + grupoId).text();
    $('#gruSelec').html(' > ' + nGrupo);
    $('#catSelec').removeClass('active-pos');
    $('#gruSelec').addClass('active-pos');
}

/**
 * Setea valores iniciales de la pagina
 */
var setearValores = function() {
    var catName = sessionStorage.getItem('categoriaName');
    $('#catSelec').html(' > ' + catName);
    $('#gruSelec').html('');
    $('#catSelec').addClass('active-pos');
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
 * Crea un loader en forma de grilla de imagenes
 */
 var putLoaders = function(cant = 20) {
    var listPdrHtml = "";    

    for( var i = 0; i < cant; i++) {

        listPdrHtml += '<div class="col-md-3">';
        listPdrHtml += '<div class="product-item">';
        listPdrHtml += '<div style="position: relative">';
        listPdrHtml += '<a href="#"><img src="assets/images/empty.jpg" width="200" height="150"></a>';                
        listPdrHtml += '</div>';
        listPdrHtml += '<div class="down-content text-center">';
        listPdrHtml += '<i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i>';
        listPdrHtml += '</div>';        
        listPdrHtml += '</div>';
        listPdrHtml += '</div>'; 
      
    }

    $('#grd_items_grupos').html(listPdrHtml);

}


$( document ).ready(function() {  
    obtenerCategorias();     
    obtenerGrupos();
    setearValores();
});