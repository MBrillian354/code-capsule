"use client";

import React from "react";
import {
    Stack,
    TextField,
    InputAdornment,
    Button,
    Typography,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import { useActionState } from "react";
import { createCapsule } from "../../dashboard/actions";

export default function CreateCapsuleForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        createCapsule,
        undefined
    );

    return (
        <>
            <Stack
                component="form"
                action={formAction}
                direction="row"
                spacing={1}
            >
                <TextField
                    name="url"
                    fullWidth
                    variant="outlined"
                    sx={{ backgroundColor: "white", flex: 1 }}
                    placeholder="Enter URL to convert into a capsule..."
                    disabled={isPending}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CodeIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <Button
                    variant="contained"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? "Creating..." : "Create"}
                </Button>
            </Stack>
            {errorMessage && (
                <Typography
                    variant="body2"
                    color="error"
                    sx={{ mt: 1 }}
                >
                    {errorMessage}
                </Typography>
            )}
        </>
    );
}
