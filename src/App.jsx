import React, { useState } from "react";

export default function App() {
  const [step, setStep] = useState(1);
  const [isCommitted, setIsCommitted] = useState(null);
  const [yourName, setYourName] = useState("");
  const [crushName, setCrushName] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCommitAnswer = async (answer) => {
    setIsCommitted(answer);

    // If "No", submit only status and skip to result
    if (answer === "No") {
      try {
        await fetch(
          "https://script.google.com/macros/s/AKfycbwqa6xgYzzJ3aUVc5ls0BfFPvdO5acenN7xfNbyOsQw-Y2DWfZvbwU-aIa8C5ARtMtFiA/exec",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: "",
              loverName: "",
              status: "No",
            }),
          }
        );
      } catch (error) {
        console.error("Error saving to Google Sheet:", error);
      }

      // Show "No" result screen immediately
      setMatchResult("No relationship to check 💔");
      setStep(3);
    } else {
      // If Yes, move to name input step
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
      await fetch(
        "https://script.google.com/macros/s/AKfycbwqa6xgYzzJ3aUVc5ls0BfFPvdO5acenN7xfNbyOsQw-Y2DWfZvbwU-aIa8C5ARtMtFiA/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: yourName,
            loverName: crushName,
            status: "Yes",
          }),
        }
      ).then((res)=>{
        console.log(res);
        
      })
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
