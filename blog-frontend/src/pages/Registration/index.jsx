import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, fetchUserRegister, userIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";
import { useForm } from 'react-hook-form';

import styles from './Login.module.scss';

export const Registration = () => {
  const isUserAuth = useSelector(userIsAuth);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: '',
      fullName: '',
      password: ''
    },
    mode: 'onChange'
  })
  const onSubmit = async (values) => {
    const data = await dispatch(fetchUserRegister(values));
    if (!data.payload) return alert("Registration Error")
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }
  }
  if (isUserAuth) {
    return <Navigate to="/" />
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Create Account
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Fullname"
          fullWidth
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Enter Fullname' })} />
        <TextField
          className={styles.field}
          label="Email"
          fullWidth
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Enter valid email' })} />
        <TextField
          className={styles.field}
          label="Password"
          fullWidth
          type='password'
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Enter password' })} />
        <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
          Register
        </Button>
      </form>
    </Paper>
  );
};
