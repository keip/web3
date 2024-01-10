import { createRoot } from 'react-dom/client'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Nav from './components/Nav.tsx'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item width={280} sx={{
            background: '#000',
            height: '100vh'
          }}>
            <Nav />
          </Grid>
          <Grid item flex={1}>
            Content
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)
root.render(<App />)
