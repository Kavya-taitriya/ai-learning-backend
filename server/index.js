const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Load Google Gemini API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-study-plan", async (req, res) => {
  try {
    const { subject, weakness } = req.body;
    console.log("Received request:", subject, weakness);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Suggest a detailed study plan for a student struggling with ${weakness} in ${subject}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({ studyPlan: response.text() });
  } catch (error) {
    console.error("Error generating study plan:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
