const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Use a single destination path for all files
    const destinationPath = path.resolve(__dirname, "../uploads");
    callback(null, destinationPath);
  },
  filename: (req, file, callback) => {
    // Save the original name and file type in the file object
    file.originalname = file.originalname;
    file.fileType = file.mimetype;

    // Create a unique file name for storage
    const fileName = `${Date.now()}_${file.originalname}`;
    callback(null, fileName);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
