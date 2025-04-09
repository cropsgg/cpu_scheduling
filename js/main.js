class CPUScheduler {
    constructor() {
        this.visualizer = new Visualizer();
        this.processes = [];
        this.initializeEventListeners();
        this.setupDragAndDrop();
        this.setupToast();
    }

    initializeEventListeners() {
        // Algorithm selection
        document.getElementById('algorithm').addEventListener('change', (e) => {
            const quantumInput = document.querySelector('.quantum-input');
            const priorityColumn = document.querySelector('.priority-column');
            
            if (e.target.value === 'round-robin') {
                quantumInput.style.display = 'block';
                priorityColumn.style.display = 'none';
            } else if (e.target.value === 'priority') {
                quantumInput.style.display = 'none';
                priorityColumn.style.display = 'table-cell';
            } else {
                quantumInput.style.display = 'none';
                priorityColumn.style.display = 'none';
            }
        });

        // Add process button
        document.getElementById('add-process').addEventListener('click', () => {
            this.addProcessRow();
        });

        // Clear table button
        document.getElementById('clear-table').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the process table?')) {
                this.clearProcessTable();
                this.showToast('Process table cleared successfully', 'success');
            }
        });

        // Start simulation button
        document.getElementById('start-simulation').addEventListener('click', () => {
            this.startSimulation();
        });

        // Compare algorithms button
        document.getElementById('compare-algorithms').addEventListener('click', () => {
            this.compareAlgorithms();
        });

        // File input
        document.getElementById('load-file').addEventListener('click', () => {
            document.getElementById('process-file').click();
        });

        // File drop zone click
        document.getElementById('file-drop-zone').addEventListener('click', () => {
            document.getElementById('process-file').click();
        });

        // File input change
        document.getElementById('process-file').addEventListener('change', (e) => {
            this.handleFileSelect(e);
        });

        // Modal close button
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('comparison-modal').style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('comparison-modal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    setupDragAndDrop() {
        const dropZone = document.getElementById('file-drop-zone');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('drag-over');
            });
        });

        dropZone.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            if (file) {
                this.loadProcessesFromFile(file);
            }
        });
    }

    setupToast() {
        this.toast = document.getElementById('toast');
    }

    showToast(message, type = 'info') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.style.display = 'block';
        
        setTimeout(() => {
            this.toast.style.display = 'none';
        }, 3000);
    }

    addProcessRow() {
        const tbody = document.querySelector('#process-table tbody');
        const row = document.createElement('tr');
        
        const processCell = document.createElement('td');
        const processInput = document.createElement('input');
        processInput.type = 'text';
        processInput.placeholder = 'Process name';
        processCell.appendChild(processInput);

        const arrivalCell = document.createElement('td');
        const arrivalInput = document.createElement('input');
        arrivalInput.type = 'number';
        arrivalInput.min = '0';
        arrivalInput.step = '0.1';
        arrivalInput.placeholder = 'Arrival time';
        arrivalCell.appendChild(arrivalInput);

        const burstCell = document.createElement('td');
        const burstInput = document.createElement('input');
        burstInput.type = 'number';
        burstInput.min = '0.1';
        burstInput.step = '0.1';
        burstInput.placeholder = 'CPU burst';
        burstCell.appendChild(burstInput);

        const priorityCell = document.createElement('td');
        const priorityInput = document.createElement('input');
        priorityInput.type = 'number';
        priorityInput.min = '0';
        priorityInput.placeholder = 'Priority';
        priorityCell.appendChild(priorityInput);

        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn secondary delete-row';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            row.remove();
            this.showToast('Process removed successfully', 'success');
        });
        actionsCell.appendChild(deleteButton);

        row.appendChild(processCell);
        row.appendChild(arrivalCell);
        row.appendChild(burstCell);
        row.appendChild(priorityCell);
        row.appendChild(actionsCell);
        tbody.appendChild(row);
    }

    clearProcessTable() {
        const tbody = document.querySelector('#process-table tbody');
        tbody.innerHTML = '';
    }

    getProcessesFromTable() {
        const processes = [];
        const rows = document.querySelectorAll('#process-table tbody tr');
        
        rows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            if (inputs[0].value && inputs[1].value && inputs[2].value) {
                processes.push({
                    name: inputs[0].value,
                    arrivalTime: parseFloat(inputs[1].value),
                    burstTime: parseFloat(inputs[2].value),
                    priority: inputs[3].value ? parseInt(inputs[3].value) : 0
                });
            }
        });

        return processes;
    }

    startSimulation() {
        const processes = this.getProcessesFromTable();
        if (processes.length === 0) {
            this.showToast('Please add at least one process', 'error');
            return;
        }

        const algorithm = document.getElementById('algorithm').value;
        let result;

        try {
            switch (algorithm) {
                case 'fcfs':
                    result = SchedulingAlgorithms.fcfs(processes);
                    break;
                case 'round-robin':
                    const timeQuantum = parseFloat(document.getElementById('time-quantum').value);
                    if (timeQuantum <= 0) {
                        throw new Error('Time quantum must be greater than 0');
                    }
                    result = SchedulingAlgorithms.roundRobin(processes, timeQuantum);
                    break;
                case 'sjf-preemptive':
                    result = SchedulingAlgorithms.sjfPreemptive(processes);
                    break;
                case 'sjf-nonpreemptive':
                    result = SchedulingAlgorithms.sjfNonPreemptive(processes);
                    break;
                case 'srtf':
                    result = SchedulingAlgorithms.srtf(processes);
                    break;
                case 'priority':
                    result = SchedulingAlgorithms.priorityScheduling(processes);
                    break;
            }

            const avgWaitingTime = result.waitingTimes.reduce((sum, wt) => sum + wt.waitingTime, 0) / result.waitingTimes.length;
            const totalTime = result.timestamps[result.timestamps.length - 1];

            // Add loading state to the start simulation button
            const startButton = document.getElementById('start-simulation');
            startButton.disabled = true;
            startButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Simulating...';

            // Simulate with a slight delay to show the loading state
            setTimeout(() => {
                this.visualizer.updateMetrics(totalTime, avgWaitingTime);
                this.visualizer.animateSimulation(result.schedule, result.timestamps);
                this.showToast('Simulation completed successfully', 'success');
                
                // Reset button state
                startButton.disabled = false;
                startButton.innerHTML = '<i class="fas fa-play"></i> Start Simulation';
            }, 500);
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    compareAlgorithms() {
        const processes = this.getProcessesFromTable();
        if (processes.length === 0) {
            this.showToast('Please add at least one process', 'error');
            return;
        }

        try {
            const timeQuantum = parseFloat(document.getElementById('time-quantum').value);
            const results = {
                'FCFS': SchedulingAlgorithms.fcfs([...processes]).waitingTimes.reduce((sum, wt) => sum + wt.waitingTime, 0) / processes.length,
                'Round Robin': SchedulingAlgorithms.roundRobin([...processes], timeQuantum).waitingTimes.reduce((sum, wt) => sum + wt.waitingTime, 0) / processes.length,
                'SJF (Preemptive)': SchedulingAlgorithms.sjfPreemptive([...processes]).waitingTimes.reduce((sum, wt) => sum + wt.waitingTime, 0) / processes.length,
                'SJF (Non-Preemptive)': SchedulingAlgorithms.sjfNonPreemptive([...processes]).waitingTimes.reduce((sum, wt) => sum + wt.waitingTime, 0) / processes.length,
                'SRTF': SchedulingAlgorithms.srtf([...processes]).waitingTimes.reduce((sum, wt) => sum + wt.waitingTime, 0) / processes.length,
                'Priority': SchedulingAlgorithms.priorityScheduling([...processes]).waitingTimes.reduce((sum, wt) => sum + wt.waitingTime, 0) / processes.length
            };

            document.getElementById('comparison-modal').style.display = 'block';
            this.visualizer.showComparisonChart(results);
            this.showToast('Comparison completed successfully', 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadProcessesFromFile(file);
        }
    }

    loadProcessesFromFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const processes = JSON.parse(e.target.result);
                this.clearProcessTable();
                processes.forEach(process => {
                    this.addProcessRow();
                    const row = document.querySelector('#process-table tbody tr:last-child');
                    const inputs = row.querySelectorAll('input');
                    inputs[0].value = process.name;
                    inputs[1].value = process.arrivalTime;
                    inputs[2].value = process.burstTime;
                    if (process.priority !== undefined) {
                        inputs[3].value = process.priority;
                    }
                });
                this.showToast('Processes loaded successfully', 'success');
            } catch (error) {
                this.showToast('Error loading file. Please ensure it is a valid JSON file.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CPUScheduler();
}); 