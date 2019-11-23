var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

/**
 * Exibe uma tela com dados detalhados dos produtos 
 */
function mostrarProduto(e) {
    
    modal.style.display = 'block';

    var id = e.getElementsByClassName('idproduto')[0].innerHTML;

    fetch(`/produtos/produto/${login_usuario}/${id}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
    
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
    
                var registro = resposta[0];
    
                modal_nome_produto.innerHTML = registro.nome;
                modal_preco.innerHTML = `R$${Number(registro.preco).toFixed(2)}`;
                modal_categoria.innerHTML = registro.categoria;
                modal_localizacao.innerHTML = registro.corredor == null ? 'Não disponível' : `Corredor ${registro.corredor}`;

                obterDadosGrafico(registro.id);
                obterDadosGraficoEstabelecimento(registro.id);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
    .catch(function (error) {
        console.error(`Erro na obtenção dos dados p/ tabela de produtos: ${error.message}`);
    });
}

function fecharProduto() {
    
    modal.style.display = 'none';
    window.grafico_doughnut.destroy();
    window.linha.destroy();
}

function configurarGrafico() {
    var configuracoes = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

    return configuracoes;
}

// altere aqui como os dados serão exibidos
// e como são recuperados do BackEnd
function obterDadosGrafico(id) {

    // neste JSON tem que ser 'labels', 'datasets' etc, 
    // porque é o padrão do Chart.js
    var dados = {
        labels: [],
        datasets: [{
            label: 'Sensores ativados',
            data: [],
            borderColor: [
                'rgba(255, 99, 132, 1)'
            ],
            backgroundColor: 'rgba(255, 99, 132, 1)',
            fill: false,
            lineTension: 0.4
        },
        {
            label: 'Baixa demanda',
            data: [],
            borderColor: [
                'rgba(255, 206, 86, 1)'
            ],
            fill: false,
            lineTension: 0.4
        },
        {
            label: 'Alta demanda',
            data: [],
            borderColor: [
                'rgba(54, 162, 235, 1)'
            ],
            fill: false,
            lineTension: 0.4
        }
    ]
    };

    fetch(`/leituras/produto/${login_usuario}/${id}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {

                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                resposta.reverse();

                for (i = 0; i < resposta.length; i++) {
                    var registro = resposta[i];
                
                    // aqui, após 'registro.' use os nomes 
                    // dos atributos que vem no JSON 
                    // que gerou na consulta ao banco de dados

                    dados.labels.push(`${meses[registro.mes - 1]}/${registro.ano}`);

                    dados.datasets[0].data.push(registro.qtd);
                }
                console.log(JSON.stringify(dados));

                fetch(`/leituras/estatisticas/produto/${id}/${login_usuario}`, { cache: 'no-store' }).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (resposta) {
        
                            var registro = resposta[0];

                            for (var i = 0; i < dados.datasets[0].data.length; i++) {

                                dados.datasets[1].data.push(registro.Q1);
                                dados.datasets[2].data.push(registro.Q3);
                            }

                            plotarGrafico(dados);
                        });
                    } else {
                        console.error('Nenhum dado encontrado ou erro na API');
                    }
                })
                .catch(function (error) {
                    console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
                });
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
    .catch(function (error) {
        console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
    });

}

// só altere aqui se souber o que está fazendo!
function plotarGrafico(dados) {
    console.log('iniciando plotagem do gráfico...');

    var ctx = chartProduto.getContext('2d');

    window.linha = new Chart.Line(ctx, {
        data: dados,
        options: configurarGrafico()
    });

}

function configurarGraficoEstabelecimento() {
    var configuracoes = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        }
    };

    return configuracoes;
}

// altere aqui como os dados serão exibidos
// e como são recuperados do BackEnd
function obterDadosGraficoEstabelecimento(id) {

    // neste JSON tem que ser 'labels', 'datasets' etc, 
    // porque é o padrão do Chart.js
    var dados = {
        labels: [],
        datasets: [{
            label: 'Sensores consultados',
            data: [],
            backgroundColor: [
                '#e74a3b',
                '#1cc88a',
                '#4e73df',
                '#36b9cc'
            ],
            borderColor: '#FFFFFF',
            borderWidth: 3,
            fill: false,
            lineTension: 0.4
        }]
    };

    fetch(`/produtos/topestabelecimentos/${login_usuario}/${id}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {

                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                resposta.reverse();

                for (i = 0; i < resposta.length; i++) {
                    var registro = resposta[i];
                
                    // aqui, após 'registro.' use os nomes 
                    // dos atributos que vem no JSON 
                    // que gerou na consulta ao banco de dados

                    dados.labels.push(registro.nome);

                    dados.datasets[0].data.push(registro.qtd);
                }
                console.log(JSON.stringify(dados));

                //div_aguarde.style.display = 'none';

                plotarGraficoEstabelecimento(dados);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
    .catch(function (error) {
        console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
    });

}

// só altere aqui se souber o que está fazendo!
function plotarGraficoEstabelecimento(dados) {
    console.log('iniciando plotagem do gráfico...');

    var ctx2 = estabelecimentos.getContext('2d');

    window.grafico_doughnut = Chart.Doughnut(ctx2, {
        data: dados,
        options: configurarGraficoEstabelecimento()
    });
}