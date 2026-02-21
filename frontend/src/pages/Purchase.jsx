import { useState } from "react";
import api from "../api";

export default function Purchase() {

  const [form, setForm] = useState({ vendor: "", amount: "" });

  const submit = async () => {

    await api.post("/purchases", form);
    alert("Purchase saved!");
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">Purchase Orders</h1>
      <div className="bg-crm-dark p-6 rounded-xl border border-gray-800 max-w-md">
        <input
          placeholder="Vendor"
          className="w-full mb-3 p-2 bg-black/50 border border-gray-700 rounded text-white focus:border-crm-sky outline-none"
          onChange={e => setForm({ ...form, vendor: e.target.value })}
        />
        <input
          placeholder="Amount"
          className="w-full mb-3 p-2 bg-black/50 border border-gray-700 rounded text-white focus:border-crm-sky outline-none"
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />
        <button
          onClick={submit}
          className="w-full bg-crm-sky text-black font-bold p-2 rounded hover:bg-sky-600 transition"
        >
          Save Purchase
        </button>
      </div>
    </div>
  );
}
