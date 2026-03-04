import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const STATUS_COLORS = {
  Applied:   { bg: "var(--blue-dim)",  color: "var(--blue)"  },
  Screening: { bg: "var(--orange)",    color: "#fff"          },
  Interview: { bg: "var(--surface-2)", color: "var(--text)"   },
  Offer:     { bg: "var(--green-dim)", color: "var(--green)"  },
  Rejected:  { bg: "var(--red-dim)",   color: "var(--red)"    },
};

function Applications() {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications", {
        params: { page, limit: 10, search, status },
      });
      setApplications(res.data.applications);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, status]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchApplications();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await api.delete(`/applications/${id}`);
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-wide">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--display)", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Applications
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "4px" }}>
            {pagination.total || 0} total applications
          </p>
        </div>
        <Link to="/applications/new">
          <button className="btn-primary" style={{ width: "auto", padding: "10px 20px" }}>
            + Add New
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "280px" }}
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border-2)",
            borderRadius: "var(--radius)",
            padding: "12px 16px",
            fontFamily: "var(--mono)",
            fontSize: "0.82rem",
            color: status ? "var(--text)" : "var(--text-muted)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="">All Status</option>
          <option value="Applied">Applied</option>
          <option value="Screening">Screening</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="dashboard-card" style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            No applications found.{" "}
            <Link to="/applications/new" className="link">Add your first one →</Link>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {applications.map((app) => (
            <div key={app._id} className="dashboard-card" style={{ padding: "18px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <p style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "0.95rem" }}>
                    {app.jobTitle}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "2px" }}>
                    {app.companyName} · {new Date(app.applicationDate).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    ...STATUS_COLORS[app.status],
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}>
                    {app.status}
                  </span>
                  <Link to={`/applications/${app._id}`}>
                    <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                      View
                    </button>
                  </Link>
                  <button
                    className="btn-danger"
                    style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                    onClick={() => handleDelete(app._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "24px" }}>
          <button
            className="btn-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{ padding: "8px 16px", fontSize: "0.75rem" }}
          >
            ← Prev
          </button>
          <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", alignSelf: "center" }}>
            {page} / {pagination.pages}
          </span>
          <button
            className="btn-secondary"
            disabled={page === pagination.pages}
            onClick={() => setPage(page + 1)}
            style={{ padding: "8px 16px", fontSize: "0.75rem" }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default Applications;