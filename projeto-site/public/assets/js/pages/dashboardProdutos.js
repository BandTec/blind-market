var combobox_produtos = document.createElement('select');

var exibiu_grafico = false;

verificar_autenticacao();

function atualizarProdutos() {    
    popularTabelaProdutos();
    //setTimeout(atualizarProdutos, 2000);
}

function atualizarGraficoProdutos() {
    
    obterDadosGraficoProdutos();
    //setTimeout(obterDadosGraficoProdutos, 2000);
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
    
                    tbody.innerHTML += `<tr onclick="mostrarProduto(this)">
                                            <td class="idproduto">${registro.id}</td>
                                            <td>${registro.nome}</td>
                                            <td>${registro.categoria}</td>
                                            <td>R$${Number(registro.preco).toFixed(2)}</td>
                                            <td>Corredor ${registro.corredor}</td>
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

function popularTabelaSensores() {
    fetch(`/leituras/todossensores/${login_usuario}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
    
                var tbody = tableSensors.getElementsByTagName('tbody')[0];
                tbody.innerHTML = '';
    
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
    
                for (i = 0; i < resposta.length; i++) {
                    var registro = resposta[i];
    
                    var combo = combobox_produtos.cloneNode(true);
                    combo.value = registro.fkProduto;
                    combo.setAttribute('onchange', 'atualizarProdutoSensor(this)');

                    var tr = document.createElement('tr');
                    tr.innerHTML += `<td class="idsensor">${registro.id}</td>`;
                    tr.innerHTML += `<td>Sensor ${registro.id}</td>`;

                    var td = document.createElement('td');
                    td.appendChild(combo);

                    var td2 = document.createElement('td');
                    td2.appendChild(document.createTextNode(registro.estabelecimento));

                    var td3 = document.createElement('td');
                    td3.appendChild(document.createTextNode(`Corredor ${registro.corredor}`));

                    tr.appendChild(td);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    
                    tbody.appendChild(tr);
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

function atualizarProdutoSensor(e) {
    
    var idsensor = e.parentNode.parentNode.getElementsByClassName('idsensor')[0].innerHTML;
    var idproduto = e.value;

    var form = document.createElement("form");
    form.method = 'post';

    var sensor = document.createElement("input");
    sensor.setAttribute('type',"text");
    sensor.setAttribute('name',"idsensor");
    sensor.value = idsensor;

    var produto = document.createElement("input");
    produto.setAttribute('type',"text");
    produto.setAttribute('name',"idproduto");
    produto.value = idproduto;

    form.appendChild(sensor);
    form.appendChild(produto);

    var formData = new URLSearchParams(new FormData(form));
    
    fetch("/estabelecimentos/trocarproduto", {
        method: "POST",
        body: formData
    }).then(resposta => {

        if (resposta.ok) {
            resposta.json().then(json => {

                window.location.href = './dashboard-produtos.html';
            });

        } else {

            console.log('Erro ao trocar produto!');

            response.text().then(texto => {
                console.error(texto);
                finalizar_aguardar(texto);
            });
        }
    });
}

// só mexer se quiser alterar o tempo de atualização
// ou se souber o que está fazendo!
function atualizarGraficoProdutos() {
    obterDadosGraficoProdutos();
    setTimeout(atualizarGraficoProdutos, 1000);
}

// altere aqui as configurações do gráfico
// (tamanhos, cores, textos, etc)
function configurarGraficoProdutos() {
    var configuracoes = {
        responsive: true,
        animation: false,
        maintainAspectRatio: false,
        stacked: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

    exibiu_grafico = true;

    return configuracoes;
}

// altere aqui como os dados serão exibidos
// e como são recuperados do BackEnd
function obterDadosGraficoProdutos() {

    // neste JSON tem que ser 'labels', 'datasets' etc, 
    // porque é o padrão do Chart.js
    var dados = {
        labels: [],
        datasets: [
            {
                label: 'Quantidade',
                borderColor: '#B3344F',
                backgroundColor: 'rgba(255, 99, 132, 1)',
                fill: false,
                borderWidth: 3,
                data: []
            }
        ]
    };

    fetch(`/leituras/qtdprodutos/${login_usuario}`, { cache: 'no-store' }).then(function (response) {
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
                //console.log(JSON.stringify(dados));

                //div_aguarde.style.display = 'none';

                plotarGraficoProdutos(dados);
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
function plotarGraficoProdutos(dados) {
    console.log('iniciando plotagem do gráfico...');

    var ctx = chart.getContext('2d');

    if (window.grafico_linha != undefined) {
        
        window.grafico_linha.destroy();
    }

    window.grafico_linha = Chart.Bar(ctx, {
        data: dados,
        options: configurarGraficoProdutos()
    });
}

function load() {
    
    atualizarGraficoProdutos();
    atualizarProdutos();
    popularTabelaSensores();
}

fetch(`/leituras/combobox/categorias`, { cache: 'no-store' }).then(function (response) {
    if (response.ok) {
        response.json().then(function (resposta) {

            console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

            resposta.reverse();

            for (i = 0; i < resposta.length; i++) {
                var registro = resposta[i];
            
                // aqui, após 'registro.' use os nomes 
                // dos atributos que vem no JSON 
                // que gerou na consulta ao banco de dados

                cmbCategoria.innerHTML += `<option value="${registro.id}">${registro.nome}</option>`;
            }
            //console.log(JSON.stringify(dados));
        });
    } else {
        console.error('Nenhum dado encontrado ou erro na API');
    }
})
.catch(function (error) {
    console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
});

fetch(`/leituras/combobox/produtos`, { cache: 'no-store' }).then(function (response) {
    if (response.ok) {
        response.json().then(function (resposta) {

            console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

            for (i = 0; i < resposta.length; i++) {
                var registro = resposta[i];
            
                // aqui, após 'registro.' use os nomes 
                // dos atributos que vem no JSON 
                // que gerou na consulta ao banco de dados

                combobox_produtos.innerHTML += `<option value="${registro.id}">${registro.nome}</option>`;
            }
            //console.log(JSON.stringify(dados));
        });
    } else {
        console.error('Nenhum dado encontrado ou erro na API');
    }
})
.catch(function (error) {
    console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
});

window.onload = load();