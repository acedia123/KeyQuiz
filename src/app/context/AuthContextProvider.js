import { createContext, useState } from 'react';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../services/auth';
import { routes } from '../configs';
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const history = useNavigate();

    const facebookLogin = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider);
    };

    const googleLogin = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const { displayName, email, photoURL } = user;
                setUser({
                    displayName,
                    email,
                    photoURL,
                });
                loginWithGoogle({ user_name: displayName, email, avatar: photoURL }).then(({ data }) => {
                    localStorage.setItem('user', JSON.stringify({ ...data[0], type_of_login: 'google' }));
                    history(routes.home);
                });
            }
        });
    };

    const signOutFirebase = () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem('user');
                window.location.reload();
            })
            .catch((error) => {
                // An error happened.
            });
    };

    return (
        <AuthContext.Provider value={{ facebookLogin, googleLogin, user, signOutFirebase }}>
            {children}
        </AuthContext.Provider>
    );
};
