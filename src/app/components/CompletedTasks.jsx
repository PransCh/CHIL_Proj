import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, Pagination, Box, Button } from '@mui/material';
import { PropagateLoader } from 'react-spinners';

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const hardcodedEmail = 'Digital Manufacturing';

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.post('/api/assignedposts', {
          AssignedTeam: hardcodedEmail,
          Status: 'Completed'
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        fetch('/api/users/'+123).then(r =>  r.json().then(data => console.log(data)))
          
        console.log('API Response:', response.data);

        if (response.data && Array.isArray(response.data.posts)) {
          setTasks(response.data.posts);
        } else {
          console.warn('No posts found in response:', response.data);
          setTasks([]);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error.response?.data || error.message);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };


    fetchTasks();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleViewMore = (task) => {
    console.log('View More clicked for task:', task);
  };

  const displayedTasks = Array.isArray(tasks)
    ? tasks.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : [];

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h4"
          component="div"
          sx={{
            mb: 3,
            color: '#005C7A',
            fontWeight: 'bold',
          }}
        >
          COMPLETED ASSIGNED TASKS
        </Typography>
        <Box sx={{ width: '100%', mt: 2 }}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
              }}
            >
              <PropagateLoader color="#005C7A" />
            </Box>
          ) : Array.isArray(tasks) && tasks.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No completed tasks found.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {displayedTasks.map((task, index) => (
                <Card
                  key={index}
                  sx={{
                    width: { xs: '95%', md: '80%' },
                    minWidth: '1000px',
                    padding: '24px',
                    marginBottom: '15px',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#E6F5FA',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    position: 'relative',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewMore(task)}
                    sx={{
                      position: 'absolute',
                      top: '80px',
                      right: '30px',
                      textTransform: 'none',
                      fontSize: '12px',
                      padding: '10px 10px',
                      backgroundColor: '#005C7A',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#007A9C',
                      },
                    }}
                  >
                    View More
                  </Button>
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{
                      marginBottom: '4px',
                      paddingRight: '100px',
                      textAlign: 'left',
                    }}
                  >
                    {task.IdeaTitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      textAlign: 'left',
                      margin: 0,
                    }}
                  >
                    {task.IdeaAnswer ? task.IdeaAnswer : 'No answer yet'}
                  </Typography>
                </Card>
              ))}
            </Box>
          )}
          {Array.isArray(tasks) && tasks.length > 0 && (
            <Pagination
              count={Math.ceil(tasks.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'center',
                '& .MuiPaginationItem-root': {
                  color: '#005C7A',
                  '&.Mui-selected': {
                    backgroundColor: '#E6F5FA',
                    color: '#005C7A',
                    fontWeight: 'bold',
                  },
                  '&:hover': {
                    backgroundColor: '#E6F5FA',
                  },
                },
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CompletedTasks;