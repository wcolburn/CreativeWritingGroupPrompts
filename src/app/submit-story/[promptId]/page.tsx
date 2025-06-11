'use client';

import NavBar from '@/components/Navbar';
import { useGroupContext } from "@/context/groupContext";
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SubmitStory() {
    const params = useParams();
    const promptId = params?.promptId as string | undefined;
    const router = useRouter();

    const { addNewStory } = useGroupContext();

    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState<string>("");

    function handleSubmit() {
        if (promptId) {
            addNewStory(title, body, promptId);
            router.push('/current-prompt')
        }
    }

    return (
        <div>
            <header><NavBar /></header>
            <main>
                <Stack>
                    <Box marginX={50} marginY={5} sx={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography variant='h6'>Title</Typography>
                        <TextField
                            id="title"
                            variant='standard'
                            value={title}
                            fullWidth
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setTitle(event.target.value);
                            }}
                        />
                    </Box>
                    
                    <Box marginX={20} sx={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {/* <Typography variant='h6'>Story</Typography> */}
                        <TextField
                            multiline
                            minRows={20}
                            maxRows={50}
                            fullWidth
                            variant="outlined"
                            value={body}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setBody(event.target.value);
                            }}
                        />
                        <Box height={15} />
                        <Button variant="contained" onClick={handleSubmit}>Submit Story</Button>
                    </Box>
                </Stack>
            </main>
        </div>
    )
}
