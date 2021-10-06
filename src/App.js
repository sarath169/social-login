import React, { useState, useMemo } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./Authentication/Login";
import Chat from "./Chat";
import { UserProvider } from "./UserContext";

require("dotenv").config();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const providerValue = useMemo(
    () => ({ user, setUser, token, setToken }),
    [user, setUser, token, setToken]
  );
  return (
    <BrowserRouter>
      <UserProvider value={providerValue}>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path = '/chat'>
            <Chat/>
          </Route>
        </Switch>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
