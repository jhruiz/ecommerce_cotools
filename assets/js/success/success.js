/**
 * Aprueba la compra y la confirmación del pago
 */
var approvePurchase = function() {
    var idPreference = $('#idPreference').val();
    $.ajax({
        method: "POST",
        url: urlC + "pedido/approvepurchase",
        data: { idPreference : idPreference },
        success: function(respuesta) {
            if(respuesta.estado) {
                bootbox.alert('Su pago ha sido procesado. Gracias por su compra', function(){
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
    approvePurchase();
});