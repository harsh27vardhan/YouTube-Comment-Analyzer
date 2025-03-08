import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const SentimentChart = ({ sentimentData, comments }) => {
    // console.log(sentimentData, comments);
    // Prepare Bar Chart data
    const barData = {
        labels: ["Agree", "Neutral", "Disagree"],
        datasets: [
            {
                label: "Comment Sentiment",
                data: [sentimentData.Agree, sentimentData.Neutral, sentimentData.Disagree],
                backgroundColor: ["#4CAF50", "#FFC107", "#F44336"], // Green, Yellow, Red
                borderColor: ["#388E3C", "#FFA000", "#D32F2F"],
                borderWidth: 1,
            },
        ],
    };

    // Prepare Pie Chart data
    const pieData = {
        labels: ["Agree", "Neutral", "Disagree"],
        datasets: [
            {
                data: [sentimentData.Agree, sentimentData.Neutral, sentimentData.Disagree],
                backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
                hoverBackgroundColor: ["#45A049", "#FFCA28", "#E53935"],
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    const [showComments, setShowComments] = useState(false);

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white shadow-2xl rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                Sentiment Analysis Overview
            </h2>

            {/* Sentiment Counts */}
            <div className="flex justify-center space-x-6 mb-6">
                <div className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg shadow">
                    ✅ Agree: <span className="font-bold">{sentimentData.Agree}</span>
                </div>
                <div className="px-4 py-2 bg-yellow-100 text-yellow-700 font-semibold rounded-lg shadow">
                    🤔 Neutral: <span className="font-bold">{sentimentData.Neutral}</span>
                </div>
                <div className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg shadow">
                    ❌ Disagree: <span className="font-bold">{sentimentData.Disagree}</span>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-center text-gray-700 mb-2">Bar Chart</h3>
                    <div className="h-64">
                        <Bar data={barData} options={options} />
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-center text-gray-700 mb-2">Pie Chart</h3>
                    <div className="h-64">
                        <Pie data={pieData} />
                    </div>
                </div>
            </div>

            {showComments === false ? <button className="flex m-auto mt-10 bg-gray-300 p-2 rounded" onClick={() => { setShowComments(true) }}>Show All Comments</button> : (
                <ul className="border border-gray-500 p-4 mt-8">
                    <button className="flex m-auto bg-gray-300 p-2 rounded" onClick={() => { setShowComments(false) }}>Hide Comments</button>
                    {comments.map((comment, index) => <li key={index}>{comment}</li>)}
                </ul>
            )}

        </div>
    );
};

export default SentimentChart;
