import SplitterComponent from "@/components/SplitterComponent"
import Sidebar from "@/components/sidebar/Sidebar"
import WorkSpace from "@/components/workspace"
import { useAppContext } from "@/context/AppContext"
import useFullScreen from "@/hooks/useFullScreen"
import useUserActivity from "@/hooks/useUserActivity"
import { RemoteUser, USER_CONNECTION_STATUS, USER_STATUS, User } from "@/types/user"
import { useEffect } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"

function EditorPage() {
    // Listen user online/offline status
    useUserActivity()
    // Enable fullscreen mode
    useFullScreen()
    const navigate = useNavigate()
    const { roomId } = useParams()
    const { setCurrentUser, currentUser, setUsers, setStatus } = useAppContext()
    const location = useLocation()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const username =
            currentUser.username ||
            location.state?.username ||
            searchParams.get("username")

        if (!username && (!currentUser.username || currentUser.username.length === 0)) {
            navigate("/", {
                state: { roomId },
            })
            return
        }

        if (roomId && username) {
            const user: User = { username, roomId }
            setCurrentUser(user)
            setStatus(USER_STATUS.JOINED)
            const localUser: RemoteUser = {
                ...user,
                status: USER_CONNECTION_STATUS.ONLINE,
                cursorPosition: 0,
                typing: false,
                currentFile: "",
                socketId: "local-user",
            }
            setUsers((prev) => {
                if (prev.some((u) => u.username === username)) return prev
                return [localUser]
            })
        }
    }, [
        currentUser.username,
        location.state?.username,
        searchParams,
        navigate,
        roomId,
        setCurrentUser,
        setStatus,
        setUsers,
    ])

    return (
        <SplitterComponent>
            <Sidebar />
            <WorkSpace />
        </SplitterComponent>
    )
}

export default EditorPage
