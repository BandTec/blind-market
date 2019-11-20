function abrirEstabelecimento(param) {
    fetch(`/leituras/dashboard/estabelecimentos/modal/${param}`, {
            cache: 'no-store'
        }).then(function (response) {
            modalEstabelecimento.style.display = "block"
            if (response.ok) {
                response.json().then(function (resposta) {

                    var modal = document.getElementById("modal_header")

                    for (i = 0; i < resposta.length; i++) {
                        var registro = resposta[i];

                        modal.innerHTML += `
                                                <div class="modal-header-title-bar>
                                                    <div class="modal-header-title>
                                                        <h2>${registro.nome}</h2>
                                                        <p>${registro.endereco}</p>
                                                        <p>${registro.cep}</p>
                                                    </div>
                                                </div>
                                            `
                    }
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados: ${error.message}`);
        });

}