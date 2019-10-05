//criando uma function para alterar a cor da nav 
//Aqui usamos o jquery para encurtar o codigo para que não tenha que criar diversas funções
$(document).ready(function () { //Quando o arquivo for carregado ele começa a fazer essa verificação
    //Detectando o scroll da pagina
    $(window).scroll(function () {
        //Verificando se o scroll da pagina é maior que 10px
        if ($(document).scrollTop() > 10) {
            //Se for maior ele cai aqui e faz a alteração dos elementos
            //Procurando o id e add nele uma classe(ao qual tem seu estilos no css)
            $('#nav').addClass('change');
            $('#button').addClass('btnchange');
            $('#logoBold').addClass('logoBold');
            $('#changeBold').addClass('logoBold');
        } else {
            //Quando for menor ele cai aqui e faz a alteração dos elementos
            //Procurando o id e removendo as classes que foram add anteriormente
            $('#nav').removeClass('change');
            $('#button').removeClass('btnchange');
            $('#logoBold').removeClass('logoBold');
            $('#changeBold').removeClass('logoBold');
        }
    });
});