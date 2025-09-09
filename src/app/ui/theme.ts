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
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 8,
                },
            },
        },
        MuiPaper: {
            defaultProps: {
                // keep rounded corners for Paper by default
                square: false,
            },
            styleOverrides: {
                // target the `rounded` slot so the override only applies
                // when Paper is meant to be rounded (not globally to every root)
                rounded: {
                    borderRadius: 8,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    // remove default uppercase transform for Button text
                    textTransform: "none",
                },
            },
        },
    },
});

export default theme;
