import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, Outlet } from 'react-router-dom'

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://komorebi.ai/">
        Komorebi AI
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  )
}

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" component="div" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            React Template
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/about">
            About
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 6 }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 4 }}>
        <Copyright />
      </Box>
    </Box>
  )
}
