'use client';

import NavBar from "@/components/Navbar";
import { useUserContext } from "@/context/userContext";
import { useGroupContext } from "@/context/groupContext"
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { DisplayCurrentPrompt } from "@/components/DisplayCurrentPrompt";

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
                user?.uid == nextPromptChooser?.id ? (
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
                            <Button variant="contained" onClick={handleSubmit}>Submit Prompt</Button>
                        </div>
                ) : (
                    <Typography>Hang tight! The prompt chooser for this week is working on it.</Typography>
                )
            }
        </div>
    )
}

function DisplayPrompt() {

    const { nextPromptChooser } = useGroupContext();

    return (
        <Stack
            direction="column"
            alignItems="center"
            spacing={4}
            padding={5}
        >
            <Typography variant="h6">The winner is:</Typography>
            <DisplayCurrentPrompt />
            <Box height={10}/>
            <Typography>Next person to vote is: {nextPromptChooser?.name}</Typography>
            <Typography>Come back Saturday to vote on the next prompt!</Typography>
        </Stack>
    )
}