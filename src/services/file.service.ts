import File from '../database/models/File';

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
        await file.destroy();
        return { message: 'File deleted successfully' };
    } catch (error) {
        throw new Error(`Error deleting file`);
    }
}

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


