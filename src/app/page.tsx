'use client';

import { LogInButton } from "@/components/LogInButton";
import NavBar from "@/components/Navbar";
import { useUserContext } from "@/context/userContext";
import { Typography } from "@mui/material";


export default function Home() {

  const user  = useUserContext();
  
  return (
    <div>
     <header> <NavBar /> </header>
     <main>
      {
        user ? (
          <div>Hey!</div>
        ) : (
          <WelcomeNewUser />
        )
      }
     </main>
    </div>
  );
}

function WelcomeNewUser() {
  return (
    <div>
      <Typography>Welcome to Creative Writing Group Prompts!</Typography>
      <Typography>This is a website for groups of friends to write weekly stories together!</Typography>
      <Typography>You choose a timeframe (Ex. one week) for everyone in the group to write for a selected prompt.</Typography>
      <Typography>Before the start of the timeframe, a valid user is randomly selected to be the prompt chooser.</Typography>
      <Typography>The user must select up to six prompts, and then the other users can vote on which prompt they want.</Typography>
      <Typography>Once the prompt is selected, users have the duration of the timeframe to submit a story for it.</Typography>
      <Typography>Previous prompts and their stories are stored once they end.</Typography>
      <LogInButton />
    </div>
  )
}