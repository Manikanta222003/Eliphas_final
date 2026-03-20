import { useState } from "react";
import API from "../api";

const inputStyle = {
  padding: "9px 12px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box"
};

function SearchPage() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [filters, setFilters] = useState({
    vehicleNumber: "",
    challanNumber: "",
    date: "",
    fromLocation: "",
    toLocation: "",
    loadType: ""
  });

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const search = async () => {

    const hasFilter = Object.values(filters).some(v => v.trim() !== "");

    if (!hasFilter) {
      setMessage("Please enter at least one search field.");
      setResults([]);
      return;
    }

    try {

      setLoading(true);
      setMessage("");

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v.trim()) params.append(k, v.trim());
      });

      const res = await API.get(`/billing/search?${params.toString()}`);

      setResults(res.data);

      if (res.data.length === 0) {
        setMessage("No records found.");
      }

    }
    catch (error) {
      console.error(error);
      setMessage("Search failed. Please try again.");
    }
    finally {
      setLoading(false);
    }

  };

  const deleteRecord = async (id) => {

    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {

      await API.delete(`/billing/delete/${id}`);
      setMessage("Record deleted successfully.");
      setResults(prev => prev.filter(r => r._id !== id));

    }
    catch (error) {
      console.error(error);
      setMessage("Delete failed.");
    }

  };

  const clearFilters = () => {
    setFilters({ vehicleNumber: "", challanNumber: "", date: "", fromLocation: "", toLocation: "", loadType: "" });
    setResults([]);
    setMessage("");
  };

  return (

    <div style={{
      background: "#fff",
      borderRadius: "8px",
      padding: "28px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.08)"
    }}>

      <h2 style={{ marginTop: 0, marginBottom: "24px", color: "#1a1a2e" }}>Search Billing Records</h2>

      {/* FILTER GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px 20px", marginBottom: "20px" }}>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "13px" }}>Vehicle Number</label>
          <input style={inputStyle} name="vehicleNumber" placeholder="Vehicle Number" value={filters.vehicleNumber} onChange={handleChange} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "13px" }}>Challan Number</label>
          <input style={inputStyle} name="challanNumber" placeholder="Challan Number" value={filters.challanNumber} onChange={handleChange} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "13px" }}>Date</label>
          <input style={inputStyle} name="date" type="date" value={filters.date} onChange={handleChange} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "13px" }}>From Location</label>
          <input style={inputStyle} name="fromLocation" placeholder="From Location" value={filters.fromLocation} onChange={handleChange} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "13px" }}>To Location</label>
          <input style={inputStyle} name="toLocation" placeholder="To Location" value={filters.toLocation} onChange={handleChange} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "13px" }}>Load Type</label>
          <input style={inputStyle} name="loadType" placeholder="e.g. Sand, Cement" value={filters.loadType} onChange={handleChange} />
        </div>

      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>

        <button
          onClick={search}
          disabled={loading}
          style={{
            padding: "10px 28px",
            background: "#1a1a2e",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>

        <button
          onClick={clearFilters}
          style={{
            padding: "10px 20px",
            background: "transparent",
            color: "#555",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: "pointer"
          }}
        >
          Clear
        </button>

      </div>

      {message && (
        <p style={{ color: results.length === 0 ? "#888" : "#155724", marginBottom: "12px" }}>
          {message}
        </p>
      )}

      {/* RESULTS TABLE */}
      {results.length > 0 && (

        <div style={{ overflowX: "auto" }}>

          <p style={{ marginBottom: "8px", color: "#555", fontSize: "13px" }}>
            {results.length} record(s) found
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>

            <thead>
              <tr style={{ background: "#1a1a2e", color: "#fff" }}>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Client</th>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Company</th>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Vehicle</th>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Challan</th>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>From</th>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>To</th>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Load</th>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Co. Fare</th>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Cl. Fare</th>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Date</th>
                {user.role === "admin" && (
                  <th style={{ padding: "10px 12px", textAlign: "left" }}>Action</th>
                )}
              </tr>
            </thead>

            <tbody>
              {results.map((r, i) => (
                <tr
                  key={r._id}
                  style={{ background: i % 2 === 0 ? "#fff" : "#f9f9f9", borderBottom: "1px solid #eee" }}
                >
                  <td style={{ padding: "9px 12px" }}>{r.clientName}</td>
                  <td style={{ padding: "9px 12px" }}>{r.companyName}</td>
                  <td style={{ padding: "9px 12px" }}>{r.vehicleNumber}</td>
                  <td style={{ padding: "9px 12px" }}>{r.challanNumber}</td>
                  <td style={{ padding: "9px 12px" }}>{r.fromLocation}</td>
                  <td style={{ padding: "9px 12px" }}>{r.toLocation}</td>
                  <td style={{ padding: "9px 12px" }}>{r.loadType}</td>
                  <td style={{ padding: "9px 12px" }}>₹{r.companyFare}</td>
                  <td style={{ padding: "9px 12px" }}>₹{r.clientFare}</td>
                  <td style={{ padding: "9px 12px" }}>
                    {r.date ? new Date(r.date).toLocaleDateString("en-IN") : ""}
                  </td>
                  {user.role === "admin" && (
                    <td style={{ padding: "9px 12px" }}>
                      <button
                        onClick={() => deleteRecord(r._id)}
                        style={{
                          padding: "5px 12px",
                          background: "#e63946",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px"
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}

export default SearchPage;
