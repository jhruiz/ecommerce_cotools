/**
 * Pasa a pendiente la compra a la espera de la confirmacion o rechazo de pago
 */
var pendingPurchase = function() {
    var idPreference = $('#idPreference').val();
    $.ajax({
        method: "POST",
        url: urlC + "pedido/pendingpurchase",
        data: { idPreference : idPreference },
        success: function(respuesta) {
            if(respuesta.estado) {
                bootbox.alert('Su pago se encuentra pendiente por aprobación.', function(){
                    window.location.href = urlEC + "index.php";
                });
            } else {
                bootbox.alert(respuesta.mensaje, function(){
                    window.location.href = urlEC + "index.php";
                });
            }
        },
        error: function() {
            console.log('Se presentó un error.');
        }
    });
}

$( document ).ready(function() {
    pendingPurchase();
});