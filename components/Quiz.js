class Quiz {
  constructor(quiz_id, mcqs, questions) {
    this.quiz_id = quiz_id;
    this.mcqs = mcqs;
    this.questions = questions;
  }
}

export const quizConverter = {
  toFirestore: function (quiz) {
    console.log(quiz);
    return {
      quiz_id: quiz.quiz_id,
      mcqs: quiz.mcqs,
      questions: quiz.questions,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Quiz(data.quiz_id, data.mcqs, data.questions);
  },
};

export default Quiz;
