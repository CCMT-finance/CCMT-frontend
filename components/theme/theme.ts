import {createTheme} from '@mui/material/styles';
import {red} from '@mui/material/colors';

// Create a theme instance.
export const theme = createTheme({
    palette: {
        primary: {
            main: '#272635',
        },
        secondary: {
            main: '#B1E5F2',
        },
        error: {
            main: "#e8006f",
        },
        background: {
            default: "#E8E9F3",
            paper: "#ffffff"
        }
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    padding: 16,
                    boxShadow: "none"
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    padding: 10,
                    boxShadow: "none",
                    textTransform: "none"
                }
            }
        }
    }
});

export default theme;