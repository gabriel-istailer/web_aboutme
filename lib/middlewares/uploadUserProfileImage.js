import path from 'path';
import { writeFile } from 'fs/promises';

async function streamToBuffer(readableStream) {
    const chunks = [];
    for await (const chunk of readableStream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

async function uploadUserProfileImage(file) {

    console.log('ARQUIVO MIDDLEWARE: ', file); // Vem undefined já

    const buffer = await streamToBuffer(file.stream());

    const extension = path.extname(file.name) || '.png';
    const fileName = `${Date.now()}${extension}`;
    const filePath = path.join(process.cwd(), 'public', 'users-profiles', fileName);

    await writeFile(filePath, buffer);

    const imagePath = `/users-profiles/${fileName}`;

    return imagePath;
}

export default uploadUserProfileImage;