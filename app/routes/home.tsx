import * as React from 'react';
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';

interface FileInfo {
  name: string;
  isDirectory: boolean;
  size: number;
  mtime: string;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function Home() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/files.json')
      .then(response => response.json())
      .then((data: FileInfo[]) => {
        setFiles(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching file list:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resource Repository
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Index of /files
        </Typography>
      </Box>

      <Paper elevation={3}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {files.length === 0 ? (
              <ListItem>
                <ListItemText primary="No files found" />
              </ListItem>
            ) : (
              files.map((file) => (
                <React.Fragment key={file.name}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component="a"
                      href={`/files/${file.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ListItemIcon>
                        {file.isDirectory ? <FolderIcon color="primary" /> : <InsertDriveFileIcon color="action" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={file.name} 
                        secondary={
                          <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', mr: 2 }}>
                            <span>{new Date(file.mtime).toLocaleString()}</span>
                            <span>{file.isDirectory ? '-' : formatBytes(file.size)}</span>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))
            )}
          </List>
        )}
      </Paper>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Powered by React Router & Material UI
        </Typography>
      </Box>
    </Container>
  );
}



