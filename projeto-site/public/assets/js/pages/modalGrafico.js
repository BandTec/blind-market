var exibiu_grafico = false;

var mesesModal = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
var param;
var usuarioParam;

function atualizarGrafico2() {
    modalChart()
    obterDadosGrafico()
    setTimeout(modalChart, 3000);
}

function modalChart() {
    var params = window.location.search
    var valor1 = params.split('=')
    console.log(valor1)
    if (params.split('=')[0] == "?") {
        param = Number(valor1[1])
        usuarioParam = valor1[2]
    }
}


function configModalGrafico() {
    var configuracoes = {
        responsive: true,
        maintainAspectRatio: false,
        animation: exibiu_grafico ? false : {
            duration: 1500
        },
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
        datasets: [{
            label: 'Sensores consultados',
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.3)',
            fill: true,
            lineTension: 0.4,
            borderWidth: 3,
            data: []
        }]
    };



    fetch(`/estabelecimentos/modal/${param}/${usuarioParam}`, {
            cache: 'no-store'
        }).then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {

                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    

                    for (i = 0; i < resposta.length; i++) {
                        var registro = resposta[i];

                        dados.labels.push(mesesModal[Number(registro.Mes) -1]);

                        dados.datasets[0].data.push(registro.Qtd);


                    }

                    console.log(JSON.stringify(dados));

                    plotarGraficoModal(dados);
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
function plotarGraficoModal(dados) {
    console.log('iniciando plotagem do gráfico do Modal...');

    var ctx = chartModal.getContext('2d');
    window.grafico_linha = Chart.Line(ctx, {
        data: dados,
        options: configModalGrafico()
    });
}

configModalGrafico();

atualizarGrafico2()