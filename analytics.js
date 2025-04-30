document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('analyticsChart');
  
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{
          label: 'System Performance',
          data: [65, 72, 86, 81, 84, 86, 94],
          borderColor: '#00fff2',
          backgroundColor: '#00fff211',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#00fff233'
            },
            ticks: {
              color: '#00fff2'
            }
          },
          x: {
            grid: {
              color: '#00fff233'
            },
            ticks: {
              color: '#00fff2'
            }
          }
        }
      }
    });
  }
});
