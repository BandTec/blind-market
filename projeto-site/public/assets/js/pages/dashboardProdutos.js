verificar_autenticacao();

function atualizarProdutos() {
    
    popularTabelaProdutos();
    setTimeout(atualizarProdutos, 2000);
}

function popularTabelaProdutos() {
    
    fetch(`/produtos/todosprodutos/${login_usuario}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
    
                var tbody = tableProducts.getElementsByTagName('tbody')[0];
                tbody.innerHTML = '';
    
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
    
                resposta.reverse();
    
                for (i = 0; i < resposta.length; i++) {
                    var registro = resposta[i];
    
                    tbody.innerHTML += `<tr>
                                            <td>${registro.id}</td>
                                            <td>${registro.nome}</td>
                                            <td>${registro.categoria}</td>
                                            <td>R$${Number(registro.preco).toFixed(2)}</td>
                                            <td>Corredor ${registro.corredor}</td>
                                        </tr>`;
                }
                console.log(JSON.stringify(dados));
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
    .catch(function (error) {
        console.error(`Erro na obtenção dos dados p/ tabela de produtos: ${error.message}`);
    });
}

var ctx = document.getElementById('chart').getContext('2d');
var chart = new Chart(ctx, {

    type: 'line',

    data: {
        labels: ['Produto 01', 'Produto 02', 'Produto 03', 'Produto 04', 'Produto 05', 'Produto 06', 'Produto 07'],
        datasets: [{
            label: 'Produtos mais Consultados',
            data: [20, 15, 18, 20, 13, 17, 30],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.3)',
            borderWidth: 3,
            fill: true,
            lineTension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

atualizarProdutos();