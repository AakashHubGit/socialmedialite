import React from "react";
import { Link,useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../css/registration.css";

function Registration() {
  const initialValues = {
    username: "",
    password: "",
  };
  let navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    axios.post("https://social-media-lite.onrender.com/auth", data).then(() => {
      console.log(data);
    }).then((response)=>{
      navigate("/login");
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
      <button type="submit">Register</button>
      <p>Already have an account? <Link to="/login">Login here</Link>.</p>
    </Form>
  </Formik>
</div>

  );
}

export default Registration;