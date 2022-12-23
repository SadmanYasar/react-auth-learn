import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../utils/firebase"

export default function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const route = useRouter();

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (!user) {
        route.push('/auth/login');
    }

    return (
        <div>
            <h1>Welcome {user?.displayName}</h1>
            <button onClick={() => auth.signOut()}>Sign out</button>
        </div>
    )
} 