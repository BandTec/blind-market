var exibiu_grafico = false;

// só mexer se quiser alterar o tempo de atualização
// ou se souber o que está fazendo!
function atualizarGraficoEstabelecimento() {
    obterDadosGraficoEstabelecimento();
    setTimeout(atualizarGraficoEstabelecimento, 1000);
}

// altere aqui as configurações do gráfico
// (tamanhos, cores, textos, etc)
function configurarGraficoEstabelecimento() {
    var configuracoes = {
        responsive: true,
        maintainAspectRatio: false,
        animation: exibiu_grafico ? false : {duration: 1500},
        // hoverMode: 'index',
        // stacked: false,
        title: {
            display: false,
            text: 'Registros por categoria'
        },
        legend: {
            display: false
        }
    };

    exibiu_grafico = true;

    return configuracoes;
}

// altere aqui como os dados serão exibidos
// e como são recuperados do BackEnd
function obterDadosGraficoEstabelecimento() {

    // neste JSON tem que ser 'labels', 'datasets' etc, 
    // porque é o padrão do Chart.js
    var dados = {
        labels: [],
        datasets: [
            {
                label: 'Sensores consultados',
                borderColor: '#FFFFFF',
                backgroundColor: [
                    '#e74a3b',
                    '#1cc88a',
                    '#4e73df',
                    '#36b9cc'
                ],
                fill: false,
                lineTension: 0.4,
                borderWidth: 3,
                data: []
            }
        ]
    };

    fetch(`/leituras/topestabelecimentos/${login_usuario}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {

                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                resposta.reverse();

                for (i = 0; i < resposta.length; i++) {
                    var registro = resposta[i];
                
                    // aqui, após 'registro.' use os nomes 
                    // dos atributos que vem no JSON 
                    // que gerou na consulta ao banco de dados

                    dados.labels.push(`${registro.nome}`);

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

    var ctx = estabelecimentos.getContext('2d');
    window.grafico_linha = Chart.Doughnut(ctx, {
        data: dados,
        options: configurarGraficoEstabelecimento()
    });
}

atualizarGraficoEstabelecimento();