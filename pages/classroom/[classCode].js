import { useEffect, useState } from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {db, auth} from '../../lib/firebase';
import {useRouter} from 'next/router';
import Image from 'next/image';
import AnnouncementMain from '../../components/AnnouncementMain';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {classroomConverter} from "../../components/Classroom";
import Link from 'next/link';
import Announcement from '../../components/Announcement';

function Classroom() {
  const [user, setUser] = useAuthState(auth);
  const [text, setText] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const router = useRouter();
  const { classCode } = router.query;
  const [classroom, setClassroom] = useState(null);
  const [quiz, setQuiz] = useState({});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
      let componentMounted = true;
      if(classCode != null) {
        fetchData(classCode).then(data => {
          if(componentMounted && data !== null) {
            setClassroom(data);
            setAnnouncements(data.announcements);
            const currentDate = new Date();
            const timestamp = currentDate.getTime();
            if(data.quizzes && data.quizzes.validTill) {
              data.quizzes.validTill = data.quizzes.validTill.toDate().getTime();
            }
            if(data.quizzes && (data.quizzes.validTill > timestamp)) {
              setQuiz(data.quizzes);
            } else {
              setQuiz(null);
            }
            setLoading(false);
          }
        });
      }
      return () => { componentMounted = false };
  }, [classCode]);

  const postAnnouncement = async () => {
    try {
      if(text != "") {
        try {
          const classRef = doc(db, 'classrooms', classCode).withConverter(classroomConverter);
          console.log(classRef);
          let new_announcement = { text, date: new Date().getTime()};
          if (classroom.announcements === undefined || classroom.announcements === null) {
            classroom.announcements = [];
          }
          if (classroom.students === undefined || classroom.students === null) {
            classroom.students = [];
          }
          classroom.announcements.unshift(new_announcement);
          setAnnouncements(classroom.announcements);
          setText('');
          document.getElementById('announcement').value = '';
          await setDoc(classRef, classroom);
        } catch (err) {
          console.log("Error posting announcement", err);
        }
      } else {
        throw new Error("Announcement cannot be empty");
      }
    } catch(err) {
      console.log("Error posting announcement", err);
    }
  }

  useEffect(() => {
    if(!user) {
      // router.push('/login');
    } else {

    }
  }, [user]);

  if(user) {
    return (
      <div className='container-fluid'>
        <div className='row justify-content-between'>
          <div className='col-xs-6 col-sm-5 col-md-2 d-flex'>
            <Image src="/logo.svg" className='mx-auto' alt="Logo" width={100} height={100}/>
          </div>
          
          <div className='col-xs-6 col-sm-3 col-md-2 d-flex align-items-center'>
            <Image src={user.photoURL} className='mx-auto logout-img rounded-circle' alt="Logo" onClick={() => {auth.signOut()}} width={60} height={60} />
          </div>
        </div>
        {loading && classroom === null && <div className='d-flex justify-content-center'>
          <Image src="/Spinner.svg" className='mx-auto' alt="Logo" width={500} height={500}/>
        </div>}
        {!loading && classroom !== null && <>
            <section>
              <div className="container h-100">
                  <div className="text-white bg-primary border rounded border-0 p-4 py-5 bg-custom">
                      <div className="row h-100">
                          <div className="col-md-10 col-xl-8 text-center d-flex d-sm-flex d-md-flex justify-content-center align-items-center mx-auto justify-content-md-start align-items-md-center justify-content-xl-center">
                              <div>
                                  <h1 className="text-uppercase fw-bold text-white mb-3">{classroom.name}</h1>
                                  <p><strong>{classroom.code} - {classroom.type} - {classroom.semester} - {classroom.teacher_name}</strong></p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              {
                classroom.teacher_email == user.email && <div className='container'>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="btn bg-custom text-white btn-block mt-3">
                        <Link href={`/quiz_form?classCode=${classCode}`}>Generate Quiz</Link>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                    <div className="btn bg-custom text-white btn-block mt-3">
                      <Link href={`/mcq_quiz_form?classCode=${classCode}`}>Generate Multiple Choice Questions</Link>
                    </div>
                  </div>
                    <div className="col-12 col-md-12">
                      <div className="btn bg-custom text-white btn-block mt-3">
                        <Link href={`/current_quiz?classCode=${classCode}`}>Compiled Quiz So Far</Link>
                      </div>
                    </div>
                  </div>
                </div>
              }
              {
                classroom.teacher_email == user.email && <div className="wrap-input1 validate-input d-flex mt-3 justify-content-center" data-validate="Message is required">
                  <textarea className="input1 w-100 w-sm-75 w-lg-50" id="announcement" onChange={(e) => { setText(e.target.value);}} placeholder="Announcement"></textarea>
                  <span className="shadow-input1"></span>
                  <button className="floating-right-bottom-btn" onClick={postAnnouncement}>📯</button>
                </div>
              }
            </section>
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-8 mx-auto p-4">
                    {
                      quiz !== null && <div className='container rounded bg-primary text-white text-center p-3 mb-3'>
                        <h5>Quiz is Available!</h5>
                        <h5>Total Marks: {quiz.total_marks}</h5>
                        <h5>Time to attempt: {quiz.attempt} mins</h5>
                        <Link href={`/quiz/${classCode}-${quiz.name}`}>
                          <span className='btn btn-sm bg-warning text-white'>Start Quiz</span>
                        </Link>
                      </div>
                    }
                    {
                      announcements.map((a, idx) => (
                        <AnnouncementMain key={`announcement-${idx}`} author={classroom.teacher_name} announcement={a}/>
                      ))
                    }
                  </div>
              </div>
          </div>
        </>}
    </div>
    )
  } 
  return <></>;
}

let fetchData = async (classCode) => {
  const ref = doc(db, 'classrooms', classCode).withConverter(classroomConverter);
  const docSnap = await getDoc(ref);
  if(docSnap.exists()) {
    let new_classroom = docSnap.data();
    return new_classroom;
  }
  return null;
}


export default Classroom;