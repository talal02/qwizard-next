import { useEffect, useState } from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {db, auth} from '../../lib/firebase';
import {useRouter} from 'next/router';
import Image from 'next/image';
import AnnouncementMain from '../../components/AnnouncementMain';
import { doc, getDoc } from 'firebase/firestore';
import {classroomConverter} from "../../components/Classroom";
import Link from 'next/link';

function Classroom() {
  const [user, setUser] = useAuthState(auth);
  const [text, setText] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const router = useRouter();
  const { classCode } = router.query;
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
      let componentMounted = true;
      if(classCode != null) {
        fetchData(classCode).then(data => {
          if(componentMounted && data !== null) {
            setClassroom(data);
            setLoading(false);
          }
        });
      }
      return () => { componentMounted = false };
  }, [classCode]);

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
              <div class="container h-100">
                  <div class="text-white bg-primary border rounded border-0 p-4 py-5 bg-custom">
                      <div class="row h-100">
                          <div class="col-md-10 col-xl-8 text-center d-flex d-sm-flex d-md-flex justify-content-center align-items-center mx-auto justify-content-md-start align-items-md-center justify-content-xl-center">
                              <div>
                                  <h1 class="text-uppercase fw-bold text-white mb-3">{classroom.name}</h1>
                                  <p><strong>{classroom.code} - {classroom.type} - {classroom.semester} - {classroom.teacher_name}</strong></p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="wrap-input1 validate-input d-flex mt-3 justify-content-center" data-validate="Message is required">
                <textarea class="input1 w-100 w-sm-75 w-lg-50" id="announcement" onChange={(e) => setText(e.target.value)} placeholder="Announcement"></textarea>
                <span class="shadow-input1"></span>
                <button class="floating-right-bottom-btn" onClick={() => {announcements.unshift(text); setText(''); document.getElementById('announcement').value = '';}}>📯</button>
              </div>
            </section>
            <div class="container">
              <div class="row">
                <div class="col-12 col-md-6">
                  <div class="btn bg-custom text-white btn-block mt-3">
                    <Link href="/quiz_form">Generate Short Answer Questions</Link>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="btn bg-custom text-white btn-block mt-3">
                    <Link href="/mcq_quiz_form">Generate Multiple Choice Questions</Link>
                  </div>
                </div>
                <div class="col-12 col-md-12">
                  <div class="btn bg-custom text-white btn-block mt-3">
                    <Link href="/current_quiz">Compiled Quiz So Far</Link>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-8 mx-auto p-4">
                    {
                      announcements.map((a) => (
                        <AnnouncementMain author={`Talal Ahmed`} announcement={a}/>
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