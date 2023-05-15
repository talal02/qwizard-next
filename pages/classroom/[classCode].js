import axios from "axios";
import { BallTriangle } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../lib/firebase";
import { useRouter } from "next/router";
import Image from "next/image";
import AnnouncementMain from "../../components/AnnouncementMain";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { classroomConverter } from "../../components/Classroom";
import Link from "next/link";

import Announcement from "../../components/Announcement";
import { setLazyProp } from "next/dist/server/api-utils";

function Classroom() {
  const [user, setUser] = useAuthState(auth);
  const [text, setText] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const router = useRouter();
  const { classCode } = router.query;
  const [classroom, setClassroom] = useState(null);
  const [quiz, setQuiz] = useState({});
  const [loading, setLoading] = useState(true);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [displayQuiz, setDisplayQuiz] = useState(true);
  const [showClassQuizzes, setShowClassQuizzes] = useState(false);
  const [uniqueQuizzes, setUniqueQuizzes] = useState([]);
  const [currentShowQuiz, setCurrentShowQuiz] = useState(null);
  const [studentAttempted, setStudentAttempted] = useState(null);
  const [showAttempted, setShowAttempted] = useState(false);
  const [marks, setMarks] = useState(false);
  const [loadmarks, setLoadmarks] = useState(false)

  useEffect(() => {
    let componentMounted = true;
    if (classCode != null) {
      console.log(classCode, "<-")
      fetchData(classCode).then((data) => {
        if (componentMounted && data !== null) {
          setClassroom(data);
          setAnnouncements(data.announcements);
          setAttemptedQuizzes(data.attemptedQuizzes);
          const currentDate = new Date();
          const timestamp = currentDate.getTime();
          if (data.quizzes && data.quizzes.validTill > timestamp) {
            setQuiz(data.quizzes);
            const temp = data.attemptedQuizzes;
            console.log(data, "MYDATA")
            if(user) {
              if(temp !== undefined) {
                var unique = [];
                for(let i = 0; i < temp.length; i++) {
                  if(temp[i].id === data.quizzes.quizName && temp[i].userEmail == user.email) {
                    setDisplayQuiz(false);
                  }
                  if(unique.indexOf(temp[i].id) === -1) {
                    unique.push(temp[i].id);
                  }
                }
                // unique.push("A");
                // unique.push("B");
                // unique.push("C");
                setUniqueQuizzes(unique);
                if(user.email === data.teacher_email)  {
                  setDisplayQuiz(false);
                }
              } else {
                setDisplayQuiz(true);
              }
            } else {
              setDisplayQuiz(false);
            }            
          } else {
            setQuiz(null);
          }
          setLoading(false);
        }
      });
    }
    return () => {
      componentMounted = false;
    };
  }, [classCode]);

  const postAnnouncement = async () => {
    try {
      if (text != "") {
        try {
          const classRef = doc(db, "classrooms", classCode).withConverter(
            classroomConverter
          );
          console.log(classRef);
          let new_announcement = { text, date: new Date().getTime() };
          if (
            classroom.announcements === undefined ||
            classroom.announcements === null
          ) {
            classroom.announcements = [];
          }
          if (classroom.students === undefined || classroom.students === null) {
            classroom.students = [];
          }
          classroom.announcements.unshift(new_announcement);
          setAnnouncements(classroom.announcements);
          setText("");
          document.getElementById("announcement").value = "";
          await setDoc(classRef, classroom);
        } catch (err) {
          console.log("Error posting announcement", err);
        }
      } else {
        throw new Error("Announcement cannot be empty");
      }
    } catch (err) {
      console.log("Error posting announcement", err);
    }
  };

  useEffect(() => {
    if (!user) {
      // router.push('/login');
    } else {
    }
  }, [user]);

  useEffect(() => {

  }, [showAttempted])

  
  // useEffect(() => {
  // }, [marks])

    
  const selectQuiz = (e) => {
    setCurrentShowQuiz(e.target.value); 
    if(user && attemptedQuizzes !== undefined) {
      var attempted = [];
      for(let i = 0; i < attemptedQuizzes.length; i++) {
          if(attemptedQuizzes[i].id == e.target.value) {
            attempted.push(attemptedQuizzes[i]);
          }
      }
      setStudentAttempted(attempted);
    }
  }

  if (user) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div className="col-xs-6 col-sm-5 col-md-2 d-flex">
            <Image
              src="/logo.svg"
              className="mx-auto"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>

          <div className="col-xs-6 col-sm-3 col-md-2 d-flex align-items-center">
            <Image
              src={user.photoURL}
              className="mx-auto logout-img rounded-circle"
              alt="Logo"
              onClick={() => {
                auth.signOut();
              }}
              width={60}
              height={60}
            />
          </div>
        </div>
        {loading && classroom === null && (
          <div className="d-flex justify-content-center">
            <Image
              src="/Spinner.svg"
              className="mx-auto"
              alt="Logo"
              width={500}
              height={500}
            />
          </div>
        )}
        {!loading && classroom !== null && (
          <>
            <section>
              <div className="container h-100">
                <div className="text-white bg-primary border rounded border-0 p-4 py-5 bg-custom">
                  <div className="row h-100">
                    <div className="col-md-10 col-xl-8 text-center d-flex d-sm-flex d-md-flex justify-content-center align-items-center mx-auto justify-content-md-start align-items-md-center justify-content-xl-center">
                      <div>
                        <h1 className="text-uppercase fw-bold text-white mb-3">
                          {classroom.name}
                        </h1>
                        <p>
                          <strong>
                            {classroom.code} - {classroom.type} -{" "}
                            {classroom.semester} - {classroom.teacher_name}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {classroom.teacher_email == user.email && (
                <div className="container">
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="btn bg-custom text-white btn-block mt-3">
                        <Link href={`/quiz_form?classCode=${classCode}`}>
                          <a className="custom-link">Generate Quiz</a>
                        </Link>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="btn bg-custom text-white btn-block mt-3">
                        <Link href={`/mcq_quiz_form?classCode=${classCode}`}>
                          <a className="custom-link">
                            Generate Multiple Choice Questions
                          </a>
                        </Link>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="btn bg-custom text-white btn-block mt-3">
                        <Link href={`/current_quiz?classCode=${classCode}`}>
                          <a className="custom-link">Compiled Quiz So Far</a>
                        </Link>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="btn bg-custom text-white btn-block mt-3">
                        <a onClick={() => setShowClassQuizzes(!showClassQuizzes)} className="custom-link">
                          Quizzes
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
            <div className="container">
              <div className="row">
                <div className="main-class-area mt-3 col-12 col-md-10 mx-auto p-4">
                  {
                    !showClassQuizzes && (
                      <div>
                        {classroom.teacher_email == user.email && (
                    <div>
                      <h3 className="text-center">Post Announcement</h3>
                      <hr></hr>
                      <div
                        className="wrap-input1 validate-input d-flex mt-3 justify-content-center"
                        data-validate="Message is required"
                      >
                        <textarea
                          className="input1 w-100"
                          id="announcement"
                          onChange={(e) => {
                            setText(e.target.value);
                          }}
                          placeholder="Announcement"
                        ></textarea>
                        <span className="shadow-input1"></span>
                        <button
                          className="floating-right-bottom-btn"
                          onClick={postAnnouncement}
                        >
                          📯
                        </button>
                      </div>
                    </div>
                  )}
                  {quiz !== null &&
                    displayQuiz && (
                      <div>
                        <h3 className="text-center">Quiz</h3>
                        <hr></hr>
                        <div className="container rounded bg-primary text-white text-center p-3 mb-3">
                          <h5>{quiz.quizName} is Available!</h5>
                          <h5>Total Marks: {quiz.totalMarks}</h5>
                          <h5>Time to attempt: {quiz.attempt} mins</h5>
                          <Link href={`/quiz/${quiz.quizName}+${classCode}`}>
                            <span className="btn btn-sm bg-warning text-white">
                              Start Quiz
                            </span>
                          </Link>
                        </div>
                      </div>
                    )}
                  {announcements.length > 0 && (
                    <div>
                      <h3 className="text-center">Announcements</h3>
                      <hr></hr>
                      {announcements.map((a, idx) => (
                        <AnnouncementMain
                          key={`announcement-${idx}`}
                          author={classroom.teacher_name}
                          announcement={a}
                        />
                      ))}
                    </div>
                  )}
                      </div>
                    )
                  }
                  {
                    showClassQuizzes && (
                      <div>
                        <h3 className="text-center">Quizzes</h3>
                        <select className="form-control" onChange={selectQuiz} onClick={selectQuiz}>
                          {uniqueQuizzes.map((option,idx) => (
                            <option key={`option-${idx}`} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <hr></hr>
                        {/* I, Ahmed, made changes here (below) in order to display the attempted quiz */}
                        {
                          studentAttempted && studentAttempted.map((attempt,idx) => (
                            <>
                            <div key={`attempt-${idx}`} className="container rounded bg-primary text-white text-center p-3 mb-3" onClick={
                              () => {
                                // if (mark == true){
                                //   setShowAttempted(true)
                                // }
                                // if(mark !== true){
                                    if(showAttempted === true){
                                      setShowAttempted(false)
                                    }
                                    else{
                                      setShowAttempted(true)
                                    // }
                                }

                              }
                            }>
                              <h5>{attempt.userEmail}</h5>
                              {showAttempted ? (
                                <div className="card">
                                 {attempt.questions.map((q, index) => {
                                    return(
                                      <>         
                                        <div className="card-body">
                                          <div className="row">
                                            <div className="col-4" style={{ color: 'orange', border: "1px solid orange" }}><b>Question: </b> </div>
                                            <div className="col-8" style={{ color: 'orange',border: "1px solid orange", fontWeight:"600"}}>{q.question} </div>
                                            <div className="col-4" style={{ color: 'green',border: "1px solid orange" }}><b>Correct Answer: </b> </div>
                                            <div className="col-8" style={{ color: 'green',border: "1px solid orange",fontWeight:"600" }}>{q.answer} </div>
                                            <div className="col-4" style={{ color: 'black',border: "1px solid orange" }}><b>Attempted Answer: </b> </div>
                                            <div className="col-8" style={{ color: 'black',border: "1px solid orange",fontWeight:"600" }}>{q.current} </div>
                                            <div className="col-4" style={{ color: '#44a6c6',border: "1px solid orange" }}><b>Total Marks:</b> </div>
                                            <div className="col-8" style={{ color: '#44a6c6',border: "1px solid orange",fontWeight:"600" }}>{q.marks} </div>
                                            <div className="col-4" style={{ color: '#44a6c6',border: "1px solid orange" }}><b>Marks Obtained:</b> </div>
                                            <div className="col-8" style={{ color: '#44a6c6',border: "1px solid orange",fontWeight:"600" }}>{marks ? marks[index]*Number(q.marks):q.obtainedMarks } </div>
                                          </div>
                                        </div>
                                      </>)
                                  })}
                                </div>
                              ) : null}


                               {/* I, Ahmeds, changes end here */}
                            </div>
                            
                                {showAttempted ? (
                                  <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                                      {loadmarks ? 
                                      (<BallTriangle
                                        height={50}
                                        width={50}
                                        radius={5}
                                        color="#fba121"
                                        ariaLabel="ball-triangle-loading"
                                        wrapperClass={{}}
                                        wrapperStyle=""
                                        visible={true}
                                      />):null}

                                      <button className="floating-right-bottom-btn-new" disabled={loadmarks} onClick={() => {
                                        setLoadmarks(true);
                                        const targets_and_attempts = attempt.questions.map((question) => ({
                                          target: question.answer,
                                          attempt: question.current,
                                        }));
                                        axios.post("http://localhost:8080/evaluate_ans", {
                                          answers: targets_and_attempts
                                        }).then(res => {updateObtainedMarks(classCode, attempt.userEmail,res.data)
                                        setMarks(res.data.marks)}                               
                                        ).catch(err => console.log('ERR! ', err)).finally(() => setLoadmarks(false));
                                      }
                                    }
                            > &#9889; Auto-Mark Quiz  &#9757;
                            </button>
                            {loadmarks ? 
                            (<BallTriangle
                              height={50}
                              width={50}
                              radius={5}
                              color="#fba118"
                              ariaLabel="ball-triangle-loading"
                              wrapperClass={{}}
                              wrapperStyle=""
                              visible={true}
                            />):null}
                            </div>
                           ): null} 
          
                           </>
                          ))
                        }
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  return <></>;
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

let updateObtainedMarks = async (classCode, user, marks) => {
  let classroomRef = doc(db, "classrooms", classCode);
  let classroomSnapshot = await getDoc(classroomRef);
  if (classroomSnapshot.exists()) {
    let classroomData = classroomSnapshot.data();
    //let attempted_quiz = classroomData.attemptedQuizzes.find((q) => q.userEmail === user);
    let index = classroomData.attemptedQuizzes.findIndex(quiz => quiz.userEmail === user);
    let attempted_quiz = classroomData.attemptedQuizzes[index];
    console.log(attempted_quiz)
    let questions = attempted_quiz.questions;
    console.log(questions)
    console.log("marks", marks)
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      question.obtainedMarks = (marks.marks[i] * Number(question.marks));
      console.log(question.obtainedMarks);
    }
    await updateDoc(classroomRef, {
      attemptedQuizzes: classroomData.attemptedQuizzes
    });  
  }
}


export default Classroom;

