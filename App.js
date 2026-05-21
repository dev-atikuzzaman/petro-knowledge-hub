import { useState, useMemo } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const DISTRICTS = ["ঢাকা","চট্টগ্রাম","রাজশাহী","খুলনা","সিলেট","বরিশাল","ময়মনসিংহ","রংপুর","কুমিল্লা","নারায়ণগঞ্জ","গাজীপুর","নোয়াখালী","ফেনী","নাটোর","পাবনা","বগুড়া","দিনাজপুর","যশোর","ফরিদপুর","টাঙ্গাইল"];
const UNIVERSITIES = ["BUET","CUET","RUET","KUET","DU","SUST","NSTU","PUST","JU","IUT","AUST","BAUST","MIST","DUET"];
const SUBJECTS = ["EEE","ME","CE","CSE","ChE","IPE","Naval","Arch","URP","WRE","MSE","BME","Petroleum","Nuclear"];
const COMPANIES = ["BGFCL","BIFPCL","Petrobangla","BAPEX","GTCL","TGTDCL","JGTDCL","PGCB","DESCO","DPDC","NWPGCL","EGCB","APSCL","RPCL","BPDB","BCPCL","RPGCL","BREB","Titas Gas","Bakhrabad Gas"];
const DEPARTMENTS = ["Production","Maintenance","Electrical","Mechanical","Civil","HR","Finance","Planning","IT","Admin","Operations","Safety","Environment","Marketing","Procurement"];
const DESIGNATIONS = ["Junior Engineer","Assistant Engineer","Engineer","Senior Engineer","Assistant Manager","Deputy Manager","Manager","Senior Manager","AGM","DGM","GM","Director"];

const WHATSAPP_LINK = "https://chat.whatsapp.com/example-group-link";

const REACTIONS = ["👍","❤️","😂","😮","😢","🔥"];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const NAMES = [
  "মো. আকিব হোসেন","রাহেলা বেগম","তানভীর আহমেদ","সুমাইয়া ইসলাম","রাফি উদ্দিন","নাজমুল হক","সাদিয়া আক্তার",
  "ইমরান খান","ফারহান হোসেন","মেহেদী হাসান","নুসরাত জাহান","তাসনিম আরা","আরিফুল ইসলাম","শাহিনুর রহমান",
  "মাহমুদ হাসান","ফাতেমা তুজ জোহরা","রিফাত হোসেন","সানজিদা খানম","রাকিবুল ইসলাম","দিলরুবা আক্তার",
  "মোস্তফা কামাল","হাসিবুর রহমান","নাফিসা ইসলাম","তৌফিক আহমেদ","মাহফুজা বেগম","সজীব আহমেদ","রিমা আক্তার",
  "নাজমুস সাকিব","শারমিন আক্তার","রেজাউল করিম","মারিয়া সুলতানা","আশিকুর রহমান","পলি রানী","নাহিদ হাসান",
  "সামিরা ইসলাম","ওমর ফারুক","তাহমিনা বেগম","শফিউল আলম","লামিয়া খানম","বিপ্লব কুমার","রোকেয়া সুলতানা",
  "মুহাম্মদ আলী","ববিতা রানী","সাইফুল ইসলাম","শামীমা নাসরিন","আবু বকর","ফেরদৌসি বেগম","মিজানুর রহমান",
  "আফরোজা খানম","শাকিল আহমেদ","মোসাম্মৎ রুমি","নাদিম হোসেন","তানজিলা আক্তার","কামরুজ্জামান","বর্ষা রানী",
  "সোহেল রানা","নিলুফার ইয়াসমিন","আতিকুর রহমান","সুরাইয়া বেগম","জাহিদুল ইসলাম","মুক্তা আক্তার",
  "শাহরিয়ার হোসেন","রুকসানা বেগম","মাহবুবুর রহমান","তাসনিয়া ইসলাম","জুনায়েদ আহমেদ","ইশরাত জাহান",
  "মো. রাসেল","মৌসুমী আক্তার","আনোয়ার হোসেন","হাবিবা সুলতানা","নাসির উদ্দিন","সাহানা পারভীন",
  "মো. বাশার","শাপলা বেগম","আমিনুল ইসলাম","জান্নাতুল ফেরদৌস","তারেক মাহমুদ","রেহানা বেগম",
  "ফরহাদ হোসেন","সানজিলা ইসলাম"
];

