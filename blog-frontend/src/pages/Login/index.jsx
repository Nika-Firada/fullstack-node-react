import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import styles from "./Login.module.scss";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, userIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";

export const Login = () => {
  const isUserAuth = useSelector(userIsAuth);
  const dispatch = useDispatch();
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onSubmit'
  })
  const onSubmit = async(values) => {
    const data = await dispatch(fetchUserData(values));
    if(!data.payload) return alert("cann't login")
    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  if(isUserAuth){
    return <Navigate to = "/" />
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Login in account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Email"
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Enter valid email' })}
          fullWidth
        />
        <TextField 
        className={styles.field} 
        label="Password" 
        type="password"
        error={Boolean(errors.password?.message)}
        helperText={errors.password?.message}
        {...register('password', { required: 'Enter Password' })}
        fullWidth 
        />
        <Button  type="submit" size="large" variant="contained" fullWidth>
          Login
        </Button>
      </form>
    </Paper>
  );
};
