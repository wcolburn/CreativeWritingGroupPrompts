'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// Database
import { db } from "../app/firebase";
import { getDoc, setDoc, doc, collection, getDocs, where, query } from "firebase/firestore";
 import { v4 as uuid } from 'uuid';
import { AuthUser } from "./userContext";
import { Story } from "@/types/story";

import { useUserContext } from "./userContext";

const GroupContext = createContext<{
    isVoting: boolean,
    nextPromptChooser: string,
    currentPrompt: string,
    currentPromptId: string,
    addNewStory: Function,
    stories: Story[] | null,
    getAuthorFromId: Function,
    getStory: Function
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

    async function getAuthorFromId(id: string) {
        return await fetchAuthorFromId(id)
    }

    async function getStory(id: string) {
        return await fetchStoryById(id);
    }

    return (
        <GroupContext.Provider value={{ isVoting, nextPromptChooser, currentPrompt, currentPromptId, addNewStory, stories, getAuthorFromId, getStory }}>
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
        id: uuid(),
        promptId: promptId,
        author: user?.uid,
        title: title,
        body: body
    });
}

async function fetchStories(setStories: Function) {
    const querySnapshot = await getDocs(collection(db, "stories"));
    if (querySnapshot.docs) {
        const data = querySnapshot.docs.map((doc) => doc.data() as Story)
        // Swap authorId out for author name
        for (const story of data) {
            story.author = await fetchAuthorFromId(story.author)
        }
        setStories(data)
    } else {
        setStories([]);
    }
}

async function fetchStoryById(storyId: string) {
    const storiesCollection = collection(db, "stories");
    const storyQuery = query(storiesCollection, where("id", "==", storyId));
    const querySnapshot = await getDocs(storyQuery);

    if (!querySnapshot.empty) {
        const story = querySnapshot.docs[0];
        return story.data() as Story;
    } else {
        return null;
    }
}

async function fetchAuthorFromId(id: string) {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return data.name;
    } else {
        return null;
    }
}