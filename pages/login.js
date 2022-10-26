import Image from 'next/image';
import {auth} from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from "react-toastify";

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
      toast('🦄 Authentication Error!!!', { hideProgressBar: false, autoClose: 2000, type: 'error' });
    }
  };

  useEffect(() => {
    if (user && user.email.includes("@nu.edu.pk") && !loading) {
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
    <div className='container-md mt-5'>
        <div className="row justify-content-center">
          <div className='p-4 col-sm-8 col-md-6 rounded-div login-div'>
              <div className='d-flex justify-content-center'>
                <Image src="/logo.svg" className='mx-auto' alt="Vercel Logo" width={250} height={250} />
              </div>
              {
                loading && user ? 
                <section>
                  <div className='d-flex justify-content-center'>
                    <Image src={user.photoURL} className='mx-auto' alt="Qwizard Logo" width={100} height={100} />
                  </div>
                  <div className='d-flex mt-3'>
                    <p className='mx-auto'>Welcome, {user.displayName}</p>
                    <p className='mx-auto'>Email: {user.email}</p>
                  </div>
                  <div className='d-flex justify-content-center'>
                    <Image src="/loader.svg" className='mx-auto' alt="Profile Logo" width={100} height={100} />
                  </div>
                </section>
                :
                <section>
                  <div className='d-flex'>
                    <p className='lead'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                  </div>
                  <div className='d-flex mb-3'>
                  <button className='mx-auto btn btn-legendary' onClick={loginFunction}>Login / SignUp <i className="fa fa-google" aria-hidden="true"></i></button>
                  </div>
                </section>
              }
          </div>
        </div>
      </div>
  );
}

export default Login;