'use client';

import NavBar from "@/components/Navbar";
import { useUserContext } from "@/context/userContext";
import { useGroupContext } from "@/context/groupContext"
import { Typography } from "@mui/material";

export default function Voting() {

    const user  = useUserContext();
    const { isVoting } = useGroupContext();

    return (
        <div>
            <header> <NavBar /> </header>
            <main>
                {
                    isVoting ? (
                        // If current voting, display voting board
                        <VotingBoard />
                    ) : (
                        // Else, display winning prompt and say next voting time
                        <VotingResults />
                    )
                }
            </main>
        </div>
    );
}

function VotingBoard() {
    return (
        <div>Vote please</div>
    )
}

function VotingResults() {

    const { nextPromptChooser } = useGroupContext();

    return (
        <div>
            <Typography>This prompt won!</Typography>
            <Typography>Next person to vote is: {nextPromptChooser}</Typography>
            <Typography>Come back Friday to vote on the next prompt!</Typography>
        </div>
    )
}