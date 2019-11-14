var exibiu_grafico = false;

// só mexer se quiser alterar o tempo de atualização
// ou se souber o que está fazendo!
function atualizarGrafico() {
    obterDadosGrafico();
    setTimeout(atualizarGrafico, 10000);
}

// altere aqui as configurações do gráfico
// (tamanhos, cores, textos, etc)
function configurarGrafico() {
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
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
            }]
        }
    };

    exibiu_grafico = true;

    return configuracoes;
}

// altere aqui como os dados serão exibidos
// e como são recuperados do BackEnd
function obterDadosGrafico() {

    // neste JSON tem que ser 'labels', 'datasets' etc, 
    // porque é o padrão do Chart.js
    var dados = {
        labels: [],
        datasets: [
            {
                label: 'Sensores consultados',
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                fill: true,
                lineTension: 0.4,
                borderWidth: 3,
                data: []
            }
        ]
    };

    fetch(`/leituras/todosestabelecimentos/${login_usuario}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {

                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                resposta.reverse();

                for (i = 0; i < resposta.length; i++) {
                    var registro = resposta[i];
                
                    // aqui, após 'registro.' use os nomes 
                    // dos atributos que vem no JSON 
                    // que gerou na consulta ao banco de dados

                    dados.labels.push(`${registro.ano} - ${registro.mes}`);

                    dados.datasets[0].data.push(registro.qtd);
                }
                console.log(JSON.stringify(dados));

                //div_aguarde.style.display = 'none';

                plotarGrafico(dados);
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

    var ctx = chart.getContext('2d');
    window.grafico_linha = Chart.Line(ctx, {
        data: dados,
        options: configurarGrafico()
    });
}

configurarGrafico();
atualizarGrafico();