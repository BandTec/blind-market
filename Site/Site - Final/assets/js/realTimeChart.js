/**
 * Este arquivo contém o código do gráfico dinâmico na dashboard do site.
 * É um gráfico baseado no gráfico de exemplo da aula de Arquitetura computacional
 */

var context = document.getElementById("mainChart").getContext("2d"); // recuperando o contexto de desenho do elemento canvas com id 'mainChart'
context.canvas.width = 1000; // largura do gráfico
context.canvas.height = 300; // altura do gráfico

// configurações do gráfico
var configuration = {
    type: 'line', // gráfico do tipo linha
    data: {
        // dados do gráfico
        datasets: [{
            label: "Sensores ativos x Time", // legenda
            type: 'line', // os dados desse conjunto de dados serão representados em linha
            borderColor: 'rgb(255, 99, 132)', // cor da linha (rosa do site)
            backgroundColor: 'rgba(255, 255, 255, 0)', // cor de fundo dos dados (transparente)
            steppedLine: true
        }]
    },
    // opções do gráfico
    options: {
        scales: {
            // opções do eixo x
            xAxes: [{
                distribution: 'series',
                ticks: {
                    beginAtZero: true // começa em zero
                }
            }],
            // opções do eixo y
            yAxes: [{
                scaleLabel: {
                    display: true, // mostrar régua de escala
                    labelString: 'Sensores ativos' // frase mostrada na lateral do gráfico
                },
                ticks: {
                    beginAtZero: true, // começa em zero
                    stepSize: 1 // subindo de um em um
                }
            }]
        },
        animation: {
            duration: 0
        }
    }
};

var chart = new Chart(context, configuration);

//Função para obter os dados de temperatura do server
//Seria mais interessante fazer isso com WebSocket, porém para fins academicos, os dados serão atualizados via HTTP

//Esse atributo dentro do contexto serve para saber qual foi o último índice processado, assim eliminado os outros elementos na
//hora de montar/atualizar o gráfico
this.lastIndexTemp = 0;
this.time = 0;

function get_data() {

    /* 
     * Aqui o site está abrindo a conexão com o servidor node e 
     * recuperando os dados enviados pelo Arduino 
    */

    var http = new XMLHttpRequest();
    http.open('GET', 'http://localhost:3000/api', false); // abrindo conexão com o servidor
    http.send(null);

    var obj = JSON.parse(http.responseText); // recebendo dados do servidor

    // se os dados estiverem vazios
    if (obj.data.length == 0) {
        return; // parar função
    }

    var _lastIndexTemp = this.lastIndexTemp;
    this.lastIndexTemp = obj.data.length;
    listTemp = obj.data.slice(_lastIndexTemp);

    // para cada item da lista de dados recebidos
    listTemp.forEach(data => {
        
        /*
         * Aqui os dados antigos serão removidos para a adição dos novos dados
         * O máximo de registros que ele exibe ao mesmo tempo é 10
         */
        if (chart.data.labels.length == 10 && chart.data.datasets[0].data.length == 10) { // caso a quantidade de itens seja 10
            // removendo dados antigos
            chart.data.labels.shift(); 
            chart.data.datasets[0].data.shift();
        }

        // colocando dados mais atuais
        chart.data.labels.push(this.time++);
        chart.data.datasets[0].data.push(parseFloat(data));

        // essa função atualiza o gráfico na tela com todas as mudanças feitas nas linhas anteriores
        chart.update();
    });

    // colocando a soma dos sensores consultados na tela
    document.getElementById('soma').textContent = obj.sum;
}

get_data();

setInterval(function() {
    get_data();
}, 1000);