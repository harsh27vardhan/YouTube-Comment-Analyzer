const { default: axios } = require("axios");
const express = require("express");
const keywordExtractor = require("keyword-extractor");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const server = express();
server.use(
  cors({
    origin: true,
    Credential: true,
  })
);

const comments = [
  "This video is amazing! I learned a lot.",
  "I totally disagree. This method is not useful.",
  "It's okay, but not the best tutorial.",
  "This is the worst explanation ever!",
  "Great tutorial! Helped me a lot.",
];

// // Function to classify a comment using Gemini AI
// async function classifyComment(comment) {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

//   const prompt = `Classify the following comment as "Agree", "Disagree", or "Neutral":\n\n"${comment}"\n\nCategory:`;

//   try {
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = await response.text(); // Correct way to get the response text
//     return text.trim();
//   } catch (error) {
//     console.error("Error with Gemini API:", error);
//     return "Unknown";
//   }
// }

// // Function to introduce a delay
// function delay(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// // Function to classify all comments with a delay
// async function processComments() {
//   const results = [];

//   for (const comment of comments) {
//     const category = await classifyComment(comment);
//     results.push({ comment, category });
//     await delay(2000); // Wait for 2 seconds before next request
//   }

//   return results;
// }

async function processComments(comments) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `${comments}\nGiven the following YouTube video comments, classify each as "Agree", "Disagree", or "Neutral" and return the output in an array format. Return the array only, no other texts.`;

    // console.log("Prompt:", prompt);
    // console.log("---------------------------------");
    // console.log("Response:");
    // console.log("---------------------------------");

    const result = await model.generateContent(prompt);
    const response = await result.response.text(); // Correct way to extract text response

    // console.log(response);
    const start = response.indexOf("[");
    const end = response.lastIndexOf("]") + 1;
    const jsonArray = JSON.parse(response.substring(start, end));
    // console.log(jsonArray);

    return jsonArray;
  } catch (error) {
    console.error("Error processing comments:", error);
    return [];
  }
}

// API route to classify comments
server.get("/", async (req, res) => {
  res.send("Welcome to the API");
});

// const comments = [];
server.get("/search/:videoId", async (req, res) => {
  const { videoId } = req.params;
  try {
    const commentResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${process.env.API_KEY}&maxResults=100`
    );

    const comments = [];

    for (const item of commentResponse.data.items) {
      const comment = item.snippet.topLevelComment.snippet.textDisplay;
      comments.push(comment);
    }

    // Ensure all comments are collected before calling processComments
    const results = await processComments(comments);
    res.json(results);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

server.listen(3000, () => {
  console.log("server is started at port 3000");
});
