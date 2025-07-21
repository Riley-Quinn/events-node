const express = require("express");
const router = express.Router();
const multer = require("multer");
const { s3, bucketName } = require("../config/s3");
const PressImage = require("../models/PressImage");

const upload = multer({ storage: multer.memoryStorage() });

// Upload Image to S3 and save in DB
router.post("/upload/:press_id", upload.single("image"), async (req, res) => {
  try {
    const { press_id } = req.params;
    const file = req.file;
    const uuid = Date.now();
    const filePath = `press/${uuid}-${file.originalname}`;

    const params = {
      Bucket: bucketName,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    const uploadResult = await s3.upload(params).promise();

    const imageData = {
      press_id,
      file_name: file.originalname,
      file_url: uploadResult.Location,
      file_path: filePath,
    };

    const image = await PressImage.createPressImage(imageData);

    res.json({ message: "Image uploaded", image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

// Get Images by Press ID
router.get("/:press_id", async (req, res) => {
  try {
    const images = await PressImage.getImagesByPressId(req.params.press_id);
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Delete Image by ID
router.delete("/:image_id", async (req, res) => {
  try {
    const image = await PressImage.getImageById(req.params.image_id);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    await s3
      .deleteObject({ Bucket: bucketName, Key: image.file_path })
      .promise();

    await PressImage.deleteImage(req.params.image_id);

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
