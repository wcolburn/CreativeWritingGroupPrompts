'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// Database
import { db } from "../app/firebase";
import { getDoc, setDoc, doc, collection, getDocs, where, query } from "firebase/firestore";
 import { v4 as uuid } from 'uuid';
import { AuthUser } from "./userContext";
import { Story } from "@/types/story";

import { useUserContext } from "./userContext";
import { Prompt } from "@/types/prompt";

const GroupContext = createContext<{
    isVoting: boolean,
    nextPromptChooser: string | null,
    currentPrompt: Prompt | null,
    addNewStory: Function,
    stories: Story[] | null,
    getAuthorFromId: Function,
    getStory: Function,
    setCurrentPrompt: Function
} | undefined>(undefined);

export function GroupContextProvider({ children } : { children: ReactNode}) {
    const user  = useUserContext();

    const [isVoting, setIsVoting] = useState<boolean>(false);
    const [nextPromptChooser, setNextPromptChooser] = useState<string | null>(null);
    const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
    const [stories, setStories] = useState<Story[] | null>(null);

    useEffect(()=> {
        fetchStories(setStories);
        fetchCurrentPrompt(setCurrentPrompt)
        fetchPromptChooser(setNextPromptChooser)
        decideIfVoting(setIsVoting)
    }, [])

    useEffect(()=>{
        if (isVoting && nextPromptChooser == null) {
            selectPromptChooser(setNextPromptChooser)
        }
    }, [isVoting])

    useEffect(()=>{
        console.log("Middleware chooser: " + nextPromptChooser)
    }, [nextPromptChooser])

    useEffect(()=>{
        if (currentPrompt) {
            writeCurrentPrompt(currentPrompt);
        }
    }, [currentPrompt])

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
        <GroupContext.Provider value={{ isVoting, nextPromptChooser, currentPrompt, addNewStory, stories, getAuthorFromId, getStory, setCurrentPrompt }}>
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

async function fetchCurrentPrompt(setPrompt: Function) {
    const querySnapshot = await getDocs(collection(db, "prompts"));
    if (!querySnapshot.empty) {
        const prompts = querySnapshot.docs.map((doc) => doc.data() as Prompt);
        console.log(prompts)
        prompts.sort((a, b) => b.creation - a.creation); // Sort so most recent is first in the array
        setPrompt(prompts[0]);
    } else {
        return null;
    }
}

async function writeCurrentPrompt(prompt: Prompt | null) {
    const newPrompt = doc(collection(db, "prompts"));
    setDoc(newPrompt, {
        id: uuid(),
        prompt: prompt?.prompt,
        creation: Date.now()
    });
}

function decideIfVoting(setIsVoting: Function) {
    const now = new Date(Date.now())
    const day = now.getDay()
    // If Saturday (6), then voting is open
    if (day == 1)  {
        setIsVoting(true);
    } else {
        setIsVoting(false);
    }
}

async function selectPromptChooser(setChooser: Function) {
    const querySnapshot = await getDocs(collection(db, "users"));
    if (!querySnapshot.empty) {
        const users = querySnapshot.docs.map((doc) => doc.data() as AuthUser);
        const randomIndex = Math.floor(Math.random() * users.length);
        console.log("Random index: " + randomIndex)
        const selectedUserId = users[randomIndex]?.uid;
        setChooser(selectedUserId)
        setPromptChooserInDb(selectedUserId);
    }
}

function setPromptChooserInDb(id: string | undefined) {
    if (id) {
        const groupDoc = doc(collection(db, "group"));
        setDoc(groupDoc, {
            promptChooser: id
        });
    }
}

async function fetchPromptChooser(setChooser: Function) {
    const querySnapshot = await getDocs(collection(db, "group"));
     if (!querySnapshot.empty) {
        const groupData = querySnapshot.docs[0].data();
        const currentChooser = groupData.promptChooser;
        if (currentChooser) {
            setChooser(currentChooser);
        }
    } else{
        setChooser(null);
    }
}