'use client';

import NavBar from "@/components/Navbar";
import { getVotingContext } from "@/context/groupContext";
import { Box, Button, Link, Stack, Typography } from "@mui/material";

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
                
                </Stack>
            </main>
        </div>
    )
}

function DisplayCurrentPrompt() {
    const currentPrompt = getVotingContext();

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

    const currentPromptId = getVotingContext();

    return (
        <Link href={`/submit-story/${currentPromptId}`}>
            <Button variant="contained">Submit Story</Button>
        </Link>
    )
}