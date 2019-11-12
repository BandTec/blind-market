/**
 * Este arquivo contém o código dos gráficos estáticos na dashboard do site.
 * São dois gráficos no total, um de linha e outro e barra.
 */

/* Primeiro gráfico */
var ctx = document.getElementById('chart').getContext('2d'); // recuperando o contexto de desenho do elemento canvas com id 'chart'
var chart = new Chart(ctx, { // criando um novo gráfico
    // O tipo do gráfico que queremos criar
    type: 'line', // tipo = linha

    // Os dados do gráfico
    data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        datasets: [{
            label: 'Sensores consultados',
            data: [12, 19, 16, 20, 19, 17, 18, 19, 22, 18, 15, 20],
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

/* Segundo gráfico */
var ctx2 = document.getElementById('categoria').getContext('2d');
var categoria = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['Hortaliças', 'Laticínios', 'Bebidas', 'Doces', 'Frios', 'Carnes' ],
        datasets: [{
            label: 'Sensores consultados',
            data: [12, 19, 14, 20, 19, 20],
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderColor: '#B3344F',
            borderWidth: 3,
            fill: false,
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
        },
        legend: {
            display: false
        }
    }
});

/* Terceiro gráfico */
var ctx3 = document.getElementById('chart3').getContext('2d'); // recuperando o contexto de desenho do elemento canvas com id 'chart2'
var chart = new Chart(ctx3, { // criando um novo gráfico
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