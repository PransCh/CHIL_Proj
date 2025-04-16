//postsCount.jsx
"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocale } from '../LocaleProvider';

const PostsCount = () => {
  const [posts, setPosts] = useState([]);
  const [completedPosts, setCompletedPosts] = useState([]);
  const [inProgressPosts, setInProgressPosts] = useState([]);
  const { locale } = useLocale();
  const translations = require(`../../locales/${locale}.json`);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get('/api/posts');
      const allPosts = response.data.posts;
      setPosts(allPosts);
      setCompletedPosts(allPosts.filter((post) => post.status === 'Completed'));
      setInProgressPosts(allPosts.filter((post) => post.status !== 'Completed'));
    };

    fetchPosts();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '30%', backgroundColor: '#E6F5FA' }}>
        <h2>{translations?.TotalPosts|| "Total Posts"}</h2>
        <p>{posts.length}</p>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '30%', backgroundColor: '#E6F5FA' }}>
        <h2>{translations?.CompletedPosts || "Completed Posts"}</h2>
        <p>{completedPosts.length}</p>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '30%', backgroundColor: '#E6F5FA' }}>
        <h2>{translations?.InProgressPosts || "In Progress Posts"}</h2>
        <p>{inProgressPosts.length}</p>
      </div>
    </div>
  );
};

export default PostsCount;