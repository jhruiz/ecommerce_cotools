/**
 * Desactiva la compra por falla en la confirmación de pago
 */
var declinePurchase = function() {
    var idPreference = $('#idPreference').val();
    $.ajax({
        method: "POST",
        url: urlC + "pedido/declinepurchase",
        data: { idPreference : idPreference },
        success: function(respuesta) {
            if(respuesta.estado) {
                bootbox.alert('Su pago no pudo ser procesado.', function(){
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
    declinePurchase();
});