'use client'

import Link from "next/link"
import { AppBar, Toolbar, Typography,  Container, Box } from '@mui/material'

import { LogInButton } from "./LogInButton";

export default function NavBar() {

  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
        
        <HomeLink />

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