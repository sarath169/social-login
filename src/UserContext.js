import React from 'react'

const UserContext = React.createContext(null)

const UserProvider = UserContext.Provider 
const UserConsumer = UserContext.Consumer

export {UserConsumer, UserProvider, UserContext}