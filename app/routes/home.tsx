import * as React from 'react';
import { useLoaderData } from 'react-router';
import fs from 'node:fs/promises';
import path from 'node:path';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';

interface FileInfo {
  name: string;
  isDirectory: boolean;
  size: number;
  mtime: string;
}

export async function loader() {
  const resourcesPath = path.join(process.cwd(), 'public', 'resources');
  
  try {
    const files = await fs.readdir(resourcesPath);
    const fileInfos: FileInfo[] = [];

    for (const file of files) {
      const filePath = path.join(resourcesPath, file);
      const stats = await fs.stat(filePath);
      fileInfos.push({
        name: file,
        isDirectory: stats.isDirectory(),
        size: stats.size,
        mtime: stats.mtime.toISOString(),
      });
    }

    return { files: fileInfos };
  } catch (error) {
    console.error("Error reading resources directory:", error);
    return { files: [] };
  }
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
  const { files } = useLoaderData<typeof loader>();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resource Repository
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Index of /resources
        </Typography>
      </Box>

      <Paper elevation={3}>
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
                    href={`/resources/${file.name}`}
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
      </Paper>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Powered by React Router & Material UI
        </Typography>
      </Box>
    </Container>
  );
}

