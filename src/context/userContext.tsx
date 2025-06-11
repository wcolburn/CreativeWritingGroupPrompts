'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// Auth
import { auth } from "../app/firebase";
import { signOut, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
// Database
import { db } from "../app/firebase";
import { getDoc, setDoc, doc } from "firebase/firestore";

export type AuthUser = User | null;

const UserContext = createContext<{
    user: AuthUser
} | undefined>(undefined);

export function UserContextProvider({ children } : { children: ReactNode}) {
    const [user, setUser] = useState<AuthUser>(null);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => findUser(user));
        return unsubscribe;
    }, [])

    async function findUser(user: AuthUser) {
        setUser(user);
        if (user) {
            writeUser(user);
        }
    }

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    )
}


export const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
}

export const logOut = () => {
    signOut(auth);
}

export function useUserContext() {
    const context = useContext(UserContext);
    console.log(context?.user)
    return context?.user;
}

function writeUser(user: AuthUser) {
    if (user) {
        setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            id: user.uid
        });
    }
}