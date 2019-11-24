var exibiu_grafico = false;

verificar_autenticacao();

// só mexer se quiser alterar o tempo de atualização
// ou se souber o que está fazendo!
function atualizarGraficoCategoria() {
    obterDadosGraficoCategoria();
    setTimeout(atualizarGraficoCategoria, 1000);
}

// altere aqui as configurações do gráfico
// (tamanhos, cores, textos, etc)
function configurarGraficoCategoria() {
    var configuracoes = {
        responsive: true,
        animation: exibiu_grafico ? false : {duration: 1500},
        hoverMode: 'index',
        stacked: false,
        title: {
            display: true,
            text: 'Registros por categoria'
        },
        scales: {
            yAxes: [{
                display: false,
                ticks: {
                    beginAtZero: true
                },
            }],
        }
    };

    exibiu_grafico = true;

    return configuracoes;
}

// altere aqui como os dados serão exibidos
// e como são recuperados do BackEnd
function obterDadosGraficoCategoria() {

    // neste JSON tem que ser 'labels', 'datasets' etc, 
    // porque é o padrão do Chart.js
    var dados = {
        labels: [],
        datasets: [
            {
                label: 'Quantidade de sensores',
                borderColor: '#B3344F',
                backgroundColor: 'rgba(255, 99, 132, 1)',
                fill: false,
                data: []
            }
        ]
    };

    fetch(`/leituras/categorias/${login_usuario}`, { cache: 'no-store' }).then(function (response) {
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

                plotarGraficoCategoria(dados);
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
function plotarGraficoCategoria(dados) {
    console.log('iniciando plotagem do gráfico...');

    var ctx = categoria.getContext('2d');
    window.grafico_linha = Chart.Bar(ctx, {
        data: dados,
        options: configurarGraficoCategoria()
    });
}

atualizarGraficoCategoria();