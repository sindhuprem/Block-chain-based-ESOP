import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

const BASE_URL = "http://localhost:5000";

const ExerciseShares = () => {
  const { user } = useAuth();

  const exercisePrice = 5;
  const marketPrice = 18;

  const [availableShares, setAvailableShares] = useState(0);
  const [grants, setGrants] = useState([]);
  const [selectedGrantId, setSelectedGrantId] = useState(null);
  const [sharesToExercise, setSharesToExercise] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.wallet_address) {
      fetch(`${BASE_URL}/api/grants/${user.wallet_address}`)
        .then(r => r.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          // Only active grants with available shares to exercise
          const active = data.filter(g =>
            g.isActive && g.vestedShares > g.exercisedShares
          );
          setGrants(active);
          const total = active.reduce((s, g) =>
            s + (g.vestedShares - g.exercisedShares), 0);
          setAvailableShares(total);
          if (active.length > 0) setSelectedGrantId(active[0].grantId);
        })
        .catch(() => setAvailableShares(0));
    }
  }, [user]);

  const totalCost = sharesToExercise * exercisePrice;
  const marketValue = sharesToExercise * marketPrice;
  const profit = marketValue - totalCost;
  const tax = profit > 0 ? profit * 0.2 : 0;
  const netProfit = profit - tax;

  const handleExercise = () => {
    if (sharesToExercise <= 0) { alert("Enter valid number of shares"); return; }
    if (sharesToExercise > availableShares) { alert("Not enough available shares"); return; }
    setShowConfirm(true);
  };

  const confirmExercise = async () => {
    setLoading(true);
    setError(null);
    try {
      if (user?.wallet_address && selectedGrantId) {
        const res = await fetch(`${BASE_URL}/api/grants/${selectedGrantId}/exercise`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shares: sharesToExercise,
            walletAddress: user.wallet_address
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Exercise failed");
      }

      setAvailableShares(prev => prev - sharesToExercise);
      setHistory(prev => [{
        date: new Date().toLocaleString(),
        shares: sharesToExercise,
        cost: totalCost,
        profit: netProfit
      }, ...prev]);
      setSharesToExercise(0);
      setShowConfirm(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Exercise Stock Options</h1>
        <p className="text-gray-500">
          Convert your vested ESOP shares into ownership.
          <span className="text-blue-500 text-xs ml-2">(from blockchain)</span>
        </p>
      </div>

      {/* No wallet warning */}
      {!user?.wallet_address && (
        <div className="bg-blue-50 text-blue-700 p-3 rounded mb-4">
          ℹ️ No wallet address linked. Contact HR to link your wallet.
        </div>
      )}

      {/* Portfolio Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Available Shares</p>
          <h3 className="text-xl font-bold text-blue-600">{availableShares.toLocaleString()}</h3>
          <p className="text-xs text-blue-400 mt-1">from blockchain</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Exercise Price</p>
          <h3 className="text-xl font-bold">${exercisePrice}</h3>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Market Price</p>
          <h3 className="text-xl font-bold text-green-600">${marketPrice}</h3>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Potential Profit</p>
          <h3 className="text-xl font-bold text-purple-600">
            ${((marketPrice - exercisePrice) * availableShares).toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Exercise Summary</h3>
          {[
            { label: "Shares Selected", val: sharesToExercise.toLocaleString(), cls: "" },
            { label: "Total Cost", val: `$${totalCost.toLocaleString()}`, cls: "" },
            { label: "Market Value", val: `$${marketValue.toLocaleString()}`, cls: "" },
            { label: "Profit", val: `$${profit.toLocaleString()}`, cls: "text-green-600" },
            { label: "Estimated Tax (20%)", val: `$${tax.toLocaleString()}`, cls: "text-red-500" },
          ].map(({ label, val, cls }) => (
            <div key={label} className={`flex justify-between mb-2 ${cls}`}>
              <span>{label}</span><span>{val}</span>
            </div>
          ))}
          <div className="flex justify-between mt-3 border-t pt-2 font-bold">
            <span>Net Profit</span>
            <span className="text-green-600">${netProfit.toLocaleString()}</span>
          </div>
        </div>

        {/* Action */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Exercise Shares</h3>

          {grants.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Select Grant</label>
              <select className="w-full border p-2 rounded"
                value={selectedGrantId}
                onChange={e => {
                  const gid = Number(e.target.value);
                  setSelectedGrantId(gid);
                  const g = grants.find(g => g.grantId === gid);
                  if (g) setAvailableShares(g.vestedShares - g.exercisedShares);
                }}>
                {grants.map(g => (
                  <option key={g.grantId} value={g.grantId}>
                    Grant #{g.grantId} — {(g.vestedShares - g.exercisedShares).toLocaleString()} available
                  </option>
                ))}
              </select>
            </div>
          )}

          <input
            type="number"
            value={sharesToExercise}
            max={availableShares}
            min={0}
            onChange={e => setSharesToExercise(Number(e.target.value))}
            className="w-full border p-2 rounded mb-4"
            placeholder="Enter number of shares"
          />

          <input
            type="range"
            min="0"
            max={availableShares}
            value={sharesToExercise}
            onChange={e => setSharesToExercise(Number(e.target.value))}
            className="w-full mb-4"
          />

          {error && <p className="text-red-500 text-sm mb-3">❌ {error}</p>}

          <button
            onClick={handleExercise}
            disabled={availableShares === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded disabled:opacity-60">
            {availableShares === 0 ? "No Shares Available" : "Exercise Shares"}
          </button>

          {availableShares === 0 && (
            <p className="text-xs text-gray-400 text-center mt-2">
              Shares become available after cliff period passes
            </p>
          )}
        </div>
      </div>

      {success && (
        <div className="mt-6 bg-green-100 text-green-700 p-4 rounded shadow">
          ✅ Exercise completed and recorded on blockchain!
        </div>
      )}

      {/* History */}
      <div className="mt-8 bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-3">Exercise History</h3>
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No exercises in this session</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2">Date</th>
                <th>Shares</th>
                <th>Cost</th>
                <th>Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-2">{h.date}</td>
                  <td>{h.shares}</td>
                  <td>${h.cost.toLocaleString()}</td>
                  <td className="text-green-600">${h.profit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-3">Confirm Exercise</h3>
            <p>Exercise <strong>{sharesToExercise.toLocaleString()}</strong> shares?</p>
            <p className="text-sm text-gray-500 mt-1">
              Total cost: <strong>${totalCost.toLocaleString()}</strong> — This will be recorded on the blockchain.
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowConfirm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={confirmExercise} disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60">
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseShares;