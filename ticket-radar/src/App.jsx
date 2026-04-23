import { useState, useEffect, useRef, useCallback } from "react";

// ── Theme & Constants ──────────────────────────────────────────────
const ALERT_RADIUS_METERS = 900;
const CHECK_INTERVAL_MS = 15000;

const theme = {
  bg: "#0a0a0f",
  surface: "#12121a",
  surfaceHover: "#1a1a26",
  card: "#16161f",
  border: "#2a2a3a",
  accent: "#ff3b30",
  accentGlow: "rgba(255, 59, 48, 0.25)",
  accentSoft: "#ff6b63",
  success: "#30d158",
  successGlow: "rgba(48, 209, 88, 0.2)",
  warning: "#ffd60a",
  warningGlow: "rgba(255, 214, 10, 0.15)",
  text: "#f5f5f7",
  textSec: "#8e8e93",
  textMuted: "#636366",
  blue: "#0a84ff",
  blueGlow: "rgba(10, 132, 255, 0.2)",
};

// ── Styles ──────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700&family=Space+Mono:wght@400;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: ${theme.bg};
    color: ${theme.text};
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .app {
    max-width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  /* Header */
  .header {
    padding: 20px 20px 16px;
    position: sticky;
    top: 0;
    z-index: 100;
    background: linear-gradient(to bottom, ${theme.bg} 60%, transparent);
    backdrop-filter: blur(20px);
  }

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, ${theme.accent}, #ff6347);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 4px 16px ${theme.accentGlow};
  }

  .logo-text {
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, ${theme.text}, ${theme.accentSoft});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .monitoring-badge {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 1px;
    text-transform: uppercase;
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .monitoring-on {
    background: ${theme.successGlow};
    color: ${theme.success};
    border: 1px solid rgba(48, 209, 88, 0.3);
  }

  .monitoring-off {
    background: rgba(142, 142, 147, 0.1);
    color: ${theme.textMuted};
    border: 1px solid rgba(142, 142, 147, 0.2);
  }

  @keyframes pulse-glow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  /* Upload Zone */
  .upload-section {
    padding: 0 20px;
    margin-bottom: 24px;
  }

  .upload-zone {
    border: 2px dashed ${theme.border};
    border-radius: 20px;
    padding: 32px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: ${theme.surface};
    position: relative;
    overflow: hidden;
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: ${theme.accent};
    background: rgba(255, 59, 48, 0.05);
    box-shadow: 0 0 40px ${theme.accentGlow};
    transform: translateY(-2px);
  }

  .upload-zone::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at 50% 0%, ${theme.accentGlow} 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .upload-zone:hover::before { opacity: 1; }

  .upload-icon {
    font-size: 48px;
    margin-bottom: 12px;
    display: block;
  }

  .upload-title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 6px;
  }

  .upload-subtitle {
    color: ${theme.textSec};
    font-size: 13px;
    margin-bottom: 16px;
  }

  .upload-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .btn {
    padding: 10px 20px;
    border-radius: 12px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary {
    background: linear-gradient(135deg, ${theme.accent}, #ff6347);
    color: white;
    box-shadow: 0 4px 16px ${theme.accentGlow};
  }

  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px ${theme.accentGlow};
  }

  .btn-secondary {
    background: ${theme.surfaceHover};
    color: ${theme.text};
    border: 1px solid ${theme.border};
  }

  .btn-secondary:hover {
    background: ${theme.border};
  }

  .btn-sm {
    padding: 6px 14px;
    font-size: 12px;
    border-radius: 8px;
  }

  /* Processing */
  .processing-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 10, 15, 0.9);
    backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }

  .scanner {
    width: 120px;
    height: 120px;
    position: relative;
    margin-bottom: 24px;
  }

  .scanner-border {
    position: absolute;
    inset: 0;
    border: 3px solid ${theme.accent};
    border-radius: 16px;
    opacity: 0.3;
  }

  .scanner-line {
    position: absolute;
    left: 10%;
    right: 10%;
    height: 3px;
    background: ${theme.accent};
    box-shadow: 0 0 20px ${theme.accent};
    border-radius: 2px;
    animation: scan 2s ease-in-out infinite;
  }

  @keyframes scan {
    0%, 100% { top: 10%; }
    50% { top: 80%; }
  }

  .processing-text {
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    color: ${theme.accentSoft};
    letter-spacing: 1px;
  }

  /* Address Input */
  .address-input-section {
    padding: 0 20px;
    margin-bottom: 20px;
  }

  .address-input-card {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 16px;
    padding: 16px;
  }

  .address-input-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: ${theme.textSec};
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .address-input {
    width: 100%;
    background: ${theme.bg};
    border: 1px solid ${theme.border};
    border-radius: 10px;
    padding: 12px 14px;
    color: ${theme.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }

  .address-input:focus {
    border-color: ${theme.accent};
    box-shadow: 0 0 0 3px ${theme.accentGlow};
  }

  .address-input::placeholder {
    color: ${theme.textMuted};
  }

  .address-submit-row {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }

  .address-submit-row .address-input {
    flex: 1;
  }

  /* Ticket Cards */
  .tickets-section {
    padding: 0 20px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .section-title {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: ${theme.textSec};
  }

  .ticket-count {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: ${theme.accent};
    background: ${theme.accentGlow};
    padding: 2px 10px;
    border-radius: 10px;
  }

  .ticket-card {
    background: ${theme.card};
    border: 1px solid ${theme.border};
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .ticket-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    border-radius: 3px 0 0 3px;
  }

  .ticket-card.active::before { background: ${theme.accent}; }
  .ticket-card.safe::before { background: ${theme.success}; }

  .ticket-card:hover {
    border-color: ${theme.textMuted};
    transform: translateX(4px);
  }

  .ticket-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .ticket-type {
    font-weight: 700;
    font-size: 15px;
  }

  .ticket-status {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 3px 8px;
    border-radius: 6px;
  }

  .status-alert {
    background: ${theme.accentGlow};
    color: ${theme.accent};
  }

  .status-monitoring {
    background: ${theme.blueGlow};
    color: ${theme.blue};
  }

  .status-safe {
    background: ${theme.successGlow};
    color: ${theme.success};
  }

  .ticket-address {
    font-size: 13px;
    color: ${theme.textSec};
    margin-bottom: 10px;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    line-height: 1.4;
  }

  .ticket-meta {
    display: flex;
    gap: 16px;
    font-size: 11px;
    color: ${theme.textMuted};
    margin-bottom: 12px;
  }

  .ticket-actions {
    display: flex;
    gap: 8px;
  }

  .btn-danger {
    background: rgba(255, 59, 48, 0.1);
    color: ${theme.accent};
    border: 1px solid rgba(255, 59, 48, 0.2);
  }

  .btn-danger:hover {
    background: rgba(255, 59, 48, 0.2);
  }

  /* Map Preview */
  .map-preview {
    width: 100%;
    height: 180px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 12px;
    background: ${theme.bg};
    border: 1px solid ${theme.border};
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .map-preview img,
  .map-preview iframe {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: none;
    border-radius: 12px;
    pointer-events: auto;
  }

  .map-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: ${theme.textMuted};
    font-size: 12px;
  }

  .radius-indicator {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background: rgba(10, 10, 15, 0.85);
    backdrop-filter: blur(8px);
    padding: 4px 10px;
    border-radius: 8px;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: ${theme.warning};
    border: 1px solid rgba(255, 214, 10, 0.2);
  }

  /* Proximity Alert */
  .proximity-alert {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    max-width: 480px;
    width: 100%;
    z-index: 300;
    padding: 20px;
    animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .proximity-alert-inner {
    background: linear-gradient(135deg, rgba(255, 59, 48, 0.15), rgba(255, 59, 48, 0.05));
    border: 1px solid rgba(255, 59, 48, 0.4);
    border-radius: 16px;
    padding: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px ${theme.accentGlow};
  }

  .alert-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .alert-pulse {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${theme.accent};
    animation: alert-blink 1s ease-in-out infinite;
  }

  @keyframes alert-blink {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 ${theme.accent}; }
    50% { opacity: 0.5; box-shadow: 0 0 0 8px transparent; }
  }

  .alert-title {
    font-weight: 700;
    font-size: 15px;
    color: ${theme.accent};
  }

  .alert-body {
    font-size: 13px;
    color: ${theme.textSec};
    line-height: 1.5;
    margin-bottom: 10px;
    padding-left: 20px;
  }

  .alert-dismiss {
    margin-left: 20px;
  }

  @keyframes slide-down {
    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 48px 20px;
    color: ${theme.textMuted};
  }

  .empty-icon { font-size: 56px; margin-bottom: 16px; display: block; }

  .empty-title {
    font-weight: 600;
    font-size: 16px;
    color: ${theme.textSec};
    margin-bottom: 8px;
  }

  .empty-sub {
    font-size: 13px;
    max-width: 260px;
    margin: 0 auto;
    line-height: 1.5;
  }

  /* Thumb preview */
  .thumb-preview {
    width: 100%;
    max-height: 200px;
    object-fit: contain;
    border-radius: 12px;
    margin-bottom: 12px;
    border: 1px solid ${theme.border};
  }

  /* Misc */
  .divider {
    height: 1px;
    background: ${theme.border};
    margin: 16px 20px;
  }

  .bottom-pad { height: 100px; }

  /* Toast */
  .toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: ${theme.card};
    border: 1px solid ${theme.border};
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 13px;
    color: ${theme.text};
    z-index: 250;
    animation: toast-in 0.3s ease-out;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  }

  @keyframes toast-in {
    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }

  /* Ticket image preview modal */
  .image-modal {
    position: fixed;
    inset: 0;
    z-index: 250;
    background: rgba(10,10,15,0.92);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .image-modal img {
    max-width: 100%;
    max-height: 85vh;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .image-modal-close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    color: ${theme.text};
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
  }
`;

// ── Helpers ──────────────────────────────────────────────────────────
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Icons (inline SVG) ──────────────────────────────────────────────
const Icons = {
  Camera: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  Upload: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
  ),
  Navigation: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
  ),
};

// ══════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════
export default function TicketAlertApp() {
  const [tickets, setTickets] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [userPos, setUserPos] = useState(null);
  const [proximityAlerts, setProximityAlerts] = useState([]);
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [manualAddress, setManualAddress] = useState("");
  const [showManual, setShowManual] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const watchIdRef = useRef(null);

  // Show toast helper
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Geolocation watch ──────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.warn("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // ── Proximity check ────────────────────────────────────────────────
  useEffect(() => {
    if (!userPos || tickets.length === 0) return;

    const interval = setInterval(() => {
      const alerts = [];
      tickets.forEach((t) => {
        if (!t.lat || !t.lng) return;
        const dist = haversineDistance(userPos.lat, userPos.lng, t.lat, t.lng);
        if (dist <= ALERT_RADIUS_METERS) {
          alerts.push({ ...t, distance: Math.round(dist) });
        }
      });
      setProximityAlerts(alerts);
    }, CHECK_INTERVAL_MS);

    // Run immediately once
    const immediateAlerts = [];
    tickets.forEach((t) => {
      if (!t.lat || !t.lng) return;
      const dist = haversineDistance(userPos.lat, userPos.lng, t.lat, t.lng);
      if (dist <= ALERT_RADIUS_METERS) {
        immediateAlerts.push({ ...t, distance: Math.round(dist) });
      }
    });
    setProximityAlerts(immediateAlerts);

    return () => clearInterval(interval);
  }, [userPos, tickets]);

  // ── Clean police/ticket address format for geocoding ─────────────
  const cleanTicketAddress = (raw) => {
    if (!raw) return [];
    const queries = [raw];

    // Remove "Block" pattern: "5500 Block 210 SB Indian Head Highway" → "5500 Indian Head Highway"
    let cleaned = raw.replace(/\bBlock\s+\d+\s*(SB|NB|EB|WB)?\s*/gi, "").trim();
    if (cleaned !== raw) queries.push(cleaned);

    // Remove directional prefixes: SB, NB, EB, WB
    cleaned = cleaned.replace(/\b(SB|NB|EB|WB)\b\s*/gi, "").trim();
    if (!queries.includes(cleaned)) queries.push(cleaned);

    // Try just street + city + state (remove block numbers entirely)
    const streetMatch = raw.match(/(?:Indian Head Highway|[\w\s]+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Highway|Hwy|Pike|Way|Court|Ct|Place|Pl))/i);
    if (streetMatch) {
      const cityState = raw.match(/,?\s*([\w\s]+,\s*[A-Z]{2})\s*$/i);
      const townMatch = raw.match(/Town of ([\w\s]+)/i);
      const countyMatch = raw.match(/([\w\s]+County)/i);
      let simpleAddr = streetMatch[0].trim();
      if (townMatch) simpleAddr += ", " + townMatch[1].trim();
      else if (cityState) simpleAddr += ", " + cityState[1].trim();
      if (countyMatch) simpleAddr += ", " + countyMatch[1].trim();
      simpleAddr += ", MD";
      if (!queries.includes(simpleAddr)) queries.push(simpleAddr);
    }

    // Also try: "Indian Head Highway, Forest Heights, MD"
    const hwyMatch = raw.match(/([\w\s]+Highway)/i);
    const townMatch2 = raw.match(/(?:Town of |City of )?([\w\s]+?)(?:,|\s*Prince)/i);
    if (hwyMatch) {
      let attempt = hwyMatch[1].trim();
      if (townMatch2) attempt += ", " + townMatch2[1].trim();
      attempt += ", MD";
      if (!queries.includes(attempt)) queries.push(attempt);
    }

    return queries;
  };

  // ── Geocode address → lat/lng (multi-strategy) ─────────────────────
  const geocodeAddress = async (address) => {
    const queries = cleanTicketAddress(address);

    for (const query of queries) {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&limit=1`,
          { headers: { "User-Agent": "TicketRadar/1.0" } }
        );
        const data = await resp.json();
        if (data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            display: data[0].display_name,
          };
        }
      } catch (e) {
        console.error("Geocoding attempt failed for:", query, e);
      }
      // Small delay between requests to respect rate limits
      await new Promise((r) => setTimeout(r, 300));
    }
    return null;
  };

  // ── Process image with Claude API ──────────────────────────────────
  const processTicketImage = async (file) => {
    setProcessing(true);

    // Convert to base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const imageUrl = URL.createObjectURL(file);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: { type: "base64", media_type: file.type || "image/jpeg", data: base64 },
                },
                {
                  type: "text",
                  text: `You are analyzing a US traffic/parking ticket image. Extract the following information and respond ONLY with a JSON object (no markdown, no backticks):
{
  "address": "the street address where the violation occurred - clean it up to be geocodable. Remove words like 'Block', convert directional abbreviations (SB/NB/EB/WB) to full words or remove them. Include city/town and state. Example: '5500 Indian Head Highway, Forest Heights, MD'",
  "address_raw": "the exact raw address text as printed on the ticket",
  "type": "the type of violation (e.g. Speeding, Parking, Red Light, Stop Sign, etc.)",
  "date": "the date of the ticket if visible",
  "amount": "the fine amount if visible"
}
If you cannot determine a field, use null. This is a US ticket. For the address field, make it as clean and standard as possible for Google Maps lookup.`,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.map((c) => c.text || "").join("") || "";
      const cleaned = text.replace(/```json|```/g, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        parsed = { address: null, type: "Traffic Violation", date: null, amount: null };
      }

      let geo = null;
      if (parsed.address) {
        geo = await geocodeAddress(parsed.address);
      }

      const ticket = {
        id: generateId(),
        address: parsed.address || "Address not detected",
        type: parsed.type || "Traffic Violation",
        date: parsed.date || new Date().toLocaleDateString(),
        amount: parsed.amount,
        lat: geo?.lat || null,
        lng: geo?.lng || null,
        displayAddress: geo?.display || parsed.address,
        imageUrl,
        createdAt: Date.now(),
      };

      setTickets((prev) => [ticket, ...prev]);
      showToast(geo ? "✓ Ticket added with location" : "⚠ Ticket added — address not found on map");

      if (!geo && parsed.address) {
        setShowManual(true);
        setManualAddress(parsed.address);
      }
    } catch (err) {
      console.error("Processing error:", err);
      showToast("Error processing image. Try entering address manually.");
      setShowManual(true);
    } finally {
      setProcessing(false);
    }
  };

  // ── Handle manual address submission ───────────────────────────────
  const handleManualSubmit = async () => {
    if (!manualAddress.trim()) return;
    setProcessing(true);

    const geo = await geocodeAddress(manualAddress);

    const ticket = {
      id: generateId(),
      address: manualAddress,
      type: "Traffic Violation",
      date: new Date().toLocaleDateString(),
      amount: null,
      lat: geo?.lat || null,
      lng: geo?.lng || null,
      displayAddress: geo?.display || manualAddress,
      imageUrl: null,
      createdAt: Date.now(),
    };

    setTickets((prev) => [ticket, ...prev]);
    setManualAddress("");
    setShowManual(false);
    setProcessing(false);
    showToast(geo ? "✓ Ticket added with location" : "⚠ Address not found on map");
  };

  // ── File handlers ──────────────────────────────────────────────────
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      showToast("Please upload an image file");
      return;
    }
    processTicketImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const removeTicket = (id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    showToast("Ticket removed");
  };

  const openInMaps = (ticket) => {
    if (ticket.lat && ticket.lng) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${ticket.lat},${ticket.lng}`,
        "_blank"
      );
    }
  };

  // ── Google Maps embed URL (no API key needed) ──────────────────────
  const getGoogleMapsEmbedUrl = (lat, lng, address) => {
    // Google Maps handles messy ticket addresses much better than other geocoders
    // Always prefer address string so Google can interpret it
    if (address && address !== "Address not detected") {
      return `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
    }
    if (lat && lng) {
      return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    }
    return `https://www.google.com/maps?q=&z=4&output=embed`;
  };

  // ── Ticket status based on proximity ───────────────────────────────
  const getTicketStatus = (ticket) => {
    if (!ticket.lat || !ticket.lng || !userPos) return { label: "MONITORING", cls: "status-monitoring" };
    const dist = haversineDistance(userPos.lat, userPos.lng, ticket.lat, ticket.lng);
    if (dist <= ALERT_RADIUS_METERS) return { label: `${Math.round(dist)}m AWAY`, cls: "status-alert" };
    return { label: "SAFE", cls: "status-safe" };
  };

  const isMonitoring = tickets.some((t) => t.lat && t.lng);

  // ══════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="header">
          <div className="header-top">
            <div className="logo">
              <div className="logo-icon">🚨</div>
              <span className="logo-text">TicketRadar</span>
            </div>
            <span className={`monitoring-badge ${isMonitoring ? "monitoring-on" : "monitoring-off"}`}>
              {isMonitoring ? "● Live" : "○ Idle"}
            </span>
          </div>
        </div>

        {/* ── Upload Section ────────────────────────────────────── */}
        <div className="upload-section">
          <div
            className={`upload-zone ${dragOver ? "drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="upload-icon">📸</span>
            <div className="upload-title">Upload your ticket</div>
            <div className="upload-subtitle">
              Take a photo or upload from gallery — we'll extract the address automatically
            </div>
            <div className="upload-actions" onClick={(e) => e.stopPropagation()}>
              <button className="btn btn-primary btn-sm" onClick={() => cameraInputRef.current?.click()}>
                <Icons.Camera /> Camera
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current?.click()}>
                <Icons.Upload /> Gallery
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        </div>

        {/* ── Manual Address Entry ──────────────────────────────── */}
        <div className="address-input-section">
          {!showManual ? (
            <button
              className="btn btn-secondary btn-sm"
              style={{ width: "100%" }}
              onClick={() => setShowManual(true)}
            >
              ✏️ Or enter address manually
            </button>
          ) : (
            <div className="address-input-card">
              <div className="address-input-label">
                <Icons.MapPin /> Enter ticket location
              </div>
              <div className="address-submit-row">
                <input
                  className="address-input"
                  placeholder="e.g. 123 Main St, Baltimore, MD"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                />
                <button className="btn btn-primary btn-sm" onClick={handleManualSubmit}>
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="divider" />

        {/* ── Tickets List ──────────────────────────────────────── */}
        <div className="tickets-section">
          <div className="section-header">
            <span className="section-title">Your Tickets</span>
            {tickets.length > 0 && <span className="ticket-count">{tickets.length}</span>}
          </div>

          {tickets.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🛡️</span>
              <div className="empty-title">No tickets tracked yet</div>
              <div className="empty-sub">
                Upload a photo of your traffic ticket to start monitoring the zone and get alerts when you're nearby.
              </div>
            </div>
          ) : (
            tickets.map((ticket) => {
              const status = getTicketStatus(ticket);
              return (
                <div
                  key={ticket.id}
                  className={`ticket-card ${status.cls === "status-alert" ? "active" : status.cls === "status-safe" ? "safe" : ""}`}
                >
                  {ticket.imageUrl && (
                    <img
                      src={ticket.imageUrl}
                      className="thumb-preview"
                      alt="Ticket"
                      onClick={() => setPreviewImage(ticket.imageUrl)}
                      style={{ cursor: "pointer" }}
                    />
                  )}

                  <div className="ticket-top">
                    <span className="ticket-type">{ticket.type}</span>
                    <span className={`ticket-status ${status.cls}`}>{status.label}</span>
                  </div>

                  <div className="ticket-address">
                    <Icons.MapPin />
                    <span>{ticket.displayAddress || ticket.address}</span>
                  </div>

                  <div className="ticket-meta">
                    <span>📅 {ticket.date}</span>
                    {ticket.amount && <span>💰 {ticket.amount}</span>}
                    <span>📡 {ALERT_RADIUS_METERS}m radius</span>
                  </div>

                  {/* Map Preview - Google Maps Embed (always shows if address exists) */}
                  {(ticket.lat && ticket.lng) || ticket.address ? (
                    <div className="map-preview">
                      <iframe
                        src={getGoogleMapsEmbedUrl(ticket.lat, ticket.lng, ticket.address)}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map: ${ticket.address}`}
                      />
                      <div className="radius-indicator">⚠ {ALERT_RADIUS_METERS}m alert zone</div>
                    </div>
                  ) : (
                    <div className="map-preview">
                      <div className="map-placeholder">
                        <Icons.MapPin />
                        <span>No address detected</span>
                      </div>
                    </div>
                  )}

                  <div className="ticket-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        const q = ticket.lat && ticket.lng
                          ? `${ticket.lat},${ticket.lng}`
                          : encodeURIComponent(ticket.address);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
                      }}
                    >
                      <Icons.Navigation /> Open in Google Maps
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => removeTicket(ticket.id)}>
                      <Icons.Trash /> Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="bottom-pad" />
      </div>

      {/* ── Processing Overlay ────────────────────────────────────── */}
      {processing && (
        <div className="processing-overlay">
          <div className="scanner">
            <div className="scanner-border" />
            <div className="scanner-line" />
          </div>
          <div className="processing-text">Analyzing ticket...</div>
        </div>
      )}

      {/* ── Proximity Alert ───────────────────────────────────────── */}
      {proximityAlerts.length > 0 && (
        <div className="proximity-alert">
          <div className="proximity-alert-inner">
            <div className="alert-header">
              <div className="alert-pulse" />
              <span className="alert-title">⚠️ Ticket Zone Ahead!</span>
            </div>
            {proximityAlerts.map((a) => (
              <div key={a.id} className="alert-body">
                <strong>{a.type}</strong> — {a.address}
                <br />
                You are <strong>{a.distance}m</strong> from this ticket location.
              </div>
            ))}
            <button
              className="btn btn-secondary btn-sm alert-dismiss"
              onClick={() => setProximityAlerts([])}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ── Image Preview Modal ───────────────────────────────────── */}
      {previewImage && (
        <div className="image-modal" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Ticket full size" />
          <button className="image-modal-close" onClick={() => setPreviewImage(null)}>✕</button>
        </div>
      )}

      {/* ── Toast ─────────────────────────────────────────────────── */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
