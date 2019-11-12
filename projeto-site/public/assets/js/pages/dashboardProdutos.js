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