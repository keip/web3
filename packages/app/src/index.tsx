import { createRoot } from 'react-dom/client'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Nav from './components/Nav'

const App = () => {
  return (
    <Container maxWidth={false}>
      <Grid container>
        <Grid item width={200}>
          <Nav />
        </Grid>
        <Grid item flex={1}>
          Content
        </Grid>
      </Grid>
    </Container>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)
root.render(<App />)
