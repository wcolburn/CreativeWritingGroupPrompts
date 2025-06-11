'use client';
import { useUserContext, logOut, googleSignIn } from "@/context/userContext";
import { ProfileLink } from "./Navbar";
import { UserProfilePicture } from "./userProfilePicture";

export function LogInButton() {

    const user = useUserContext();

    function handleLogout() {
        logOut();
    }

    function handleGoogleLogin() {
        googleSignIn();
    }

    return (
        <div>
            {user ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
                    {/* <ProfileLink /> */}
                    <button onClick={handleLogout}>Log Out</button>
                    <UserProfilePicture user={user} />
                </div>
            ) : (
                <button onClick={handleGoogleLogin}>Log In with Google</button>
            )}
        </div>
    );
}
