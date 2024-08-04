// SocketClientAI.js
import io from 'socket.io-client';

class SocketClientAI {
  constructor() {
    this.socket = io('http://localhost:8930');

    // Listen to server events
    this.socket.on('GenerateUnitStepComplete', (data) => {
      if (this.onStepComplete) this.onStepComplete(data);
    });

    this.socket.on('NextStep', (data) => {
      if (this.onNextStep) this.onNextStep(data);
    });
    this.socket.on('StepResults', (data) => {
      if (this.onStepResults) this.onStepResults(data);
    });

    this.socket.on('GenerateUnitFinished', (data) => {
      if (this.onUnitFinished) this.onUnitFinished(data);
    });
  }


  //emitters
  // Function to generate a unitinit_data.estimatedMinutes,init_data.maxDepth);
  GenerateUnit(level, mainTask, personalSpecs, breakdownRange, timeForStep,estimatedMinutes,maxDepth,auto,name) {
    this.socket.emit('GenerateUnit', { level, mainTask, personalSpecs, breakdownRange, timeForStep,estimatedMinutes,auto,maxDepth,name });
  }

  ApproveStep(stepId, prompt,system) {
    this.socket.emit('ApproveStep', { stepId, prompt,system });
  }

  ContinueStep(stepId) {
    this.socket.emit('ContinueStep', { stepId });
  }
  InterceptStep(stepId, prompt) {
    this.socket.emit('InterceptStep', { stepId, prompt });
  }
  
  Disconnect() {
    this.socket.disconnect();
  }
  // Event handlers setters
  setOnStepComplete(callback) {
    this.onStepComplete = callback;
  }
  setOnUnitFinished(callback) {
    this.onUnitFinished = callback;
  }
  setOnNextStep(callback) {
    this.onNextStep = callback;
  }

  setOnStepResults(callback) {
    this.onStepResults = callback;
  }

  

  
}

export default SocketClientAI;
