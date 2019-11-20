/**
 * Exibe uma tela com dados detalhados dos produtos 
 */
function mostrarProduto(e) {
    
    modal.style.display = 'block';

    var id = e.getElementsByClassName('idproduto')[0].innerHTML;

    fetch(`/produtos/produto/${login_usuario}/${id}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
    
                var tbody = tableProducts.getElementsByTagName('tbody')[0];
                tbody.innerHTML = '';
    
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
    
                var registro = resposta[0];
    
                modal_nome_produto.innerHTML = registro.nome;
                modal_preco.innerHTML = `R$${Number(registro.preco).toFixed(2)}`;
                modal_categoria.innerHTML = registro.categoria;
                modal_localizacao.innerHTML = registro.corredor == null ? 'Não disponível' : `Corredor ${registro.corredor}`;
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
    .catch(function (error) {
        console.error(`Erro na obtenção dos dados p/ tabela de produtos: ${error.message}`);
    });

    var ctx = document.getElementById('chartProduto').getContext('2d');
    var produto = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            datasets: [{
                label: 'Sensores ativados',
                data: [12, 19, 14, 20, 19, 17, 18, 19, 22, 18, 15, 20],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                backgroundColor: 'rgba(255, 99, 132, 1)',
                fill: false,
                lineTension: 0.4
            },
            {
                label: 'Baixa demanda',
                data: [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                ],
                fill: false,
                lineTension: 0.4
            },
            {
                label: 'Grande demanda',
                data: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                ],
                fill: false,
                lineTension: 0.2
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

    var ctx2 = document.getElementById('estabelecimentos').getContext('2d'); // recuperando o contexto de desenho do elemento canvas com id 'chart2'
    var chart = new Chart(ctx2, { // criando um novo gráfico
        type: 'doughnut',
        data: {
            labels: ['Estabelecimento 1', 'Estabelecimento 2', 'Estabelecimento 3', 'Estabelecimento 4'],
            datasets: [{
                label: 'Sensores consultados',
                data: [12, 19, 14, 20],
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
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            }
        }
    });
}

function fecharProduto() {
    
    modal.style.display = 'none';
}

