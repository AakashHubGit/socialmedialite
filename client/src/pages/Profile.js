import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import "../css/profile.css";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    axios
      .get(`https://social-media-lite.onrender.com/auth/basicinfo/${id}`)
      .then((response) => {
        setUsername(response.data.username);
      });

    axios
      .get(`https://social-media-lite.onrender.com/posts/byuserId/${id}`)
      .then((response) => {
        setListOfPosts(response.data);
        // Calculate total likes for the user
        const likesCount = response.data.reduce(
          (total, post) => total + post.Likes.length,
          0
        );
        setTotalLikes(likesCount);
      });
  }, [id]);

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1>Username: {username}</h1>
        <div>Total Likes: {totalLikes}</div>
        {authState.username === username && (
          <button onClick={() => navigate("/changepassword")}>
            Change My Password
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => (
          <div key={key} className="post">
            <div className="title">{value.title}</div>
            <div className="body" onClick={() => navigate(`/post/${value.id}`)}>
              {value.postText}
            </div>
            <div className="footer">
              <div className="username">{value.username}</div>
              <div className="buttons">
                <label>{value.Likes.length}</label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
