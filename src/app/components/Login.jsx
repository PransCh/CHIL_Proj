"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { InputAdornment } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateEmail(email);

    if (emailError) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data)
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("User Name", data.user.name);
        localStorage.setItem("User Email", data.user.email);
        localStorage.setItem("User Team", data.user.UserTeam);
        
        router.push("/");
      } else {
        setError(data.message || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again later.");
      console.error(err);
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
      data-testid="login-form-container"
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
          border: "1px solid #ddd",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          Welcome Back!
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
          Login to access your account
        </Typography>
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
          data-testid="email-input"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          data-testid="password-input"
        />
        {error && (
          <Typography color="error" sx={{ mt: 1, fontSize: "0.8em" }} data-testid="error-message">
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, py: 1.5, borderRadius: "10px" }}
          disabled={loading}
          data-testid="login-button"
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "Login"
          )}
        </Button>
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Don't have an account?{" "}
          <Link href="/signup" style={{ textDecoration: "none", color: "#007bff" }}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}