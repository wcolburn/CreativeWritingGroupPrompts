'use client';

import NavBar from "@/components/Navbar";
import { useUserContext } from "@/context/userContext";
import { useGroupContext } from "@/context/groupContext"
import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Prompt } from "@/types/prompt";

export default function Voting() {

    const { currentPrompt } = useGroupContext();

    return (
        <div>
            <header> <NavBar /> </header>
            <main>
                {
                    currentPrompt ? (
                        <DisplayPrompt />
                    ) : (
                        <NextPromptInputForm />
                    )                 
                }
            </main>
        </div>
    );
}

function NextPromptInputForm() {

    const { nextPromptChooser, addNewPrompt } = useGroupContext();
    const user  = useUserContext();
    const [prompt, setPrompt] = useState<string>("");

    function handleSubmit() {
        addNewPrompt(prompt);
    }

    return (
        <div>
            {
                user?.uid == nextPromptChooser ? (
                        <div>
                            <Typography>You are the prompt chooser for this week! Please enter your prompt in the field below and click Submit.</Typography>
                            <TextField
                                id="Prompt"
                                variant='standard'
                                value={prompt}
                                fullWidth
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setPrompt(event.target.value);
                                }}
                            />
                            <Button variant="contained" onClick={handleSubmit}>Submit Story</Button>
                        </div>
                ) : (
                    <Typography>Hang tight! The prompt chooser for this week is working on it.</Typography>
                )
            }
        </div>
    )
}

function DisplayPrompt() {

    const { nextPromptChooser, currentPrompt } = useGroupContext();

    return (
        <div>
            <Typography >Winner:</Typography>
            <Typography>{currentPrompt?.prompt}</Typography>
            <Typography>Next person to vote is: {nextPromptChooser}</Typography>
            <Typography>Come back Friday to vote on the next prompt!</Typography>
        </div>
    )
}