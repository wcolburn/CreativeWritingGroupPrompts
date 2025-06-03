'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// Database
import { db } from "../app/firebase";
import { getDoc, setDoc, doc } from "firebase/firestore";

const GroupContext = createContext<{
    isVoting: boolean,
    nextPromptChooser: string,
} | undefined>(undefined);

export function GroupContextProvider({ children } : { children: ReactNode}) {
    const [isVoting, setIsVoting] = useState<boolean>(false);
    const [nextPromptChooser, setNextPromptChooser] = useState<string>("");

    return (
        <GroupContext.Provider value={{ isVoting, nextPromptChooser }}>
            {children}
        </GroupContext.Provider>
    )

}

export function getVotingContext() {
    const context = useContext(GroupContext);
    return context?.isVoting;
}

export function getPromptChooserContext() {
    const context = useContext(GroupContext);
    return context?.nextPromptChooser;
}