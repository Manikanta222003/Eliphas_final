import { useState } from "react";
import API from "../api";
import "./ReportsPage.css";

function ReportsPage({ user }) {

  const [data,         setData]         = useState([]);
  const [message,      setMessage]      = useState("");
  const [activeReport, setActiveReport] = useState("");
  const [loading,      setLoading]      = useState(false);
  const [customFrom,   setCustomFrom]   = useState("");
  const [customTo,     setCustomTo]     = useState("");


  // ── LOAD REPORT ──────────────────────────────────
  const loadReport = async (type) => {
    if (type === "custom" && (!customFrom || !customTo)) {
      setMessage("Please select both From and To dates for custom report.");
      return;
    }
    try {
      setLoading(true);
      setActiveReport(type);
      setMessage("");
      setData([]);

      const url = type === "custom"
        ? `/reports/custom?from=${customFrom}&to=${customTo}`
        : `/reports/${type}`;

      const response = await API.get(url);
      const result   = response.data?.data || [];
      setData(result);
      if (result.length === 0) setMessage("No records found for this period.");
    } catch (error) {
      console.error("Report load error:", error);
      setMessage("Failed to load report.");
    } finally {
      setLoading(false);
    }
  };


  // ── GENERIC DOWNLOAD ─────────────────────────────
  const download = async (type, format) => {
    try {
      setMessage("");

      if (type === "custom" && (!customFrom || !customTo)) {
        setMessage("Please select From and To dates before downloading custom report.");
        return;
      }

      const url = type === "custom"
        ? `/reports/custom-${format}?from=${customFrom}&to=${customTo}`
        : `/reports/${type}-${format}`;

      const mimeMap = {
        excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        pdf:   "application/pdf",
        csv:   "text/csv"
      };
      const extMap = { excel: "xlsx", pdf: "pdf", csv: "csv" };

      const response = await API.get(url, { responseType: "blob" });
      const blob     = new Blob([response.data], { type: mimeMap[format] });
      const link     = document.createElement("a");
      link.href      = window.URL.createObjectURL(blob);
      link.download  = `billing_${type}_report.${extMap[format]}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error(`${format} download error:`, error);
      setMessage(`${format.toUpperCase()} download failed.`);
    }
  };


  // ── TOTALS ───────────────────────────────────────
  const grandCompanyFare = data.reduce((s, i) => s + Number(i.companyFare || 0), 0);
  const grandClientFare  = data.reduce((s, i) => s + Number(i.clientFare  || 0), 0);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  }) : "";


  // ── STYLES ───────────────────────────────────────
  const btnStyle = (type) => ({
    padding: "9px 18px",
    marginRight: "8px",
    marginBottom: "8px",
    border: activeReport === type ? "2px solid #1a1a2e" : "1px solid #ccc",
    background: activeReport === type ? "#1a1a2e" : "#fff",
    color: activeReport === type ? "#fff" : "#333",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: activeReport === type ? "700" : "400",
    fontSize: "14px"
  });

  const dlBtn = (color) => ({
    padding: "7px 14px",
    marginRight: "6px",
    marginBottom: "6px",
    border: "none",
    background: color,
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600"
  });

  const periods = ["daily", "weekly", "monthly", "yearly", "custom"];

  return (

    <div style={{ background: "#fff", borderRadius: "8px", padding: "28px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>

      <h2 style={{ marginTop: 0, marginBottom: "24px", color: "#1a1a2e" }}>Billing Reports</h2>

      {/* VIEW REPORT BUTTONS */}
      <div style={{ marginBottom: "8px" }}>
        <span style={{ fontWeight: "600", fontSize: "13px", color: "#555", marginRight: "12px" }}>View Report:</span>
        {periods.map(p => (
          <button key={p} style={btnStyle(p)} onClick={() => loadReport(p)}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* CUSTOM DATE RANGE */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "12px 16px", background: "#f5f6fa", borderRadius: "4px",
        marginBottom: "20px", flexWrap: "wrap"
      }}>
        <label style={{ fontWeight: "600", fontSize: "13px" }}>Custom Range:</label>
        <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
          style={{ padding: "7px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
        <span style={{ color: "#777" }}>to</span>
        <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
          style={{ padding: "7px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
      </div>

      {/* DOWNLOAD BUTTONS — Excel, PDF, CSV per period */}
      <div style={{ marginBottom: "24px" }}>
        <span style={{ fontWeight: "600", fontSize: "13px", color: "#555", display: "block", marginBottom: "10px" }}>
          Download Reports:
        </span>

        <table style={{ borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr>
              <th style={{ padding: "6px 14px 6px 0", textAlign: "left", color: "#777", fontWeight: "600" }}>Period</th>
              <th style={{ padding: "6px 8px", textAlign: "center", color: "#2a9d8f", fontWeight: "600" }}>Excel</th>
              <th style={{ padding: "6px 8px", textAlign: "center", color: "#e63946", fontWeight: "600" }}>PDF</th>
              <th style={{ padding: "6px 8px", textAlign: "center", color: "#457b9d", fontWeight: "600" }}>CSV</th>
            </tr>
          </thead>
          <tbody>
            {periods.map(p => (
              <tr key={p}>
                <td style={{ padding: "4px 14px 4px 0", fontWeight: "600", textTransform: "capitalize" }}>{p}</td>
                <td style={{ padding: "4px 8px", textAlign: "center" }}>
                  <button style={dlBtn("#2a9d8f")} onClick={() => download(p, "excel")}>⬇ Excel</button>
                </td>
                <td style={{ padding: "4px 8px", textAlign: "center" }}>
                  <button style={dlBtn("#e63946")} onClick={() => download(p, "pdf")}>⬇ PDF</button>
                </td>
                <td style={{ padding: "4px 8px", textAlign: "center" }}>
                  <button style={dlBtn("#457b9d")} onClick={() => download(p, "csv")}>⬇ CSV</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MESSAGE */}
      {message && <p style={{ color: "#888", marginBottom: "12px" }}>{message}</p>}

      {/* LOADING */}
      {loading && <p style={{ color: "#555", marginBottom: "12px" }}>Loading report...</p>}

      {/* TABLE */}
      {!loading && data.length > 0 && (
        <div style={{ overflowX: "auto" }}>

          <p style={{ fontSize: "13px", color: "#555", marginBottom: "8px" }}>
            {data.length} record(s) — {activeReport.toUpperCase()} REPORT
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
                <th style={{ padding: "10px 12px", textAlign: "right" }}>Co. Fare (₹)</th>
                <th style={{ padding: "10px 12px", textAlign: "right" }}>Cl. Fare (₹)</th>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={item._id} style={{ background: i % 2 === 0 ? "#fff" : "#f9f9f9", borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "9px 12px" }}>{item.clientName}</td>
                  <td style={{ padding: "9px 12px" }}>{item.companyName}</td>
                  <td style={{ padding: "9px 12px" }}>{item.vehicleNumber}</td>
                  <td style={{ padding: "9px 12px" }}>{item.challanNumber}</td>
                  <td style={{ padding: "9px 12px" }}>{item.fromLocation}</td>
                  <td style={{ padding: "9px 12px" }}>{item.toLocation}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right" }}>₹{Number(item.companyFare || 0).toLocaleString("en-IN")}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right" }}>₹{Number(item.clientFare  || 0).toLocaleString("en-IN")}</td>
                  <td style={{ padding: "9px 12px" }}>{formatDate(item.date || item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "#1a1a2e", color: "#fff", fontWeight: "700" }}>
                <td colSpan={6} style={{ padding: "10px 12px" }}>GRAND TOTAL ({data.length} records)</td>
                <td style={{ padding: "10px 12px", textAlign: "right" }}>₹{grandCompanyFare.toLocaleString("en-IN")}</td>
                <td style={{ padding: "10px 12px", textAlign: "right" }}>₹{grandClientFare.toLocaleString("en-IN")}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>

        </div>
      )}

    </div>

  );

}

export default ReportsPage;
