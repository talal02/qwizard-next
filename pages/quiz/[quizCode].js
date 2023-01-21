import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';


function Quiz() {
  const router = useRouter();
  const { quizCode } = router.query;
  const [startQuiz, setStartQuiz] = useState(false);
  const [questions, setQuestions] = useState([
    {
      "question": "What is the capital of France?",
      "choices": [
        "Paris",
        "London",
        "Rome",
        "Madrid"
      ],
      "answer": "Paris",
      "type": "multiple"
    }, 
    {
      "question": "What is the capital of Spain?",
      "choices": [
        "Paris",
        "London",
        "Rome",
        "Madrid"
      ],
      "answer": "Madrid",
      "type": "multiple"
    },
    {
      "question": "What is the capital of Italy?",
      "answer": "The capital of Italy is Rome.",
      "type": "short"
    },
    {
      "question": "What is the capital of the United Kingdom?",
      "answer": "The capital of the United Kingdom is London.",
      "type": "short"
    },
    {
      "question": "What is the capital of the United States?",
      "answer": "The capital of the United States is Washington",
      "type": "short"
    }
  ]);
  const [attempted, setAttempted] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  function maximizeScreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
      document.documentElement.msRequestFullscreen();
    }
    setStartQuiz(true);
  }
  useEffect(() => {
    window.addEventListener('blur', () => {
      if(startQuiz) {
        setStartQuiz(false);
      }
    });
    document.addEventListener('fullscreenchange', () => {
      if(!document.fullscreenElement) {
        setStartQuiz(false);
      }
    });

    var browserPrefixes = ['moz', 'ms', 'o', 'webkit'],
    isVisible = true; // internal flag, defaults to true

// get the correct attribute name
function getHiddenPropertyName(prefix) {
  return (prefix ? prefix + 'Hidden' : 'hidden');
}

// get the correct event name
function getVisibilityEvent(prefix) {
  return (prefix ? prefix : '') + 'visibilitychange';
}

// get current browser vendor prefix
function getBrowserPrefix() {
  for (var i = 0; i < browserPrefixes.length; i++) {
    if(getHiddenPropertyName(browserPrefixes[i]) in document) {
      // return vendor prefix
      return browserPrefixes[i];
    }
  }

  // no vendor prefix needed
  return null;
}

// bind and handle events
var browserPrefix = getBrowserPrefix(),
    hiddenPropertyName = getHiddenPropertyName(browserPrefix),
    visibilityEventName = getVisibilityEvent(browserPrefix);

function onVisible() {
if(isVisible) {
    return;
  }
 
  // change flag value
  isVisible = true;
  console.log('visible');
}

function onHidden() {
  // prevent double execution
  if(!isVisible) {
    return;
  }

  // change flag value
  isVisible = false;
  setStartQuiz(false);
  console.log('hidden');
}

  function handleVisibilityChange(forcedFlag) {
    // forcedFlag is a boolean when this event handler is triggered by a
    // focus or blur eventotherwise it's an Event object
    if(typeof forcedFlag === "boolean") {
      if(forcedFlag) {
        return onVisible();
      }

      return onHidden();
    }
    if(document[hiddenPropertyName]) {
      return onHidden();
    }

    return onVisible();
  }

  document.addEventListener(visibilityEventName, handleVisibilityChange, false);

  // extra event listeners for better behaviour
  document.addEventListener('focus', function() {
    handleVisibilityChange(true);
  }, false);

  document.addEventListener('blur', function() {
    handleVisibilityChange(false);
  }, false);

  window.addEventListener('focus', function() {
      handleVisibilityChange(true);
  }, false);

  window.addEventListener('blur', function() {
    handleVisibilityChange(false);
  }, false);


  }, []);
  return (
    <div className="container-fluid pt-5 h-100">
      <h1 className='text-center pb-5'>Quiz {quizCode}</h1>
      {
      !startQuiz ? 
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center pt-5 pb-5">Quiz Instructions</h2>
            <ol>
              <li>Start the quiz by clicking on the "Start Quiz" button.</li>
              <li>Attempt each question one at a time.</li>
              <li>Select the answer that you think is correct.</li>
              <li>Click on the "Next" button to move on to the next question.</li>
            </ol>
            <div className="alert alert-danger" role="alert">
              Warning: Do not switch to another tab or close the tab during the quiz, as this will result in the quiz being canceled.
            </div>
            <ol start="5">
              <li>Once you have completed all the questions, click on the "Submit" button to finish the quiz.</li>
              <li>If you accidentally switch to another tab or close the tab, you can return to the quiz by clicking on the browser tab with the quiz or open the tab again, but the quiz will be canceled and you will have to start over.</li>
            </ol>
          </div>
        </div>
        <div className="row pt-5 pb-5">
          <div className="col-12">
            <div className="text-center">
              <button id="start-quiz-btn" className="btn btn-warning text-white btn-lg" onClick={()=>{maximizeScreen();}}>Start Quiz</button>
            </div>
          </div>
        </div>
      </div> :
      <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card bg-warning text-white">
            <div className="card-header text-center">
              <h5>Quiz Question</h5>
            </div>
            {
              currentQuestion < questions.length & currentQuestion > -1 ?
              <div className="card-body d-flex flex-column align-items-center">
                <h4 className="card-text text-center pb-3 pt-3">{questions[currentQuestion].question}</h4>
                  { questions[currentQuestion].type === 'multiple' ?
                <div className="form-group">
                  <div className="form-check">
                      <input className="form-check-input" type="radio" name="choice" id="choice1" value="Paris" />
                      <label className="form-check-label" for="choice1">{questions[currentQuestion].choices[0]}</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="choice" id="choice2" value="London" />
                      <label className="form-check-label" for="choice2">{questions[currentQuestion].choices[1]}</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="choice" id="choice3" value="Rome" />
                      <label className="form-check-label" for="choice3">{questions[currentQuestion].choices[2]}</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="choice" id="choice4" value="Madrid" />
                      <label className="form-check-label" for="choice4">{questions[currentQuestion].choices[3]}</label>
                    </div>
                </div>
                    :
                    <div className="form-group w-50">
                      <textarea class="form-control" rows="5" col="20" id="area"></textarea>
                    </div>
                  }
              </div> :
              <h3 className='pt-5 pb-5 text-center'>
                 <button className='btn btn-info btn-lg text-white'>SUBMIT</button>
              </h3>
            }
          </div>
        </div>
        </div>
        <div className="row pt-5 pb-5">
          <div className="col-6">
            <div className="text-center">
              <button className="btn btn-info text-white btn-lg" onClick={()=>{setCurrentQuestion(currentQuestion-1);}}>Prev</button>
            </div>
          </div>
          <div className="col-6">
            <div className="text-center">
              <button className="btn btn-success text-white btn-lg" onClick={()=>{setCurrentQuestion(currentQuestion+1);}}>Next</button>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  )

}

export default Quiz;