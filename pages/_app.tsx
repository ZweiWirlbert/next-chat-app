import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Login from './login';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import Loading from '../components/Loading';
import { useEffect } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedInUser, loading, _err] = useAuthState(auth);

  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          doc(db, 'users', loggedInUser?.email as string),
          {
            displayName: loggedInUser?.displayName,
            email: loggedInUser?.email,
            lastSeen: serverTimestamp(),
            photoUrl: loggedInUser?.photoURL,
          },
          {
            merge: true,
          }
        );
      } catch (error) {
        console.log('ERROR SET USER IN DB', error);
      }
    };

    if (loggedInUser) {
      setUserInDb();
    }
  }, [loggedInUser]);

  if (loading) {
    return <Loading />;
  }

  if (!loggedInUser) return <Login />;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
