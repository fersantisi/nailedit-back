import File from '../database/models/File';
import fs from 'fs';
import path from 'path';

// Save a new file (already done)
export const saveFile = async ({
  projectId,
  filename,
  path,
  type,
}: {
  projectId: number;
  filename: string;
  path: string;
  type: string;
}) => {
  try {
    const file = await File.create({
      projectId,
      filename,
      path,
      type,
    });
    return file;
  } catch (error) {
    throw new Error(`Error saving file.`);
  }
};

export const getProjectFiles = async (projectId: number) => {
  try {
    const files = await File.findAll({ where: { projectId } });
    return files;
  } catch (error) {
    throw new Error(`Error fetching files.`);
  }
};

export const deleteFile = async (fileId: number) => {
    try {
        const file = await File.findByPk(fileId);
        if (!file) {
            throw new Error('File not found');
        }

        // Delete physical file from filesystem
        try {
            const fullPath = path.join(process.cwd(), file.path.startsWith('/') ? file.path.slice(1) : file.path);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                console.log(`Deleted physical file: ${fullPath}`);
            }
        } catch (fileError) {
            console.warn(`Failed to delete physical file ${file.path}:`, fileError);
            // Continue with database deletion even if physical file can't be deleted
        }

        // Delete database record
        await file.destroy();
        return { message: 'File deleted successfully' };
    } catch (error) {
        throw new Error(`Error deleting file`);
    }
};

export const getFileById = async (fileId: number) => {
  try {
    const file = await File.findByPk(fileId);
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  } catch (error) {
    throw new Error(`Error retrieving file`);
  }
};
