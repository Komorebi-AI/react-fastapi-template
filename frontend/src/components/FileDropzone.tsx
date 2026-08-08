import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useDropzone } from 'react-dropzone'

interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void
  files: File[]
}

export default function FileDropzone({ onFilesAccepted, files }: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: onFilesAccepted,
  })

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'transparent',
        }}
      >
        <input {...getInputProps()} />
        <Typography color="text.secondary">
          Drag and drop some files here, or click to select files
        </Typography>
      </Box>
      {files.length > 0 && (
        <List dense>
          {files.map((file) => (
            <ListItem key={file.name} disableGutters>
              <ListItemText primary={file.name} secondary={`${file.size} bytes`} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
