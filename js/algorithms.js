class SchedulingAlgorithms {
    static fcfs(processes) {
        processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
        let currentTime = 0;
        const schedule = [];
        const timestamps = [];
        const completionTimes = {};
        const waitingTimes = [];

        for (const process of processes) {
            const startTime = Math.max(currentTime, process.arrivalTime);
            timestamps.push(startTime);
            schedule.push({
                process: process.name,
                duration: process.burstTime
            });
            currentTime = startTime + process.burstTime;
            completionTimes[process.name] = currentTime;
        }
        timestamps.push(currentTime);

        for (const process of processes) {
            const waitingTime = completionTimes[process.name] - process.burstTime - process.arrivalTime;
            waitingTimes.push({
                process: process.name,
                waitingTime: waitingTime
            });
        }

        return {
            schedule,
            timestamps: timestamps.map(t => Number(t.toFixed(2))),
            completionTimes,
            waitingTimes
        };
    }

    static roundRobin(processes, timeQuantum) {
        const queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        const schedule = [];
        const timestamps = [];
        const completionTimes = {};
        const waitingTimes = [];
        const remainingTimes = {};
        let currentTime = 0;

        processes.forEach(p => remainingTimes[p.name] = p.burstTime);

        while (queue.length > 0) {
            const process = queue.shift();
            if (currentTime < process.arrivalTime) {
                currentTime = process.arrivalTime;
            }

            timestamps.push(currentTime);
            const executionTime = Math.min(remainingTimes[process.name], timeQuantum);
            schedule.push({
                process: process.name,
                duration: executionTime
            });

            currentTime += executionTime;
            remainingTimes[process.name] -= executionTime;

            if (remainingTimes[process.name] > 0) {
                queue.push(process);
            } else {
                completionTimes[process.name] = currentTime;
            }
        }

        timestamps.push(currentTime);

        for (const process of processes) {
            const waitingTime = completionTimes[process.name] - process.burstTime - process.arrivalTime;
            waitingTimes.push({
                process: process.name,
                waitingTime: waitingTime
            });
        }

        return {
            schedule,
            timestamps: timestamps.map(t => Number(t.toFixed(2))),
            completionTimes,
            waitingTimes
        };
    }

    static srtf(processes) {
        processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
        let currentTime = 0;
        const schedule = [];
        const timestamps = [];
        const completionTimes = {};
        const waitingTimes = [];
        const remainingTimes = {};
        const waitingQueue = [];

        processes.forEach(p => remainingTimes[p.name] = p.burstTime);

        while (processes.length > 0 || waitingQueue.length > 0) {
            while (processes.length > 0 && processes[0].arrivalTime <= currentTime) {
                waitingQueue.push(processes.shift());
            }

            if (waitingQueue.length > 0) {
                waitingQueue.sort((a, b) => remainingTimes[a.name] - remainingTimes[b.name]);
                const process = waitingQueue.shift();
                const nextArrivalTime = processes.length > 0 ? processes[0].arrivalTime : Infinity;
                const timeToNextArrival = nextArrivalTime - currentTime;

                timestamps.push(currentTime);
                if (remainingTimes[process.name] <= timeToNextArrival) {
                    schedule.push({
                        process: process.name,
                        duration: remainingTimes[process.name]
                    });
                    currentTime += remainingTimes[process.name];
                    completionTimes[process.name] = currentTime;
                } else {
                    schedule.push({
                        process: process.name,
                        duration: timeToNextArrival
                    });
                    remainingTimes[process.name] -= timeToNextArrival;
                    currentTime += timeToNextArrival;
                    waitingQueue.push(process);
                }
            } else if (processes.length > 0) {
                const nextArrivalTime = processes[0].arrivalTime;
                if (currentTime < nextArrivalTime) {
                    schedule.push({
                        process: "Idle",
                        duration: nextArrivalTime - currentTime
                    });
                    currentTime = nextArrivalTime;
                    timestamps.push(currentTime);
                }
            }
        }

        timestamps.push(currentTime);

        for (const process of processes) {
            const waitingTime = completionTimes[process.name] - process.burstTime - process.arrivalTime;
            waitingTimes.push({
                process: process.name,
                waitingTime: waitingTime
            });
        }

        return {
            schedule,
            timestamps: timestamps.map(t => Number(t.toFixed(2))),
            completionTimes,
            waitingTimes
        };
    }

    static priorityScheduling(processes) {
        processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
        let currentTime = 0;
        const schedule = [];
        const timestamps = [];
        const completionTimes = {};
        const waitingTimes = [];
        const remainingTimes = {};
        const waitingQueue = [];

        processes.forEach(p => remainingTimes[p.name] = p.burstTime);

        while (processes.length > 0 || waitingQueue.length > 0) {
            while (processes.length > 0 && processes[0].arrivalTime <= currentTime) {
                waitingQueue.push(processes.shift());
            }

            if (waitingQueue.length > 0) {
                waitingQueue.sort((a, b) => a.priority - b.priority);
                const process = waitingQueue.shift();
                const nextArrivalTime = processes.length > 0 ? processes[0].arrivalTime : Infinity;
                const timeToNextArrival = nextArrivalTime - currentTime;

                timestamps.push(currentTime);
                if (remainingTimes[process.name] <= timeToNextArrival) {
                    schedule.push({
                        process: process.name,
                        duration: remainingTimes[process.name]
                    });
                    currentTime += remainingTimes[process.name];
                    completionTimes[process.name] = currentTime;
                } else {
                    schedule.push({
                        process: process.name,
                        duration: timeToNextArrival
                    });
                    remainingTimes[process.name] -= timeToNextArrival;
                    currentTime += timeToNextArrival;
                    waitingQueue.push(process);
                }
            } else if (processes.length > 0) {
                const nextArrivalTime = processes[0].arrivalTime;
                if (currentTime < nextArrivalTime) {
                    schedule.push({
                        process: "Idle",
                        duration: nextArrivalTime - currentTime
                    });
                    currentTime = nextArrivalTime;
                    timestamps.push(currentTime);
                }
            }
        }

        timestamps.push(currentTime);

        for (const process of processes) {
            const waitingTime = completionTimes[process.name] - process.burstTime - process.arrivalTime;
            waitingTimes.push({
                process: process.name,
                waitingTime: waitingTime
            });
        }

        return {
            schedule,
            timestamps: timestamps.map(t => Number(t.toFixed(2))),
            completionTimes,
            waitingTimes
        };
    }

    static sjf(processes, preemptive = false) {
        processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
        let currentTime = 0;
        const schedule = [];
        const timestamps = [];
        const completionTimes = {};
        const waitingTimes = [];
        const remainingTimes = {};
        const waitingQueue = [];

        processes.forEach(p => remainingTimes[p.name] = p.burstTime);

        while (processes.length > 0 || waitingQueue.length > 0) {
            while (processes.length > 0 && processes[0].arrivalTime <= currentTime) {
                waitingQueue.push(processes.shift());
            }

            if (waitingQueue.length > 0) {
                waitingQueue.sort((a, b) => remainingTimes[a.name] - remainingTimes[b.name]);
                const process = waitingQueue.shift();
                const nextArrivalTime = processes.length > 0 ? processes[0].arrivalTime : Infinity;
                const timeToNextArrival = nextArrivalTime - currentTime;

                timestamps.push(currentTime);
                if (remainingTimes[process.name] <= timeToNextArrival) {
                    schedule.push({
                        process: process.name,
                        duration: remainingTimes[process.name]
                    });
                    currentTime += remainingTimes[process.name];
                    completionTimes[process.name] = currentTime;
                } else {
                    schedule.push({
                        process: process.name,
                        duration: timeToNextArrival
                    });
                    remainingTimes[process.name] -= timeToNextArrival;
                    currentTime += timeToNextArrival;
                    if (preemptive) {
                        waitingQueue.push(process);
                    } else {
                        currentTime += remainingTimes[process.name];
                        completionTimes[process.name] = currentTime;
                    }
                }
            } else if (processes.length > 0) {
                const nextArrivalTime = processes[0].arrivalTime;
                if (currentTime < nextArrivalTime) {
                    schedule.push({
                        process: "Idle",
                        duration: nextArrivalTime - currentTime
                    });
                    currentTime = nextArrivalTime;
                    timestamps.push(currentTime);
                }
            }
        }

        timestamps.push(currentTime);

        for (const process of processes) {
            const waitingTime = completionTimes[process.name] - process.burstTime - process.arrivalTime;
            waitingTimes.push({
                process: process.name,
                waitingTime: waitingTime
            });
        }

        return {
            schedule,
            timestamps: timestamps.map(t => Number(t.toFixed(2))),
            completionTimes,
            waitingTimes
        };
    }

    static sjfPreemptive(processes) {
        return this.sjf(processes, true);
    }

    static sjfNonPreemptive(processes) {
        return this.sjf(processes, false);
    }
} 