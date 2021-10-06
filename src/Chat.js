import React, { useState, useContext, useEffect } from "react";
import uuid from "react-uuid";
import { UserContext } from "./UserContext";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useHistory } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import ListItemText from "@material-ui/core/ListItemText";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "100%",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "50%",
    height: "77%",
    overflowY: "scroll",
  },

  gridAllign: {
    paddingLeft: "12px",
    paddingRight: "12px",
  },

  gridContainer: {
    // width: 'fit-content',
    backgroundColor: "cadetblue",
    border: "1px solid white",
    borderRadius: "15px",
  },

  groupSelected: {
    background: "linear-gradient(to right, #F1F2B5, cadetblue)",
  },

  chatBackground: {
    // background:' linear-gradient(to right, #F1F2B5, #135058)',
    backgroundColor: "#F1F2B5",
    // borderRadius: '39px'
  },

  groupBackground: {
    background: " linear-gradient(to right, #135058, #F1F2B5)",
    // borderRadius: '39px'
  },
}));

const Chat = () => {
  const classes = useStyles();

  const [client, setClient] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("chatroom");
  const [port, setPort] = useState(null);
  const { user, token } = useContext(UserContext);
  const [demoToken, setDemoToken] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const history = useHistory();
  console.log(user, token);
  const logout = () => {
    history.push("/");
  };

  // useEffect(() => {
  //   setMessageList({"to_group_id": 1,
  //   "from_user_id": 5,
  //   "s3_url_link": "https://github.com/Mansi-Chauhan27/Chat-App/blob/main/requirements/base.txt",
  //   "created_at": "2021-08-09T10:47:38.849230Z",
  //   "username": "sarath" })
  // }, [])

  useEffect(() => {
    const API_URL = "http://127.0.0.1:8000/api/token/";
    axios
      .get(API_URL)
      .then((response) => {
        console.log(response);
        setDemoToken(response.data.token);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (demoToken) {
      if (user == "chandra") {
        setPort("connected to port 8000");
        setClient(
          new W3CWebSocket(
            "ws://127.0.0.1:8000/ws/chat/" +
              user +
              "/" +
              uuid() +
              "/?token=" +
              demoToken
          )
        );
      } else {
        setPort("connected to port 8001");
        setClient(
          new W3CWebSocket(
            "ws://127.0.0.1:8001/ws/chat/" +
              user +
              "/" +
              uuid() +
              "/?token=25d38dbbc48fc35d95f2ef7c7d5b98c92c4a8fd3"
          )
        );
      }
    }
  }, [user, demoToken]);

  useEffect(() => {
    if (client) {
      client.onopen = () => {
        console.log("WebSocket Client Connected as ", user);
      };
      client.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);
        console.log("got reply! ", dataFromServer.type);
        console.log(messageList);
        if (dataFromServer) {
          // this.setState((state) =>
          // ({
          //     messages: [...state.messages,
          //     {
          //     msg: dataFromServer.message,
          //     name: dataFromServer.name,
          //     }]
          // })
          // );
          console.log(dataFromServer);
          // setMessageList([...messageList, {'id':dataFromServer.id,'message':dataFromServer.message,'from_user':dataFromServer.username, 'time': '11:23'}])
          {
            /* {
        "to_group_id": 1,
        "from_user_id": 5,
        "id": 1,
        "s3_url_link": "https://github.com/Mansi-Chauhan27/Chat-App/blob/main/requirements/base.txt",
        "created_at": "2021-08-09T10:47:38.849230Z",
        "username": "sarath"
    }, */
          }
          setMessageList((messageList) => [
            ...messageList,
            {
              to_group_id: dataFromServer.to_group_id,
              from_user_id: dataFromServer.userid,
              s3_url_link: dataFromServer.s3_url_link,
              created_at: dataFromServer.created_at,
              username: dataFromServer.username,
            },
          ]);
          // setMessageList
          console.log(messageList);
        }
      };
    }
  });
  const onSend = () => {
    client.send(
      JSON.stringify({
        type: "message",
        // message: msgValue, //s3object

        message: message,
        user_id: user, // userid
        username: user, // username
        // group: dummyGroup  //groupid
        group: "chatroom",
      })
    );
  };

  useEffect(() => {
    console.log("message", message);
  }, [message]);

  useEffect(() => {
    console.log("messageList", messageList);
  }, [messageList]);

  return (
    <div>
      <div>
        <h1>Hi {user} </h1>
        <h1> {port} </h1>
        <input
          type="text"
          name="name"
          placeholder="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <br />
        <button onClick={onSend}> send message</button>

        <List className={(classes.messageArea, classes.chatBackground)}>
          {messageList.length &&
            messageList.map((message, index) => {
              // console.log(message)
              {
                console.log(message["s3_url_link"]);
              }
              return (
                <ListItem key={index}>
                  {message["to_group_id"] === selectedGroup ? (
                    <Grid container className={classes.gridContainer}>
                      <Grid item xs={12} className={classes.gridAllign}>
                        <ListItemText
                          align={
                            user === message["username"] ? "right" : "Left"
                          }
                          primary={message["s3_url_link"]}
                        ></ListItemText>
                      </Grid>
                      <Grid item xs={12} className={classes.gridAllign}>
                        <ListItemText
                          align={
                            user === message["username"] ? "right" : "left"
                          }
                          secondary={message["created_at"]}
                        ></ListItemText>
                      </Grid>
                    </Grid>
                  ) : (
                    <div></div>
                  )}
                </ListItem>
              );
            })}
        </List>
      </div>
      <br />
      <GoogleLogout
        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
        buttonText="Logout"
        onLogoutSuccess={logout}
      ></GoogleLogout>
    </div>
  );
};

export default Chat;