const POST_TEXTS = [
  "আজকে BIM এর ক্লাসে Strategic Management সম্পর্কে যা শিখলাম সেটা সত্যিই চমৎকার! Vision, Mission, Goal, Objective — এই চারটার পার্থক্য এখন একদম ক্লিয়ার হয়ে গেছে।",
  "Public Procurement এর APP প্রক্রিয়া নিয়ে আজকে বিস্তারিত জানলাম। OTM আর RFQ এর threshold সম্পর্কে যারা জানতে চান, কমেন্টে জিজ্ঞেস করুন।",
  "গ্যাস ফিল্ড অপারেশনে সেফটি প্রটোকল মেনে চলা কতটা জরুরি সেটা নিয়ে একটা ছোট্ট নোট শেয়ার করলাম।",
  "Power Plant Efficiency বাড়ানোর কিছু practical tips নিয়ে আলোচনা করা যায়? আমার কিছু অভিজ্ঞতা শেয়ার করতে চাই।",
  "Financial Management এ Cash Flow Analysis কীভাবে করতে হয় — এই বিষয়ে BIM এর সেশনটা অসাধারণ ছিল।",
  "Leadership skills ডেভেলপ করতে হলে প্রথমে নিজেকে চেনা দরকার। আজকের সেশনে অনেক কিছু শিখলাম।",
  "Electrical Protection System সম্পর্কে আমার কাছে কিছু ভালো রিসোর্স আছে, যারা চান শেয়ার করব।",
  "HR Management এ Performance Appraisal system কীভাবে implement করা যায় সেটা নিয়ে ভাবছি।",
];

function generateUsers() {
  return NAMES.map((name, i) => {
    const isResigned = Math.random() < 0.08;
    const originalCompany = randomFrom(COMPANIES);
    return {
      id: i + 1,
      name,
      email: `user${i + 1}@bim.gov.bd`,
      phone: `017${randomInt(10000000, 99999999)}`,
      district: randomFrom(DISTRICTS),
      university: randomFrom(UNIVERSITIES),
      subject: randomFrom(SUBJECTS),
      company: isResigned ? randomFrom(COMPANIES) : originalCompany,
      originalCompany,
      designation: randomFrom(DESIGNATIONS),
      department: randomFrom(DEPARTMENTS),
      address: `${randomFrom(DISTRICTS)}, বাংলাদেশ`,
      status: isResigned ? "Resigned" : "Active",
      currentCompany: isResigned ? randomFrom(COMPANIES) : originalCompany,
      batch: "BIM Special Foundation Training 2025",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0d47a1,1565c0,1976d2,1e88e5,2196f3&fontFamily=Arial&fontSize=38`,
      joined: `${randomInt(1, 28)} মে, ২০২৫`,
    };
  });
}

function generatePosts(users) {
  return Array.from({ length: 12 }, (_, i) => {
    const user = users[randomInt(0, users.length - 1)];
    const reactions = {};
    REACTIONS.forEach(r => { if (Math.random() > 0.5) reactions[r] = randomInt(1, 15); });
    return {
      id: i + 1,
      userId: user.id,
      userName: user.name,
      userDesignation: user.designation,
      userCompany: user.company,
      userAvatar: user.avatar,
      text: POST_TEXTS[i % POST_TEXTS.length],
      image: Math.random() > 0.7 ? `https://picsum.photos/seed/${i + 100}/600/300` : null,
      reactions,
      comments: Array.from({ length: randomInt(0, 4) }, (_, j) => {
        const cu = users[randomInt(0, users.length - 1)];
        return {
          id: j + 1,
          userId: cu.id,
          userName: cu.name,
          userAvatar: cu.avatar,
          text: ["চমৎকার শেয়ার! ধন্যবাদ।", "খুবই informative।", "আমিও একই সমস্যায় পড়েছিলাম।", "আরো বিস্তারিত জানতে চাই।", "অনেক কাজে লাগবে।"][randomInt(0, 4)],
          replies: [],
          time: `${randomInt(1, 12)} ঘন্টা আগে`,
        };
      }),
      time: `${randomInt(1, 48)} ঘন্টা আগে`,
    };
  });
}

const USERS = generateUsers();
const POSTS_INIT = generatePosts(USERS);

// ============================================================
// ICONS (inline SVG)
// ============================================================
const Icon = {
  Home: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
  Users: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Filter: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>,
  Download: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Post: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Comment: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  WhatsApp: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  Sheet: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
  PDF: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>,
  Close: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Search: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Plus: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Send: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>,
  Menu: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Building: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
  MapPin: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  GradCap: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  Badge: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
};

