function Quiz() {
  return (
    <div className="container-fluid pt-5 h-100">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center pt-5 pb-5">Quiz Instructions</h1>
            <ol>
              <li>Start the quiz by clicking on the "Start Quiz" button.</li>
              <li>Attempt each question one at a time.</li>
              <li>Select the answer that you think is correct.</li>
              <li>
                Click on the "Next" button to move on to the next question.
              </li>
            </ol>
            <div className="alert alert-danger" role="alert">
              Warning: Do not switch to another tab or close the tab during the
              quiz, as this will result in the quiz being canceled.
            </div>
            <ol start="5">
              <li>
                Once you have completed all the questions, click on the "Submit"
                button to finish the quiz.
              </li>
              <li>
                If you accidentally switch to another tab or close the tab, you
                can return to the quiz by clicking on the browser tab with the
                quiz or open the tab again, but the quiz will be canceled and
                you will have to start over.
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
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
