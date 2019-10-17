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

function fazerLogin() {

    var senha = login_senha.value;
    var email = login_email.value;

    if (senha == "admin" && email == "admin@blindmarket.com.br") {
        window.location = "dashboard.html";
    } else {
        alert(`Usuário ou senha incorreta!`);
    }
}