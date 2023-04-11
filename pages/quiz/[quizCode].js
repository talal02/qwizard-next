import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { classroomConverter } from "../../components/Classroom";

function Quiz() {
  const router = useRouter();
  const { quizCode } = router.query;
  const [startQuiz, setStartQuiz] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [attempted, setAttempted] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [classCode, setClassCode] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [time, setTime] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  function maximizeScreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      /* Firefox */
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      /* IE/Edge */
      document.documentElement.msRequestFullscreen();
    }
    let curr = new Date();
    setTime(curr.getTime() + time * 60000);
    setStartQuiz(true);
  }

  const getTime = () => {
    const t = time - Date.now();
    setMinutes(Math.floor((t / 1000 / 60) % 60));
    setSeconds(Math.floor((t / 1000) % 60));
  };

  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      setStartQuiz(false);
    }
  }, [minutes, seconds]);

  useEffect(() => {
    if (time && time != 0 && startQuiz) {
      const interval = setInterval(() => {
        getTime();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startQuiz]);

  useEffect(() => {
    window.addEventListener("blur", () => {
      if (startQuiz) {
        setStartQuiz(false);
      }
    });
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        setStartQuiz(false);
      }
    });

    var browserPrefixes = ["moz", "ms", "o", "webkit"],
      isVisible = true; // internal flag, defaults to true

    // get the correct attribute name
    function getHiddenPropertyName(prefix) {
      return prefix ? prefix + "Hidden" : "hidden";
    }

    // get the correct event name
    function getVisibilityEvent(prefix) {
      return (prefix ? prefix : "") + "visibilitychange";
    }

    // get current browser vendor prefix
    function getBrowserPrefix() {
      for (var i = 0; i < browserPrefixes.length; i++) {
        if (getHiddenPropertyName(browserPrefixes[i]) in document) {
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
      if (isVisible) {
        return;
      }

      // change flag value
      isVisible = true;
    }

    function onHidden() {
      // prevent double execution
      if (!isVisible) {
        return;
      }

      // change flag value
      isVisible = false;
      setStartQuiz(false);
    }

    function handleVisibilityChange(forcedFlag) {
      // forcedFlag is a boolean when this event handler is triggered by a
      // focus or blur eventotherwise it's an Event object
      if (typeof forcedFlag === "boolean") {
        if (forcedFlag) {
          return onVisible();
        }

        return onHidden();
      }
      if (document[hiddenPropertyName]) {
        return onHidden();
      }

      return onVisible();
    }

    document.addEventListener(
      visibilityEventName,
      handleVisibilityChange,
      false
    );

    // extra event listeners for better behaviour
    document.addEventListener(
      "focus",
      function () {
        handleVisibilityChange(true);
      },
      false
    );

    document.addEventListener(
      "blur",
      function () {
        handleVisibilityChange(false);
      },
      false
    );

    window.addEventListener(
      "focus",
      function () {
        handleVisibilityChange(true);
      },
      false
    );

    window.addEventListener(
      "blur",
      function () {
        handleVisibilityChange(false);
      },
      false
    );

    // Fetch Data of Class
    console.log(quizCode);
    if (quizCode !== undefined && quizCode !== null) {
      let class_code = quizCode.split("+")[1];
      setClassCode(class_code);
      fetchData(class_code).then((data) => {
        if (data !== null) {
          setQuiz(data.quizzes);
          let _mcqs = data.quizzes.mcqs;
          let _questions = data.quizzes.questions;
          console.log("MCQS", _mcqs);
          console.log("QUESTIONS", _questions);
          setQuestions([..._mcqs, ..._questions]);
          setTime(Number(data.quizzes.attempt));
          console.log("DONE", data.quizzes.attempt);
        }
      });
    }
  }, []);

  function handlePrev(idx) {
    if (idx > 0) {
      setCurrentQuestion(idx - 1);
    }
  }

  function handleNext(idx) {
    if (idx < questions.length) {
      setCurrentQuestion(idx + 1);
    }
  }

  function handleUpdateQuestionMCQ(option) {
    let updated = [...questions];
    updated[currentQuestion].current = option;
    setQuestions(updated);
  }

  function handleUpdateQuestion(c_answer) {
    let updated = [...questions];
    updated[currentQuestion].current = c_answer;
    setQuestions(updated);
  }

  return (
    <div className="container-fluid pt-5 h-100">
      <h1 className="text-center pb-5">
        Quiz {quizCode ? quizCode.split("+")[0] : ""}
      </h1>
      {!startQuiz ? (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="text-center pt-5 pb-5">Quiz Instructions</h2>
              <ol>
                <li>Start the quiz by clicking on the "Start Quiz" button.</li>
                <li>Attempt each question one at a time.</li>
                <li>Select the answer that you think is correct.</li>
                <li>
                  Click on the "Next" button to move on to the next question.
                </li>
              </ol>
              <div className="alert alert-danger" role="alert">
                Warning: Do not switch to another tab or close the tab during
                the quiz, as this will result in the quiz being canceled.
              </div>
              <ol start="5">
                <li>
                  Once you have completed all the questions, click on the
                  "Submit" button to finish the quiz.
                </li>
              </ol>
            </div>
          </div>
          <div className="row pt-5 pb-5">
            <div className="col-12">
              <div className="text-center">
                <button
                  id="start-quiz-btn"
                  className="btn btn-warning text-white btn-lg"
                  onClick={() => {
                    maximizeScreen();
                  }}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container main-class-area">
          <h3 className="text-center p-5">
            Remaining Time: {minutes}:{seconds}
          </h3>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card bg-warning text-white">
                <div className="card-header text-center">
                  <h5>Quiz Question</h5>
                </div>
                {(currentQuestion < questions.length) &
                (currentQuestion > -1) ? (
                  <div className="card-body d-flex flex-column align-items-center">
                    <h4 className="card-text text-center pb-3 pt-3">
                      {questions[currentQuestion].question}
                    </h4>
                    {questions[currentQuestion].type === "multiple" ? (
                      <div className="form-group">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            checked={
                              true
                                ? questions[currentQuestion].current ==
                                  questions[currentQuestion].option1
                                : false
                            }
                            type="radio"
                            name="choice"
                            id="choice1"
                            onChange={() =>
                              handleUpdateQuestionMCQ(
                                questions[currentQuestion].option1
                              )
                            }
                            value={questions[currentQuestion].option1}
                          />
                          <label className="form-check-label" for="choice1">
                            {questions[currentQuestion].option1}
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            checked={
                              true
                                ? questions[currentQuestion].current ==
                                  questions[currentQuestion].option2
                                : false
                            }
                            type="radio"
                            name="choice"
                            id="choice2"
                            onChange={() =>
                              handleUpdateQuestionMCQ(
                                questions[currentQuestion].option2
                              )
                            }
                            value={questions[currentQuestion].option2}
                          />
                          <label className="form-check-label" for="choice2">
                            {questions[currentQuestion].option2}
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            checked={
                              true
                                ? questions[currentQuestion].current ==
                                  questions[currentQuestion].option3
                                : false
                            }
                            type="radio"
                            name="choice"
                            onChange={() =>
                              handleUpdateQuestionMCQ(
                                questions[currentQuestion].option3
                              )
                            }
                            id="choice3"
                            value={questions[currentQuestion].option3}
                          />
                          <label className="form-check-label" for="choice3">
                            {questions[currentQuestion].option3}
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            checked={
                              true
                                ? questions[currentQuestion].current ==
                                  questions[currentQuestion].option4
                                : false
                            }
                            onChange={() =>
                              handleUpdateQuestionMCQ(
                                questions[currentQuestion].option4
                              )
                            }
                            type="radio"
                            name="choice"
                            id="choice4"
                            value={questions[currentQuestion].option4}
                          />
                          <label className="form-check-label" for="choice4">
                            {questions[currentQuestion].option4}
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="form-group w-50">
                        <textarea
                          className="form-control"
                          rows="5"
                          col="20"
                          onChange={(e) => handleUpdateQuestion(e.target.value)}
                          id="area"
                          value={questions[currentQuestion].current}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <h3 className="pt-5 pb-5 text-center">
                    <button className="btn btn-info btn-lg text-white">
                      SUBMIT
                    </button>
                  </h3>
                )}
              </div>
            </div>
          </div>
          <div className="row pt-5 pb-5">
            <div className="col-6">
              <div className="text-center">
                <button
                  className="btn btn-info text-white btn-lg"
                  onClick={() => handlePrev(currentQuestion)}
                >
                  Prev
                </button>
              </div>
            </div>
            <div className="col-6">
              <div className="text-center">
                <button
                  className="btn btn-success text-white btn-lg"
                  onClick={() => handleNext(currentQuestion)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

let fetchData = async (classCode) => {
  const ref = doc(db, "classrooms", classCode).withConverter(
    classroomConverter
  );
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    let new_classroom = docSnap.data();
    return new_classroom;
  }
  return null;
};

export default Quiz;
