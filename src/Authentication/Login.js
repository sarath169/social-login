import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import GoogleLogin from "react-google-login";
import { useHistory, Link, Redirect } from "react-router-dom";
// import ReactDOM from "react-dom";
// import FacebookLogin from "react-facebook-login";
import { UserContext } from "../UserContext";

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function Login() {
  const [tokenId, setTokenId] = useState(null);
  const { user, setUser, token, setToken } = useContext(UserContext);
  const history = useHistory();
  const userValidation = () => {
    const url = "http://127.0.0.1:8000/api/validate/";
    console.log(tokenId);
    axios

      .get(url, { token: tokenId })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const loggedIn = (response) => {
    console.log(response.profileObj);
    setUser(response.profileObj.familyName);
    setToken(response.tokenId);
    history.push("/chat");
  };

  const responseGoogle = (response) => {
    console.log(response);
    console.log(response.profileObj);
    console.log(response.tokenId);
    setTokenId(response.tokenId);
  };

  const responseFacebook = (response) => {
    console.log(response);
  };

  useEffect(() => {
    if (tokenId) {
      userValidation();
    }
  }, [tokenId]);

  return (
    <div>
      <GoogleLogin
        clientId={process.env.REACT_APP_clientId}
        buttonText="Login"
        onSuccess={loggedIn}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />

      {/* <FacebookLogin
        appId="1088597931155576"
        autoLoad={true}
        fields="name,email,picture"
        onClick={componentClicked}
        callback={responseFacebook}
      /> */}
      {/* <div className="g-signin2" data-onsuccess={onSignIn}></div> */}
    </div>
  );
}

export default Login;
