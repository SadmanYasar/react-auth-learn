import { FcGoogle } from 'react-icons/fc';
import { AiFillFacebook } from 'react-icons/ai';
import { FacebookAuthProvider, GoogleAuthProvider, fetchSignInMethodsForEmail, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';

export default function Login() {
    const [errorMsg, setErrorMsg] = useState(null);
    const [user, loading, error] = useAuthState(auth);
    const route = useRouter();

    // sign in with google
    const googleProvider = new GoogleAuthProvider();
    const GoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setErrorMsg('');
            route.push('/dashboard')
        } catch (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                const providers = await fetchSignInMethodsForEmail(auth, error.customData.email);
                setErrorMsg(`There is already an account with this email address. Please sign in with ${providers.join(' or ')}.`);
            } else {
                setErrorMsg(error.message);
            }
        }
    }

    //sign in with facebook
    const facebookProvider = new FacebookAuthProvider();
    const FacebookLogin = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const credentials = await FacebookAuthProvider.credentialFromResult(result);
            const token = credentials.accessToken;
            let photoURL = result.user.photoURL + '?height=100&access_token=' + token;
            await updateProfile(auth.currentUser, {
                photoURL: photoURL
            })
            setErrorMsg('');
            route.push('/dashboard');
        } catch (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                const providers = await fetchSignInMethodsForEmail(auth, error.customData.email);
                setErrorMsg(`There is already an account with this email address. Please sign in with ${providers.join(' or ')}.`);
            } else {
                setErrorMsg(error.message);
            }
        }
    }

    useEffect(() => {
        if (user) {
            route.push('/dashboard');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <div className='shadow-xl mt-32 p-10 text-gray-700 rounded-lg'>
            <h2 className='text-3xl font-medium'>Join Today</h2>
            <div className='py-4'>
                <h3 className='py-4'>Sign in with one of the providers</h3>
            </div>
            <div className='flex flex-col gap-4'>
                {errorMsg && <h3 className='text-red-500 font-medium'>{errorMsg}</h3>}
                <button onClick={GoogleLogin} className='text-white bg-gray-700 p-4 w-full font-medium rounded-lg flex align-middle gap-2'>
                    <FcGoogle className='text-2xl' /> Sign in with Google
                </button>
                <button onClick={FacebookLogin} className='text-white bg-gray-700 p-4 w-full font-medium rounded-lg flex align-middle gap-2'>
                    <AiFillFacebook className='text-2xl text-blue-400' /> Sign in with Facebook
                </button>
            </div>
        </div>
    )
}