// ============================================================
// EXPORT HELPERS
// ============================================================
function exportToCSV(data) {
  const headers = ["নাম","ইমেইল","ফোন","জেলা","বিশ্ববিদ্যালয়","বিষয়","প্রতিষ্ঠান","পদবী","বিভাগ","স্ট্যাটাস","বর্তমান প্রতিষ্ঠান","ব্যাচ"];
  const rows = data.map(u => [u.name,u.email,u.phone,u.district,u.university,u.subject,u.originalCompany,u.designation,u.department,u.status,u.currentCompany,u.batch]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "BIM_Members.csv"; a.click();
}

function exportToPDF(data) {
  const win = window.open("", "_blank");
  const rows = data.map(u => `
    <tr>
      <td>${u.name}</td><td>${u.district}</td><td>${u.university}</td>
      <td>${u.subject}</td><td>${u.currentCompany}</td>
      <td>${u.designation}</td><td>${u.department}</td>
      <td style="color:${u.status==='Active'?'#16a34a':'#dc2626'}">${u.status}</td>
    </tr>`).join("");
  win.document.write(`
    <html><head><meta charset="UTF-8">
    <style>
      body{font-family:'SolaimanLipi',Arial,sans-serif;padding:20px;background:#f8fafc}
      h2{color:#1e3a5f;border-bottom:3px solid #0ea5e9;padding-bottom:8px}
      table{width:100%;border-collapse:collapse;font-size:12px;margin-top:16px}
      th{background:#1e3a5f;color:#fff;padding:8px;text-align:left}
      td{padding:7px 8px;border-bottom:1px solid #e2e8f0}
      tr:hover td{background:#f0f9ff}
    </style></head>
    <body>
      <h2>🎓 BIM Special Foundation Training — সদস্য তালিকা</h2>
      <p style="color:#64748b;font-size:13px">মোট সদস্য: <b>${data.length}</b> | তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>
      <table><thead><tr>
        <th>নাম</th><th>জেলা</th><th>বিশ্ববিদ্যালয়</th><th>বিষয়</th>
        <th>প্রতিষ্ঠান</th><th>পদবী</th><th>বিভাগ</th><th>স্ট্যাটাস</th>
      </tr></thead><tbody>${rows}</tbody></table>
      <p style="margin-top:20px;color:#94a3b8;font-size:11px">BIM Knowledge Hub — Generated ${new Date().toLocaleString()}</p>
    </body></html>`);
  win.document.close(); win.print();
}

// ============================================================
// COMPONENTS
// ============================================================

function Avatar({ src, name, size = 40 }) {
  return (
    <img src={src} alt={name} width={size} height={size}
      style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0", flexShrink: 0 }} />
  );
}

function Badge({ label, color = "#0ea5e9" }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: "20px",
      fontSize: "11px", fontWeight: 600, background: color + "20", color,
      border: `1px solid ${color}40`, whiteSpace: "nowrap"
    }}>{label}</span>
  );
}

// ---- PROFILE MODAL ----
function ProfileModal({ user, onClose }) {
  if (!user) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: "20px", maxWidth: 440, width: "100%",
        boxShadow: "0 25px 60px rgba(0,0,0,0.2)", overflow: "hidden", animation: "popIn .2s ease"
      }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#1e3a5f,#0ea5e9)", padding: "28px 24px 20px", position: "relative" }}>
          <button onClick={onClose} style={{ position:"absolute",top:14,right:14,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff" }}>
            <Icon.Close />
          </button>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
            <img src={user.avatar} alt={user.name} width={72} height={72}
              style={{ borderRadius: "50%", border: "3px solid rgba(255,255,255,0.8)" }} />
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 20, lineHeight: 1.2 }}>{user.name}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 }}>{user.designation}</div>
              <div style={{ marginTop: 8 }}>
                <span style={{
                  padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: user.status === "Active" ? "#22c55e" : "#ef4444", color: "#fff"
                }}>{user.status === "Active" ? "✓ Active" : "✗ Resigned"}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          {[
            { icon: <Icon.Building />, label: "বর্তমান প্রতিষ্ঠান", value: user.currentCompany },
            { icon: <Icon.Badge />, label: "বিভাগ", value: user.department },
            { icon: <Icon.GradCap />, label: "বিশ্ববিদ্যালয়", value: `${user.university} — ${user.subject}` },
            { icon: <Icon.MapPin />, label: "জেলা", value: user.district },
            { icon: <Icon.MapPin />, label: "বর্তমান ঠিকানা", value: user.address },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ color: "#0ea5e9", marginTop: 1 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 14, color: "#1e293b", fontWeight: 600 }}>{item.value}</div>
              </div>
            </div>
          ))}
          {user.status === "Resigned" && (
            <div style={{ background: "#fef3c7", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#92400e", fontWeight: 600 }}>পূর্ববর্তী প্রতিষ্ঠান</div>
              <div style={{ fontSize: 14, color: "#78350f" }}>{user.originalCompany}</div>
            </div>
          )}
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge label={user.batch} color="#7c3aed" />
            <Badge label={`যোগদান: ${user.joined}`} color="#0ea5e9" />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <a href={`mailto:${user.email}`} style={{
              flex: 1, textAlign: "center", padding: "9px", borderRadius: 10, fontSize: 13,
              background: "#f0f9ff", color: "#0ea5e9", textDecoration: "none", fontWeight: 600, border: "1px solid #bae6fd"
            }}>📧 Email</a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" style={{
              flex: 1, textAlign: "center", padding: "9px", borderRadius: 10, fontSize: 13,
              background: "#f0fdf4", color: "#16a34a", textDecoration: "none", fontWeight: 600, border: "1px solid #bbf7d0"
            }}><span style={{ display:"inline-flex",alignItems:"center",gap:4 }}><Icon.WhatsApp /> Group</span></a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- MULTI SELECT ----
