import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [dateFrom, setDateFrom] = useState("2024-04-01");
  const [dateTo, setDateTo] = useState("2024-04-30");
  const [reportData, setReportData] = useState([]);

  const fetchCampaignList = async () => {
    try {
      const res = await axios.get(
        "https://crm-backend-xl69.onrender.com/api/keitaro/campaigns/clean"
      );
      setCampaigns(res.data);
    } catch (err) {
      console.error("Ошибка получения списка кампаний:", err);
    }
  };

  const fetchReport = async () => {
    try {
      const res = await axios.get(
        `https://crm-backend-xl69.onrender.com/api/keitaro/traffic?campaign_id=${selectedCampaign}&from=${dateFrom}&to=${dateTo}`
      );
      setReportData(res.data.rows || []);
    } catch (err) {
      console.error("Ошибка при загрузке отчета:", err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await axios.post(
        "https://crm-backend-xl69.onrender.com/api/upload",
        formData
      );
      setUploadMessage("Файл загружен: " + res.data.filename);
    } catch (err) {
      console.error("Ошибка загрузки файла:", err);
    }
  };

  useEffect(() => {
    fetchCampaignList();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">CRM Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Загрузить CSV</h2>
          <input type="file" onChange={handleFileChange} className="mb-2" />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Загрузить
          </button>
          <p className="mt-2 text-sm text-gray-600">{uploadMessage}</p>

          <h2 className="text-lg font-semibold mt-6 mb-2">Выбрать кампанию</h2>
          <select
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Выберите --</option>
            {campaigns.map((c) => (
              <option key={c.ID} value={c.ID}>
                {c.Название}
              </option>
            ))}
          </select>

          <div className="mt-4">
            <label className="block text-sm">От:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <label className="block text-sm mt-2">До:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <button
              onClick={fetchReport}
              className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Показать отчёт
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Топ кампаний по доходу</h2>
          {reportData.length === 0 ? (
            <p className="text-gray-500">Нет данных для отображения</p>
          ) : (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.map((r, i) => ({ name: r[0] || `Запись ${i+1}`, value: r[4] }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide={false} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
              <table className="w-full text-left border">
                <thead>
         <thead>
  <tr>
    {Array.isArray(reportData[0])
      ? reportData[0].map((_, index) => (
          <th key={index} className="border px-2 py-1 text-sm">
            Колонка {index + 1}
          </th>
        ))
      : null}
  </tr>
</thead>

                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="border px-2 py-1 text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
