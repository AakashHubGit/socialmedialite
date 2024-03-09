import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../css/registration.css";

function Registration() {
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    axios.post("https://social-media-lite.onrender.com/auth", data).then(() => {
      console.log(data);
    });
  };

  return (
    <div className="card">
  <Formik
    initialValues={initialValues}
    onSubmit={onSubmit}
    validationSchema={validationSchema}
  >
    <Form className="formContainer">
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
      <button type="submit">Register</button>
      <p>Already have an account? <a href="/login">Login here</a>.</p>
    </Form>
  </Formik>
</div>

  );
}

export default Registration;