function MultiSelect({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "9px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0",
        background: "#fff", textAlign: "left", cursor: "pointer", fontSize: 13, color: "#374151",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <span>{value.length ? `${label} (${value.length})` : label}</span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff",
          border: "1.5px solid #e2e8f0", borderRadius: 10, zIndex: 50, maxHeight: 200, overflowY: "auto",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
        }}>
          {options.map(opt => (
            <label key={opt} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer",
              fontSize: 13, background: value.includes(opt) ? "#f0f9ff" : "#fff",
              color: value.includes(opt) ? "#0ea5e9" : "#374151"
            }}>
              <input type="checkbox" checked={value.includes(opt)}
                onChange={() => onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt])}
                style={{ accentColor: "#0ea5e9" }} />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- POST CARD ----
function PostCard({ post, currentUser }) {
  const [comments, setComments] = useState(post.comments);
  const [reactions, setReactions] = useState(post.reactions);
  const [showReactions, setShowReactions] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

  function handleReact(emoji) {
    setReactions(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
    setShowReactions(false);
  }
  function addComment() {
    if (!commentText.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now(), userId: currentUser.id, userName: currentUser.name,
      userAvatar: currentUser.avatar, text: commentText, replies: [], time: "এখনই"
    }]);
    setCommentText("");
  }
  function addReply(commentId) {
    if (!replyText.trim()) return;
    setComments(prev => prev.map(c => c.id === commentId ? {
      ...c, replies: [...c.replies, {
        id: Date.now(), userName: currentUser.name,
        userAvatar: currentUser.avatar, text: replyText, time: "এখনই"
      }]
    } : c));
    setReplyText(""); setReplyTo(null);
  }

  return (
    <div style={{
      background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden",
      transition: "box-shadow .2s", marginBottom: 16
    }}>
      <div style={{ padding: "16px 18px" }}>
        {/* Author */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <Avatar src={post.userAvatar} name={post.userName} size={44} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{post.userName}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{post.userDesignation} · {post.userCompany}</div>
          </div>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>{post.time}</span>
        </div>
        {/* Text */}
        <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, marginBottom: post.image ? 12 : 0 }}>{post.text}</p>
        {/* Image */}
        {post.image && <img src={post.image} alt="" style={{ width: "100%", borderRadius: 10, display: "block", maxHeight: 240, objectFit: "cover" }} />}
        {/* Reaction counts */}
        {totalReactions > 0 && (
          <div style={{ display: "flex", gap: 4, marginTop: 12, flexWrap: "wrap" }}>
            {Object.entries(reactions).map(([emoji, count]) => count > 0 && (
              <span key={emoji} style={{
                fontSize: 12, background: "#f8fafc", border: "1px solid #e2e8f0",
                borderRadius: 20, padding: "2px 8px", color: "#475569"
              }}>{emoji} {count}</span>
            ))}
          </div>
        )}
      </div>
      {/* Actions */}
      <div style={{
        borderTop: "1px solid #f1f5f9", padding: "10px 18px",
        display: "flex", gap: 6, position: "relative"
      }}>
        <div style={{ position: "relative" }}>
          <button onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}
            style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 5 }}>
            👍 রিয়েক্ট
          </button>
          {showReactions && (
            <div onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}
              style={{
                position: "absolute", bottom: "100%", left: 0, background: "#fff",
                border: "1px solid #e2e8f0", borderRadius: 30, padding: "6px 10px",
                display: "flex", gap: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", zIndex: 10, marginBottom: 4
              }}>
              {REACTIONS.map(r => (
                <button key={r} onClick={() => handleReact(r)} style={{
                  fontSize: 22, background: "none", border: "none", cursor: "pointer",
                  transition: "transform .15s", lineHeight: 1
                }} onMouseEnter={e => e.target.style.transform = "scale(1.3)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"}>{r}</button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowComments(!showComments)} style={{
          padding: "7px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff",
          cursor: "pointer", fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 5
        }}>
          <Icon.Comment /> কমেন্ট ({comments.length})
        </button>
        <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" style={{
          marginLeft: "auto", padding: "7px 12px", borderRadius: 8, border: "1px solid #bbf7d0",
          background: "#f0fdf4", color: "#16a34a", textDecoration: "none", fontSize: 12,
          display: "flex", alignItems: "center", gap: 5, fontWeight: 600
        }}>
          <Icon.WhatsApp /> WhatsApp
        </a>
      </div>
      {/* Comments */}
      {showComments && (
        <div style={{ padding: "0 18px 14px", borderTop: "1px solid #f8fafc" }}>
          {comments.map(c => (
            <div key={c.id} style={{ marginTop: 12 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Avatar src={c.userAvatar} name={c.userName} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ background: "#f8fafc", borderRadius: "0 10px 10px 10px", padding: "8px 12px" }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: "#1e293b", marginBottom: 3 }}>{c.userName}</div>
                    <div style={{ fontSize: 13, color: "#334155" }}>{c.text}</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 4, paddingLeft: 4 }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{c.time}</span>
                    <button onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                      style={{ fontSize: 11, color: "#0ea5e9", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Reply</button>
                  </div>
                  {/* Replies */}
                  {c.replies.map((r, ri) => (
                    <div key={ri} style={{ display: "flex", gap: 8, marginTop: 8, paddingLeft: 8 }}>
                      <Avatar src={r.userAvatar} name={r.userName} size={26} />
                      <div style={{ background: "#f0f9ff", borderRadius: "0 8px 8px 8px", padding: "6px 10px" }}>
                        <div style={{ fontWeight: 700, fontSize: 11, color: "#0ea5e9", marginBottom: 2 }}>{r.userName}</div>
                        <div style={{ fontSize: 12, color: "#334155" }}>{r.text}</div>
                      </div>
                    </div>
                  ))}
                  {/* Reply input */}
                  {replyTo === c.id && (
                    <div style={{ display: "flex", gap: 8, marginTop: 8, paddingLeft: 8 }}>
                      <input value={replyText} onChange={e => setReplyText(e.target.value)}
                        placeholder="Reply লিখুন..." style={{ flex: 1, padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}
                        onKeyDown={e => e.key === "Enter" && addReply(c.id)} />
                      <button onClick={() => addReply(c.id)} style={{
                        padding: "6px 10px", borderRadius: 8, background: "#0ea5e9", color: "#fff",
                        border: "none", cursor: "pointer", display: "flex", alignItems: "center"
                      }}><Icon.Send /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Comment input */}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Avatar src={currentUser.avatar} name={currentUser.name} size={32} />
            <input value={commentText} onChange={e => setCommentText(e.target.value)}
              placeholder="কমেন্ট করুন..." style={{
                flex: 1, padding: "8px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0",
                fontSize: 13, outline: "none"
              }} onKeyDown={e => e.key === "Enter" && addComment()} />
            <button onClick={addComment} style={{
              padding: "8px 12px", borderRadius: 10, background: "#0ea5e9", color: "#fff",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center"
            }}><Icon.Send /></button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- CREATE POST MODAL ----
function CreatePostModal({ currentUser, onClose, onPost }) {
  const [text, setText] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  function submit() {
    if (!text.trim()) return;
    onPost({
      id: Date.now(), userId: currentUser.id, userName: currentUser.name,
      userDesignation: currentUser.designation, userCompany: currentUser.company,
      userAvatar: currentUser.avatar, text, image: imgUrl || null,
      reactions: {}, comments: [], time: "এখনই"
    });
    onClose();
  }
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 500, boxShadow: "0 20px 50px rgba(0,0,0,0.18)", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg,#1e3a5f,#0ea5e9)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>✏️ নতুন পোস্ট করুন</span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.Close /></button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <Avatar src={currentUser.avatar} name={currentUser.name} size={44} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{currentUser.name}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{currentUser.designation}</div>
            </div>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="আপনার জ্ঞান বা অভিজ্ঞতা শেয়ার করুন..."
            style={{ width: "100%", minHeight: 110, padding: "12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          <input value={imgUrl} onChange={e => setImgUrl(e.target.value)}
            placeholder="🖼️ ছবির URL (ঐচ্ছিক)"
            style={{ width: "100%", marginTop: 10, padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          <button onClick={submit} style={{
            marginTop: 14, width: "100%", padding: "11px", borderRadius: 10,
            background: "linear-gradient(135deg,#0ea5e9,#1e3a5f)", color: "#fff",
            border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer"
          }}>পোস্ট করুন →</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const currentUser = USERS[0];
  const [tab, setTab] = useState("feed");
  const [posts, setPosts] = useState(POSTS_INIT);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [filterDistrict, setFilterDistrict] = useState([]);
  const [filterUniversity, setFilterUniversity] = useState([]);
  const [filterSubject, setFilterSubject] = useState([]);
  const [filterCompany, setFilterCompany] = useState([]);
  const [filterDept, setFilterDept] = useState([]);

  const filteredUsers = useMemo(() => {
    return USERS.filter(u => {
      const q = searchText.toLowerCase();
      const matchSearch = !q || u.name.includes(q) || u.district.includes(q) || u.university.toLowerCase().includes(q) || u.subject.toLowerCase().includes(q) || u.company.toLowerCase().includes(q);
      const matchDistrict = !filterDistrict.length || filterDistrict.includes(u.district);
      const matchUni = !filterUniversity.length || filterUniversity.includes(u.university);
      const matchSub = !filterSubject.length || filterSubject.includes(u.subject);
      const matchComp = !filterCompany.length || filterCompany.includes(u.currentCompany);
      const matchDept = !filterDept.length || filterDept.includes(u.department);
      return matchSearch && matchDistrict && matchUni && matchSub && matchComp && matchDept;
    });
  }, [searchText, filterDistrict, filterUniversity, filterSubject, filterCompany, filterDept]);

  function clearFilters() {
    setSearchText(""); setFilterDistrict([]); setFilterUniversity([]);
    setFilterSubject([]); setFilterCompany([]); setFilterDept([]);
  }

  const stats = useMemo(() => ({
    total: USERS.length,
    active: USERS.filter(u => u.status === "Active").length,
    companies: new Set(USERS.map(u => u.currentCompany)).size,
    universities: new Set(USERS.map(u => u.university)).size,
  }), []);

  const NavItem = ({ id, icon, label }) => (
    <button onClick={() => { setTab(id); setMobileMenu(false); }} style={{
      display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderRadius: 12,
      border: "none", background: tab === id ? "linear-gradient(135deg,#0ea5e9,#1e3a5f)" : "transparent",
      color: tab === id ? "#fff" : "#64748b", cursor: "pointer", fontSize: 14, fontWeight: tab === id ? 700 : 500,
      width: "100%", textAlign: "left", transition: "all .2s"
    }}>
      {icon}{label}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Hind Siliguri', 'SolaimanLipi', Arial, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes popIn { from { transform: scale(.9); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes fadeUp { from { transform: translateY(10px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        ::-webkit-scrollbar { width: 5px } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px }
        button:hover { opacity: .92 } a:hover { opacity: .85 }
      `}</style>

      {/* TOP NAV */}
      <div style={{
        background: "linear-gradient(135deg,#1e3a5f 0%,#0c2040 100%)",
        padding: "0 20px", display: "flex", alignItems: "center", height: 58,
        boxShadow: "0 2px 20px rgba(0,0,0,0.2)", position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#0ea5e9,#38bdf8)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎓</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1.1 }}>BIM Knowledge Hub</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10 }}>Special Foundation Training 2025</div>
          </div>
        </div>
        {/* Desktop nav */}
        <div style={{ display: "flex", gap: 4 }} className="desktop-nav">
          {[{id:"feed",label:"ফিড"},{id:"members",label:"সদস্য"},{id:"stats",label:"পরিসংখ্যান"}].map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              padding: "6px 16px", borderRadius: 8, border: "none",
              background: tab === n.id ? "rgba(255,255,255,0.2)" : "transparent",
              color: tab === n.id ? "#fff" : "rgba(255,255,255,0.65)",
              cursor: "pointer", fontSize: 13, fontWeight: tab === n.id ? 700 : 400,
              transition: "all .2s"
            }}>{n.label}</button>
          ))}
        </div>
        <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" style={{
          marginLeft: 12, padding: "7px 14px", borderRadius: 10, background: "#25D366",
          color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 6
        }}>
          <Icon.WhatsApp /> Group
        </a>
        <button onClick={() => setMobileMenu(!mobileMenu)} style={{
          marginLeft: 8, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8,
          padding: "6px 8px", cursor: "pointer", color: "#fff", display: "none"
        }} id="hamburger">
          <Icon.Menu />
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div style={{ background: "#1e3a5f", padding: "8px 16px 16px" }}>
          {[{id:"feed",icon:<Icon.Home />,label:"ফিড"},{id:"members",icon:<Icon.Users />,label:"সদস্য"},{id:"stats",icon:<Icon.Filter />,label:"পরিসংখ্যান"}].map(n => (
            <NavItem key={n.id} {...n} />
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px", display: "flex", gap: 20, alignItems: "flex-start" }}>

        {/* LEFT SIDEBAR — desktop */}
        <div style={{ width: 220, flexShrink: 0, position: "sticky", top: 78 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 14px" }}>
              <Avatar src={currentUser.avatar} name={currentUser.name} size={56} />
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8, textAlign: "center", color: "#1e293b" }}>{currentUser.name}</div>
              <div style={{ fontSize: 11, color: "#64748b", textAlign: "center", marginTop: 2 }}>{currentUser.designation}</div>
              <div style={{ fontSize: 11, color: "#0ea5e9", fontWeight: 600, marginTop: 2 }}>{currentUser.company}</div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
              <NavItem id="feed" icon={<Icon.Home />} label="নিউজ ফিড" />
              <NavItem id="members" icon={<Icon.Users />} label="সদস্য তালিকা" />
              <NavItem id="stats" icon={<Icon.Filter />} label="পরিসংখ্যান" />
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>ব্যাচ সংখ্যা</div>
            {[{l:"মোট সদস্য",v:stats.total,c:"#0ea5e9"},{l:"সক্রিয়",v:stats.active,c:"#22c55e"},{l:"প্রতিষ্ঠান",v:stats.companies,c:"#f59e0b"},{l:"বিশ্ববিদ্যালয়",v:stats.universities,c:"#7c3aed"}].map(s => (
              <div key={s.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#374151" }}>{s.l}</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: s.c }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, minWidth: 0, animation: "fadeUp .3s ease" }}>

          {/* ===== FEED TAB ===== */}
          {tab === "feed" && (
            <>
              {/* Create post bar */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "14px 18px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", gap: 12, alignItems: "center" }}>
                <Avatar src={currentUser.avatar} name={currentUser.name} size={42} />
                <button onClick={() => setShowCreatePost(true)} style={{
                  flex: 1, textAlign: "left", padding: "10px 16px", borderRadius: 22,
                  border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#94a3b8",
                  cursor: "pointer", fontSize: 14
                }}>আপনার জ্ঞান বা অভিজ্ঞতা শেয়ার করুন... ✍️</button>
                <button onClick={() => setShowCreatePost(true)} style={{
                  padding: "9px 16px", borderRadius: 12, background: "linear-gradient(135deg,#0ea5e9,#1e3a5f)",
                  color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700
                }}><Icon.Plus /> পোস্ট</button>
              </div>
              {posts.map(p => <PostCard key={p.id} post={p} currentUser={currentUser} />)}
            </>
          )}

          {/* ===== MEMBERS TAB ===== */}
          {tab === "members" && (
            <>
              {/* Filter Panel */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 18, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon.Filter />
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>ফিল্টার ও সার্চ</span>
                    <span style={{ background: "#f0f9ff", color: "#0ea5e9", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{filteredUsers.length} জন</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={clearFilters} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer", fontSize: 12 }}>রিসেট</button>
                    <button onClick={() => exportToCSV(filteredUsers)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #bbf7d0", background: "#f0fdf4", color: "#16a34a", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5, fontWeight: 600 }}>
                      <Icon.Sheet /> Sheets
                    </button>
                    <button onClick={() => exportToPDF(filteredUsers)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #fecaca", background: "#fff1f2", color: "#dc2626", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5, fontWeight: 600 }}>
                      <Icon.PDF /> PDF
                    </button>
                  </div>
                </div>
                {/* Search */}
                <div style={{ position: "relative", marginBottom: 12 }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}><Icon.Search /></span>
                  <input value={searchText} onChange={e => setSearchText(e.target.value)}
                    placeholder="নাম, জেলা, বিশ্ববিদ্যালয়, বিষয় দিয়ে খুঁজুন..."
                    style={{ width: "100%", padding: "10px 12px 10px 38px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none" }} />
                </div>
                {/* Filters grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 }}>
                  <MultiSelect label="জেলা" options={DISTRICTS} value={filterDistrict} onChange={setFilterDistrict} />
                  <MultiSelect label="বিশ্ববিদ্যালয়" options={UNIVERSITIES} value={filterUniversity} onChange={setFilterUniversity} />
                  <MultiSelect label="বিষয়" options={SUBJECTS} value={filterSubject} onChange={setFilterSubject} />
                  <MultiSelect label="প্রতিষ্ঠান" options={COMPANIES} value={filterCompany} onChange={setFilterCompany} />
                  <MultiSelect label="বিভাগ" options={DEPARTMENTS} value={filterDept} onChange={setFilterDept} />
                </div>
              </div>

              {/* Member Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
                {filteredUsers.map(u => (
                  <div key={u.id} onClick={() => setSelectedUser(u)} style={{
                    background: "#fff", borderRadius: 14, padding: 16, cursor: "pointer",
                    border: "1.5px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    transition: "all .2s", animation: "fadeUp .25s ease"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#0ea5e9"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(14,165,233,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                      <Avatar src={u.avatar} name={u.name} size={46} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{u.designation}</div>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
                          background: u.status === "Active" ? "#f0fdf4" : "#fff1f2",
                          color: u.status === "Active" ? "#16a34a" : "#dc2626",
                          border: `1px solid ${u.status === "Active" ? "#bbf7d0" : "#fecaca"}`
                        }}>{u.status}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {[
                        { icon: <Icon.Building />, text: u.currentCompany },
                        { icon: <Icon.GradCap />, text: `${u.university} · ${u.subject}` },
                        { icon: <Icon.MapPin />, text: u.district },
                      ].map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 12 }}>
                          <span style={{ color: "#0ea5e9", flexShrink: 0 }}>{item.icon}</span>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {filteredUsers.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                  <div style={{ fontSize: 40 }}>🔍</div>
                  <div style={{ fontSize: 16, marginTop: 12 }}>কোনো সদস্য পাওয়া যায়নি</div>
                  <button onClick={clearFilters} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 10, background: "#0ea5e9", color: "#fff", border: "none", cursor: "pointer" }}>ফিল্টার সরান</button>
                </div>
              )}
            </>
          )}

          {/* ===== STATS TAB ===== */}
          {tab === "stats" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
                {[
                  { label: "মোট সদস্য", value: stats.total, icon: "👥", color: "#0ea5e9", bg: "#f0f9ff" },
                  { label: "সক্রিয় সদস্য", value: stats.active, icon: "✅", color: "#22c55e", bg: "#f0fdf4" },
                  { label: "প্রতিষ্ঠান", value: stats.companies, icon: "🏢", color: "#f59e0b", bg: "#fffbeb" },
                  { label: "বিশ্ববিদ্যালয়", value: stats.universities, icon: "🎓", color: "#7c3aed", bg: "#faf5ff" },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: "18px 20px", border: `1.5px solid ${s.color}20` }}>
                    <div style={{ fontSize: 28 }}>{s.icon}</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1.2, marginTop: 8 }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Top districts */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#1e293b" }}>📍 জেলা অনুযায়ী বিতরণ</div>
                {Object.entries(USERS.reduce((acc, u) => { acc[u.district] = (acc[u.district] || 0) + 1; return acc; }, {}))
                  .sort((a, b) => b[1] - a[1]).slice(0, 8)
                  .map(([district, count]) => (
                    <div key={district} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ width: 80, fontSize: 13, color: "#374151", flexShrink: 0 }}>{district}</span>
                      <div style={{ flex: 1, height: 10, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                        <div style={{ width: `${(count / USERS.length) * 100}%`, height: "100%", background: "linear-gradient(90deg,#0ea5e9,#38bdf8)", borderRadius: 10, transition: "width .6s ease" }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0ea5e9", width: 24, textAlign: "right" }}>{count}</span>
                    </div>
                  ))}
              </div>
              {/* Top companies */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#1e293b" }}>🏢 প্রতিষ্ঠান অনুযায়ী বিতরণ</div>
                {Object.entries(USERS.reduce((acc, u) => { acc[u.currentCompany] = (acc[u.currentCompany] || 0) + 1; return acc; }, {}))
                  .sort((a, b) => b[1] - a[1]).slice(0, 8)
                  .map(([company, count]) => (
                    <div key={company} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ width: 120, fontSize: 12, color: "#374151", flexShrink: 0 }}>{company}</span>
                      <div style={{ flex: 1, height: 10, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                        <div style={{ width: `${(count / USERS.length) * 100}%`, height: "100%", background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 10 }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed", width: 24, textAlign: "right" }}>{count}</span>
                    </div>
                  ))}
              </div>
              {/* Export all */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: "#1e293b" }}>📤 ডেটা এক্সপোর্ট</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button onClick={() => exportToCSV(USERS)} style={{
                    padding: "12px 22px", borderRadius: 12, background: "#f0fdf4", color: "#16a34a",
                    border: "1.5px solid #bbf7d0", cursor: "pointer", fontWeight: 700, fontSize: 14,
                    display: "flex", alignItems: "center", gap: 8
                  }}><Icon.Sheet /> সকল সদস্যের CSV (Google Sheets)</button>
                  <button onClick={() => exportToPDF(USERS)} style={{
                    padding: "12px 22px", borderRadius: 12, background: "#fff1f2", color: "#dc2626",
                    border: "1.5px solid #fecaca", cursor: "pointer", fontWeight: 700, fontSize: 14,
                    display: "flex", alignItems: "center", gap: 8
                  }}><Icon.PDF /> সকল সদস্যের PDF</button>
                </div>
                <p style={{ marginTop: 12, fontSize: 12, color: "#94a3b8" }}>💡 সদস্য তালিকায় গিয়ে ফিল্টার করেও নির্দিষ্ট গ্রুপের ডেটা ডাউনলোড করা যাবে।</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {showCreatePost && (
        <CreatePostModal currentUser={currentUser}
          onClose={() => setShowCreatePost(false)}
          onPost={post => setPosts(prev => [post, ...prev])} />
      )}
      {selectedUser && <ProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}
