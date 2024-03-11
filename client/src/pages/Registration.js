import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../css/registration.css";

function Registration() {
  const initialValues = {
    username: "",
    password: "",
  };
  const [loading, setLoading] = useState(false); // State to track loading status
  let navigate = useNavigate();
  
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    setLoading(true); // Set loading to true when registration form is submitted
    axios.post("https://social-media-lite.onrender.com/auth", data)
      .then(() => {
        console.log(data);
      })
      .then(() => {
        setLoading(false); // Set loading to false after successful registration
        navigate("/login");
      })
      .catch(error => {
        console.error("Error:", error);
        setLoading(false); // Set loading to false in case of error
      });
  };

  return (
    <div className="card">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="registerContainer">
          <h2>Create an Account</h2>
          <label htmlFor="username">Username:</label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            id="username"
            name="username"
            placeholder="(Ex. John123...)"
          />
          <label htmlFor="password">Password:</label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="password"
            name="password"
            placeholder="Your Password..."
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"} {/* Show loading text if loading */}
          </button>
          <p>
            Already have an account? <Link to="/login">Login here</Link>.
          </p>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
