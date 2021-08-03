var mostrarTexto1Banner = function() {
    var spanWidth = $('#text_1_banner span').width();
    $('#text_1_banner').animate( { width: spanWidth }, 4000);
}

var mostrarTexto2Banner = function() {
    var spanWidth = $('#text_2_banner span').width();
    $('#text_2_banner').animate( { width: spanWidth }, 4000);
}

$( document ).ready(function() {   
    setTimeout(function(){ 
        mostrarTexto1Banner();
        mostrarTexto2Banner();
    }, 2000);    
});