var telaLogin = tela_login;
var cadastro = criar_conta;

var telaCadastro = mostrar_cadastro;
var login = fazer_login;

cadastro.addEventListener("click", function () {
    telaLogin.classList.add('invisivel')
    telaCadastro.classList.remove('invisivel')
})

login.addEventListener("click", function () {
    telaLogin.classList.remove('invisivel')
    telaCadastro.classList.add('invisivel')
})