import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { api } from '../api/client'
import FileDropzone from '../components/FileDropzone'

interface HealthResponse {
  status: string
}

interface UploadResponse {
  message: string
}

// Example page showing the patterns this template is built around:
// - reading from the backend with useQuery (health check)
// - writing to the backend with useMutation (file upload)
export default function HomePage() {
  const [files, setFiles] = useState<File[]>([])

  const health = useQuery({
    queryKey: ['health'],
    queryFn: () => api<HealthResponse>('/health'),
    retry: false,
  })

  const upload = useMutation({
    mutationFn: (filesToUpload: File[]) => {
      const formData = new FormData()
      for (const file of filesToUpload) {
        formData.append('files', file)
      }
      return api<UploadResponse>('/upload', { method: 'POST', body: formData })
    },
    onSuccess: () => setFiles([]),
  })

  return (
    <Stack spacing={4}>
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <Typography component="h1" variant="h3" align="center">
          React Template
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          A starting point for React frontends backed by a Python API. This page demonstrates
          querying the backend and uploading files — replace it with your app.
        </Typography>
        <Chip
          label={
            health.isPending
              ? 'Checking backend…'
              : health.isSuccess
                ? 'Backend online'
                : 'Backend offline'
          }
          color={health.isPending ? 'default' : health.isSuccess ? 'success' : 'error'}
          variant="outlined"
        />
      </Stack>

      <FileDropzone
        files={files}
        onFilesAccepted={(accepted) => setFiles([...files, ...accepted])}
      />

      <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          disabled={files.length === 0 || upload.isPending}
          onClick={() => upload.mutate(files)}
        >
          {upload.isPending ? 'Uploading…' : 'Upload'}
        </Button>
        <Button variant="outlined" disabled={files.length === 0} onClick={() => setFiles([])}>
          Clear
        </Button>
      </Stack>

      {upload.isSuccess && <Alert severity="success">{upload.data.message}</Alert>}
      {upload.isError && <Alert severity="error">Upload failed: {upload.error.message}</Alert>}
    </Stack>
  )
}
