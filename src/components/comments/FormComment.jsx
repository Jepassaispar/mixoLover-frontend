import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import "./../../css/FormComment.css";
import UserContext from "../../auth/UserContext";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
const AddComment = props => {
  const { isLoading, currentUser } = useAuth();
  const [message, setMessage] = useState({});
  const [oldMessages, setOldMessages] = useState([]);

  const [user, Setuser] = useState({});
  const inputComment = useRef();

  useEffect(() => {
    if (currentUser)
      Setuser({ photo: currentUser.photo, name: currentUser.name });
    // console.log(props.UserId);
  }, []);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL +
          "/comment/cocktail/" +
          props.CocktailId
      )
      .then(dbRes => {
        if (dbRes.data.length) {
          setOldMessages(dbRes.data);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleChange = e => {
    setMessage({ ...message, [e.target.name]: e.target.value });
    Setuser({ photo: currentUser.photo, name: currentUser.name });
    console.log("je suis l'userID", props.UserId);
  };

  const handleSubmit = e => {
    e.preventDefault();
    createComment();
  };

  function createComment() {
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "/comment", {
        message: message.message,
        created: new Date(),
        cocktail: `${props.CocktailId}`,
        user: user
      })
      .then(res => {
        setOldMessages([...oldMessages, res.data]);
        inputComment.current.value = "";
        console.log(oldMessages);
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <div className="newComment">
      {/* {console.log(message)} */}
      <form className="formComment" onSubmit={handleSubmit}>
        {currentUser ? (
          <>
            <div className="imageAndInputContainer">
              <img className="userPhoto" src={user.photo} alt="inch" />
              <textarea
                className="inputComment"
                name="message"
                ref={inputComment}
                id="message"
                placeholder="leave a comment here..."
                maxLength="300"
                // size="10"
                required
                onChange={handleChange}
              ></textarea>
            </div>
            <button className="btnSubmitMessage">comment !</button>
          </>
        ) : (
          <button className="btn-formComment">
            <NavLink
              className="link-formComment"
              style={{
                textDecoration: "none"
              }}
              to="/Signup"
            >
              SignUp to comment !
            </NavLink>
          </button>
        )}
        <br />
        <div className="comments">
          {!Boolean(oldMessages.length) ? (
            <p className="noMessageYet">No message yet</p>
          ) : (
            <div className="oneComment">
              {oldMessages
                .sort((a, b) => {
                  if (a.created > b.created) return -1;
                  else return 1;
                })
                .map((oldMessage, i) => (
                  <li className="listMessage" key={i}>
                    <div className="message">
                      <div className="nameAndPictureContainer">
                        <img
                          className="userPhoto"
                          src={oldMessage.user.photo}
                          alt="inch"
                        />
                        <div className="fullUser">
                          <span className="userName">
                            {oldMessage.user.name}
                          </span>
                          <span className="dateMessage">
                            le {oldMessage.created.substr(0, 10)} à{" "}
                            {oldMessage.created.substr(11, 5)}
                          </span>
                        </div>
                      </div>
                      <span className="contentMessage">
                        {oldMessage.message}
                      </span>
                    </div>
                  </li>
                ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddComment;
