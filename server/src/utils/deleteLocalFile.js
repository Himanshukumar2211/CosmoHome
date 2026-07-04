import fs from 'fs/promises';

export const deleteLocalFile = async (filePath) => {
  if (filePath) {
    await fs.rm(filePath, { force: true });
  }
};
