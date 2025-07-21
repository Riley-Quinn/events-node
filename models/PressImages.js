const knex = require("../db");

// Create a new image entry
const createPressImage = async (imageData) => {
  try {
    const [insertedId] = await knex("press_images").insert(imageData);
    return { image_id: insertedId, ...imageData };
  } catch (err) {
    console.error("Error creating press image:", err);
    throw err;
  }
};

// Get images by press_id
const getImagesByPressId = async (pressId) => {
  try {
    return await knex("press_images").where({ press_id: pressId });
  } catch (err) {
    console.error("Error fetching images by press_id:", err);
    throw err;
  }
};

// Get image by image_id
const getImageById = async (imageId) => {
  try {
    return await knex("press_images").where({ image_id: imageId }).first();
  } catch (err) {
    console.error("Error fetching image by ID:", err);
    throw err;
  }
};

// Delete image by ID
const deleteImage = async (imageId) => {
  try {
    return await knex("press_images").where({ image_id: imageId }).del();
  } catch (err) {
    console.error("Error deleting image:", err);
    throw err;
  }
};

module.exports = {
  createPressImage,
  getImagesByPressId,
  getImageById,
  deleteImage,
};
