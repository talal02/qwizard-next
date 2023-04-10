import Image from 'next/image';
import {auth, db} from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from "react-toastify";
import {userConverter} from '../components/User';
import User from '../components/User';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import styles from '../styles/login.module.css';

function Login() {
  const googleAuth = new GoogleAuthProvider();
  const [user, setUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const loginFunction = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuth);
      toast('🦄 Authentication Successful!!!', { hideProgressBar: false, autoClose: 2000, type: 'info' });
    } catch (error) {
      console.log('ERROR HERE', error);
      console.log(error);      
      toast('🦄 Authentication Error!!!', { hideProgressBar: false, autoClose: 2000, type: 'error' });
    }
  };

  useEffect(() => {
    // && user.email.includes("@nu.edu.pk")
    if (user && !loading) {
      const fetchUserData = async () => {
        const ref = doc(db, "users", user.email).withConverter(userConverter);
        const docSnap = await getDoc(ref);
  
        if(!docSnap.exists()) {
          await setDoc(ref, new User(user.displayName, user.email, user.photoURL, []));
          console.log('DONE!!!');
        } 
      }
      fetchUserData().catch(console.error);
      setLoading(true);
      toast('🦄 Login Successful!!!', { hideProgressBar: false, autoClose: 2000, type: 'success' });
    } else if (user && !loading && !user.email.includes("@nu.edu.pk")) {
      toast('🦄 Use NU Account only!!!', { hideProgressBar: false, autoClose: 2000, type: 'warning' });
      auth.signOut();
    }
    if(loading) {
      setTimeout(() => {
        router.push('/classroom');
        setLoading(false);
      }, 2500);
    }
  }, [user, loading]);


  return (
    // <div className='container-md mt-5'>
    //     <div className="row justify-content-center">
    //       <div className='p-4 col-sm-8 col-md-6 rounded-div login-div'>
    //           <div className='d-flex justify-content-center'>
    //             <Image src="/logo.svg" className='mx-auto' alt="Vercel Logo" width={250} height={250} />
    //           </div>
    //           {
    //             loading && user ? 
    //             <section>
    //               <div className='d-flex justify-content-center'>
    //                 <Image src={user.photoURL} className='mx-auto' alt="Qwizard Logo" width={100} height={100} />
    //               </div>
    //               <div className='d-flex mt-3'>
    //                 <p className='mx-auto lead'>Welcome, {user.displayName}<br></br>Email: {user.email}</p>
    //               </div>
    //               <div className='d-flex justify-content-center'>
    //                 <Image src="/loader.svg" className='mx-auto' alt="Profile Logo" width={50} height={50} />
    //               </div>
    //             </section>
    //             :
    //             <section>
    //               <div className='d-flex'>
    //                 <p className='lead'>Qwizard  is a Learning Management System (LMS) which incorporates inside itself:<br></br>
    //                   🌎Automatic Question Generation (Short Answer + MCQs)<br></br>
    //                   🌎Automatic Solution (Answer) Generation<br></br>
    //                   🌎Automatic Quiz Marking.<br></br>
    //                   🌎Real-time Quiz Attempting Session for students.
    //                 </p>
    //               </div>
    //               <div className='d-flex mt-5 mb-3'>
    //               <button className='mx-auto btn btn-legendary' onClick={loginFunction}>Login / SignUp <i className="fa fa-google" aria-hidden="true"></i></button>
    //               </div>
    //             </section>
    //           }
    //       </div>
    //     </div>
    //   </div>
    <div className={styles.container}>
  <div className="row justify-content-center">
    <div className={`${styles.loginDiv} p-4 col-sm-10 col-md-8 col-lg-6 col-xl-4  rounded-div`}>
      <div className='d-flex justify-content-center'>
        <Image src="/logo.svg" className='mx-auto' alt="Vercel Logo" width={250} height={250} />
      </div>
      {loading && user ? 
        <section>
          <div className='d-flex justify-content-center'>
            <Image src={user.photoURL} className='mx-auto' alt="Qwizard Logo" width={100} height={100} />
          </div>
          <div className='d-flex mt-3'>
            <p className='mx-auto lead'>Welcome, {user.displayName}<br></br>Email: {user.email}</p>
          </div>
          <div className='d-flex justify-content-center'>
            <Image src="/loader.svg" className='mx-auto loader' alt="Profile Logo" width={50} height={50} />
          </div>
        </section>
        :
        <section>
          <div className='d-flex'>
            <p className='lead' style={{fontSize: '20px', fontWeight: 'lighter'}}>Qwizard is a Learning Management System (LMS) which incorporates inside itself:<br />
              🌎Automatic Question Generation (Short Answer + MCQs)<br />
              🌎Automatic Solution (Answer) Generation<br />
              🌎Automatic Quiz Marking.<br />
              🌎Real-time Quiz Attempting Session for students.
            </p>
          </div>
          <div className='d-flex mt-5 mb-3'>
            <button className={`${styles.btn} mx-auto btn`} onClick={loginFunction}>Login / SignUp <i className="fa fa-google" aria-hidden="true"></i></button>
          </div>
        </section>
      }
    </div>
  </div>
</div>
  );
}

export default Login;