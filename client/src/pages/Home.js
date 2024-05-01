import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ThumbUpAltOutlined, ThumbUpAlt } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import "../css/home.css";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortByLikes, setSortByLikes] = useState(false);
  const [usernameFilter, setUsernameFilter] = useState("");
  const [showLikedPosts, setShowLikedPosts] = useState(false);
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
          const reversedPosts = response.data.listOfPosts.reverse();
          setListOfPosts(reversedPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, [navigate]);

  const likeAPost = (e, postId) => {
    e.preventDefault(); // Prevent default behavior of link click
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
    return (
      <div className="loader-container">
        <CircularProgress />
      </div>
    );
  }

  // Apply filter for liked posts if showLikedPosts is true
  let filteredPosts = showLikedPosts
    ? listOfPosts.filter((post) => likedPosts.includes(post.id))
    : listOfPosts;

  // Sort the filtered posts by likes if sortByLikes is true
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortByLikes) {
      return b.Likes.length - a.Likes.length;
    }
    return 0;
  });

  // Apply username filter
  filteredPosts = sortedPosts.filter((post) =>
    post.username.toLowerCase().includes(usernameFilter.toLowerCase())
  );

  return (
    <div className="container">
      <div className="filters">
        <div className="filter">
          <label htmlFor="sortByLikes" className="sortLabel">
            Sort by Likes:
          </label>
          <input
            type="checkbox"
            id="sortByLikes"
            checked={sortByLikes}
            onChange={() => setSortByLikes(!sortByLikes)}
          />
        </div>
        <div className="filter">
          <label htmlFor="showLikedPosts" className="filterLabel">
            Show Liked Posts:
          </label>
          <input
            type="checkbox"
            id="showLikedPosts"
            checked={showLikedPosts}
            onChange={() => setShowLikedPosts(!showLikedPosts)}
          />
        </div>
        <div className="filter">
          <label htmlFor="usernameFilter" className="filterLabel">
            Filter by Username:
          </label>
          <input
            type="text"
            id="usernameFilter"
            value={usernameFilter}
            onChange={(e) => setUsernameFilter(e.target.value)}
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
              <div className="body">{value.postText}</div>
              <div className="footer">
                <div className="username">
                  <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
                </div>
                <div className="buttons">
                  {likedPosts.includes(value.id) ? (
                    <ThumbUpAlt
                      onClick={(e) => {
                        likeAPost(e, value.id);
                      }}
                      className="likeBttn"
                    />
                  ) : (
                    <ThumbUpAltOutlined
                      onClick={(e) => {
                        likeAPost(e, value.id);
                      }}
                      className="likeBttn"
                    />
                  )}
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
