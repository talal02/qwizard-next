import '../styles/globals.css';
import '../styles/global.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';


function MyApp({ Component, pageProps }) {
  return ( 
  <>
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
    <ToastContainer />
  </>);
}

export default MyApp
