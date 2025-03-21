import React, { useState } from "react";
import "../styles/StudyMaterials.css";
import { FileText } from "lucide-react";

const StudyMaterials = () => {
  const [selectedOlympiad, setSelectedOlympiad] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const certificateData = [
    { exam: "IAOL 1", type: "Previous Year Paper", cost: "100 Rs" },
    { exam: "IAOL 1", type: "Previous Year Paper", cost: "100 Rs" },
    { exam: "IAOL 1", type: "Previous Year Paper", cost: "100 Rs" },
    { exam: "IAOL 1", type: "Previous Year Paper", cost: "100 Rs" },
    { exam: "IAOL 1", type: "Previous Year Paper", cost: "100 Rs" },
    { exam: "IAOL 1", type: "Previous Year Paper", cost: "100 Rs" },
    { exam: "IAOL 1", type: "Previous Year Paper", cost: "100 Rs" },
    { exam: "IAOL 1", type: "Previous Year Paper", cost: "100 Rs" },
  ];

  return (
    <div className="p-4 space-y-4 w-full h-full flex flex-col">
      
      
     {/* HEADER */}
     <div className="flex items-center gap-3">
        <div className="bg-blue-100 rounded-full w-9 h-9 flex items-center justify-center">
          <FileText />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Study Material</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col w-full items-center gap-4">
        <select
          className="bg-blue-50  w-full border border-blue-200 rounded-md px-4 py-2 text-sm transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={selectedOlympiad}
          onChange={(e) => setSelectedOlympiad(e.target.value)}
        >
          <option value="">Which Olympiad</option>
          <option value="math">Mathematics</option>
          <option value="science">Science</option>
        </select>

        <select
          className="w-full bg-blue-50 border border-blue-200 rounded-md px-4 py-2 text-sm transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="">Select Level</option>
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
        </select>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-slideUp">
        {/* Table Header */}
        <div className="grid grid-cols-4 bg-gradient-to-r from-blue-100 to-blue-50 text-sm font-medium">
          <div className="px-4 py-3">EXAM</div>
          <div className="px-4 py-3">TYPE</div>
          <div className="px-4 py-3">COST</div>
          <div className="px-4 py-3">BUY</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {certificateData.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-4 text-sm transition-colors duration-300 hover:bg-gray-50"
            >
              <div className="px-4 py-3">{item.exam}</div>
              <div className="px-4 py-3">{item.type}</div>
              <div className="px-4 py-3">{item.cost}</div>
              <div className="px-4 py-3">
                <button className="text-blue-600 font-medium hover:text-blue-800 transition-transform duration-300 transform hover:scale-105">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyMaterials;
