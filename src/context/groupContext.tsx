'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// Database
import { db } from "../app/firebase";
import { getDoc, setDoc, doc, collection, getDocs } from "firebase/firestore";
import { AuthUser } from "./userContext";
import { Story } from "@/types/story";

import { useUserContext } from "./userContext";

const GroupContext = createContext<{
    isVoting: boolean,
    nextPromptChooser: string,
    currentPrompt: string,
    currentPromptId: string,
    addNewStory: Function,
    stories: Story[] | null
} | undefined>(undefined);

export function GroupContextProvider({ children } : { children: ReactNode}) {
    const user  = useUserContext();

    const [isVoting, setIsVoting] = useState<boolean>(false);
    const [nextPromptChooser, setNextPromptChooser] = useState<string>("");
    const [currentPrompt, setCurrentPrompt] = useState<string>("");
    const [currentPromptId, setCurrentPromptId] = useState<string>("");
    const [stories, setStories] = useState<Story[] | null>(null);

    useEffect(()=> {
        fetchStories(setStories);
    }, [])

    useEffect(()=>{
        console.log(stories)
    }, [stories])

    function addNewStory(title: string, body: string, promptId: string) {
        writeNewStory(title, body, promptId, user);
    }

    return (
        <GroupContext.Provider value={{ isVoting, nextPromptChooser, currentPrompt, currentPromptId, addNewStory, stories }}>
            {children}
        </GroupContext.Provider>
    )

}

export function useGroupContext() {
    const context = useContext(GroupContext);

    if (!context) {
        throw new Error('useGroupProvider must be used with a GroupProvider');
    }

    return context;

}

function writeNewStory(title: string, body: string, promptId: string, user: AuthUser | undefined) {

    const newStory = doc(collection(db, "stories"));
    setDoc(newStory, {
        promptId: promptId,
        author: user?.uid,
        title: title,
        body: body
    });
}

async function fetchStories(setStories: Function) {
    const querySnapshot = await getDocs(collection(db, "stories"));
    setStories(
        querySnapshot.docs.map((doc) => doc.data())
    )
}