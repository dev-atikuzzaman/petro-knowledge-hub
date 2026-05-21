// src/AdminPanel.jsx
import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection, addDoc, getDocs,
  doc, updateDoc, deleteDoc
} from "firebase/firestore";

export default function AdminPanel({ onClose }) {
  const [members, setMembers] = useState([]);
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ name: "", label: "", type: "text" });
  const [activeTab, setActiveTab] = useState("fields");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Firestore থেকে custom fields লোড
  useEffect(() => {
    getDocs(collection(db, "customFields")).then(snap => {
      setFields(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    getDocs(collection(db, "members")).then(snap => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  // নতুন field Firestore এ সেভ + Sheet এ কলাম যোগ
  async function createField() {
    if (!newField.name || !newField.label) {
      setMsg("⚠️ Field name ও label দিতে হবে"); return;
    }
    setLoading(true);
    try {
      // Firestore এ field schema সেভ
      const docRef = await addDoc(collection(db, "customFields"), {
        ...newField,
        createdAt: new Date().toISOString(),
        visible: true
      });
      setFields(prev => [...prev, { id: docRef.id, ...newField }]);

      // Sheet এ কলাম নোট (write করতে OAuth লাগে — নিচে বিস্তারিত)
      setMsg(`✅ "${newField.label}" field তৈরি হয়েছে! Sheet এও manually কলাম যোগ করো।`);
      setNewField({ name: "", label: "", type: "text" });
    } catch (e) {
      setMsg("❌ Error: " + e.message);
    }
    setLoading(false);
  }

  // Field delete
  async function deleteField(id, label) {
    if (!window.confirm(`"${label}" field মুছবে?`)) return;
    await deleteDoc(doc(db, "customFields", id));
    setFields(prev => prev.filter(f => f.id !== id));
    setMsg(`🗑️ "${label}" মুছে গেছে`);
  }

  // Field visibility toggle
  async function toggleField(id, current) {
    await updateDoc(doc(db, "customFields", id), { visible: !current });
    setFields(prev => prev.map(f => f.id === id ? { ...f, visible: !current } : f));
  }

  const fieldTypes = [
    { value: "text", label: "টেক্সট" },
    { value: "number", label: "নম্বর" },
    { value: "select", label: "ড্রপডাউন" },
    { value: "date", label: "তারিখ" },
    { value: "url", label: "লিংক (URL)" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 680,
        maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg,#1e3a5f,#0ea5e9)",
          padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>⚙️ Admin Panel</span>
          <div style={{ display: "flex", gap: 8 }}>
            {["fields","members","import"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                background: activeTab === t ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                color: "#fff"
              }}>
                {t === "fields" ? "🔧 ফিল্ড" : t === "members" ? "👥 সদস্য" : "📥 Import"}
              </button>
            ))}
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%",
              width: 30, height: 30, cursor: "pointer", color: "#fff", fontSize: 18, lineHeight: 1
            }}>✕</button>
          </div>
        </div>

        <div style={{ overflowY: "auto", padding: 20, flex: 1 }}>
          {msg && (
            <div style={{
              padding: "10px 14px", borderRadius: 10, marginBottom: 16, fontSize: 13,
              background: msg.startsWith("✅") ? "#f0fdf4" : msg.startsWith("❌") ? "#fff1f2" : "#fffbeb",
              color: msg.startsWith("✅") ? "#16a34a" : msg.startsWith("❌") ? "#dc2626" : "#92400e",
              border: `1px solid ${msg.startsWith("✅") ? "#bbf7d0" : msg.startsWith("❌") ? "#fecaca" : "#fde68a"}`
            }}>{msg}</div>
          )}

          {/* ===== FIELDS TAB ===== */}
          {activeTab === "fields" && (
            <>
              <div style={{ background: "#f8fafc", borderRadius: 14, padding: 16, marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", marginBottom: 14 }}>➕ নতুন ফিল্ড তৈরি করো</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Field Name (English)</label>
                    <input value={newField.name} onChange={e => setNewField({...newField, name: e.target.value.replace(/\s/g,"_")})}
                      placeholder="e.g. linkedin_url"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Label (বাংলা)</label>
                    <input value={newField.label} onChange={e => setNewField({...newField, label: e.target.value})}
                      placeholder="e.g. LinkedIn প্রোফাইল"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>ধরন (Type)</label>
                    <select value={newField.type} onChange={e => setNewField({...newField, type: e.target.value})}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box", background: "#fff" }}>
                      {fieldTypes.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={createField} disabled={loading} style={{
                  marginTop: 12, padding: "10px 20px", borderRadius: 10,
                  background: "linear-gradient(135deg,#0ea5e9,#1e3a5f)", color: "#fff",
                  border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer"
                }}>
                  {loading ? "তৈরি হচ্ছে..." : "✅ Field তৈরি করো"}
                </button>
              </div>

              {/* Existing fields */}
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", marginBottom: 12 }}>
                বর্তমান Custom Fields ({fields.length}টি)
              </div>
              {fields.length === 0 && (
                <div style={{ textAlign: "center", color: "#94a3b8", padding: "30px 0", fontSize: 13 }}>
                  এখনো কোনো custom field নেই
                </div>
              )}
              {fields.map(f => (
                <div key={f.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                  border: "1.5px solid #f1f5f9", borderRadius: 12, marginBottom: 8,
                  background: f.visible ? "#fff" : "#f8fafc", opacity: f.visible ? 1 : 0.6
                }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{f.label}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>({f.name})</span>
                    <span style={{
                      marginLeft: 8, fontSize: 10, padding: "2px 7px", borderRadius: 20,
                      background: "#f0f9ff", color: "#0ea5e9", fontWeight: 600
                    }}>{f.type}</span>
                  </div>
                  <button onClick={() => toggleField(f.id, f.visible)} style={{
                    padding: "5px 12px", borderRadius: 8, border: "1px solid #e2e8f0",
                    background: f.visible ? "#f0fdf4" : "#f1f5f9", color: f.visible ? "#16a34a" : "#94a3b8",
                    cursor: "pointer", fontSize: 12, fontWeight: 600
                  }}>{f.visible ? "👁️ দৃশ্যমান" : "🚫 লুকানো"}</button>
                  <button onClick={() => deleteField(f.id, f.label)} style={{
                    padding: "5px 10px", borderRadius: 8, border: "1px solid #fecaca",
                    background: "#fff1f2", color: "#dc2626", cursor: "pointer", fontSize: 12
                  }}>🗑️</button>
                </div>
              ))}

              <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: "#fffbeb", border: "1px solid #fde68a" }}>
                <div style={{ fontSize: 12, color: "#92400e", fontWeight: 700, marginBottom: 4 }}>💡 Google Sheet Sync নির্দেশনা</div>
                <div style={{ fontSize: 12, color: "#78350f" }}>
                  নতুন field তৈরি করার পর Google Sheet এ গিয়ে সেই নামে একটি নতুন column header যোগ করো।
                  পরবর্তী version এ OAuth দিয়ে auto-sync হবে।
                </div>
              </div>
            </>
          )}

          {/* ===== MEMBERS TAB ===== */}
          {activeTab === "members" && (
            <>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", marginBottom: 14 }}>
                Firestore এ সদস্য ({members.length} জন)
              </div>
              {members.slice(0, 10).map(m => (
                <div key={m.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", border: "1px solid #f1f5f9", borderRadius: 10, marginBottom: 8
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{m.name || m.email}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{m.company} · {m.designation}</div>
                  </div>
                  <span style={{
                    fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 700,
                    background: m.status === "Active" ? "#f0fdf4" : "#fff1f2",
                    color: m.status === "Active" ? "#16a34a" : "#dc2626"
                  }}>{m.status || "Active"}</span>
                </div>
              ))}
              {members.length > 10 && <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 12 }}>...আরো {members.length - 10} জন</div>}
            </>
          )}

          {/* ===== IMPORT TAB ===== */}
          {activeTab === "import" && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: "#1e293b" }}>📥 Google Sheet থেকে Import করো</div>
              <div style={{ background: "#f0f9ff", borderRadius: 12, padding: 16, border: "1px solid #bae6fd", marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: "#0369a1", lineHeight: 1.7 }}>
                  <strong>Import এর ধাপ:</strong><br />
                  ১. Google Sheet এ সব তথ্য ভরো<br />
                  ২. Sheet টি publicly readable করো<br />
                  ৩. নিচের "Sheet থেকে Import" বাটনে ক্লিক করো<br />
                  ৪. Data Firestore এ সেভ হয়ে যাবে
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{
                  flex: 1, padding: "12px", borderRadius: 12, fontWeight: 700, fontSize: 14,
                  background: "linear-gradient(135deg,#0ea5e9,#1e3a5f)", color: "#fff", border: "none", cursor: "pointer"
                }}>📥 Sheet থেকে Import করো</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
