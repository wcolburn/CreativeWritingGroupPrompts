'use client';

import NavBar from "@/components/Navbar";
import { useGroupContext } from "@/context/groupContext";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { Story } from "@/types/story";
import { useEffect, useState } from "react";

export default function CurrentPrompt() {
    return (
        <div>
            <header> <NavBar /> </header>
            <main>
                <Stack
                    direction="column"
                    alignItems="center"
                    spacing={1}
                >

                    <DisplayCurrentPrompt />

                    <SubmitStory />

                    <SubmittedCurrentPromptStories />
                
                </Stack>
            </main>
        </div>
    )
}

function DisplayCurrentPrompt() {
    const { currentPrompt } = useGroupContext();

    return (
        <Stack
            direction="column"
            alignItems="center"
            spacing={1} // optional: adds vertical space between children
        >

            <Typography variant="h4">Prompt</Typography>

            <Box component="section" sx={{ p: 2, border: '1px solid black' }}>
                <Typography variant="h6">Gobbledygook!</Typography>
            </Box>

        </Stack>
    )
}

function SubmitStory() {

    const { currentPromptId } = useGroupContext();

    return (
        <Link href={`/submit-story/${currentPromptId}`}>
            <Button variant="contained">Submit Story</Button>
        </Link>
    )
}

function SubmittedCurrentPromptStories() {
    const { stories } = useGroupContext();

    return (
        <div>
            {
                stories ? (
                    stories.map((s: Story)=>
                        <Typography>{s.title}</Typography>
                    )
                ): (
                    <div></div>
                )
            }
        </div>
    )
}