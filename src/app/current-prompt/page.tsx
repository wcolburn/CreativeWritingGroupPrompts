'use client';

import NavBar from "@/components/Navbar";
import { useGroupContext } from "@/context/groupContext";
import { Button, Card, CardActionArea, Divider, Link, Stack, Typography } from "@mui/material";
import { Story } from "@/types/story";
import { useRouter } from 'next/navigation';
import { DisplayCurrentPrompt } from "@/components/DisplayCurrentPrompt";

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

function SubmitStory() {

    const { currentPrompt } = useGroupContext();

    return (
        <Link href={`/submit-story/${currentPrompt?.id}`}>
            <Button variant="contained">Submit Story</Button>
        </Link>
    )
}

function SubmittedCurrentPromptStories() {
    const router = useRouter();
    const { stories } = useGroupContext();

    function handleStoryClick(story: Story) {
        router.push(`/story/${story.id}`)
    }

    return (
        <div>
            <Divider />
            {
                stories ? (
                    stories.map((s: Story, i)=>
                        <div onClick={() => handleStoryClick(s)} key={i}>
                            <Card>
                                <CardActionArea sx={{ paddingX: 5, paddingY: 2}}>
                                    <Typography variant="h5">{s.title}</Typography>
                                    <Typography variant="body1">{s.author}</Typography>
                                </CardActionArea>
                            </Card>
                        </div>
                    )
                ): (
                    <div></div>
                )
            }
        </div>
    )
}