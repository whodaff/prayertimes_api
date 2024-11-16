// File: backend/server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint untuk mendapatkan jadwal sholat berdasarkan kota atau koordinat
app.get("/api/prayer-times", async (req, res) => {
  const { city, country, latitude, longitude } = req.query;

  if (latitude && longitude) {
    // Menggunakan koordinat lokasi
    try {
      const response = await axios.get("http://api.aladhan.com/v1/timings", {
        params: {
          latitude,
          longitude,
          method: 2, // Metode perhitungan
        },
      });
      return res.json(response.data);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching prayer times by location", error: error.message });
    }
  } else if (city && country) {
    // Menggunakan nama kota dan negara
    try {
      const response = await axios.get("http://api.aladhan.com/v1/timingsByCity", {
        params: {
          city,
          country,
          method: 2, // Metode perhitungan
        },
      });
      return res.json(response.data);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching prayer times by city", error: error.message });
    }
  } else {
    return res.status(400).json({ message: "City, Country or Coordinates are required" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
