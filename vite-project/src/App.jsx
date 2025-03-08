import axios from "axios";
import { useState } from "react";
import SentimentChart from "./SentimentChart";

function App() {
  const [input, setInput] = useState("");
  const [sentimentData, setSentimentData] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input != "") {
      const videoId = input.split("?v=")?.[1];
      if (videoId) {
        try {
          const response = await axios.get(`http://localhost:3000/search/${videoId}`)
          const data = response.data;
          // console.log(data);
          const categoryCounts = { "Agree": 0, "Disagree": 0, "Neutral": 0 };

          data.forEach(item => {
            if (categoryCounts[item] !== undefined) {
              categoryCounts[item]++;
            }
          });
          // console.log(categoryCounts);
          setSentimentData(categoryCounts);
        }
        catch (err) {
          console.log("Error", err);
        }
      }
    }
  }
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6 pt-8">
      <h1 className="text-4xl font-bold text-center mb-6">
        Comment Sentiment Analysis
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">
          Enter YouTube Video URL
        </h2>
        <input
          type="text"
          onChange={e => { setInput(e.target.value) }}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button type="submit" className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition">
          Analyze Comments
        </button>
      </form>
      {sentimentData && <SentimentChart sentimentData={sentimentData} />}
    </div>
  );
}

export default App;
