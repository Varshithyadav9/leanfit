import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://leanfit.onrender.com").replace(/\/$/, "");
const plans = ["All", "Diet Plan", "Workout Plan", "Diet + Workout", "Lean Pro Membership", "Lean Pro Renewal"];
const emptyForm = { code: "", discountType: "percentage", discountValue: "", minimumOrderAmount: 0, maximumDiscount: "", startDate: "", expiryDate: "", totalUsageLimit: "", perUserUsageLimit: 1, active: true, applicablePlans: ["All"] };
const dateInput = (value) => value ? new Date(value).toISOString().slice(0, 10) : "";

export default function AdminCoupons({ setPage }) {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const adminHeaders = (json = false) => ({ ...(json ? { "Content-Type": "application/json" } : {}), Authorization: `Bearer ${localStorage.getItem("leanfitAdminToken") || ""}` });

  const loadCoupons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/coupons`, { headers: adminHeaders() });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load coupons.");
      setCoupons(data.coupons || []);
    } catch (error) { setMessage(error.message); } finally { setLoading(false); }
  };
  useEffect(() => { loadCoupons(); }, []);

  const setField = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const choosePlan = (plan) => {
    setForm((old) => {
      if (plan === "All") return { ...old, applicablePlans: ["All"] };
      let next = old.applicablePlans.filter((p) => p !== "All");
      next = next.includes(plan) ? next.filter((p) => p !== plan) : [...next, plan];
      return { ...old, applicablePlans: next.length ? next : ["All"] };
    });
  };
  const reset = () => { setForm(emptyForm); setEditingId(null); };
  const edit = (coupon) => {
    setEditingId(coupon._id);
    setForm({ ...emptyForm, ...coupon, startDate: dateInput(coupon.startDate), expiryDate: dateInput(coupon.expiryDate), maximumDiscount: coupon.maximumDiscount ?? "", totalUsageLimit: coupon.totalUsageLimit ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      const url = editingId ? `${API_BASE_URL}/api/coupons/${editingId}` : `${API_BASE_URL}/api/coupons`;
      const response = await fetch(url, { method: editingId ? "PUT" : "POST", headers: adminHeaders(true), body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to save coupon.");
      setMessage(data.message); reset(); await loadCoupons();
    } catch (error) { setMessage(error.message); } finally { setSaving(false); }
  };
  const toggle = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/coupons/${id}/toggle`, { method: "PATCH", headers: adminHeaders() });
    const data = await response.json(); setMessage(data.message || "Status updated."); if (response.ok) await loadCoupons();
  };
  const remove = async (coupon) => {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) return;
    const response = await fetch(`${API_BASE_URL}/api/coupons/${coupon._id}`, { method: "DELETE", headers: adminHeaders() });
    const data = await response.json(); setMessage(data.message || "Coupon deleted."); if (response.ok) await loadCoupons();
  };

  if (loading) return <PageLoader label="Loading coupons..." />;
  return <main className="admin-page coupon-admin-page">
    <section className="admin-header"><div><p className="brand-label">LEANFIT ADMIN</p><h2>Coupons</h2><p>Create and manage discounts without changing website code.</p></div><div className="admin-header-actions"><button className="secondary-btn" onClick={() => setPage("admin")}>Back to Orders</button><button className="secondary-btn" onClick={() => setPage("welcome")}>Back to Website</button></div></section>
    {message && <p className="form-message">{message}</p>}
    <section className="admin-card coupon-admin-form-card"><h3>{editingId ? "Edit Coupon" : "Create Coupon"}</h3><form onSubmit={save} className="coupon-admin-form">
      <label>Coupon Code<input value={form.code} onChange={(e)=>setField("code", e.target.value.toUpperCase())} placeholder="LEAN20" required /></label>
      <label>Discount Type<select value={form.discountType} onChange={(e)=>setField("discountType",e.target.value)}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed amount (₹)</option></select></label>
      <label>Discount Value<input type="number" min="0.01" step="0.01" value={form.discountValue} onChange={(e)=>setField("discountValue",e.target.value)} required /></label>
      <label>Minimum Order (₹)<input type="number" min="0" step="0.01" value={form.minimumOrderAmount} onChange={(e)=>setField("minimumOrderAmount",e.target.value)} /></label>
      <label>Maximum Discount (₹)<input type="number" min="0" step="0.01" value={form.maximumDiscount} onChange={(e)=>setField("maximumDiscount",e.target.value)} placeholder="No limit" /></label>
      <label>Total Usage Limit<input type="number" min="1" value={form.totalUsageLimit} onChange={(e)=>setField("totalUsageLimit",e.target.value)} placeholder="No limit" /></label>
      <label>Per Customer Limit<input type="number" min="1" value={form.perUserUsageLimit} onChange={(e)=>setField("perUserUsageLimit",e.target.value)} /></label>
      <label>Start Date<input type="date" value={form.startDate} onChange={(e)=>setField("startDate",e.target.value)} /></label>
      <label>Expiry Date<input type="date" value={form.expiryDate} onChange={(e)=>setField("expiryDate",e.target.value)} /></label>
      <div className="coupon-plan-picker"><strong>Applicable Plans</strong><div>{plans.map((plan)=><label key={plan}><input type="checkbox" checked={form.applicablePlans.includes(plan)} onChange={()=>choosePlan(plan)} /> {plan}</label>)}</div></div>
      <label className="coupon-active-check"><input type="checkbox" checked={form.active} onChange={(e)=>setField("active",e.target.checked)} /> Active</label>
      <div className="admin-actions"><button className="primary-btn" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}</button>{editingId && <button type="button" className="secondary-btn" onClick={reset}>Cancel Edit</button>}</div>
    </form></section>
    <section className="admin-card coupon-list-card"><h3>All Coupons</h3>{coupons.length===0 ? <p className="muted">No coupons created yet.</p> : <div className="coupon-table-wrap"><table className="coupon-admin-table"><thead><tr><th>Code</th><th>Discount</th><th>Used</th><th>Plans</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead><tbody>{coupons.map((c)=><tr key={c._id}><td><strong>{c.code}</strong></td><td>{c.discountType==="percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`}</td><td>{c.usedCount || 0}{c.totalUsageLimit ? ` / ${c.totalUsageLimit}` : ""}</td><td>{(c.applicablePlans||[]).join(", ") || "All"}</td><td>{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString("en-IN") : "No expiry"}</td><td><span className={c.active ? "coupon-status active" : "coupon-status inactive"}>{c.active ? "Active" : "Inactive"}</span></td><td><div className="coupon-row-actions"><button className="secondary-btn" onClick={()=>edit(c)}>Edit</button><button className="secondary-btn" onClick={()=>toggle(c._id)}>{c.active ? "Deactivate" : "Activate"}</button><button className="secondary-btn" onClick={()=>remove(c)}>Delete</button></div></td></tr>)}</tbody></table></div>}</section>
  </main>;
}
