import { AuthUser } from "@/context/userContext"

export function UserProfilePicture(props: {user: AuthUser}) {
    return (
        <div>
        {
            props.user?.photoURL ? (
                <img src={props.user.photoURL} height={40} width={40} />
            ) : (
                <div></div>
            )
        }
        </div>
    )
}