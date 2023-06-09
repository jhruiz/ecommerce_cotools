/**
 * Validar si se diligenció el formulario
 */
var validarCampos = function() {
    var mensaje = "";
    mensaje += $('#email').val() == "" ? '- El campo email es obligatorio.<br>' : '';
    mensaje += $('#dptos').val() == "" ? '- El campo departamentos es obligatorio.<br>' : '';
    mensaje += $('#cities').val() == "" ? '- El campo ciudades es obligatorio.<br>' : '';
    mensaje += $('#direction').val() == "" ? '- El campo dirección es obligatorio.<br>' : '';
    mensaje += $('#cellphone').val() == "" ? '- El campo celular es obligatorio.<br>' : '';

    return mensaje;
}

/**
 * Actualiza la informacion del cliente
 */
var actualizarDataCliente = function() {
    var mensaje = validarCampos();

    if(mensaje == "") {
        $('#updateClient').hide();

        $.ajax({
            method: "GET",
            url: urlC + "usuario/autoactualiza",
            data: {
                user: localStorage.getItem('id'),
                email: $('#email').val(),
                ciudad: $('#cities').val(),
                direccion: $('#direction').val(),
                celular: $('#cellphone').val(),
                telefono: $('#telephone').val()
            },
            success: function(respuesta) {
                if(!respuesta.estado){
                    bootbox.alert(respuesta.mensaje);
                } else if (respuesta.estado) {
                    bootbox.alert('El usuario ha sido actualizado de forma correcta.', function(){

                        // Se actualiza el local storage
                        localStorage.setItem('ciudad', $( "#cities option:selected" ).text());
                        localStorage.setItem('direccion', $('#direction').val());
                        localStorage.setItem('email', $('#email').val());
                        localStorage.setItem('telef_benf', $('#cellphone').val());

                        // Se actualiza la informacion de envío en la vista
                        $('#nameUser').html(localStorage.getItem('nom_benf'));
                        $('#emailUser').html(localStorage.getItem('email'));
                        $('#telUser').html(localStorage.getItem('telef_benf'));
                        $('#locUser').html(localStorage.getItem('ciudad') + ' ' + localStorage.getItem('direccion'));

                        // Cierra el modal
                        $('#formEditClient').modal('hide');
                    });
                }                
            },
            error: function() {
                console.log('Error al actualizar el usuario.');
            }
        });

        $('#updateClient').show();
     
    } else {
        bootbox.alert(mensaje);  
    }    
}

/**
 * Crear el dropdown de ciudades
 */
var crearListaCiudades = function(data, ciudad_id) {
    var htmlCities = '<option value="">Ciudades*</option>';

    data.forEach( element => {
        htmlCities += '<option value="' + element.id + '">' + element.descripcion + '</option>';
    });

    $('#cities').html(htmlCities);

    // Si llega la ciudad por parametro, la preselecciona
    if(ciudad_id != null) {
        $('#cities').val(ciudad_id);
    }
}

/**
 * Obtiene las ciudades por departamento
 */
var obtenerCiudades = function(dptoId = null, ciudad_id = null) { 
    
    dptoId = dptoId == null ? $('#dptos').val() : dptoId;    
        
    if(dptoId != "") {
        $.ajax({
            method: "GET",
            url: urlC + "ciudades/obtener",
            data: { dptoId : dptoId },
            success: function(respuesta) {
                if(respuesta.estado) {
                    crearListaCiudades(respuesta.data, ciudad_id);
                }                
            },
            error: function() {
                bootbox.alert('Error al obtener las ciudades');
            }
        }); 
    } else {
        console.log('Debe seleccionar un departamento');
    }

}

/**
 * Se crea la lista de departamentos con la información obtenida por ajax
 * @param {*} data 
 */
var crearListaDptos = function(data, dpto_id) {
    var htmlDptos = '<option value="">Departamentos*</option>';

    data.forEach( element => {
        htmlDptos += '<option value="' + element.id + '">' + element.descripcion + '</option>';
    });

    $('#dptos').html(htmlDptos); 
    $('#dptos').val(dpto_id);    
}

/**
 * Obtiene el listado de departamentos
 */
var obtenerDepartamentos = function(dpto_id) {
    $.ajax({
        method: "GET",
        url: urlC + "departamentos/obtener",
        success: function(respuesta) {
            if(respuesta.estado) {
                crearListaDptos(respuesta.data, dpto_id);
            }                
        },
        error: function() {
            console.log('Error al obtener los departamentos');
        }
    });    
}

/**
 * Diligencia la información del cliente
 * @param {*} data 
 */
var generarFormularioCliente = function(data) {

    obtenerDepartamentos(data['0'].departamento);
    obtenerCiudades(data['0'].departamento, data['0'].ciudad_id);    

    $('#name').val(data['0'].primer_nombre + ' ' + data['0'].segundo_nombre);
    $('#lastnames').val(data['0'].primer_apellido + ' ' + data['0'].segundo_apellido);
    $('#identification').val(data['0'].nit);
    $('#email').val(data['0'].email);
    $('#direction').val(data['0'].direccion);
    $('#telephone').val(data['0'].telefono);
    $('#cellphone').val(data['0'].celular);
    $('#formEditClient').modal('show');
}

/**
 * Se obtiene la información del usuario para actualizar datos
 */
var obtenerInfoCliente = function() {
    var userId = localStorage.getItem('id');

    if(userId != ""){
        $.ajax({
            method: "GET",
            url: urlC + "usuario/obtener",
            data: { usuarioId : userId },
            success: function(respuesta) {
                if(respuesta){
                    generarFormularioCliente(respuesta.data);
                }            
            },
            error: function() {
                bootbox.alert('Se produjo un error. Por favor, inténtelo nuevamente.');
            }
        });
    } else {
        bootbox.alert("No se logró acceder a la información del usuario. Por favor, inténtelo nuevamente.");
    }    
}


$( document ).ready(function() {
    $('#editClient').click(obtenerInfoCliente);
});