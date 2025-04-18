"use client";
 
import React, { useState, useEffect } from "react";
import { PropagateLoader } from "react-spinners";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  styled,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
 
import { useRouter } from "next/navigation";
import { useLocale } from '../LocaleProvider';

 
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.light,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
        transform: 'scale(1.05)',
    },
 
}));
 
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  textTransform: "none",
  padding: theme.spacing(1, 3),
  "&:hover": {
    backgroundColor: theme.palette.primary.darkblue, // #E6F5FA
    color: theme.palette.text.primary,
  },
}));
 
const PaginationButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : "transparent",
  color: active ? "#fff" : theme.palette.text.primary,
  minWidth: "36px",
  height: "36px",
  borderRadius: "50%",
  margin: theme.spacing(0, 0.5),
  padding: 0,
  border: `1px solid ${theme.palette.primary.main}`,
  "&:hover": {
    backgroundColor: theme.palette.primary.darkblue, // #E6F5FA
    color: theme.palette.text.primary,
  },
}));
 
const NavigationButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  textTransform: "none",
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0, 1),
  "&:hover": {
    backgroundColor: theme.palette.primary.darkblue, // #E6F5FA
    color: theme.palette.text.primary,
  },
  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));
 
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: "#FFFFFF",
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(4),
    minWidth: { xs: "90%", sm: "400px" },
    maxWidth: "600px",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[5],
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
}));
 
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const itemsPerPage = 5;
  const router=useRouter();
  const { locale, setLocale } = useLocale();
  const translations = require(`../../locales/${locale}.json`);
 
  const user = {
    id: 2,
    name: "Chitimella Praneeth",
    role: "Admin",
    email: "chitimellapraneeth@gmail.com",
    avatar: "user.png",
  };
 
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);
 
  // Pagination logic
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);
 
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
 
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
 
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
 
  const handleViewMore = (notification) => {
    setSelectedNotification(notification);
    setOpenModal(true);
  };
 
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedNotification(null);
  };
 
  const handleGoToDiscussion = () => {
    // Add navigation logic here, e.g., router.push(`/discussion/${selectedNotification?.id}`)
    router.push('/discussion')
  };
 
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
 
  if (loading) {
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 64px)",
       
          }}>
            <PropagateLoader color="#005C7A" />
          </Box>
    );
  }
 
  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }
 
  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 2, md: 4 },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: (theme) => theme.palette.primary.main,
          mb: 3,
          fontWeight: "bold",
          textAlign: "left",
        }}
      >
        {translations?.yournotifications||'YOUR NOTIFICATIONS'}
      </Typography>
 
      {notifications.length === 0 ? (
        <Typography sx={{ textAlign: "left" }}>
          {translations?.nonotificationsavailable||'NO NOTIFICATIONS AVAILABLE'}
        </Typography>
      ) : (
        <>
          {currentNotifications.map((notification,key) => (
            <StyledCard key={notification.id}>
              <CardContent sx={{ flex: 1, pr: 2 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "medium", mb: 2 }}
                >
                  {notification.IdeaTitle}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ fontWeight: "regular" }}
                  >
                    {notification.IdeaDesc}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    <strong>{translations?.impact||'Impact'}</strong> {notification.IdeaImpact}
                  </Typography>
                </Box>
              </CardContent>
              <Box sx={{ pr: 2, display: "flex", alignItems: "center" }}>
                <StyledButton
                  onClick={() => handleViewMore(notification)}
                  aria-label="View more details"
                >
                  {translations?.ViewMore||'View More'}
                </StyledButton>
              </Box>
            </StyledCard>
          ))}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 4,
              }}
            >
              <NavigationButton
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                {translations?.previous||'Previous'}
              </NavigationButton>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <PaginationButton
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                    aria-label={`Page ${page}`}
                  >
                    {page}
                  </PaginationButton>
                )
              )}
              <NavigationButton
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                {translations?.next||'Next'}
              </NavigationButton>
            </Box>
          )}
        </>
      )}
 
      {/* Modal for View More */}
      <StyledDialog open={openModal} onClose={handleCloseModal}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: (theme) => theme.palette.primary.main,
            mb: 3,
            px: 0,
          }}
        >
          {selectedNotification
            ? `Details for ${selectedNotification.IdeaTitle}`
            : "Notification Details"}
        </Typography>
        <DialogContent sx={{ px: 0, py: 0 }}>
          {selectedNotification && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* <Typography
                variant="h6"
                sx={{ fontWeight: "medium" }}
              >
                {selectedNotification.IdeaTitle}
              </Typography> */}
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ lineHeight: 1.6 }}
              >
                {selectedNotification.IdeaDesc}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
              >
                <strong>{translations?.answer||'Answer'}</strong>{" "}
                {selectedNotification.IdeaAnswer || "No reply yet"}
              </Typography>
               <Typography
                variant="body1"
                color="text.secondary"
              >
                <strong>{translations?.reasonbehindpostingthisidea||'Reason Behind Posting The Idea'}:</strong>{" "}
                {selectedNotification.IdeaReason}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
              >
                <strong>{translations?.impact||'Impact'}:</strong> {selectedNotification.IdeaImpact}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
              >
                <strong>{translations?.status||'Status'}</strong> {selectedNotification.IdeaStatus}
              </Typography>
             
              <Typography
                variant="body1"
                color="text.secondary"
              >
                <strong>{translations?.postedby||'Posted By'}</strong> {selectedNotification.createdUserName}
                {/* {selectedNotification.createdUserEmail
                  ? ` (${selectedNotification.createdUserEmail})`
                  : ""} */}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ gap: 1, px: 0, pt: 3 }}>
          <StyledButton
            onClick={handleCloseModal}
            aria-label="Close dialog"
          >
            {translations?.close||'Close'}
          </StyledButton>
          <StyledButton
            onClick={handleGoToDiscussion}
            aria-label="Go to discussion page"
          >
            {translations?.gotodiscussions||'Go to Discussion'}
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};
 
export default NotificationsPage;