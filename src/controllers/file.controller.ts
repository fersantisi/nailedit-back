import { Response, Request } from 'express';
import { deleteFile, getFileById, getProjectFiles, saveFile } from '../services/file.service';
import path from 'path';
import fs from 'fs';

export const uploadFile = async (
  req: Request & { file?: Express.Multer.File },
  res: Response
): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded.' });
    return;
  }

  const projectId = Number(req.params.projectId);
  if (isNaN(projectId)) {
    res.status(400).json({ message: 'Invalid project ID' });
    return;
  }

  const filePath = `/uploads/projects/${projectId}/${req.file.filename}`;

  const savedFile = await saveFile({
    projectId,
    filename: req.file.filename,
    path: filePath,
    type: req.file.mimetype,
  });

  res.status(200).json({
    message: 'File uploaded successfully',
    file: {
      id: savedFile.id,
      filename: savedFile.filename,
      path: savedFile.path,
      type: savedFile.type,
    },
  });
};

export const getFilesForProject = async (req: Request, res: Response): Promise<void> => {
  const projectId = Number(req.params.projectId);
  if (isNaN(projectId)) {
    res.status(400).json({ message: 'Invalid project ID' });
    return;
  }

  const files = await getProjectFiles(projectId);
  res.status(200).json(files);
};

export const removeFile = async (req: Request, res: Response): Promise<void> => {
  const fileId = Number(req.params.fileId);
  if (isNaN(fileId)) {
    res.status(400).json({ message: 'Invalid file ID' });
    return;
  }

  try {
    await deleteFile(fileId);
    res.status(200).json({
      message: 'File deleted successfully',
    });
  } catch (error) {
    res.status(404).json({ error });
  }
};

export const getFile = async (req: Request, res: Response): Promise<void> => {
  const fileId = Number(req.params.fileId);
  if (isNaN(fileId)) {
    res.status(400).json({ message: 'Invalid file ID' });
    return;
  }

  try {
    const file = await getFileById(fileId);
    
    // Build the full file path (remove leading slash if present)
    const fullPath = path.join(process.cwd(), file.path.startsWith('/') ? file.path.slice(1) : file.path);
    
    // Check if file exists on filesystem
    if (!fs.existsSync(fullPath)) {
      res.status(404).json({ message: 'File not found on filesystem' });
      return;
    }
    
    // Set proper headers for file download
    res.setHeader('Content-Type', file.type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error streaming file' });
      }
    });
    
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};


