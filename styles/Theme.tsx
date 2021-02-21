import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import teal from '@material-ui/core/colors/teal';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: red[50],
      main: red[100],
      dark: red[150],
      contrastText: '#000',
    },
    secondary: {
      light: teal[50],
      main: teal[100],
      dark: teal[200],
      contrastText: '#000',
    },
  },
});

function Theme({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default Theme;
