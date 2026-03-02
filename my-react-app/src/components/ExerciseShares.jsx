import React, { useState } from "react";
import "./ExerciseShares.css";

const ExerciseShares = () => {

  // EXISTING VALUES
  const availableSharesInitial = 2500;
  const exercisePrice = 5;

  // NEW: Market price simulation
  const marketPrice = 18;

  // STATES
  const [availableShares, setAvailableShares] = useState(availableSharesInitial);
  const [sharesToExercise, setSharesToExercise] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState([]);

  // CALCULATIONS
  const totalCost = sharesToExercise * exercisePrice;
  const marketValue = sharesToExercise * marketPrice;
  const profit = marketValue - totalCost;

  // Tax estimation (example 20%)
  const tax = profit > 0 ? profit * 0.2 : 0;
  const netProfit = profit - tax;

  // Exercise handler
  const handleExercise = () => {

    if (sharesToExercise <= 0) {
      alert("Enter valid number of shares");
      return;
    }

    if (sharesToExercise > availableShares) {
      alert("Not enough available shares");
      return;
    }

    setShowConfirm(true);
  };

  // Confirm exercise
  const confirmExercise = () => {

    const newAvailable = availableShares - sharesToExercise;

    setAvailableShares(newAvailable);

    // Add to history
    const newTransaction = {
      date: new Date().toLocaleString(),
      shares: sharesToExercise,
      cost: totalCost,
      profit: netProfit
    };

    setHistory([newTransaction, ...history]);

    setSharesToExercise(0);
    setShowConfirm(false);
    setSuccess(true);

    setTimeout(() => setSuccess(false), 3000);
  };

  return (

    <div className="exercise-page p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="exercise-header mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Exercise Stock Options
        </h1>

        <p className="text-gray-500">
          Convert your vested ESOP shares into ownership.
        </p>

      </div>


      {/* PORTFOLIO CARDS */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Available Shares</p>
          <h3 className="text-xl font-bold text-blue-600">
            {availableShares}
          </h3>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Exercise Price</p>
          <h3 className="text-xl font-bold">
            ${exercisePrice}
          </h3>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Market Price</p>
          <h3 className="text-xl font-bold text-green-600">
            ${marketPrice}
          </h3>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Potential Profit</p>
          <h3 className="text-xl font-bold text-purple-600">
            ${(marketPrice - exercisePrice) * availableShares}
          </h3>
        </div>

      </div>


      {/* MAIN GRID */}
      <div className="exercise-grid grid md:grid-cols-2 gap-6">

        {/* SUMMARY CARD */}
        <div className="exercise-card bg-white shadow-lg rounded-lg p-6">

          <h3 className="text-xl font-bold mb-4">
            Exercise Summary
          </h3>

          <div className="flex justify-between mb-2">
            <span>Shares Selected</span>
            <span>{sharesToExercise}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Total Cost</span>
            <span>${totalCost}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Market Value</span>
            <span>${marketValue}</span>
          </div>

          <div className="flex justify-between mb-2 text-green-600">
            <span>Profit</span>
            <span>${profit}</span>
          </div>

          <div className="flex justify-between mb-2 text-red-500">
            <span>Estimated Tax (20%)</span>
            <span>${tax}</span>
          </div>

          <div className="flex justify-between mt-3 border-t pt-2 font-bold">
            <span>Net Profit</span>
            <span className="text-green-600">${netProfit}</span>
          </div>

        </div>


        {/* ACTION CARD */}
        <div className="exercise-card bg-white shadow-lg rounded-lg p-6">

          <h3 className="text-xl font-bold mb-4">
            Exercise Shares
          </h3>


          {/* NUMBER INPUT */}
          <input
            type="number"
            value={sharesToExercise}
            max={availableShares}
            onChange={(e) =>
              setSharesToExercise(Number(e.target.value))
            }
            className="w-full border p-2 rounded mb-4"
            placeholder="Enter shares"
          />


          {/* SLIDER */}
          <input
            type="range"
            min="0"
            max={availableShares}
            value={sharesToExercise}
            onChange={(e) =>
              setSharesToExercise(Number(e.target.value))
            }
            className="w-full mb-4"
          />


          {/* BUTTON */}
          <button
            onClick={handleExercise}
            className="exercise-btn bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
          >
            Exercise Shares
          </button>

        </div>

      </div>


      {/* SUCCESS MESSAGE */}
      {success && (

        <div className="mt-6 bg-green-100 text-green-700 p-4 rounded shadow">

          ✅ Exercise completed successfully!

        </div>

      )}


      {/* HISTORY TABLE */}
      <div className="mt-8 bg-white rounded shadow p-4">

        <h3 className="text-lg font-bold mb-3">
          Exercise History
        </h3>

        {history.length === 0 ? (

          <p className="text-gray-500">
            No exercises yet
          </p>

        ) : (

          <table className="w-full">

            <thead>
              <tr className="border-b text-left">
                <th>Date</th>
                <th>Shares</th>
                <th>Cost</th>
                <th>Net Profit</th>
              </tr>
            </thead>

            <tbody>

              {history.map((h, index) => (

                <tr key={index} className="border-b">

                  <td>{h.date}</td>
                  <td>{h.shares}</td>
                  <td>${h.cost}</td>
                  <td className="text-green-600">
                    ${h.profit}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>


      {/* CONFIRM MODAL */}
      {showConfirm && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded shadow-lg w-96">

            <h3 className="text-lg font-bold mb-3">
              Confirm Exercise
            </h3>

            <p>
              Exercise {sharesToExercise} shares?
            </p>

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmExercise}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default ExerciseShares;
