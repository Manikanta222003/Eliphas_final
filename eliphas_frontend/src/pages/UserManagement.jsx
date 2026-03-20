import { useState, useEffect } from "react";
import API from "../api";

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "14px",
  boxSizing: "border-box"
};

function UserManagement() {

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser.role === "admin";

  const [users,   setUsers]   = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Step: "form" | "otp"
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ username: "", password: "", role: "manager", email: "" });
  const [pendingUsername, setPendingUsername] = useState("");
  const [otp,  setOtp]  = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data);
    } catch (e) { console.error(e); }
  };


  // ── STEP A: Initiate create user → sends OTP ──
  const initiateCreate = async () => {

    if (!form.username || !form.password || !form.email) {
      setMessage({ text: "Username, password and email are all required.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const res = await API.post("/auth/users/initiate", form);

      setPendingUsername(form.username);
      setStep("otp");
      setOtp("");
      setMessage({ text: `OTP sent to ${res.data.email}. Enter it below to confirm.`, type: "info" });

    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Failed to send OTP.", type: "error" });
    } finally {
      setLoading(false);
    }

  };


  // ── STEP B: Confirm OTP → finalize account ──
  const confirmCreate = async () => {

    if (!otp.trim() || otp.trim().length < 6) {
      setMessage({ text: "Please enter the 6-digit OTP.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      await API.post("/auth/users/confirm", { username: pendingUsername, otp: otp.trim() });

      setMessage({ text: `User "${pendingUsername}" created and verified successfully.`, type: "success" });
      setForm({ username: "", password: "", role: "manager", email: "" });
      setOtp("");
      setStep("form");
      fetchUsers();

    } catch (error) {
      setMessage({ text: error.response?.data?.message || "OTP verification failed.", type: "error" });
    } finally {
      setLoading(false);
    }

  };


  // ── DELETE USER ──
  const deleteUser = async (id, username, role) => {

    if (username === currentUser.username) {
      setMessage({ text: "You cannot delete your own account.", type: "error" });
      return;
    }

    if (!window.confirm(`Delete ${role} "${username}"? This cannot be undone.`)) return;

    try {
      const res = await API.delete(`/auth/users/${id}`);
      setMessage({ text: res.data.message, type: "success" });
      fetchUsers();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Delete failed.", type: "error" });
    }

  };

  // Can this user delete target?
  const canDelete = (targetRole, targetUsername) => {
    if (targetUsername === currentUser.username) return false;
    if (isAdmin) return targetRole !== "admin";
    // manager can only delete non-admin, non-manager
    return targetRole !== "admin" && targetRole !== "manager";
  };

  return (

    <div style={{ background: "#fff", borderRadius: "8px", padding: "28px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>

      <h2 style={{ marginTop: 0, marginBottom: "24px", color: "#1a1a2e" }}>User Management</h2>

      {/* CREATE FORM — only admin can create */}
      {isAdmin && (
        <div style={{ background: "#f5f6fa", borderRadius: "6px", padding: "20px", marginBottom: "28px" }}>

          <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "15px" }}>
            {step === "form" ? "Create New User" : "Verify OTP"}
          </h3>

          {message.text && (
            <div style={{
              padding: "10px 14px", borderRadius: "4px", marginBottom: "14px", fontSize: "13px",
              background: message.type === "success" ? "#d4edda" : message.type === "info" ? "#d1ecf1" : "#f8d7da",
              color:      message.type === "success" ? "#155724" : message.type === "info" ? "#0c5460" : "#721c24"
            }}>
              {message.text}
            </div>
          )}

          {/* STEP A: Form */}
          {step === "form" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "13px" }}>Username</label>
                <input style={inputStyle} placeholder="Username" value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "13px" }}>Password</label>
                <input style={inputStyle} type="password" placeholder="Password" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "13px" }}>Email (OTP will be sent)</label>
                <input style={inputStyle} type="email" placeholder="user@email.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "13px" }}>Role</label>
                <select style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button onClick={initiateCreate} disabled={loading} style={{
                padding: "9px 20px", background: "#1a1a2e", color: "#fff", border: "none",
                borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap"
              }}>
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>

            </div>
          )}

          {/* STEP B: OTP */}
          {step === "otp" && (
            <div style={{ display: "flex", gap: "12px", alignItems: "end", maxWidth: "420px" }}>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "13px" }}>
                  Enter 6-digit OTP sent to new user's email
                </label>
                <input
                  style={inputStyle}
                  placeholder="Enter OTP"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              <button onClick={confirmCreate} disabled={loading} style={{
                padding: "9px 20px", background: "#2e7d32", color: "#fff", border: "none",
                borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap"
              }}>
                {loading ? "Verifying..." : "Confirm ✓"}
              </button>

              <button onClick={() => { setStep("form"); setOtp(""); setMessage({ text: "", type: "" }); }} style={{
                padding: "9px 16px", background: "transparent", color: "#888", border: "1px solid #ccc",
                borderRadius: "4px", cursor: "pointer", fontSize: "14px"
              }}>
                Cancel
              </button>

            </div>
          )}

        </div>
      )}

      {/* Message for non-admin */}
      {!isAdmin && message.text && (
        <div style={{
          padding: "10px 14px", borderRadius: "4px", marginBottom: "14px", fontSize: "13px",
          background: message.type === "success" ? "#d4edda" : "#f8d7da",
          color:      message.type === "success" ? "#155724" : "#721c24"
        }}>
          {message.text}
        </div>
      )}

      {/* USERS TABLE */}
      <h3 style={{ marginBottom: "12px", fontSize: "15px", color: "#333" }}>All Users ({users.length})</h3>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>

        <thead>
          <tr style={{ background: "#1a1a2e", color: "#fff" }}>
            <th style={{ padding: "10px 14px", textAlign: "left" }}>#</th>
            <th style={{ padding: "10px 14px", textAlign: "left" }}>Username</th>
            <th style={{ padding: "10px 14px", textAlign: "left" }}>Email</th>
            <th style={{ padding: "10px 14px", textAlign: "left" }}>Role</th>
            <th style={{ padding: "10px 14px", textAlign: "left" }}>Status</th>
            <th style={{ padding: "10px 14px", textAlign: "left" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u, i) => {
            const isSelf = u.username === currentUser.username;
            return (
              <tr key={u._id} style={{ borderBottom: "1px solid #eee", background: i % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                <td style={{ padding: "10px 14px", color: "#aaa" }}>{i + 1}</td>
                <td style={{ padding: "10px 14px", fontWeight: "600" }}>
                  {u.username} {isSelf && <span style={{ fontSize: "11px", color: "#888" }}>(you)</span>}
                </td>
                <td style={{ padding: "10px 14px", color: "#555" }}>{u.email || "—"}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600",
                    background: u.role === "admin" ? "#fdecea" : "#e8f5e9",
                    color:      u.role === "admin" ? "#c62828" : "#2e7d32"
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600",
                    background: u.isVerified ? "#e8f5e9" : "#fff8e1",
                    color:      u.isVerified ? "#2e7d32" : "#f57f17"
                  }}>
                    {u.isVerified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  {canDelete(u.role, u.username) ? (
                    <button
                      onClick={() => deleteUser(u._id, u.username, u.role)}
                      style={{
                        padding: "5px 14px", background: "#e63946", color: "#fff",
                        border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px"
                      }}
                    >
                      Delete
                    </button>
                  ) : (
                    <span style={{ color: "#ccc", fontSize: "12px" }}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>

    </div>

  );

}

export default UserManagement;
