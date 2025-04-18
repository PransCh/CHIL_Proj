//AddPostDialog.jsx
"use client";
 
import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem } from '@mui/material';
import { useLocale } from '../LocaleProvider';

 
const AddPostDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [impact, setImpact] = useState('');
  const [error, setError] = useState('');
  const { locale } = useLocale();
  const translations = require(`../../locales/${locale}.json`);
 
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
 
  const validateForm = () => {
    if (!title || !description || !reason || !impact) {
      setError('All fields are required.');
      return false;
    }
    setError('');
    return true;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
 
    try {
      const response = await fetch('/api/postsubmit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, reason, impact }),
      });
 
      if (response.ok) {
        console.log('Details stored successfully');
        setError('');
      } else {
        const errorMessage = await response.text();
        console.error('Error storing:', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred.');
    }
 
    handleClose();
  };
 
  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} style={{ backgroundColor: '#005C7A', marginTop: '20px', marginBottom: '20px' }}>
        {translations?.ADDNEWPOST||'Add New Post'}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Post</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Reason"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <TextField
              select
              margin="dense"
              label="Impact"
              fullWidth
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
            >
              <MenuItem value="">Select Impact</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
            </TextField>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <DialogActions>
              <Button onClick={handleClose} style={{backgroundColor:"#005C7A", color:"white"}}>
                Cancel
              </Button>
              <Button type="submit" style={{backgroundColor: "#005C7A", color: "white"}}>
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
 
export default AddPostDialog;