import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { getApiInfo, predict } from '../api/backend'

// Example page showing the patterns this template is built around:
// - reading from the backend with useQuery (version/status check)
// - writing to the backend with useMutation (mock prediction)
export default function HomePage() {
  const [input, setInput] = useState('5')

  const apiInfo = useQuery({
    queryKey: ['api-info'],
    queryFn: getApiInfo,
    retry: false,
  })

  const prediction = useMutation({ mutationFn: predict })

  return (
    <Stack spacing={4}>
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <Typography component="h1" variant="h3" align="center">
          React Template
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          A starting point for React frontends backed by a Python API. This page talks to the
          FastAPI example in <code>backend/</code> — replace it with your app.
        </Typography>
        <Chip
          label={
            apiInfo.isPending
              ? 'Checking backend…'
              : apiInfo.isSuccess
                ? `Backend online (${apiInfo.data})`
                : 'Backend offline'
          }
          color={apiInfo.isPending ? 'default' : apiInfo.isSuccess ? 'success' : 'error'}
          variant="outlined"
        />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <TextField
          label="Input"
          type="number"
          size="small"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button
          variant="contained"
          disabled={input === '' || prediction.isPending}
          onClick={() => prediction.mutate(Number(input))}
        >
          {prediction.isPending ? 'Predicting…' : 'Predict'}
        </Button>
      </Stack>

      {prediction.isSuccess && (
        <Alert severity="success">Prediction result: {prediction.data.output}</Alert>
      )}
      {prediction.isError && (
        <Alert severity="error">Prediction failed: {prediction.error.message}</Alert>
      )}
    </Stack>
  )
}
