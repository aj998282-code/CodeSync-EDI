import {
    SocketContext as SocketContextType,
} from "@/types/socket"
import {
    ReactNode,
    createContext,
    useContext,
    useMemo,
} from "react"
import { Socket } from "socket.io-client"

const SocketContext = createContext<SocketContextType | null>(null)

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider")
    }
    return context
}

class MockSocket {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private listeners: Map<string, Set<(...args: any[]) => void>> = new Map()
    public connected = true
    public id = "local-user"

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event: string, callback: (...args: any[]) => void) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }
        this.listeners.get(event)!.add(callback)
        return this
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    once(event: string, callback: (...args: any[]) => void) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onceWrapper = (...args: any[]) => {
            this.off(event, onceWrapper)
            callback(...args)
        }
        this.on(event, onceWrapper)
        return this
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    off(event: string, callback?: (...args: any[]) => void) {
        if (!callback) {
            this.listeners.delete(event)
        } else {
            this.listeners.get(event)?.delete(callback)
        }
        return this
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit(event: string, ...args: any[]) {
        const callbacks = this.listeners.get(event)
        if (callbacks) {
            callbacks.forEach((cb) => {
                try {
                    cb(...args)
                } catch (e) {
                    console.error("Error in mock socket handler for event:", event, e)
                }
            })
        }
        return this
    }

    connect() {
        this.connected = true
        return this
    }

    disconnect() {
        this.connected = false
        return this
    }
}

const SocketProvider = ({ children }: { children: ReactNode }) => {
    const socket = useMemo(() => new MockSocket() as unknown as Socket, [])

    return (
        <SocketContext.Provider
            value={{
                socket,
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}

export { SocketProvider }
export default SocketContext
