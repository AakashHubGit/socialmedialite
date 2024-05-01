import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import "../css/post.css";

function Post() {
  const { id } = useParams();
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    axios
      .get(`https://social-media-lite.onrender.com/posts/byId/${id}`)
      .then((response) => {
        setPostObject(response.data);
      });

    axios
      .get(`https://social-media-lite.onrender.com/comments/${id}`)
      .then((response) => {
        setComments(response.data);
      });
  }, [id]);

  const addComment = () => {
    axios
      .post(
        "https://social-media-lite.onrender.com/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`https://social-media-lite.onrender.com/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`https://social-media-lite.onrender.com/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = (option) => {
    let newText;
    if (option === "title") {
      newText = prompt("Enter New Title:");
      axios.put(
        "https://social-media-lite.onrender.com/posts/title",
        {
          newTitle: newText,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
    } else {
      newText = prompt("Enter New Text:");
      axios.put(
        "https://social-media-lite.onrender.com/posts/postText",
        {
          newText: newText,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
    }
    setPostObject({ ...postObject, [option]: newText });
  };

  return (
    <div className="postPage">
      <div className="postContainer">
        <div className="postCard">
          <div className="postHeader">
            <div
              className="title"
              onClick={() =>
                authState.username === postObject.username && editPost("title")
              }
            >
              {postObject.title}
            </div>
            <div className="username">{postObject.username}</div>
          </div>
          <div
            className="body"
            onClick={() =>
              authState.username === postObject.username && editPost("body")
            }
          >
            {postObject.postText}
          </div>
          {authState.username === postObject.username && (
            <button
              className="deleteButton"
              onClick={() => deletePost(postObject.id)}
            >
              Delete Post
            </button>
          )}
        </div>
        <div className="commentContainer">
          <div className="addCommentContainer">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
            />
            <button onClick={addComment}>Add Comment</button>
          </div>
          {comments.map((comment) => (
            <div className="commentCard" key={comment.id}>
              <div className="commentText">{comment.commentBody}</div>
              <div className="commentMeta">Username: {comment.username}</div>
              {authState.username === comment.username && (
                <button
                  className="deleteButton"
                  onClick={() => deleteComment(comment.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Post;
