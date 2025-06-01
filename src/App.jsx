import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [step, setStep] = useState(1);
  const [isCommitted, setIsCommitted] = useState(null);
  const [yourName, setYourName] = useState("");
  const [crushName, setCrushName] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCommitAnswer = async (answer) => {
    setIsCommitted(answer);

    if (answer === "No") {
      try {
        await axios.post(
          "https://love-checker-server.vercel.app/submit",
          {
            name: "",
            loverName: "",
            status: "No",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error saving to Google Sheet:", error);
      }

      setMatchResult("No relationship to check 💔");
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const calculateMatch = async () => {
    if (!yourName || !crushName) return;
    setLoading(true);

    const percentage = Math.floor(60 + Math.random() * 40); // 60-100%
    const result = `${percentage}% Love Match 💖`;
    setMatchResult(result);

    try {
      const res = await axios.post(
        "https://love-checker-server.vercel.app/submit",
        {
          name: yourName,
          loverName: crushName,
          status: "Yes",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
    } catch (error) {
      console.error("Error saving to Google Sheet:", error);
    }

    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-red-200 p-4 text-center font-sans">
      <h1 className="text-4xl font-bold text-pink-700 mb-8">Love Status Checker 💘</h1>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xl text-pink-600">Are you currently committed?</p>
          <div className="flex space-x-4 justify-center">
            <button
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow-md"
              onClick={() => handleCommitAnswer("Yes")}
            >
              Yes ❤️
            </button>
            <button
              className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-full shadow-md"
              onClick={() => handleCommitAnswer("No")}
            >
              No 😶
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 w-full max-w-md">
          <p className="text-xl text-pink-600">Enter your name and your crush's name</p>
          <input
            className="w-full p-3 rounded-xl border-2 border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-400 bg-white/80 backdrop-blur-sm text-pink-800 placeholder-pink-400 text-lg"
            placeholder="Your Name"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl border-2 border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-400 bg-white/80 backdrop-blur-sm text-pink-800 placeholder-pink-400 text-lg"
            placeholder="Your Lover Name"
            value={crushName}
            onChange={(e) => setCrushName(e.target.value)}
          />

          <button
            className="w-full bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white py-2 rounded-full shadow-lg disabled:opacity-50"
            onClick={calculateMatch}
            disabled={loading}
          >
            {loading ? "Calculating..." : "See Love Match 💕"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full mt-4">
          <p className="text-pink-700 text-xl mb-2 font-semibold">
            {yourName && crushName ? `${yourName} ❤️ ${crushName}` : "Not Committed"}
          </p>
          <p className="text-3xl font-bold text-red-500">{matchResult}</p>
          <button
            onClick={() => {
              setStep(1);
              setIsCommitted(null);
              setYourName("");
              setCrushName("");
              setMatchResult(null);
            }}
            className="mt-6 text-sm text-pink-500 hover:underline"
          >
            Try Again 🔁
          </button>
        </div>
      )}
    </div>
  );
}
