import { Response, Request } from 'express';
import { deleteFile, getFileById, getProjectFiles, saveFile } from '../services/file.service';

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
    res.status(200).json(file);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};


