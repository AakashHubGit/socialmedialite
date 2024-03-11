import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ThumbUpAltOutlined } from "@mui/icons-material";
import { CircularProgress } from "@mui/material"; // Import CircularProgress from Material-UI
import "../css/home.css";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [sortByLikes, setSortByLikes] = useState(false);
  const [usernameFilter, setUsernameFilter] = useState('');
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("https://social-media-lite.onrender.com/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          const reversedPosts = response.data.listOfPosts.reverse(); // Reverse the order of posts
          setListOfPosts(reversedPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
          setLoading(false); // Set loading to false when data is fetched
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          setLoading(false); // Set loading to false in case of error
        });
    }
  }, [navigate]);

  const likeAPost = (postId) => {
    axios
      .post(
        "https://social-media-lite.onrender.com/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  if (loading) {
    // Render circular loading indicator while data is being fetched
    return (
      <div className="loader-container">
        <CircularProgress />
      </div>
    );
  }

  const sortedPosts = [...listOfPosts].sort((a, b) => {
    if (sortByLikes) {
      return b.Likes.length - a.Likes.length;
    }
    return 0;
  });

  const filteredPosts = sortedPosts.filter(post =>
    post.username.toLowerCase().includes(usernameFilter.toLowerCase())
  );

  return (
    <div className="container">
      <div className="filters">
        <div className="filter">
          <label htmlFor="sortByLikes" className="sortLabel">Sort by Likes:</label>
          <input
            type="checkbox"
            id="sortByLikes"
            checked={sortByLikes}
            onChange={() => setSortByLikes(!sortByLikes)}
          />
        </div>
        <div className="filter">
          <label htmlFor="usernameFilter" className="filterLabel">Filter by Username:</label>
          <input
            type="text"
            id="usernameFilter"
            value={usernameFilter}
            onChange={e => setUsernameFilter(e.target.value)}
            placeholder="Enter username"
            className="filterInput"
          />
        </div>
      </div>
      {filteredPosts.map((value, key) => {
        return (
          <Link to={`/post/${value.id}`} key={key} className="post-link">
            <div className="post">
              <div className="title">{value.title}</div>
              <div className="body">
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">
                  <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
                </div>
                <div className="buttons">
                  <ThumbUpAltOutlined
                    onClick={() => {
                      likeAPost(value.id);
                    }}
                    className={
                      likedPosts.includes(value.id) ? 'unlikeBttn' : 'likeBttn'
                    }
                  />
                  <label>{value.Likes.length}</label>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Home;
