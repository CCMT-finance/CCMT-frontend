import React from "react";

// export type UseUserType = ReturnType<typeof _useUser>
// //@ts-ignore
// const UserContext = React.createContext()
//
// export const UserProvider: React.FC<{ user?: UserType }> = ({
//                                                                 user,
//                                                                 children
//                                                             }) => {
//     const User = _useUser(user)
//     return <UserContext.Provider value = {User} >
//         {children}
//         < /UserContext.Provider>
// }
//
// export const useUser: () => UseUserType = () => {
//     const context = React.useContext(UserContext)
//     if (context === undefined) {
//         throw new Error('useUser must be used within a UserProvider')
//     }
//     return context as UseUserType
// }

export const createProvider = <T, Arg = any>(initState: () => T) => {
    // @ts-ignore
    const context = React.createContext()

    return {
        hook: () => {
            const localContext = React.useContext(context)
            if (localContext === undefined) {
                throw new Error('wff')
            }
            return localContext as T
        },
        provider: (({children}) => <context.Provider value={initState()}>{children}</context.Provider>) as React.FC
    }
}