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
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'], // as etiquetas que aparecem na parte debaixo do gráfico
        datasets: [{
            label: 'Quantidade de consultas (total)', // a legenda do gráfico
            backgroundColor: 'rgb(255, 99, 132)', // cor de fundo do gráfico
            borderColor: 'rgb(255, 99, 132)', // cor da borda do gráfico
            data: [0, 10, 5, 2, 20, 30, 45] // os dados do gráfico
        }]
    },
});

/* Segundo gráfico */
var ctx2 = document.getElementById('chart2').getContext('2d'); // recuperando o contexto de desenho do elemento canvas com id 'chart2'
var chart = new Chart(ctx2, { // criando um novo gráfico
    // O tipo do gráfico que queremos criar
    type: 'bar',

    // Os dados do gráfico
    data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'], // as etiquetas que aparecem na parte debaixo do gráfico
        datasets: [{
            label: 'Quantidade de consultas (Maçã)', // a legenda do gráfico
            backgroundColor: 'rgb(255, 99, 132)', // cor de fundo do gráfico
            borderColor: 'rgb(255, 99, 132)', // cor da borda do gráfico
            data: [0, 30, 15, 10, 20, 30, 25] // os dados do gráfico
        }]
    },
});