const express = require("express");
const router = express.Router();
const multer = require("multer");
const { s3, bucketName } = require("../config/s3");
const PressImages = require("../models/PressImages");
const uuid = require("uuid");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload media to event
router.post("/upload/:press_id", upload.single("file"), async (req, res) => {
  try {
    const { press_id } = req.params;
    const { originalname, mimetype, buffer } = req.file;
    const uniqueFileName = `${uuid.v4()}_${originalname}`;
    const s3Key = `press/${press_id}/${uniqueFileName}`;

    await s3
      .upload({
        Bucket: bucketName,
        Key: s3Key,
        Body: buffer,
        ContentType: mimetype,
        ACL: "public-read",
      })
      .promise();

    const newMedia = {
      type: mimetype.startsWith("image") ? "image" : "file",
      url: s3Key, // only storing relative path
      press_id,
    };

    const [id] = await PressImages.create(newMedia);
    res.json({ message: "Uploaded", id, ...newMedia });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Get all media
router.get("/all", async (req, res) => {
  try {
    const media = await PressImages.getAll();
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// Get media for a specific event
router.get("/press/:press_id", async (req, res) => {
  try {
    const media = await PressImages.getByPressId(req.params.press_id);
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// Delete media
// Delete media
router.delete("/:media_id", async (req, res) => {
  try {
    const media = await PressImages.getById(req.params.media_id);
    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    await s3
      .deleteObject({
        Bucket: bucketName,
        Key: media.url, // fix here
      })
      .promise();

    await PressImages.delete(req.params.media_id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete media" });
  }
});

module.exports = router;
