'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// Database
import { db } from "../app/firebase";
import { getDoc, setDoc, doc, collection, getDocs, where, query, updateDoc } from "firebase/firestore";
 import { v4 as uuid } from 'uuid';
import { AuthUser } from "./userContext";
import { Story } from "@/types/story";

import { useUserContext } from "./userContext";
import { Prompt } from "@/types/prompt";
import { PromptChooser } from "@/types/promptChooser";

const GroupContext = createContext<{
    isVoting: boolean,
    nextPromptChooser: PromptChooser | null,
    currentPrompt: Prompt | null,
    addNewStory: Function,
    stories: Story[] | null,
    getAuthorFromId: Function,
    getStory: Function,
    setCurrentPrompt: Function,
    addNewPrompt: Function
} | undefined>(undefined);

export function GroupContextProvider({ children } : { children: ReactNode}) {
    const user  = useUserContext();

    const [isVoting, setIsVoting] = useState<boolean>(false);
    const [nextPromptChooser, setNextPromptChooser] = useState<PromptChooser | null>(null);
    const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
    const [stories, setStories] = useState<Story[] | null>(null);
    const [prepareForVoting, setPrepareForVoting] = useState<boolean | null>(null);

    useEffect(()=> {
        fetchStories(setStories);
        fetchCurrentPrompt(setCurrentPrompt)
        fetchPromptChooser(setNextPromptChooser)
        decideIfVoting(setIsVoting)
        decideIfPrepareForVoting(setPrepareForVoting)
    }, [])

    useEffect(()=>{
        if (isVoting && nextPromptChooser == null) {
            selectPromptChooser(setNextPromptChooser)
        }
    }, [isVoting])

    useEffect(()=>{
        if (prepareForVoting && isVoting) {
            setCurrentPrompt(null);
        }
    }, [prepareForVoting, isVoting])

    function addNewStory(title: string, body: string, promptId: string) {
        writeNewStory(title, body, promptId, user);
    }

    async function getAuthorFromId(id: string) {
        return await fetchAuthorFromId(id)
    }

    async function getStory(id: string) {
        return await fetchStoryById(id);
    }

    async function addNewPrompt(prompt: string) {
        const newCurrentPrompt: Prompt = await writeCurrentPrompt(prompt);
        setCurrentPrompt(newCurrentPrompt);
    }

    return (
        <GroupContext.Provider value={{ isVoting, nextPromptChooser, currentPrompt, addNewStory, stories, getAuthorFromId, getStory, setCurrentPrompt, addNewPrompt }}>
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
        const storyData = story.data() as Story;
        storyData.author = await fetchAuthorFromId(storyData.author)
        return storyData
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

async function writeCurrentPrompt(prompt: string) {
    const promptDoc = doc(collection(db, "prompts"));
    const newPrompt: Prompt = {
        id: uuid(),
        prompt: prompt,
        creation: Date.now()
    }
    setDoc(promptDoc, newPrompt);
    return newPrompt;
}

function decideIfVoting(setIsVoting: Function) {
    const now = new Date(Date.now())
    const day = now.getDay()
    // If Saturday (6), then voting is open
    if (day == 6)  {
        setIsVoting(true);
    } else {
        setIsVoting(false);
    }
}

async function decideIfPrepareForVoting(setPrepareForVoting: Function) {
    const querySnapshot = await getDocs(collection(db, "group"));
    if (!querySnapshot.empty) {
        const groupData = querySnapshot.docs[0].data();
        const prepareForVoting = groupData.prepareForVoting;
        if (prepareForVoting == true) {
            setPrepareForVoting(true);
        } else {
            const now = new Date(Date.now())
            const day = now.getDay()
            // If Saturday (6), then voting is open
            if (day == 5)  {
                prepareForVoting(true);
                writePrepareForVotingInDb();
            }
            setPrepareForVoting(false);
        }
    }
}

async function writePrepareForVotingInDb() {
    const groupCollection = collection(db, "group");
    const groupSnapshot = await getDocs(groupCollection);
    if (!groupSnapshot.empty) {
        const metadata = groupSnapshot.docs[0].ref;

        await updateDoc(metadata, {
            prepareForVoting: true
        });
    }
}

async function selectPromptChooser(setChooser: Function) {
    const querySnapshot = await getDocs(collection(db, "users"));
    if (!querySnapshot.empty) {
        const users = querySnapshot.docs.map((doc) => doc.data());
        const randomIndex = Math.floor(Math.random() * users.length);
        const selectedUserId = users[randomIndex]?.id;
        if (selectedUserId) {
            console.log("Making!")
            const chooser: PromptChooser = {
                name: await fetchAuthorFromId(selectedUserId),
                id: selectedUserId
            }
            setChooser(chooser)
            setPromptChooserInDb(selectedUserId);
        }
    }
}

async function setPromptChooserInDb(id: string | undefined) {
    if (id) {
        const groupCollection = collection(db, "group");
        const groupSnapshot = await getDocs(groupCollection);
        if (!groupSnapshot.empty) {
            const metadata = groupSnapshot.docs[0].ref;

            await updateDoc(metadata, {
                promptChooser: id
            });
        }
    }
}

async function fetchPromptChooser(setChooser: Function) {
    const querySnapshot = await getDocs(collection(db, "group"));
     if (!querySnapshot.empty) {
        const groupData = querySnapshot.docs[0].data();
        const currentChooser = groupData.promptChooser;
        if (currentChooser) {
            const chooser: PromptChooser = {
                name: await fetchAuthorFromId(currentChooser),
                id: currentChooser
            }
            setChooser(chooser);
        }
    } else{
        setChooser(null);
    }
}