const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uploadImage = async (req, res) => {
  if (req.files.file.mimetype.split("/")[0] === "image") {
    const result = await cloudinary.uploader.upload(req.files.file.tempFilePath, {
      public_id: req.files.file.name,
      folder: "grasp-uploads",
    });
    fs.unlinkSync(req.files.file.tempFilePath);
    res.status(StatusCodes.OK).json({ file: { src: result.secure_url } });
  } else if (req.files.file.mimetype.split("/")[0] === "video") {
    const result = await cloudinary.uploader.upload(req.files.file.tempFilePath, {
      chunk_size: 6000000,
      resource_type: "video",
      public_id: req.files.file.name,
      folder: "grasp-uploads",
    });
    fs.unlinkSync(req.files.file.tempFilePath);
    res.status(StatusCodes.OK).json({ file: { src: result.secure_url } });
  } else {
    const result = await cloudinary.uploader.upload(req.files.file.tempFilePath, {
      pages: true,
      public_id: req.files.file.name,
      folder: "grasp-uploads",
    });
    fs.unlinkSync(req.files.file.tempFilePath);
    res.status(StatusCodes.OK).json({ file: { src: result.secure_url } });
  }
};

const deleteFile = async (req, res) => {
  const { public_id, resource_type } = req.body;

  const data = await cloudinary.uploader.destroy(`grasp-uploads/${public_id}`, {
    resource_type: "image",
  });
  if (!data) {
    throw new BadRequestError(`Error in deleting file`);
  }
  res.status(StatusCodes.OK).json(data);
};

module.exports = { uploadImage, deleteFile };
