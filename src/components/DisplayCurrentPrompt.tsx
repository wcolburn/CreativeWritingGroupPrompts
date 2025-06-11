import { useGroupContext } from "@/context/groupContext";
import { Stack, Typography, Box } from "@mui/material";

export function DisplayCurrentPrompt() {
    const { currentPrompt } = useGroupContext();

    return (
        <Stack
            direction="column"
            alignItems="center"
            spacing={1} // optional: adds vertical space between children
        >

            <Typography variant="h4">Prompt</Typography>

            <Box component="section" sx={{ p: 2, border: '1px solid black' }}>
                <Typography variant="h6">{currentPrompt?.prompt}</Typography>
            </Box>

        </Stack>
    )
}