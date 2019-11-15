fetch(`/leituras/qtdestabelecimentos/${login_usuario}`, { cache: 'no-store' }).then(function (response) {
    if (response.ok) {
        response.json().then(function (resposta) {

            console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

            resposta.reverse();

            for (i = 0; i < resposta.length; i++) {
                var registro = resposta[i];

                var card = `<div qtd="${registro.qtd}" eid="${registro.id}" class="estabelecimento">
                                <img src="assets/img/shop.png" alt="">
                                <span>${registro.nome}</span>
                            </div>`;

                cards_estabelecimentos.innerHTML += card;

                fetch(`leituras/estatisticas/estabelecimento/${registro.id}`, { cache: 'no-store' }).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (resposta) {
            
                            console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
            
                            resposta.reverse();
                            var registro = resposta[0];
                            
                            var card = document.querySelector(`[eid='${registro.id}']`);
                            var qtd = card.getAttribute('qtd');

                            if (qtd <= registro.media) {
                                
                                card.classList.add('warning');
                            }
                        });
                    } else {
                        console.error('Nenhum dado encontrado ou erro na API');
                    }
                })
                .catch(function (error) {
                    console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
                });

                //dados.labels.push(`${registro.ano} - ${registro.mes}`);
                //dados.datasets[0].data.push(registro.qtd);
            }
        });
    } else {
        console.error('Nenhum dado encontrado ou erro na API');
    }
})
.catch(function (error) {
    console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
});