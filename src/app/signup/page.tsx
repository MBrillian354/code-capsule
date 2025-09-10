"use client";

import { Suspense } from "react";
import Link from "next/link";

import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Stack,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { useActionState } from "react";
import { createAccount } from "@/app/signup/actions";

export default function Page() {
    const [errorMessage, formAction, isPending] = useActionState(
        createAccount,
        undefined
    );

    return (
        <Box className="min-h-screen flex items-center justify-center px-2 bg-gray-50">
            <Paper
                elevation={0}
                variant="outlined"
                className="p-8 w-full max-w-md"
            >
                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    className="text-primary"
                >
                    CodeCapsule
                </Typography>
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    align="center"
                    sx={{ fontWeight: "bold", marginBottom: 4 }}
                >
                    Create Account
                </Typography>
                <Suspense fallback={<div>Loading...</div>}>
                    <Stack
                        component="form"
                        action={formAction}
                        className="gap-4"
                    >
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Full Name"
                            type="text"
                            required
                            variant="outlined"
                            disabled={isPending}
                        />
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            required
                            variant="outlined"
                            disabled={isPending}
                        />
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            required
                            variant="outlined"
                            disabled={isPending}
                            helperText="Must be at least 8 characters with uppercase, lowercase, and number"
                        />
                        <TextField
                            fullWidth
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            required
                            variant="outlined"
                            disabled={isPending}
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isPending}
                        >
                            {isPending ? "Creating Account..." : "Create Account"}
                        </Button>
                        {errorMessage && (
                            <div
                                className="flex h-8 items-end space-x-1"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                <ErrorOutlineIcon className="text-red-500" />
                                <p className="text-sm text-red-500">
                                    {errorMessage}
                                </p>
                            </div>
                        )}
                        <Typography variant="body2" align="center" className="mt-4">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Sign in here
                            </Link>
                        </Typography>
                    </Stack>
                </Suspense>
            </Paper>
        </Box>
    );
}
