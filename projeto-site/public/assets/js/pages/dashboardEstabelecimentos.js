var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

var exibiu_grafico = false;

// só mexer se quiser alterar o tempo de atualização
// ou se souber o que está fazendo!
function atualizarGrafico() {
    obterDadosGrafico();
    listagemEstabelecimento()
    setTimeout(atualizarGrafico, 10000);
    // setTimeout(atualizarGrafico, 10000);
}

// altere aqui as configurações do gráfico
// (tamanhos, cores, textos, etc)
function configurarGrafico() {
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

    fetch(`/leituras/dashboard/estabelecimentos/${login_usuario}`, {
            cache: 'no-store'
        }).then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {

                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    resposta.reverse();

                    for (i = 0; i < resposta.length; i++) {
                        var registro = resposta[i];

                        // aqui, após 'registro.' use os nomes 
                        // dos atributos que vem no JSON 
                        // que gerou na consulta ao banco de dados

                        dados.labels.push(`${meses[Number(registro.mes) - 1]}/${registro.ano}`);

                        dados.datasets[0].data.push(registro.qtd);

                    }
                    nomeEstabelecimento.innerHTML = `${registro.nome}`
                    enderecoEstabelecimento.innerHTML = `${registro.endereco}`
                    cepEstabelecimento.innerHTML = `${registro.cep}`

                    console.log(JSON.stringify(dados));

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

// Popular a listagem de estabelecimentos
function listagemEstabelecimento() {
    fetch(`/leituras/todosestabelecimentos/listagem/${login_usuario}`, {
            cache: 'no-store'
        }).then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {

                    var tbody = listEstabelecimentos.getElementsByTagName('tbody')[0];
                    tbody.innerHTML = '';

                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    for (i = 0; i < resposta.length; i++) {
                        var registro = resposta[i];

                        tbody.innerHTML += `<tr onclick='abrirAtualiza(${registro.idEstabelecimento})'>
                                        <td name='idestabelecimento'>${registro.idEstabelecimento}</td>
                                        <td>${registro.nome}</td>
                                        <td>${registro.endereco}</td>
                                        <td>${registro.cep}</td>                                       
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

function abrirAtualiza(id) {
    var temp_estabelecimento = id
    console.log(typeof temp_estabelecimento)

    fetch(`/leituras/atualizar/estabelecimento/${temp_estabelecimento}`, {
            cache: 'no-store'
        }).then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {

                    var form = modal_headerAtualiza;

                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    form.innerHTML = ''
                    for (i = 0; i < resposta.length; i++) {
                        var registro = resposta[i];

                        form.innerHTML = `
                        <h3>Atualize o cadastro do Estabelecimento</h3>
                        <form action="" method="POST" onsubmit="return validaCamposEstabelecimento(event)" id="formAtualiza">
                            <label for="">idEstabelecimento</label>
                            <input readonly type="text" name="idestab" value="${registro.idEstabelecimento}">

                            <label for="">Nome do Estabelecimento</label>
                            <input id="nomeEstab" type="text" name="nomeEstab" value="${registro.nome}">

                            <label for="">Endereço do Estabelecimento</label>
                            <input id="endEstab" type="text" name="endEstab" value="${registro.endereco}">

                            <label for="">CEP do Estabelecimento</label>
                            <input id="cepEstab" type="text" name="cepEstab" value="${registro.cep}">

                            
                            <div>
                                <button class="button" id="btnatualiza">Atualizar</button>
                                <button class="button_off" onclick="fecharModal()" id="sairModal">Cancelar</button>
                            </div>

                            <div>
                                <span class="error" id="error"><span>
                            </div>
                        </form>
                    `
                    }
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ tabela de produtos: ${error.message}`);
        });

    modalAtualizaEstabelecimento.style.display = "block"

}


function validaCamposEstabelecimento(event) {
    event.preventDefault()

    error.innerHTML = ""
    error.style.display = "none"
    error.style.color = ""

    if (nomeEstab.value == "") {
        error.innerHTML = "Erro, preencha o campo Nome do Estabelecimento"
        error.style.display = "block"
        nomeEstab.focus();

    } else if (endEstab.value == "") {
        error.innerHTML = "Erro, preencha o campo Endereço do Estabelecimento"
        error.style.display = "block"
        endEstab.focus();

    } else if (cepEstab.value == "") {
        error.innerHTML = "Erro, preencha o campo CEP do Estabelecimento"
        error.style.display = "block"
        cepEstab.focus();
    } else {
        atualizarEstabelecimento()
        error.innerHTML = "Estabelecimento Atualizado com sucesso"
        error.style.display = "block"
        error.style.color = "#1ac28a"
    }

}

function atualizarEstabelecimento() {
    var atualizaEstab = new URLSearchParams(new FormData(formAtualiza));
    fetch("/estabelecimentos/atualizando/estabelecimento", {
        method: "POST",
        body: atualizaEstab
    }).then(resposta => {

        if (resposta.ok) {
            resposta.json().then(json => {
                sairModal.innerHTML = 'Sair';
                btnatualiza.disabled = true;

                var buttonSair = document.getElementById('sairModal');
                buttonSair.classList.remove('button_off')
                buttonSair.classList.add('button')
            });

        } else {
            error.innerHTML = "Falha ao atualizar o usuario, tente novamente"
            error.style.display = "block"
        }
    });

    return false;
}






// só altere aqui se souber o que está fazendo!
function plotarGrafico(dados) {
    console.log('iniciando plotagem do gráfico...');

    var ctx = chartEstabelecimento.getContext('2d');
    window.grafico_linha = Chart.Line(ctx, {
        data: dados,
        options: configurarGrafico()
    });
}

configurarGrafico();
atualizarGrafico();