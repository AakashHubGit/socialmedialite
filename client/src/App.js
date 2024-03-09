import "./App.css";
import { Route, Routes,BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("https://social-media-lite.onrender.com/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, [authState]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
  };

  return (
    <Router>

      <AuthContext.Provider value={{ authState, setAuthState }}>
    <div className="App">
          <div className="navbar">
            <div className="links">
              {!authState.status ? (
                <>
                  <a href="/login">Login</a>
                  <a href="/registration"> Registration</a>
                </>
              ) : (
                <>
                  <a href="/"> Home Page</a>
                  <a href="/createpost"> Create A Post</a>
                </>
              )}
            </div>
            <div className="loggedInContainer">
                <h1>{authState.username} </h1>
              {authState.status && <button onClick={logout}> Logout</button>}
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/createpost" element={<CreatePost/>} />
            <Route path="/post/:id" element={<Post/>} />
            <Route path="/registration" element={<Registration/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/profile/:id" element={<Profile/>} />
            <Route path="/changepassword" element={<ChangePassword/>} />
            <Route path="*" element={<PageNotFound/>} />
          </Routes>
    </div>
      </AuthContext.Provider>
                </Router>
  );
}

export default App;