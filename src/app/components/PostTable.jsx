//PostsTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, TextField, MenuItem, Chip, Snackbar, IconButton, Button, Pagination } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import FilterListIcon from '@mui/icons-material/FilterList';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DomainIcon from '@mui/icons-material/Domain';
import AddPostDialog from './AddPostDialog';
import PropagateLoader from 'react-spinners/PropagateLoader';
 
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
 
const PostTable = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filters, setFilters] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/posts');
        console.log('API Response:', response.data.posts);
        const allPosts = response.data.posts || [];
        setPosts(allPosts);
        setFilteredPosts(allPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchPosts();
  }, []);
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
 
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
 
  const handleFilterTypeChange = (event) => {
    const { value } = event.target;
    if (value && !filters.some(filter => filter.type === value)) {
      setFilters([...filters, { type: value, value: '' }]);
    } else if (filters.some(filter => filter.type === value)) {
      setOpenSnackbar(true);
    }
  };
 
  const handleFilterValueChange = (index, event) => {
    const { value } = event.target;
    const newFilters = [...filters];
    newFilters[index].value = value;
    setFilters(newFilters);
    console.log('Updated Filters:', newFilters);
  };
 
  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };
 
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
 
  useEffect(() => {
    const applyFilters = () => {
      let filtered = posts;
      console.log('Applying Filters:', filters);
      filters.forEach(filter => {
        if (filter.type === 'status' && filter.value) {
          filtered = filtered.filter(post => post.IdeaStatus === filter.value);
          console.log('After status filter:', filtered);
        }
        if (filter.type === 'dateModified' && filter.value) {
          filtered = filtered.filter(post => {
            if (!post.createdAt) return false;
            const postDate = new Date(post.createdAt);
            const filterDate = new Date(filter.value);
            return postDate >= filterDate && !isNaN(postDate) && !isNaN(filterDate);
          });
          console.log('After dateModified filter:', filtered);
        }
        if (filter.type === 'domain' && filter.value) {
          filtered = filtered.filter(post => post.IdeaImpact === filter.value);
          console.log('After domain filter:', filtered);
        }
      });
      console.log('Final Filtered Posts:', filtered);
      setFilteredPosts(filtered);
      setPage(1);
    };
    applyFilters();
  }, [filters, posts]);
 
  // Function to truncate description at the last complete word within 100 characters
  const truncateDescription = (desc) => {
    if (typeof desc !== 'string') return '';
    if (desc.length <= 100) return desc;
 
    const words = desc.split(' ');
    let result = '';
    let currentLength = 0;
 
    for (const word of words) {
      // Add 1 for the space that will be added
      if (currentLength + word.length + (result ? 1 : 0) > 100 - 3) {
        break;
      }
      result += (result ? ' ' : '') + word;
      currentLength += word.length + (result ? 1 : 0);
    }
 
    return result + '...';
  };
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '80%', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FilterListIcon style={{ marginRight: '10px' }} />
          <Typography variant="h6" component="div" style={{ marginRight: '10px' }}>
            Filters
          </Typography>
          <TextField
            select
            label="Add Filter"
            value=""
            onChange={handleFilterTypeChange}
            style={{ marginRight: '10px' }}
            placeholder="Select Filter"
          >
            <MenuItem value="">
              <FilterListIcon /> None
            </MenuItem>
            <MenuItem value="status">
              <PendingIcon /> Status
            </MenuItem>
            <MenuItem value="dateModified">
              <DateRangeIcon /> Date Modified
            </MenuItem>
            <MenuItem value="domain">
              <DomainIcon /> Domain
            </MenuItem>
          </TextField>
        </div>
        <Typography variant="h5" component="div" style={{ margin: '0 10px' }}>
          Check out posts
        </Typography>
        <AddPostDialog />
      </div>
      <div style={{ width: '80%', marginTop: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginBottom: '10px' }}>
          {filters.map((filter, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
              {filter.type === 'status' && (
                <TextField
                  select
                  label="Status"
                  value={filter.value}
                  onChange={(event) => handleFilterValueChange(index, event)}
                  style={{ marginRight: '10px' }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Not Completed">Not Completed</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </TextField>
              )}
              {filter.type === 'dateModified' && (
                <TextField
                  label="Date Modified"
                  type="date"
                  value={filter.value}
                  onChange={(event) => handleFilterValueChange(index, event)}
                  InputLabelProps={{ shrink: true }}
                  style={{ marginRight: '10px' }}
                />
              )}
              {filter.type === 'domain' && (
                <TextField
                  select
                  label="Domain"
                  value={filter.value}
                  onChange={(event) => handleFilterValueChange(index, event)}
                  style={{ marginRight: '10px' }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                </TextField>
              )}
              <Chip
                label={`${filter.type}: ${filter.value || 'All'}`}
                onDelete={() => handleRemoveFilter(index)}
                style={{ marginLeft: '10px', borderRadius: '16px' }}
              />
            </div>
          ))}
        </div>
        <div style={{ width: '100%', marginTop: '10px', textAlign: 'center' }}>
          {loading ? (
            <PropagateLoader color="#005C7A" />
          ) : filteredPosts.length === 0 ? (
            <Typography>No posts</Typography>
          ) : (
            filteredPosts.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((post, index) => (
              <Card
                key={index}
                style={{
                  padding: '20px',
                  marginBottom: '10px',
                  height: '200px',
                  position: 'relative',
                  backgroundColor: '#E6F5FA',
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => alert(`Viewing post: ${post.IdeaTitle}`)}
                  style={{
                    position: 'absolute',
                    top: '25px',
                    right: '10px',
                    backgroundColor: '#005C7A',
                    padding: '5px 10px',
                    fontSize: '0.8rem',
                    width: '100px',
                    height: '30px',
                  }}
                >
                  View More
                </Button>
                <Typography variant="h6" noWrap style={{ marginRight: '120px' }}>
                  {post.IdeaTitle}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{
                    marginTop: '10px',
                    maxWidth: 'calc(100% - 120px)',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {truncateDescription(post.IdeaDesc)}
                </Typography>
              </Card>
            ))
          )}
        </div>
        {!loading && filteredPosts.length > 0 && (
          <Pagination
            count={Math.ceil(filteredPosts.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
          />
        )}
      </div>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          This filter has already been selected!
        </Alert>
      </Snackbar>
    </div>
  );
};
 
export default PostTable;