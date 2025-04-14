
"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { InputAdornment, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import emailjs from 'emailjs-com';

export default function Register() {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("Bad");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Invalid email address");
        } else {
            setEmailError("");
        }
    };

    const validatePassword = (password) => {
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]/.test(password);

        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            setPasswordStrength("Bad");
        } else if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecialChar) {
            setPasswordError("Add a mix of uppercase, lowercase, numbers, and special characters");
            setPasswordStrength("Good");
        } else if (password.length >= 8 && password.length < 12) {
            setPasswordError("");
            setPasswordStrength("Good");
        } else if (password.length >= 12) {
            setPasswordError("");
            setPasswordStrength("Excellent");
        } else {
            setPasswordError("");
            setPasswordStrength("Bad");
        }
    };



    const sendEmail = (email) => {
        const templateParams = {
            email: email,
            message: 'A new user has registered.'
        };

        emailjs.send('service_xgr2u1k', 'template_j4jvbus', templateParams, 'eSP8rJrLsApARUj7Z')
            .then((response) => {
                console.log('Email sent successfully!', response.status, response.text);
            }, (error) => {
                console.error('Failed to send email:', error);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        validateEmail(email);
        validatePassword(password);

        console.log("Email Error:", emailError);
        console.log("Password Error:", passwordError);

        if (emailError || passwordError) return;

        setLoading(true);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            console.log("API Response:", data); // Debugging line to check the response
            if (data.success) {
                sendEmail(email);
                console.log("Signed up successfully");
                console.log("Navigating to /login");
                router.push("/login"); // Navigate to login page
            } else {
                if (data.error === 'Invalid email') {
                    setEmailError(data.error);
                } else {
                    setError(data.message);
                }
            }
        } catch (error) {
            setError("An error occurred during signup.");
            console.error("Signup Error:", error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "#f5f5f5",
                backgroundImage: "linear-gradient(to bottom, #f7f7f7, #e7e7e7)",
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    backgroundColor: "#fff",
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    width: "100%",
                    maxWidth: "400px",
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
                    Create Your Account
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                    Register to access your account
                </Typography>
                <TextField
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon sx={{ color: "#333" }} />
                            </InputAdornment>
                        ),
                    }}
                    required
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor: "#007bff" },
                        },
                    }}
                />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        validateEmail(e.target.value);
                    }}
                    error={!!emailError}
                    helperText={emailError}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon sx={{ color: "#333" }} />
                            </InputAdornment>
                        ),
                    }}
                    required
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor: "#007bff" },
                        },
                    }}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        validatePassword(e.target.value);
                    }}
                    error={!!passwordError}
                    helperText={passwordError}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon sx={{ color: "#333" }} />
                            </InputAdornment>
                        ),
                    }}
                    required
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor: "#007bff" },
                        },
                    }}
                />
                <Typography variant="body2" sx={{ mt: 1, color: passwordStrength === "Excellent" ? "#0f0" : passwordStrength === "Good" ? "#ff0" : "#f00" }}>
                    Password Strength: {passwordStrength}
                </Typography>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, py: 1.5, borderRadius: "10px", position: 'relative' }}
                >
                    {loading ? (
                        <CircularProgress size={24} sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} />
                    ) : (
                        <span style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.3s' }}>Sign Up</span>
                    )}
                </Button>
                {error && (
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                    Already have an account? <Link href="/login">Login</Link>
                </Typography>
            </Box>
        </Box>
    );
}