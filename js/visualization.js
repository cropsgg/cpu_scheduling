class Visualizer {
    constructor() {
        this.ganttContainer = document.getElementById('gantt-container');
        this.colors = {
            'P1': '#2196F3',
            'P2': '#4CAF50',
            'P3': '#FFC107',
            'P4': '#9C27B0',
            'P5': '#FF5722',
            'Idle': '#9E9E9E'
        };
        this.currentSimulation = null;
    }

    clearGanttChart() {
        this.ganttContainer.innerHTML = '';
    }

    createGanttChart(schedule, timestamps) {
        this.clearGanttChart();
        const totalTime = timestamps[timestamps.length - 1];
        const scale = this.ganttContainer.clientWidth / totalTime;

        // Create timeline
        const timeline = document.createElement('div');
        timeline.className = 'timeline';
        this.ganttContainer.appendChild(timeline);

        // Create process blocks
        let currentX = 0;
        schedule.forEach((item, index) => {
            const block = document.createElement('div');
            block.className = 'process-block';
            block.style.left = `${currentX * scale}px`;
            block.style.width = `${item.duration * scale}px`;
            block.style.backgroundColor = this.colors[item.process] || '#2196F3';
            block.style.position = 'absolute';
            block.style.height = '60px';
            block.style.top = '20px';
            block.style.borderRadius = '4px';
            block.style.display = 'flex';
            block.style.alignItems = 'center';
            block.style.justifyContent = 'center';
            block.style.color = 'white';
            block.style.fontWeight = 'bold';

            const processName = document.createElement('span');
            processName.textContent = item.process;
            block.appendChild(processName);

            this.ganttContainer.appendChild(block);
            currentX += item.duration;
        });

        // Create time markers
        timestamps.forEach((time, index) => {
            const marker = document.createElement('div');
            marker.className = 'time-marker';
            marker.style.left = `${time * scale}px`;
            marker.style.position = 'absolute';
            marker.style.top = '90px';
            marker.style.transform = 'translateX(-50%)';
            marker.textContent = time.toFixed(1);
            this.ganttContainer.appendChild(marker);
        });
    }

    updateMetrics(totalTime, avgWaitingTime) {
        document.getElementById('total-time').textContent = totalTime.toFixed(2);
        document.getElementById('avg-waiting-time').textContent = avgWaitingTime.toFixed(2);
    }

    showComparisonChart(results) {
        const ctx = document.getElementById('comparison-chart').getContext('2d');
        const algorithms = Object.keys(results);
        const avgWaitingTimes = algorithms.map(algo => results[algo]);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: algorithms,
                datasets: [{
                    label: 'Average Waiting Time',
                    data: avgWaitingTimes,
                    backgroundColor: [
                        '#2196F3',
                        '#4CAF50',
                        '#FFC107',
                        '#9C27B0'
                    ],
                    borderColor: [
                        '#1976D2',
                        '#388E3C',
                        '#FFA000',
                        '#7B1FA2'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Average Waiting Time'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Algorithm Comparison',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }

    animateSimulation(schedule, timestamps, interval = 1000) {
        if (this.currentSimulation) {
            clearInterval(this.currentSimulation);
        }

        let currentStep = 0;
        this.currentSimulation = setInterval(() => {
            if (currentStep < schedule.length) {
                this.createGanttChart(
                    schedule.slice(0, currentStep + 1),
                    timestamps.slice(0, currentStep + 2)
                );
                currentStep++;
            } else {
                clearInterval(this.currentSimulation);
            }
        }, interval);
    }
} 