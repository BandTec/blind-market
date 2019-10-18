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

function fazerCadastro() {

    var nome = cadastro_nome.value;
    var senha = cadastro_senha.value;
    var email = cadastro_email.value;

    if (nome == "Blind") {
    }

    if (senha == "admin") {
    
    
      if (email.endsWith  ("@blindmarket.com.br")) {
        window.location = "login.html";
    } else {
        alert(`Usuário não cadastrado!`);
    }
}
}