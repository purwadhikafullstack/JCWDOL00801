const multer = require("multer");
const fs = require("fs");

module.exports = {
  uploader2: (directory, filePrefix) => {
    // define default directory location
    let defaultDirectory = "./src/public";

    // multer configuration
    const storageUploader = multer.diskStorage({
      destination: (req, file, cb) => {
        // menentukan lokasi penyimpanan
        const pathDirectory = directory ? defaultDirectory + directory : defaultDirectory;

        // melakukan pemeriksaan pathDirectory
        if (fs.existsSync(pathDirectory)) {
          // jika directory ada, maka multer akan menjalankan parameter cb untuk menyimpan data
          console.log(`Directory ${pathDirectory} exist`);
          cb(null, pathDirectory);
        } else {
          // jika directory tidak ada
          fs.mkdir(pathDirectory, { recursive: true }, (err) => {
            if (err) {
              console.log(`Error making directory`, err);
            }
            cb(err, pathDirectory);
          });
        }
      },
      filename: (req, file, cb) => {
        // membaca extention
        let ext = file.originalname.split(".");
        console.log(ext);
        let newName = filePrefix + Date.now() + "." + ext[ext.length - 1];
        console.log("New Filename", newName);
        cb(null, newName);
      },
    });

    return multer({
      storage: storageUploader,
      fileFilter: (req, file, cb) => {
        const extFilter = /\.(jpg|jpeg|png|webp)/;
        let check = file.originalname.toLocaleLowerCase().match(extFilter);
        if (check) {
          cb(null, true);
        } else {
          cb(new Error(`Your file ext is denied`, false));
        }
      },
    });
  },
};
