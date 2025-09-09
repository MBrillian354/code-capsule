"use client";

import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle login logic here
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <Box className="min-h-screen flex items-center justify-center bg-gray-50">
            <Paper elevation={3} className="p-8 w-full max-w-md">
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        variant="outlined"
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
