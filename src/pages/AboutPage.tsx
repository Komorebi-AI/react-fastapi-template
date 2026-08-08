import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export default function AboutPage() {
  return (
    <Stack spacing={2}>
      <Typography component="h1" variant="h4">
        About
      </Typography>
      <Typography color="text.secondary">
        This page exists to demonstrate client-side routing with React Router. Add your own pages
        under <code>src/pages/</code> and register them in <code>src/App.tsx</code>.
      </Typography>
    </Stack>
  )
}
