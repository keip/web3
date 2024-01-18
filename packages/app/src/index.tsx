import { createRoot } from "react-dom/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Nav from "./components/Nav.tsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import reducers from "./reducers/index.ts";
import Detail from "./components/Detail.tsx";
import Box from "@mui/material/Box";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const store = configureStore({
  reducer: reducers,
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid
              item
              width={280}
              sx={{
                background: "#000",
              }}
            >
              <Box mr={3}>
                <Nav />
              </Box>
            </Grid>
            <Grid item flex={1}>
              <Detail />
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(<App />);
