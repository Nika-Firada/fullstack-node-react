import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { useSelector } from "react-redux";

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { userIsAuth } from "../../redux/slices/auth";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import axios from '../../axios'


export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const isUserAuth = useSelector(userIsAuth);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null)
  const [isLoading, setIsLoading] = React.useState(false)


  const isEditing = Boolean(id)
  // edit post
  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({data})=> {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags);
      }).catch(err => { console.warn(err); alert("error") })
    }
  },[])

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url)
    } catch (err) {
      console.warn(err)
      alert('Something gone wrong..!')
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  // library needs
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);
  // same here
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter Text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );
  // if not authorized you cant write post
  if (!window.localStorage.getItem('token') && !isUserAuth) {
    return <Navigate to="/" />
  }
  // send
  const onSubmit = async () => {
    try {
      setIsLoading(true)
      const fields = {
        title,
        imageUrl,
        tags,
        text
      }
      const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields);
      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`)
    } catch (error) {
      console.warn(error);
      alert("Error during creating post!")
    }
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button variant="outlined" size="large" onClick={() => inputFileRef.current.click()}>
        Load Photo
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Delete
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Title..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard" placeholder="Tags"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Save': 'Post'}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
