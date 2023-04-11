import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { quiz_atom } from "../atoms/atoms";
import { useRouter } from "next/router";
import { db, auth } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { classroomConverter } from "../components/Classroom";

export default function current_quiz() {
  const [quizName, setQuizName] = useState("");
  const [validTill, setValidTill] = useState(null);
  const [totalMarks, setTotalMarks] = useState(0);
  const [duration, setDuration] = useState(0);
  const [localQuiz, setLocalQuiz] = useState(null);
  const [topic, setTopic] = useState("");
  const router = useRouter();
  const { classCode } = router.query;

  let current_quiz = useRecoilValue(quiz_atom);

  useEffect(() => {
    if (current_quiz.length > 0) {
      setTotalMarks(
        current_quiz.reduce(
          (acc, curr) => Number(acc.marks) + Number(curr.marks)
        )
      );
      setLocalQuiz(current_quiz.map((question) => question));
    }
  }, [current_quiz]);

  const setQuiz = () => {
    if (classCode != null) {
      fetchData(classCode).then((data) => {
        if (data !== null) {
          let classRoom = data;
          let _questions = localQuiz.map((question) => {
            if (Object.keys(question).length == 4) {
              return {
                question: question["question"],
                answer: question["answer"],
                marks: question["marks"],
                obtainedMarks: 0,
                type: "short",
                current: "",
              };
            }
          });
          let mcqs = localQuiz.map((question) => {
            if (Object.keys(question).length > 4) {
              return {
                question: question["question"],
                option1: question["option1"],
                option2: question["option2"],
                option3: question["option3"],
                option4: question["option4"],
                answer: question["answer"],
                marks: question["marks"],
                obtainedMarks: 0,
                type: "multiple",
              };
            }
          });
          mcqs = mcqs.filter((question) => question !== undefined);
          _questions = _questions.filter((question) => question !== undefined);
          console.log("MCQS", mcqs);
          console.log("Questions", _questions);
          classRoom.quizzes = {
            mcqs,
            questions: _questions,
            quizName,
            validTill,
            totalMarks,
            topic,
            attempt: duration,
          };
          const classRef = doc(db, "classrooms", classCode);
          const { ...classinit } = classRoom;
          setDoc(classRef, classinit).then(() =>
            router.push("/classroom/" + classCode, undefined, { shallow: true })
          );
        }
      });
    }
  };

  return (
    <div className="m-5 p-5 main-class-area">
      <h3 className="text-center">Current Quiz</h3>
      <hr className="my-2"></hr>
      {
        <div className="container">
          {current_quiz.map((question, idx) => {
            if (Object.keys(question).length == 4) {
              return (
                <div
                  key={`q-${idx}`}
                  className="container"
                  style={{ fontSize: "120%", marginTop: "4%" }}
                >
                  <div className="row">
                    <div
                      className="col-2"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      <span style={{ color: "brown" }}>Question: </span>
                    </div>
                    <div
                      className="col-10"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                      onInput={(e) => {
                        console.log(e.target.innerHTML);
                      }}
                    >
                      {" "}
                      {question["question"]}
                    </div>
                    <div
                      className="col-2"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      <span style={{ color: "brown" }}>Answer: </span>
                    </div>
                    <div
                      className="col-10"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      {question["answer"]}
                    </div>
                    <div
                      className="col-2"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      <span style={{ color: "brown" }}>Marks: </span>
                    </div>
                    <div
                      className="col-10"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      {question["marks"]}
                    </div>
                    <div
                      className="col-12"
                      style={{
                        border: "3px solid orange",
                        padding: "1.5%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <button type="button" className="btn btn-warning">
                        {" "}
                        Delete question from Quiz
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={`q-${idx}`}
                  className="container"
                  style={{ fontSize: "120%", marginTop: "4%" }}
                >
                  <div className="row">
                    <div
                      className="col-2"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      <span style={{ color: "brown" }}>Question: </span>
                    </div>
                    <div
                      className="col-10"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                      onInput={(e) => {
                        console.log(e.target.innerHTML);
                      }}
                    >
                      {" "}
                      {question["question"]}
                    </div>
                    <div
                      className="col-2"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      <span style={{ color: "brown" }}>Option 1: </span>
                    </div>
                    <div
                      className="col-10"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      {question["option1"]}
                    </div>
                    <div
                      className="col-2"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      <span style={{ color: "brown" }}>Option 2: </span>
                    </div>
                    <div
                      className="col-10"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      {question["option2"]}
                    </div>
                    <div
                      className="col-2"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      <span style={{ color: "brown" }}>Option 3: </span>
                    </div>
                    <div
                      className="col-10"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      {question["option3"]}
                    </div>
                    <div
                      className="col-2"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      <span style={{ color: "brown" }}>Option 4: </span>
                    </div>
                    <div
                      className="col-10"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      {question["option4"]}
                    </div>
                    <div
                      className="col-2"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      <span style={{ color: "brown" }}>Answer: </span>
                    </div>
                    <div
                      className="col-10"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      {question["answer"]}
                    </div>
                    <div
                      className="col-2"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      <span style={{ color: "brown" }}>Marks: </span>
                    </div>
                    <div
                      className="col-10"
                      style={{ border: "3px solid orange", padding: "1.5%" }}
                    >
                      {question["marks"]}
                    </div>
                    <div
                      className="col-12"
                      style={{
                        border: "3px solid orange",
                        padding: "1.5%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <button type="button" className="btn btn-warning">
                        {" "}
                        Delete question from Quiz
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      }
      <div className="container mt-5 text-center">
        <div className="form-group">
          <label style={{fontSize: 'large'}} for="quizName">Quiz Name</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setQuizName(e.target.value)}
            placeholder="Quiz Name"
          />
        </div>
        <div className="form-group">
          <label style={{fontSize: 'large'}} for="validTill">Valid Till</label>
          <input
            type="datetime-local"
            className="form-control"
            id="validTill"
            onChange={(e) => {
              setValidTill(Date.parse(e.target.value));
            }}
          />
        </div>
        <div className="form-group">
          <label style={{fontSize: 'large'}} for="duration">Duration (In Minutes)</label>
          <input
            type="number"
            className="form-control"
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (In Minutes)"
          />
        </div>
        <div className="form-group">
          <label style={{fontSize: 'large'}} for="topic">Topic</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic"
          />
        </div>
        {current_quiz.length > 0 && (
          <div className="form-group">
            <h4>Total Marks are {totalMarks}</h4>
          </div>
        )}
        <button onClick={setQuiz} className="btn btn-primary">
          Set Quiz
        </button>
      </div>
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
