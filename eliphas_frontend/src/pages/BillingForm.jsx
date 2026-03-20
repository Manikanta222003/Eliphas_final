import { useState } from "react";
import API from "../api";

const BILLING_TYPE_OPTIONS  = ["Direct Company", "Outsourced Company"];
const BILLING_BASIS_OPTIONS = ["Trip Wise", "Contract Based", "Per Ton / KM / Price", "Per Machine / Day or Machine / Hour"];

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "14px",
  boxSizing: "border-box"
};

const labelStyle = {
  display: "block",
  marginBottom: "4px",
  fontWeight: "600",
  fontSize: "13px",
  color: "#333"
};

const fieldStyle = {
  marginBottom: "16px"
};

function Field({ label, children }) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

const EMPTY_FORM = {
  clientName: "",
  companyName: "",
  phoneNumber: "",
  vehicleNumber: "",
  challanNumber: "",
  fromLocation: "",
  toLocation: "",
  loadType: "",
  weight: "",
  billingType: "",
  billingBasis: "",
  companyFare: "",
  clientFare: "",
  dieselQuantity: "",
  dieselPrice: "",
  companyLocation: "",
  date: new Date().toISOString().split("T")[0],
  time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
};

function BillingForm() {

  const [form,    setForm]    = useState(EMPTY_FORM);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [saving,  setSaving]  = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async () => {

    if (!form.clientName || !form.vehicleNumber || !form.challanNumber) {
      setMessage({ text: "Client Name, Vehicle Number and Challan Number are required.", type: "error" });
      return;
    }

    try {

      setSaving(true);
      setMessage({ text: "", type: "" });

      await API.post("/billing/add", form);

      setMessage({ text: "Billing saved successfully!", type: "success" });
      setForm(EMPTY_FORM);

    }
    catch (error) {
      console.error(error);
      setMessage({ text: "Error saving billing. Please try again.", type: "error" });
    }
    finally {
      setSaving(false);
    }

  };

  return (

    <div style={{
      background: "#fff",
      borderRadius: "8px",
      padding: "28px",
      maxWidth: "900px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.08)"
    }}>

      <h2 style={{ marginTop: 0, marginBottom: "24px", color: "#1a1a2e" }}>Add Billing Entry</h2>

      {message.text && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "4px",
          marginBottom: "20px",
          background: message.type === "success" ? "#d4edda" : "#f8d7da",
          color:      message.type === "success" ? "#155724" : "#721c24",
          border:     `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`
        }}>
          {message.text}
        </div>
      )}

      {/* ROW 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }}>

        <Field label="Client Name *">
          <input style={inputStyle} name="clientName" placeholder="Client Name" value={form.clientName} onChange={handleChange} />
        </Field>

        <Field label="Company Name">
          <input style={inputStyle} name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} />
        </Field>

        <Field label="Phone Number">
          <input style={inputStyle} name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} />
        </Field>

      </div>

      {/* ROW 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }}>

        <Field label="Vehicle Number *">
          <input style={inputStyle} name="vehicleNumber" placeholder="e.g. AP12AB1234" value={form.vehicleNumber} onChange={handleChange} />
        </Field>

        <Field label="Challan Number *">
          <input style={inputStyle} name="challanNumber" placeholder="Challan Number" value={form.challanNumber} onChange={handleChange} />
        </Field>

        <Field label="Load Type">
          <input style={inputStyle} name="loadType" placeholder="e.g. Sand, Gravel, Cement" value={form.loadType} onChange={handleChange} />
        </Field>

      </div>

      {/* ROW 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }}>

        <Field label="From Location">
          <input style={inputStyle} name="fromLocation" placeholder="From Location" value={form.fromLocation} onChange={handleChange} />
        </Field>

        <Field label="To Location">
          <input style={inputStyle} name="toLocation" placeholder="To Location" value={form.toLocation} onChange={handleChange} />
        </Field>

        <Field label="Weight (tons)">
          <input style={inputStyle} name="weight" placeholder="Weight in tons" type="number" value={form.weight} onChange={handleChange} />
        </Field>

      </div>

      {/* ROW 4 — Billing Type & Basis */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>

        <Field label="Billing Type (Billing To)">
          <select style={inputStyle} name="billingType" value={form.billingType} onChange={handleChange}>
            <option value="">-- Select Billing Type --</option>
            {BILLING_TYPE_OPTIONS.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>

        <Field label="Type of Transport / Billing Basis">
          <select style={inputStyle} name="billingBasis" value={form.billingBasis} onChange={handleChange}>
            <option value="">-- Select Billing Basis --</option>
            {BILLING_BASIS_OPTIONS.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>

      </div>

      {/* ROW 5 — Fares */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>

        <Field label="Company Fare (₹)">
          <input style={inputStyle} name="companyFare" placeholder="Fare for company" type="number" value={form.companyFare} onChange={handleChange} />
        </Field>

        <Field label="Client Fare (₹)">
          <input style={inputStyle} name="clientFare" placeholder="Fare for client" type="number" value={form.clientFare} onChange={handleChange} />
        </Field>

      </div>

      {/* ROW 6 — Diesel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }}>

        <Field label="Diesel Quantity (L)">
          <input style={inputStyle} name="dieselQuantity" placeholder="Diesel litres" type="number" value={form.dieselQuantity} onChange={handleChange} />
        </Field>

        <Field label="Diesel Price (₹/L)">
          <input style={inputStyle} name="dieselPrice" placeholder="Price per litre" type="number" value={form.dieselPrice} onChange={handleChange} />
        </Field>

        <Field label="Company Location">
          <input style={inputStyle} name="companyLocation" placeholder="Company Location" value={form.companyLocation} onChange={handleChange} />
        </Field>

      </div>

      {/* ROW 7 — Date / Time */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>

        <Field label="Date">
          <input style={inputStyle} name="date" type="date" value={form.date} onChange={handleChange} />
        </Field>

        <Field label="Time">
          <input style={inputStyle} name="time" type="time" value={form.time} onChange={handleChange} />
        </Field>

      </div>

      <button
        onClick={save}
        disabled={saving}
        style={{
          marginTop: "8px",
          padding: "12px 32px",
          background: saving ? "#888" : "#1a1a2e",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          fontSize: "15px",
          cursor: saving ? "not-allowed" : "pointer",
          fontWeight: "600"
        }}
      >
        {saving ? "Saving..." : "Save Billing"}
      </button>

    </div>

  );

}

export default BillingForm;
