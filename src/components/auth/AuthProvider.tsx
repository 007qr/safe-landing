import { createContext, ParentComponent, useContext } from 'solid-js'
import { createAuthStore } from './Auth.store'
// import { createWorkspaceStore } from '../workspace/Workspace.store'

const AuthContext = createContext<ReturnType<typeof createAuthStore>>()

export const AuthProvider: ParentComponent = (props) => {
    // const wkStore = createWorkspaceStore()
    const authStore = createAuthStore();
    // wkStore.setWorkspace(wkStore.getWorkspace())

    return (
        <AuthContext.Provider value={authStore}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const provideAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('provideAuth must be used within an <AuthProvider>')
    }
    return context
}
