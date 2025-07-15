import fs from 'fs/promises';
import path from 'path';

async function deleteUserOldProfileImage(oldImagePath) {
    const fullPath = path.join(process.cwd(), 'public', oldImagePath);

    try {
        await fs.unlink(fullPath);
    } catch (error) {
        console.log('Error deleting old user profile picture: ', error);
    }

}

export default deleteUserOldProfileImage;