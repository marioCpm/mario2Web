const TimelineManager = require('./TimelineManager');
const ReviewManager = require('./ReviewManager');


class TrainingManager {
  constructor(displayInformer,displayQuestion,scenarioFinished) {
    this.scenarioFinished = scenarioFinished;
    this.displayInformer = displayInformer;
    this.displayQuestion = displayQuestion;
    this.scenarioStructure = [];
    this.alive = false;
    this.isStepProcessing = false; // Flag to check if the runStep is in process

    this.currentIndex = 0;
    this.timelineManager = new TimelineManager(); // Initialize timeline manager
    this.reviewManager = new ReviewManager(); // Initialize review manager
  }


  StartTimeline() {
    this.timelineManager.startTimeline();
  }


  
  setData(scenarioStructure) {
    console.log("setting data")
    console.log("scenarioStructure data")
    console.log(JSON.stringify(scenarioStructure))
    
    this.scenarioStructure = scenarioStructure;
    this.currentIndex = 0;
  }

  getData() {
    console.log("getting data")
    return this.scenarioStructure;
  }





  StartSession() {
    this.StartTimeline();
    if (this.scenarioStructure?.length === 0) {
      console.log('No scenario data set.');
      return;
    }
    this.alive = true;
    this.runStep();
  }

  AddEventToReview(type, message) {
    const timestamp = this.timelineManager.getTimestampFormatted();
    let newEvent = {type, message,timestamp};
    this.reviewManager.addEvent(newEvent);
  }
  getReview() {

    return this.reviewManager.getReview();
  }

  CalculateScore(_review,type) {
    console.log("CalculateScore");
    console.log(_review);
    let review = JSON.parse(_review);
    let totalTrials = 0;
    let correctAnswers = 0;

    const questions = review.filter(event => event.type === "questionStarted").map(event => ({
        question: JSON.parse(event.message).question,
        correctAnswer: JSON.parse(event.message).correct_answer,
        number_of_trials: JSON.parse(event.message).number_of_trials
    }));

    const questionDone = review.filter(event => event.type === "QuestionDone").map(event => ({
        question: JSON.parse(event.message).question,
        selectedOption: JSON.parse(event.message).selectedOption,
        trialsRemaining: JSON.parse(event.message).trialsRemaining
    }));
    console.log("correctAnswers");



    questions.forEach(qs => {
        const correspondingDoneEvent = questionDone.find(qd => qd.question === qs.question);
        if (correspondingDoneEvent) {
            totalTrials += qs.number_of_trials - correspondingDoneEvent.trialsRemaining;
            if (qs.correctAnswer === correspondingDoneEvent.selectedOption) {
                correctAnswers += 1;
            }
        }
    });
    console.log("correctAnswers");
    console.log(correctAnswers);

    totalTrials=totalTrials+correctAnswers;
    console.log("totalTrials");
    console.log(totalTrials);
    const score = correctAnswers / totalTrials;
    console.log("score");
    console.log(score);
    let resultScore = Math.ceil(score * 10); // Scale score to 1-10

    if (!resultScore){
      resultScore = 3;
    }

    const assessment = review.filter(event => event.type === "assessment" && event?.object?.score !== undefined)
    .map(event => ({
        score: event.object.score !== null ? event.object.score : 0 // Providing a default score of 0 if null
    }));
    assessment.forEach(as => {
      resultScore+=Math.ceil(as.score/10)*7;
    });
    return resultScore;
}


  runStep() {
    this.isStepProcessing = true;
    setTimeout(() => {
      console.log('One second has passed.');
      console.log(this.currentIndex);
      console.log(this.scenarioStructure?.length);
      if (this.currentIndex >= this.scenarioStructure?.length) {
        console.log('Scenario completed.');
        let review = JSON.stringify(this.getReview());
        this.alive = false;
        let score = this.CalculateScore(review)
        console.log("score");
        console.log(score);

        this.scenarioFinished(review,score);
        return;
      }
      const currentElement = this.scenarioStructure[this.currentIndex];
      console.log(currentElement);

      switch (currentElement?.type) {
        case 'informer':
          this.startInformer(currentElement);
          break;
        case 'question':
          this.startQuestion(currentElement);
          break;
        case 'sleeper':
          this.startSleeper(currentElement);
          break;
        default:
          console.log(`Unknown type: ${currentElement.type}`);
      }
      this.isStepProcessing = false;

  }, 1000); 
    
  }

  startInformer(informer) {
    console.log(`Starting informer: ${informer.id}`);

    this.AddEventToReview("informerStarted",informer)

    this.displayInformer(informer);
  }

  startQuestion(question) {
    console.log(`Starting question: ${question.id}`);
    // Call the function in main.js to display question data
    this.AddEventToReview("questionStarted",JSON.stringify(question))
    // Listen for an event to continue to the next step
    this.displayQuestion(question)
  }

  questionDone(question) {
    this.AddEventToReview("QuestionDone",question)

  }

  startSleeper(sleeper) {
    console.log(`Starting sleeper: ${sleeper.id}`);
    console.log(sleeper);
    setTimeout(() => {
      try {
        console.log(`Sleeper ${sleeper.id} completed.`);
        this.currentIndex++;
        this.runStep();
      } catch (error) {
        console.error(`Error in sleeper ${sleeper.id}:`, error);
      }
    }, sleeper.seconds * 1000);
  }

  continueSession() {
    if (this.isStepProcessing) {
      console.log("Step is already running. Please wait.");
      return; // Exit if a step is already running
  }
    this.currentIndex++;
    this.runStep();
  }

  isAlive() {
    return this.alive;
  }
}

// Example usage:

module.exports = TrainingManager;
