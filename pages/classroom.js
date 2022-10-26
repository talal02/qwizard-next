import { useEffect, useState } from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../lib/firebase';
import {useRouter} from 'next/router';
import Image from 'next/image';
import Popup from '../components/Popup';

function Classroom() {
  const [user, setUser] = useAuthState(auth);
  const [seen, setSeen] = useState(false);
  const router = useRouter();

  const togglePopup = () => {
    setSeen(!seen);
    };

  useEffect(() => {
    console.log(user);
    if(!user) {
      router.push('/login');
    }
  }, [user]);

  if(user) {
    return (
      <div className='container-fluid'>
        <div className='row justify-content-between'>
          <div className='col-2 d-flex'>
            <Image src="/logo.svg" className='mx-auto' alt="Logo" width={100} height={100}/>
          </div>
          <div className='col-2 d-flex align-items-center'>
            <i class="fa fa-plus-square mr-3" style={{'fontSize': 'xx-large', 'color': 'orange'}} aria-hidden="true" onClick={togglePopup}></i>
            <Image src={user.photoURL} className='mx-auto logout-img rounded-circle' alt="Logo" onClick={() => {auth.signOut()}} width={60} height={60} />
          </div>
        </div>
        {seen && <Popup toggle={togglePopup} />}
      </div>
    );
  } 
  return <></>;
}

export default Classroom;