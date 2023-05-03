/**
 * Valida en el local storage si el cliente se encuentra logueado
 */
var validarUsuarioLoging = function(){
    userId = localStorage.getItem('id');
    if(userId == null) {
        $('.pedidos').hide();
    }
} 

$( document ).ready(function() {   
    validarUsuarioLoging();
});