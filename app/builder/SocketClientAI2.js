// SocketClientAI.js
import io from 'socket.io-client';

class SocketClientAI2 {
  constructor() {
    this.socket = io('http://localhost:8930');

    // Listen to server events

    this.socket.on('UnitReady', (data) => {
      if (this.onUnitReady) this.onUnitReady(data);
    });
    this.socket.on('SessionsReady', (data) => {
      if (this.onSessionsReady) this.onSessionsReady(data);
    }); 
    this.socket.on('StepReady', (data) => {
      if (this.onStepReady) this.onStepReady(data);
    }); 
    this.socket.on('AllStepsReady', (data) => {
      if (this.onAllStepsReady) this.onAllStepsReady(data);
    }); 
    this.socket.on('Error', (data) => {
      if (this.onError) this.onError(data);
    });
    
  }


  //emitters
  // Function to generate a unitinit_data.estimatedMinutes,init_data.maxDepth);
  GenerateUnit(tags,prompt) {
    let categories = [];
    let stacks = [];
    let levels = [];
    let concepts = [];

    // Populate arrays based on sid
    tags.forEach(item => {
        switch (item.sid) {
            case 1:
                categories.push(item.topic);
                break;
            case 2:
                stacks.push(item.topic);
                break;
            case 3:
                levels.push(item.topic);
                break;
            case 4:
                concepts.push(item.topic);
                break;
                
            default:
                // Handle unexpected sid value
                console.log(`Unexpected sid: ${item.sid}`);
                break;
        }
    });

    this.socket.emit('GenerateUnit', { categories, stacks, levels, concepts,prompt });
  }
  
  GenerateSessions(unit,prompt) {
    
    this.socket.emit('GenerateSessions', { unit,prompt });
  }
  GenerateSteps(unit,sessions,prompt) {  
    this.socket.emit('GenerateSteps', { unit,sessions,prompt });
  }
  

  // Event handlers setters

  setOnUnitReady(callback) {
    this.onUnitReady = callback;
  }
  setOnSessionsReady(callback) {
    this.onSessionsReady = callback;
  }
  setOnAllStepsReady(callback) {
    this.onAllStepsReady = callback;
  }
  setOnStepReady(callback) {
    this.onStepReady = callback;
  }
  setOnError(callback) {
    this.onError = callback;
  }
  
  Disconnect() {
    this.socket.disconnect();
  }
  
}

export default SocketClientAI2;
