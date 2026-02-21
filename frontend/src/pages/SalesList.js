import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";

export default function SalesList() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    api.get("/sales", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setSales(res.data))
    .catch(err => console.log(err));
  }, []);

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Sales History</h2>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-crm-sky">
          <tr>
            <th className="p-2">Customer</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((s, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{s.customer}</td>
              <td className="p-2">₹ {s.amount}</td>
              <td className="p-2">{s.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
