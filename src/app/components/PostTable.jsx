import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  Typography,
  TextField,
  MenuItem,
  Chip,
  Snackbar,
  IconButton,
  Button,
  Pagination,
  Menu,
  Box,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import FilterListIcon from '@mui/icons-material/FilterList';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DomainIcon from '@mui/icons-material/Domain';
import AddPostDialog from './AddPostDialog';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { useLocale } from '../LocaleProvider';

 
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
  const [anchorEl, setAnchorEl] = useState(null);

  const { locale } = useLocale();
  const translations = require(`../../locales/${locale}.json`);
 
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
 
  const handleFilterTypeClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleFilterTypeSelect = (value) => {
    if (value && !filters.some((filter) => filter.type === value)) {
      setFilters([...filters, { type: value, value: '' }]);
    } else if (filters.some((filter) => filter.type === value)) {
      setOpenSnackbar(true);
    }
    setAnchorEl(null);
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
 
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
 
  useEffect(() => {
    const applyFilters = () => {
      let filtered = posts;
      console.log('Applying Filters:', filters);
      filters.forEach((filter) => {
        if (filter.type === 'status' && filter.value) {
          filtered = filtered.filter((post) => post.IdeaStatus === filter.value);
          console.log('After status filter:', filtered);
        }
        if (filter.type === 'dateModified' && filter.value) {
          filtered = filtered.filter((post) => {
            if (!post.createdAt) return false;
            const postDate = new Date(post.createdAt);
            const filterDate = new Date(filter.value);
            return postDate >= filterDate && !isNaN(postDate) && !isNaN(filterDate);
          });
          console.log('After dateModified filter:', filtered);
        }
        if (filter.type === 'domain' && filter.value) {
          filtered = filtered.filter((post) => post.IdeaImpact === filter.value);
          console.log('After domain filter:', filtered);
        }
      });
      console.log('Final Filtered Posts:', filtered);
      setFilteredPosts(filtered);
      setPage(1);
    };
    applyFilters();
  }, [filters, posts]);
 
  const truncateDescription = (desc) => {
    if (typeof desc !== 'string') return '';
    if (desc.length <= 100) return desc;
 
    const words = desc.split(' ');
    let result = '';
    let currentLength = 0;
 
    for (const word of words) {
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
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={handleFilterTypeClick}
            sx={{
              backgroundColor: '#005C7A',
              color: 'white',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#007A9C',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              },
              '&:focus': {
                outline: '2px solid #004A62',
                outlineOffset: '2px',
              },
            }}
          >
            {translations?.AddFilter||'Add Filter'}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                mt: 1,
              },
            }}
          >
            <MenuItem
              onClick={() => handleFilterTypeSelect('status')}
              sx={{
                fontSize: '14px',
                color: '#333',
                padding: '10px 20px',
                '&:hover': {
                  backgroundColor: '#E6F5FA',
                },
              }}
            >
              <PendingIcon sx={{ mr: 1, color: '#005C7A' }} /> Status
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterTypeSelect('dateModified')}
              sx={{
                fontSize: '14px',
                color: '#333',
                padding: '10px 20px',
                '&:hover': {
                  backgroundColor: '#E6F5FA',
                },
              }}
            >
              <DateRangeIcon sx={{ mr: 1, color: '#005C7A' }} /> Date Modified
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterTypeSelect('domain')}
              sx={{
                fontSize: '14px',
                color: '#333',
                padding: '10px 20px',
                '&:hover': {
                  backgroundColor: '#E6F5FA',
                },
              }}
            >
              <DomainIcon sx={{ mr: 1, color: '#005C7A' }} /> Domain
            </MenuItem>
          </Menu>
        </div>
        <Typography variant="h5" component="div" sx={{ margin: '0 10px', color: '#005C7A', fontWeight: 'bold' }}>
          {translations?.Checkoutposts||'CHECK OUT POSTS'}
        </Typography>
        <AddPostDialog />
      </div>
      <div style={{ width: '80%', marginTop: '20px' }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          {filters.map((filter, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {filter.type === 'status' && (
                <TextField
                  select
                  label="Status"
                  value={filter.value}
                  onChange={(event) => handleFilterValueChange(index, event)}
                  sx={{
                    minWidth: '150px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: '14px',
                      '& fieldset': {
                        borderColor: '#005C7A',
                      },
                      '&:hover fieldset': {
                        borderColor: '#007A9C',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#007A9C',
                        boxShadow: '0 0 4px rgba(0, 92, 122, 0.3)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#005C7A',
                      fontSize: '14px',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#007A9C',
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
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
                  sx={{
                    minWidth: '150px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: '14px',
                      '& fieldset': {
                        borderColor: '#005C7A',
                      },
                      '&:hover fieldset': {
                        borderColor: '#007A9C',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#007A9C',
                        boxShadow: '0 0 4px rgba(0, 92, 122, 0.3)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#005C7A',
                      fontSize: '14px',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#007A9C',
                    },
                  }}
                />
              )}
              {filter.type === 'domain' && (
                <TextField
                  select
                  label="Domain"
                  value={filter.value}
                  onChange={(event) => handleFilterValueChange(index, event)}
                  sx={{
                    minWidth: '150px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: '14px',
                      '& fieldset': {
                        borderColor: '#005C7A',
                      },
                      '&:hover fieldset': {
                        borderColor: '#007A9C',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#007A9C',
                        boxShadow: '0 0 4px rgba(0, 92, 122, 0.3)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#005C7A',
                      fontSize: '14px',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#007A9C',
                    },
                  }}
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
                sx={{
                  backgroundColor: '#005C7A',
                  color: 'white',
                  borderRadius: '16px',
                  fontSize: '14px',
                  height: '32px',
                  '& .MuiChip-label': {
                    padding: '0 12px',
                  },
                  '& .MuiChip-deleteIcon': {
                    color: 'white',
                    '&:hover': {
                      color: '#E6F5FA',
                      transform: 'scale(1.2)',
                    },
                  },
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: '#007A9C',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  },
                }}
              />
            </Box>
          ))}
        </Box>
        <div style={{ width: '100%', marginTop: '10px', textAlign: 'center' }}>
          {loading ? (
            <PropagateLoader color="#005C7A" />
          ) : filteredPosts.length === 0 ? (
            <Typography>No posts</Typography>
          ) : (
            filteredPosts.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((post, index) => (
              <Card
                key={index}
                sx={{
                  padding: '20px',
                  marginBottom: '10px',
                  height: '200px',
                  position: 'relative',
                  backgroundColor: '#E6F5FA',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => alert(`Viewing post: ${post.IdeaTitle}`)}
                  style={{
                    position: 'absolute',
                    top: '85px',
                    right: '20px',
                    backgroundColor: '#005C7A',
                    padding: '20px 10px',
                    fontSize: '0.8rem',
                    width: '100px',
                    height: '30px',
                  }}
                >
                  {translations?.ViewMore||'View More'}
                </Button>
                <Typography
                  variant="h6"
                  noWrap
                  style={{
                    marginRight: '120px',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  {post.IdeaTitle}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{
                    marginTop: '10px',
                    maxWidth: 'calc(100% - 120px)',
                    width: '100%',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'left',
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