# CPU Scheduling Algorithm Visualizer

An interactive web application that visualizes different CPU scheduling algorithms and their performance metrics.

## Overview

This application provides a visual representation of various CPU scheduling algorithms, helping users understand how different scheduling policies affect process execution and system performance. The simulator includes both preemptive and non-preemptive scheduling algorithms with real-time visualization.

## Supported Algorithms

### 1. First Come First Serve (FCFS)
- Non-preemptive scheduling algorithm
- Processes are executed in the order they arrive
- Simple implementation but may lead to high average waiting time
- Implementation: `SchedulingAlgorithms.fcfs()`

### 2. Round Robin (RR)
- Preemptive scheduling algorithm
- Each process gets a fixed time slice (time quantum)
- Processes are executed in a circular queue
- Fair distribution of CPU time
- Implementation: `SchedulingAlgorithms.roundRobin()`

### 3. Shortest Job First (SJF)
#### Preemptive (SRTF - Shortest Remaining Time First)
- Preemptive version of SJF
- Process with shortest remaining time gets CPU
- Better average waiting time than FCFS
- Implementation: `SchedulingAlgorithms.sjfPreemptive()`

#### Non-Preemptive
- Process with shortest burst time gets CPU
- Once started, process runs to completion
- Implementation: `SchedulingAlgorithms.sjfNonPreemptive()`

### 4. Priority Scheduling
- Processes are executed based on priority
- Lower number indicates higher priority
- Can be preemptive or non-preemptive
- Implementation: `SchedulingAlgorithms.priorityScheduling()`

## Algorithm Implementation Details

### Process Structure
```javascript
{
    name: string,          // Process identifier
    arrivalTime: number,   // Time when process arrives
    burstTime: number,     // CPU time needed
    priority: number       // Process priority (optional)
}
```

### Common Components in All Algorithms
1. **Process Queue Management**
   - Maintains ready queue of processes
   - Sorts processes based on algorithm criteria
   - Handles process arrival and completion

2. **Time Tracking**
   - Maintains current simulation time
   - Tracks process completion times
   - Calculates waiting times

3. **Schedule Generation**
   - Creates Gantt chart data
   - Records process execution timeline
   - Tracks context switches

### Algorithm-Specific Features

#### FCFS Implementation
```javascript
static fcfs(processes) {
    // Sort by arrival time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    
    // Execute processes in order
    for (const process of processes) {
        // Calculate start time (considering arrival)
        const startTime = Math.max(currentTime, process.arrivalTime);
        
        // Execute process
        currentTime = startTime + process.burstTime;
        
        // Record completion and waiting time
    }
}
```

#### Round Robin Implementation
```javascript
static roundRobin(processes, timeQuantum) {
    // Initialize queue with processes
    const queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    
    while (queue.length > 0) {
        const process = queue.shift();
        
        // Execute for time quantum or remaining time
        const executionTime = Math.min(remainingTime, timeQuantum);
        
        // Update remaining time
        remainingTime -= executionTime;
        
        // Requeue if not completed
        if (remainingTime > 0) {
            queue.push(process);
        }
    }
}
```

#### SJF Implementation
```javascript
static sjf(processes, preemptive = false) {
    // Sort by arrival time initially
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    
    while (processes.length > 0 || waitingQueue.length > 0) {
        // Add arrived processes to waiting queue
        while (processes.length > 0 && processes[0].arrivalTime <= currentTime) {
            waitingQueue.push(processes.shift());
        }
        
        // Sort waiting queue by burst time
        waitingQueue.sort((a, b) => remainingTimes[a.name] - remainingTimes[b.name]);
        
        // Execute shortest job
        const process = waitingQueue.shift();
        
        if (preemptive) {
            // Check for shorter jobs after each time unit
            // Preempt if shorter job arrives
        } else {
            // Execute to completion
        }
    }
}
```

## Performance Metrics

The simulator calculates and displays several performance metrics:

1. **Average Waiting Time**
   - Total time processes spend waiting
   - Calculated as: Σ(Completion Time - Burst Time - Arrival Time) / Number of Processes

2. **Total Time**
   - Total simulation duration
   - Last process completion time

3. **Process Timeline**
   - Gantt chart visualization
   - Shows process execution order
   - Displays context switches

## Usage

1. **Adding Processes**
   - Use the process table to add processes
   - Specify arrival time, burst time, and priority
   - Import process data from JSON file

2. **Running Simulation**
   - Select scheduling algorithm
   - Set time quantum for Round Robin
   - Click "Start Simulation"

3. **Comparing Algorithms**
   - Click "Compare Algorithms"
   - View performance comparison chart
   - Analyze waiting times across algorithms

## File Structure

```
├── index.html          # Main application interface
├── css/
│   └── styles.css      # Application styling
├── js/
│   ├── main.js         # Application logic
│   ├── algorithms.js   # Scheduling algorithms
│   └── visualization.js # Gantt chart and metrics
└── README.md           # Documentation
```

## Technical Implementation

### Visualization
- Uses HTML5 Canvas for Gantt chart
- Chart.js for algorithm comparison
- CSS animations for process blocks

### Data Flow
1. User input → Process data structure
2. Algorithm processing → Schedule generation
3. Schedule → Gantt chart visualization
4. Metrics calculation → Performance display

### Error Handling
- Input validation
- Process data verification
- Algorithm-specific constraints
- User feedback through toast notifications

## Contributing

Feel free to contribute to this project by:
1. Adding new scheduling algorithms
2. Improving visualizations
3. Enhancing performance metrics
4. Adding new features

## License

This project is open source and available under the MIT License. 