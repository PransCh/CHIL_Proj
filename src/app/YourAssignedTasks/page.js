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
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import { Toaster, toast } from "react-hot-toast";
import { useLocale } from '../LocaleProvider';


const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
    backgroundColor: '#E6F5FA', // #F5F5F5 in light
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
    backgroundColor: '#005C7A',
    color: "#fff",
    textTransform: "none",
    padding: theme.spacing(1, 3),
    "&:hover": {
        backgroundColor: theme.palette.primary.darkblue, // #E6F5FA
    },
}));

const PaginationButton = styled(Button)(({ theme, active }) => ({
    backgroundColor: active ? theme.palette.primary.main : "transparent",
    color: active ? "#fff" : theme.palette.text.primary,
    minWidth: "36px",
    height: "36px",
    borderRadius: "50%",
    margin: theme.spacing(0, 0.5),
    padding: 0,
    border: `1px solid ${theme.palette.primary.main}`,
    "&:hover": {
        backgroundColor: theme.palette.primary.light, // #E6F5FA
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
    },
    "&:disabled": {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
    },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
        [theme.breakpoints.up("xs")]: { minWidth: "90%" },
        [theme.breakpoints.up("sm")]: { minWidth: "400px" },
        maxWidth: "600px",
    },
    "& .MuiBackdrop-root": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: "bold",
    fontSize: "1.5rem",
    paddingBottom: theme.spacing(1),
}));

const StyledDialogButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    textTransform: "none",
    padding: theme.spacing(1, 3),
    "&:hover": {
        backgroundColor: theme.palette.primary.darkblue, // #E6F5FA
    },
}));

const DataPage = () => {
    const [dataItems, setDataItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [notes, setNotes] = useState("");
    const itemsPerPage = 5;
    const { locale } = useLocale();
    const translations = require(`../../locales/${locale}.json`);

    const user = {
        id: 2,
        name: "Chitimella Praneeth",
        role: "Admin",
        email: "chitimellapraneeth@gmail.com",
        avatar: "user.png",
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/yourAssignedTasks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id }),
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setDataItems(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                toast.error("Failed to load tasks");
            }
        };
        fetchData();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(dataItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = dataItems.slice(startIndex, endIndex);

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

    const handleLogDetails = (item) => {
        setSelectedItem(item);
        setNotes("");
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedItem(null);
        setNotes("");
    };

    const handleSubmitNotes = async () => {
        if (!selectedItem) return;
        if (!notes.trim()) {
            toast.error("Notes cannot be empty");
            return;
        }
        try {
            const response = await fetch("/api/postlog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedItem.Id, notes: notes, userId: user.id }),
            });
            if (!response.ok) {
                throw new Error("Failed to post data");
            }
            toast.success("Submitted successfully!");
            handleCloseModal();
        } catch (err) {
            toast.error("Failed to submit notes");
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date)
            ? date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "Invalid Date";
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
        <div>
            <Box
                sx={{
                    width: "100%",
                    p: { xs: 2, md: 4 },
                }}
            >
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            backgroundColor: "#E6F5FA",
                            color: "#005C7A",
                            border: "1px solid #005C7A",
                        },
                    }}
                />
                <Typography
                    variant="h4"
                    sx={{
                        color: (theme) => '#005C7A',
                        mb: 3,
                        fontWeight: "bold",
                        textAlign: "left",
                    }}
                >
                    {translations?.yourassignedtasks||'YOUR ASSIGNED TASKS'}
                </Typography>

                {dataItems.length === 0 ? (
                    <Typography sx={{ textAlign: "left" }}>{translations?.nodataavailable||'No data available'}.</Typography>
                ) : (
                    <>
                        {currentItems.map((item, key) => (
                            <StyledCard key={item.id}>
                                <CardContent sx={{ flex: 1, pr: 2 }}>
                                    <Typography variant="h5" sx={{ fontWeight: "medium", mb: 2 }}>
                                        {item.IdeaTitle || "Untitled"}
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography
                                            variant="body1"
                                            color="text.primary"
                                            sx={{ fontWeight: "regular" }}
                                        >
                                            {item.IdeaDesc || "No description"}
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
                                            <strong>{translations?.impact||'Impact'}:</strong> {item.IdeaImpact || "N/A"}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>{translations?.createdby||'Created'}:</strong> {formatDate(item.CreatedAt)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>By:</strong>{" "}
                                            {item.createdUserName || "Unknown"} (
                                            {item.createdUserEmail || "N/A"})
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <Box sx={{ pr: 2, display: "flex", alignItems: "center" }}>
                                    <StyledButton onClick={() => handleLogDetails(item)}>
                                        {translations?.logdetails||'Log Details'}
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
                                >
                                    {translations?.previous||'Previous'}
                                </NavigationButton>
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                    (page, key) => (
                                        <PaginationButton
                                            key={page}
                                            active={page === currentPage}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </PaginationButton>
                                    )
                                )}
                                <NavigationButton
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    {translations?.next||'Next'}
                                </NavigationButton>
                            </Box>
                        )}
                    </>
                )}

                <StyledDialog open={openModal} onClose={handleCloseModal}>
                    <StyledDialogTitle>
                        {selectedItem
                            ? `Log Details for ${selectedItem.IdeaTitle || "Untitled"}`
                            : "Log Details"}
                    </StyledDialogTitle>
                    <DialogContent>
                        <TextField
                            label="Notes"
                            multiline
                            rows={4}
                            fullWidth
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            variant="outlined"
                            sx={{ mt: 1 }}
                            placeholder="Enter your notes here..."
                        />
                    </DialogContent>
                    <DialogActions>
                        <StyledDialogButton onClick={handleCloseModal}>
                            {translations?.cancel||'Cancel'}
                        </StyledDialogButton>
                        <StyledDialogButton onClick={handleSubmitNotes}>
                           {translations?.submit||'Submit'}
                        </StyledDialogButton>
                    </DialogActions>
                </StyledDialog>
            </Box>
        </div>
    );
};

export default DataPage;