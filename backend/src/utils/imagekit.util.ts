import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_PX3eDdQWFnIxtXW1UDZog1UnZ8A=',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_AmnbOX3SVy6s0ubqr5yi2zBHmRk=',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/hisaabu',
});

export const uploadImage = async (
  file: Buffer,
  fileName: string,
  folder: string = 'company-logos'
): Promise<{ url: string; fileId: string }> => {
  try {
    const response = await imagekit.upload({
      file: file,
      fileName: fileName,
      folder: `/${folder}/`,
    });

    return {
      url: response.url,
      fileId: response.fileId,
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw error;
  }
};

export const deleteImage = async (fileId: string): Promise<void> => {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error('ImageKit delete error:', error);
    throw error;
  }
};

export default imagekit;
