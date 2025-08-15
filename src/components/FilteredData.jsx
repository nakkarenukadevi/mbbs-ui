import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function FilteredDataTable() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!formData) {
      navigate("/", { replace: true });
      return;
    }
    setLoading(true);
    setError("");
    // Make actual API call using formData and pagination
    const fetchData = async () => {
      try {
        const url = ` https://mbbs-server.onrender.com/api/students?pageNumber=${page}&pageSize=${pageSize}`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData }),
        });
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const response = await res.json();
        // Expecting response: { data: [...], total: number }
        setData(response.data || []);
        setTotalPages(
          response.total ? Math.ceil(response.total / pageSize) : 1
        );
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [formData, page, pageSize, navigate]);

  if (!formData) return null;
  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data found.</div>;
  }

  // Render table header from keys of first object, excluding 's_no'
  const headers = Object.keys(data[0]).filter((h) => h !== "s_no");

  // Helper to format header names: capitalize and add space before capital letters
  function formatHeader(header) {
    // Special cases for known headers
    if (header === "ews") return "EWS";
    if (header === "pmc") return "PMC";
    if (header === "anglo_india") return "Anglo India";
    return header
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <div className="w-full">
      <div className="w-full min-h-[60vh] overflow-x-scroll flex items-center justify-center">
        <div className="max-h-[70vh]">
          <table
            className="border-collapse"
            style={{ tableLayout: "auto", width: "100%" }}
          >
            <thead className="bg-blue-700 text-white sticky top-0 z-10">
              <tr>
                <th
                  className="px-4 py-2 whitespace-nowrap text-left font-bold"
                  style={{ minWidth: 60 }}
                >
                  S. No
                </th>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 whitespace-nowrap text-left font-bold"
                    style={{ minWidth: 120 }}
                  >
                    {formatHeader(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="even:bg-gray-100 odd:bg-white">
                  <td
                    className="px-4 py-2 whitespace-nowrap border"
                    style={{ minWidth: 60 }}
                  >
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="px-4 py-2 whitespace-nowrap border"
                      style={{ minWidth: 120 }}
                    >
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="font-medium">
            Students per page:
          </label>
          <select
            id="pageSize"
            className="border rounded px-2 py-1"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2 ml-auto">
          {renderPagination(page, totalPages, setPage)}
        </div>
      </div>
    </div>
  );
}

export default FilteredDataTable;

// Helper function to render pagination numbers with ellipsis for large datasets
function renderPagination(page, totalPages, setPage) {
  const pageWindow = 2; // Number of pages to show before/after current
  const pages = [];
  if (totalPages <= 10) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    let start = Math.max(2, page - pageWindow);
    let end = Math.min(totalPages - 1, page + pageWindow);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }
  return pages.map((num, idx) =>
    num === "..." ? (
      <span key={"ellipsis-" + idx} style={{ margin: "0 4px" }}>
        ...
      </span>
    ) : (
      <button
        key={num}
        onClick={() => setPage(num)}
        style={{
          margin: 2,
          padding: "4px 8px",
          background: num === page ? "#1976d2" : "#fff",
          color: num === page ? "#fff" : "#000",
          border: "1px solid #1976d2",
          borderRadius: 4,
          cursor: "pointer",
        }}
        disabled={num === page}
      >
        {num}
      </button>
    )
  );
}
