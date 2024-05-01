import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import "../css/createPost.css";

const initialValues = {
  title: "",
  postText: "",
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required("You must input a Title!"),
  postText: Yup.string().required("Post cannot be empty."),
});

function CreatePost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post("https://social-media-lite.onrender.com/posts", values, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createPostPage">
      <div className="createPostContainer">
        <h2>Create a New Post</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="inputGroup">
                <label htmlFor="title">Title</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter the title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="errorMessage"
                />
              </div>

              <div className="inputGroup">
                <label htmlFor="postText">Post</label>
                <Field
                  as="textarea"
                  id="postText"
                  name="postText"
                  placeholder="Write your post here..."
                />
                <ErrorMessage
                  name="postText"
                  component="div"
                  className="errorMessage"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="submitButton"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Post"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreatePost;
