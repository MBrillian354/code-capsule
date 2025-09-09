"use client";

import { Suspense } from "react";

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
import { useSearchParams } from "next/navigation";
import { authenticate } from "@/lib/actions";

export default function Page() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    );

    return (
        <Box className="min-h-screen flex items-center justify-center bg-gray-50">
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
                    Login
                </Typography>
                <Suspense fallback={<div>Loading...</div>}>
                    <Stack
                        component="form"
                        action={formAction}
                        className="gap-4"
                    >
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            required
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            required
                            variant="outlined"
                        />
                        <input
                            type="hidden"
                            name="redirectTo"
                            value={callbackUrl}
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            aria-disabled={isPending}
                        >
                            Login
                        </Button>
                        <div
                            className="flex h-8 items-end space-x-1"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {errorMessage && (
                                <>
                                    <ErrorOutlineIcon className="text-red-500" />
                                    <p className="text-sm text-red-500">
                                        {errorMessage}
                                    </p>
                                </>
                            )}
                        </div>
                    </Stack>
                </Suspense>
            </Paper>
        </Box>
    );
}
