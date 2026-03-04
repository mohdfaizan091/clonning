import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const STATUSES = ["Applied", "Screening", "Interview", "Offer", "Rejected"];

function ApplicationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    status: "Applied",
    applicationDate: new Date().toISOString().split("T")[0],
    interviewDate: "",
    salaryRange: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;
    const fetch = async () => {
      try {
        const res = await api.get(`/applications/${id}`);
        const app = res.data.application;
        setForm({
          companyName: app.companyName,
          jobTitle: app.jobTitle,
          status: app.status,
          applicationDate: app.applicationDate?.split("T")[0] || "",
          interviewDate: app.interviewDate?.split("T")[0] || "",
          salaryRange: app.salaryRange || "",
          notes: app.notes || "",
        });
      } catch {
        setError("Application not found");
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isEditing) {
        await api.put(`/applications/${id}`, form);
      } else {
        await api.post("/applications", form);
      }
      navigate("/applications");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit}>
        <div>
          <p className="form-title">{isEditing ? "Edit Application" : "New Application"}</p>
          <p className="form-sub">{isEditing ? "Update the details below" : "Track a new job application"}</p>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <input
          placeholder="Company Name *"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />
        <input
          placeholder="Job Title *"
          value={form.jobTitle}
          onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border-2)",
            borderRadius: "var(--radius)",
            padding: "12px 16px",
            fontFamily: "var(--mono)",
            fontSize: "0.82rem",
            color: "var(--text)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div>
          <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Application Date
          </p>
          <input
            type="date"
            value={form.applicationDate}
            onChange={(e) => setForm({ ...form, applicationDate: e.target.value })}
          />
        </div>

        <div>
          <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Interview Date (optional)
          </p>
          <input
            type="date"
            value={form.interviewDate}
            onChange={(e) => setForm({ ...form, interviewDate: e.target.value })}
          />
        </div>

        <input
          placeholder="Salary Range (optional) e.g. 8-12 LPA"
          value={form.salaryRange}
          onChange={(e) => setForm({ ...form, salaryRange: e.target.value })}
        />

        <textarea
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={4}
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border-2)",
            borderRadius: "var(--radius)",
            padding: "12px 16px",
            fontFamily: "var(--mono)",
            fontSize: "0.82rem",
            color: "var(--text)",
            outline: "none",
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ flex: 1 }}
            onClick={() => navigate("/applications")}
          >
            Cancel
          </button>
          <button type="submit" style={{ flex: 2 }} disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update" : "Add Application"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;