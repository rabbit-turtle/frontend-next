import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import teal from '@material-ui/core/colors/teal';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: red[50],
      main: red[100],
      dark: red[200],
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

export default theme;
