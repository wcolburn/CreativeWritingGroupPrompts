'use client';

import { useGroupContext } from "@/context/groupContext";
import { useEffect, useState } from "react";
import { Story } from "@/types/story";
import { Box, Stack, Typography } from "@mui/material";
import NavBar from "@/components/Navbar";
import { useParams } from "next/navigation";

export default function StoryPage() {
    const { getStory } = useGroupContext();
    const params = useParams();
    const storyId = params?.storyId as string | undefined;
    const [story, setStory] = useState<Story | null>(null);

    useEffect(()=> {
        if (storyId) {
            getStory(storyId)
                .then((s: Story)=>{setStory(s)})
        }
    }, [storyId])

    return (
        <div>
            {
                story ? (
                    <DisplayStory story={story}/>
                ) : (
                    <Typography>Loading...</Typography>
                )
            }
        </div>
    );
}

function DisplayStory(props: {story: Story}) {
    return (
        <div>
            <header><NavBar /></header>
            <main>
                <Stack>
                    <Box marginX={50} marginTop={5} sx={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography variant='h4'>{props.story.title}</Typography>
                    </Box>

                    <Box marginX={50} marginBottom={3} sx={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography variant='h6'>By {props.story.author}</Typography>
                    </Box>
                    
                    <Box sx={{ whiteSpace: 'pre-line', p: 2 }}>
                        <Typography variant="body1">
                            {props.story.body}
                        </Typography>
                    </Box>
                </Stack>
            </main>
        </div>
    )
}