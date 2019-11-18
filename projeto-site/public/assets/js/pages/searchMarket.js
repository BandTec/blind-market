function tabelaSearchMarket(cep) {   
    fetch(`/estabelecimentos/buscar/${cep.substring(0 ,5)}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
    
                var tbody = estabelecimentos.getElementsByTagName('tbody')[0];
                tbody.innerHTML = '';
    
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
    
                resposta.reverse();
    
                for (i = 0; i < resposta.length; i++) {
                    var registro = resposta[i];
    
                    tbody.innerHTML += `<tr">
                                            <td>${registro.nome}</td>
                                            <td>${registro.endereco}</td>
                                            <td><a target="_blank" href='https://www.google.com/maps/search/${registro.nome.split(' ').join('+')}+${registro.endereco.split(' ').join('+')}'>Clique Aqui</a></td>
                                        </tr>`;
                }
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
    .catch(function (error) {
        console.error(`Erro na obtenção dos dados p/ tabela de produtos: ${error.message}`);
    });
}
