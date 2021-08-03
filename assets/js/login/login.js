var urlC = 'https://cotoolsback.cotools.co/public/';

function suscribirse() {
    window.open('https://admin.cotools.co/pages/usuarios/externos.html', '_blank');
}

/**
 * Funcion logout
 */
function logoutUser() {
    bootbox.confirm("¿Está seguro que desea salir?", function(result){ 
        if( result ) {
            localStorage.clear();
            location.reload();
        }
    });
}

/**
 * Valida si se diligenció correctamente el formulario
 * @param {*} usuario 
 * @param {*} password 
 * @returns 
 */
var validarLogin = function(usuario, password) {

    if(usuario == "" || password == "") {
        return false;
    }

    return true;
}

/**
 * Funcion para realizar el login del usuario cliente
 */
function loginUser() {
    var user = $('#user').val();
    var password = $('#password').val();

    if(validarLogin(user, password)) {
        $.ajax({
            method: "GET",
            url: urlC + "login-user",
            data: { user: user, password: password },
            success: function(respuesta) {

                if( respuesta.estado ) {
                    if( respuesta.data['0'].estado_id == '3' ) {

                        bootbox.alert('El usuario se encuentra inactivo.');
    
                    } else if( respuesta.data['0'].estado_id == '1' ) {
    
                        bootbox.alert('El usuario debe ser verificado.');
    
                    } else {
                        localStorage.setItem('email', respuesta.data['0'].email);
                        localStorage.setItem('estado', respuesta.data['0'].estado_id);
                        localStorage.setItem('id', respuesta.data['0'].id);
                        localStorage.setItem('cod_benf', respuesta.dataDatax['0'].cod_benf);
                        localStorage.setItem('lista_benf', respuesta.dataDatax['0'].lista_benf);
                        localStorage.setItem('lugar_benf', respuesta.dataDatax['0'].lugar_benf);
                        localStorage.setItem('nom_benf', respuesta.dataDatax['0'].nom_benf);
                        localStorage.setItem('telef_benf', respuesta.dataDatax['0'].telef_benf);

                        window.location.href = 'index.html';
                    }
                } else {
                    bootbox.alert(respuesta.mensaje);
                }
                
            },
            error: function() {
                bootbox.alert('Se produjo un error. Por favor, inténtelo nuevamente.');
            }
          })        

    } else {
        bootbox.alert('El usuario y/o contraseña no son correctos.');
    }
}

/**
 * Valida el estado de login del cliente
 */
var validarEstadoLogin = function() {
    var cliente = localStorage.getItem('cod_benf');
    
    if(cliente != null) {
        $('#form-login').html('');

        var nlHtml = "";
    
        nlHtml += '<div class="col-lg-12 col-md-12 col-sm-12">';
        nlHtml += '<fieldset>';
        nlHtml += '<p>El usuario ' + localStorage.getItem('nom_benf') + ' ya se encuentra logueado.</p>';
        nlHtml += '</fieldset>';
        nlHtml += '</div>';
        nlHtml += '<div class="col-lg-12">';
        nlHtml += '<fieldset>';
        nlHtml += '<a href="#" class="btn btn-primary" onclick="logoutUser()">Logout</a>';
        nlHtml += '</fieldset>';
        nlHtml += '</div>';
        $('#form-login').html(nlHtml);    
    }

}

$( document ).ready(function() {       
    validarEstadoLogin();
});