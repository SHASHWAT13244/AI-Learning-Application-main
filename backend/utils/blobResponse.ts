import axios from 'axios';

export const getBlobBuffer = async (path: string): Promise<Buffer> => {
  const response = await axios.get(path, {
    responseType: 'arraybuffer',
  });
  return Buffer.from(response.data);
};
