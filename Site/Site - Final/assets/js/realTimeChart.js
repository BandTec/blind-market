var context = document.getElementById("mainChart").getContext("2d");
context.canvas.width = 1000;
context.canvas.height = 300;

var configuration = {
    type: 'line',
    data: {
        datasets: [{
            label: "Sensores ativos x Time",
            type: 'line',
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            steppedLine: true
        }]
    },
    options: {
        scales: {
            xAxes: [{
                //type: 'value',
                distribution: 'series',
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Sensores ativos'
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
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

    var http = new XMLHttpRequest();
    http.open('GET', 'http://localhost:3000/api', false);
    http.send(null);

    var obj = JSON.parse(http.responseText);

    if (obj.data.length == 0) {
        return;
    }

    var _lastIndexTemp = this.lastIndexTemp;
    this.lastIndexTemp = obj.data.length;
    listTemp = obj.data.slice(_lastIndexTemp);

    listTemp.forEach(data => {
        //Máximo de 60 itens exibidos no gráfico
        if (chart.data.labels.length == 10 && chart.data.datasets[0].data.length == 10) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }

        chart.data.labels.push(this.time++);
        chart.data.datasets[0].data.push(parseFloat(data));
        chart.update();
    });

    document.getElementById('soma').textContent = obj.sum;
}

get_data();

setInterval(function() {
    get_data();
}, 1000);