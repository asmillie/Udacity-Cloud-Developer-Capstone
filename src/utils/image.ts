import Jimp from 'jimp';
import { createLogger } from './logger';

const logger = createLogger('ImageUtils');

export async function resizeImage(buffer: Buffer): Promise<Buffer> {
    return await Jimp.read(buffer)
        .then(image => {
            image.cover(56, 56);
            return image.getBufferAsync(image.getMIME());
        })
        .catch(err => {
            logger.error(`Error reading image buffer: ${err}`);
            throw new Error('Error reading image buffer');
        });
}