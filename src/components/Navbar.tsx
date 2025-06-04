'use client'

import Link from "next/link"
import { AppBar, Toolbar, Typography,  Container, Box } from '@mui/material'

import { LogInButton } from "./LogInButton";

export default function NavBar() {

  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-evenly" }}>
        
        <HomeLink />

        <CurrentPromptLink />

        <VotingLink />

        <LogInButton />

        </Toolbar>
      </Container>
    </AppBar>
  );
}

function HomeLink() {
    return (
        <Link href="/" style={{color: "#fff", textDecoration: 'none'}}>
            <Typography
                variant="h6"
                noWrap
                sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                
                }}
            >
                HOME
            </Typography>
        </Link>
    )
}

export function ProfileLink() {
    return (
        <Link href="/profile" style={{color: "#fff", textDecoration: 'none'}}>
            <Typography
                variant="h6"
                noWrap
                sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                
                }}
            >
                PROFILE
            </Typography>
        </Link>
    )
}

export function VotingLink() {
    return (
        <Link href="/voting" style={{color: "#fff", textDecoration: 'none'}}>
            <Typography
                variant="h6"
                noWrap
                sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                
                }}
            >
                VOTING
            </Typography>
        </Link>
    )
}

export function CurrentPromptLink() {
    return (
        <Link href="/current-prompt" style={{color: "#fff", textDecoration: 'none'}}>
            <Typography
                variant="h6"
                noWrap
                sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                
                }}
            >
                CURRENT PROMPT
            </Typography>
        </Link>
    )
}