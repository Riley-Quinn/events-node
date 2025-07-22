const express = require("express");
const router = express.Router();
const Events = require("../models/Events");

// Get all events
router.get("/all", async (req, res) => {
  try {
    const events = await Events.getAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Events.getById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// Create event
router.post("/create", async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body;

    if (!title || !date || !time) {
      return res
        .status(400)
        .json({ error: "Title, date, and time are required" });
    }

    const [id] = await Events.create({
      title,
      description,
      date,
      time,
      location,
    });

    res.json({ message: "Event created", id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

// Update event
router.put("/:id", async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body;

    const event = await Events.getById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    await Events.update(req.params.id, {
      title,
      description,
      date,
      time,
      location,
    });

    res.json({ message: "Event updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete event
router.delete("/:id", async (req, res) => {
  try {
    const event = await Events.getById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    await Events.delete(req.params.id);

    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

module.exports = router;
