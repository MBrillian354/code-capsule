"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    cssVariables: true,
    typography: {
        fontFamily: "var(--font-roboto)",
    },
    // set a global shape value
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    // enforce the border radius for Paper components
                    borderRadius: '24px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    // remove default uppercase transform for Button text
                    textTransform: 'none',
                },
            },
        },
    },
});

export default theme;
