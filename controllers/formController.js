import { prisma } from "../lib/prisma.js";
import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  destination: "../public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25000000 },
});

const uploadFilePost = [
  upload.array("files", 10),
  async (req, res) => {
    const uploadedFile = req.files;

    console.log(uploadedFile);

    res.redirect("/dashboard");
  },
];

const createFolderPost = async (req, res) => {
  const user = req.user;
  const { folder } = req.body;
  const { folderId } = req.params;

  if (folderId) {
    await prisma.folder.update({
      where: {
        authorId: user.id,
        id: folderId,
      },
      data: {
        folders: {
          create: {
            name: folder,
          },
        },
      },
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      folders: {
        create: {
          name: folder,
        },
      },
    },
  });

  res.redirect("/dashboard");
};

export { uploadFilePost, createFolderPost };
