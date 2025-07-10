import multer from "multer";
import path from 'path';

function uploadUserImageProfile(uniqueName) {
    const storage = multer.diskStorage({
        destination: process.env.UPLOADS_PATH,
        filename: function (req, file, cb) {
            const fileName = uniqueName + path.extname(file.originalname);
            cb(null, fileName);
        }
    });

    return multer({ storage });

}

export default uploadUserImageProfile;