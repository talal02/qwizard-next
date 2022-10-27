import { useEffect, useState } from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth, db} from '../lib/firebase';
import {useRouter} from 'next/router';
import Image from 'next/image';
import Popup from '../components/Popup';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import {userConverter} from '../components/User';
import ClassroomMain from '../components/classroomMain';

function Classroom() {
  const [user, setUser] = useAuthState(auth);
  const [seen, setSeen] = useState(false);
  const [enrolledClassrooms, setEnrolledClassrooms] = useState([]);
  const router = useRouter();

  const togglePopup = () => {
    setSeen(!seen);
    };

  useEffect(() => {
    console.log('CALLED AGAIN');
    if(!user) {
      router.push('/login');
    } else {
      const fetchClassData = async () => {
        const ref = doc(db, "users", user.email).withConverter(userConverter);
        const docSnap = await getDoc(ref);
        if(docSnap.exists()) {
          const new_user = docSnap.data();
          let classes = [];
          console.log(new_user)
          for (let i = 0; i < new_user.classrooms.length; i++) {
            const classRef = doc(db, "classrooms", new_user.classrooms[i]);
            const classSnap = await getDoc(classRef);

            if(classSnap.exists()) {
              const new_class = classSnap.data();
              classes.push(new_class);
            }
          } 
          setEnrolledClassrooms(classes);
        }
      }
      fetchClassData().catch(console.error);
    }
  }, [user, seen]);

  if(user) {
    return (
      <div className='container-fluid'>
        <div className='row justify-content-between'>
          <div className='col-xs-6 col-sm-5 col-md-2 d-flex'>
            <Image src="/logo.svg" className='mx-auto' alt="Logo" width={100} height={100}/>
          </div>
          
          <div className='col-xs-6 col-sm-3 col-md-2 d-flex align-items-center'>
            <i className="fa fa-plus-square mr-3" style={{'fontSize': 'xx-large', 'color': 'orange'}} aria-hidden="true" onClick={togglePopup}></i>
            <Image src={user.photoURL} className='mx-auto logout-img rounded-circle' alt="Logo" onClick={() => {auth.signOut()}} width={60} height={60} />
          </div>
        </div>
        <section className='page-contain row'>
          {enrolledClassrooms.length > 0 && enrolledClassrooms.map((classroom) => {
            return (
              <ClassroomMain name={classroom.name} teacher={classroom.teacher_name} code={classroom.code} semester={classroom.semester} type={classroom.type} />
            );
          })}
        </section>
        {seen && <Popup toggle={togglePopup} user={user}/>}
      </div>
    );
  } 
  return <></>;
}

export default Classroom;