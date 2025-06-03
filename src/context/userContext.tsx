'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// Auth
import { auth } from "../app/firebase";
import { signOut, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
// Database
import { db } from "../app/firebase";
import { getDoc, setDoc, doc } from "firebase/firestore";

export type AuthUser = User | null;
type UserSettings = {
    id: string;
    occupation: string;
    organization: string;
    linkedin: string;
    github: string;
}

const UserContext = createContext<{
    user: AuthUser,
    userSettings: UserSettings | null,
    saveUserSettings: Function
} | undefined>(undefined);

export function UserContextProvider({ children } : { children: ReactNode}) {
    const [user, setUser] = useState<AuthUser>(null);
    const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

    function saveUserSettings(occupation: string, organization: string, linkedin: string, github: string) {
        if (user != null) {
            setUserSettings({
                id: user.uid,
                occupation: occupation,
                organization: organization,
                linkedin: linkedin,
                github: github
            })
        }
    }

    useEffect(() => {
        if (userSettings != null) {
            writeUserSettings(userSettings)
        }
    }, [userSettings])

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => findUser(user));
        return unsubscribe;
    }, [])

    async function findUser(user: AuthUser) {
        setUser(user);
        if (user !== null) {
            setUserSettings( await findUserSettings(user.uid));
        } else {
            setUserSettings(null);
        }
    }

    return (
        <UserContext.Provider value={{ user, userSettings, saveUserSettings }}>
            {children}
        </UserContext.Provider>
    )
}

async function findUserSettings(uid: string) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return { id: docSnap.id, occupation: data.occupation, organization: data.organization, linkedin: data.linkedin, github: data.github }
    } else {
        return null;
    }
}

function writeUserSettings(userSettings: UserSettings) {
    setDoc(doc(db, "users", userSettings.id), {
        occupation: userSettings.occupation,
        organization: userSettings.organization,
        linkedin: userSettings.linkedin,
        github: userSettings.github
    });
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

export function useUserSettingsContext() {
    const context = useContext(UserContext);
    return context?.userSettings;
}

export function useSaveUserSettingsContext() {
    const context = useContext(UserContext);
    return context?.saveUserSettings;
}