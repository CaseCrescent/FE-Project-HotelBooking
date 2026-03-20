// ===========================================
// src/components/admin/AdminHotelFormPanel.tsx
// Admin: ฟอร์มเพิ่ม / แก้ไขโรงแรม (ฝั่งซ้าย)
// - แยกออกมาจาก admin/hotels/page.tsx เพื่อให้ไฟล์ไม่ยาวเกิน
// - รับ state + handlers เป็น props จาก parent
// - Picture: เลือกจาก gallery /public/img/ → เก็บแค่ path (ไม่ใช้ base64)
//   แก้ปัญหา localStorage QuotaExceededError
// ===========================================

"use client";
import { CircularProgress, Rating } from "@mui/material";

const HOTEL_IMAGES = [
  "/img/hotel.jpg", "/img/hotel2.jpg", "/img/hotel3.jpg",
  "/img/hotel4.jpg", "/img/hotel5.jpg", "/img/hotel6.jpg",
  "/img/cover.jpg", "/img/cover2.jpg", "/img/cover3.jpg", "/img/cover4.jpg",
  "/img/Capella Bangkok Interprets The City S Rich History.jpg",
  "/img/H Tel Providence Paris France.jpg",
  "/img/Hotel Chocolate St Lucia.jpg",
];

// ---- Shared input style ----
export const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "rgba(0,0,0,0.25)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "10px",
  padding: "10px 14px",
  color: "white",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
};

// ---- Reusable field wrapper ----
function Field({
  label,
  required,
  badge,
  children,
}: {
  label: string;
  required?: boolean;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.45)", fontSize: "11px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase" }}>
        {label}
        {required && <span style={{ color: "#dcb771" }}>*</span>}
        {badge && (
          <span style={{ color: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontSize: "9px", padding: "2px 6px", borderRadius: "4px", fontWeight: "400", letterSpacing: "0", textTransform: "none" }}>
            {badge}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

// ---- Props ----
interface AdminHotelFormPanelProps {
  formMode: "create" | "edit";
  name: string; setName: (v: string) => void;
  address: string; setAddress: (v: string) => void;
  tel: string; setTel: (v: string) => void;
  picture: string; setPicture: (v: string) => void;
  rating: number; setRating: (v: number) => void;
  description: string; setDescription: (v: string) => void;
  submitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function AdminHotelFormPanel({
  formMode, name, setName, address, setAddress, tel, setTel,
  picture, setPicture, rating, setRating, description, setDescription,
  submitting, onSubmit, onCancel,
}: AdminHotelFormPanelProps) {
  const focusGold = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "rgba(220,183,113,0.4)");
  const blurGray = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.07)");

  return (
    // ⚠️ ใช้ inline style แทน Tailwind responsive เพราะ JIT v4 อาจไม่ generate
    <div
      style={{
        width: "400px",
        minWidth: "300px",
        flexShrink: 0,
        position: "sticky",
        top: "88px",
        backgroundColor: "#1a1730",
        border: "1px solid rgba(220,183,113,0.08)",
        borderRadius: "16px",
        padding: "28px 24px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Form title */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
        <span style={{ color: "#dcb771", fontSize: "18px", fontWeight: "700" }}>+</span>
        <h2 style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" }}>
          {formMode === "create" ? "Add New Hotel" : `Editing: ${name}`}
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Hotel Name */}
        <Field label="Hotel Name" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grand Palace Hotel"
            style={inputStyle}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </Field>

        {/* Address */}
        <Field label="Address" required>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 123 Sukhumvit Road, Bangkok"
            style={inputStyle}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </Field>

        {/* Telephone */}
        <Field label="Telephone" required>
          <input
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="e.g. 02-111-2222"
            style={inputStyle}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </Field>

        {/* Picture — file picker + gallery */}
        <Field label="Hotel Picture" badge="Display Only">
          {/* Preview */}
          {picture && (
            <div style={{ position: "relative", width: "100%", height: "140px", borderRadius: "10px", overflow: "hidden", marginBottom: "6px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={picture}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                onClick={() => setPicture("")}
                style={{
                  position: "absolute", top: "6px", right: "6px",
                  background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%",
                  width: "24px", height: "24px", cursor: "pointer", color: "white",
                  fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center",
                }}
                title="Remove image"
              >
                ×
              </button>
            </div>
          )}

          {/* Gallery — เลือกรูปจาก /public/img/ (เก็บแค่ path ไม่ใช่ base64) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px", maxHeight: "200px", overflowY: "auto" }}>
            {HOTEL_IMAGES.map((src) => (
              <button
                key={src}
                onClick={() => setPicture(picture === src ? "" : src)}
                style={{
                  padding: 0, border: `2px solid ${picture === src ? "#dcb771" : "transparent"}`,
                  borderRadius: "6px", overflow: "hidden", cursor: "pointer", background: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" style={{ width: "100%", height: "56px", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>
        </Field>

        {/* Display Rating (frontend-only) */}
        <Field label="Display Rating" badge="Display Only">
          <Rating
            value={rating}
            onChange={(_, v) => setRating(v || 4)}
            sx={{
              "& .MuiRating-iconFilled": { color: "#dcb771" },
              "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.12)" },
            }}
          />
        </Field>

        {/* Description (frontend-only) */}
        <Field label="Description / Type" badge="Display Only">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Boutique hotel in the heart of the city..."
            rows={3}
            style={{ ...inputStyle, resize: "vertical", lineHeight: "1.5", minHeight: "80px" }}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </Field>

        <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "11px", marginTop: "-8px" }}>
          Picture, Rating &amp; Description are stored locally, not in database.
        </p>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
          <button
            onClick={onSubmit}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "14px",
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
              background: "linear-gradient(135deg, #e8c98c 0%, #c5a059 100%)",
              color: "#12101f",
              transition: "opacity 0.2s",
            }}
          >
            {submitting ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <CircularProgress size={16} sx={{ color: "#12101f" }} />
                {formMode === "create" ? "Adding..." : "Saving..."}
              </span>
            ) : (
              formMode === "create" ? "Add Hotel" : "Save Changes"
            )}
          </button>

          {formMode === "edit" && (
            <button
              onClick={onCancel}
              style={{ padding: "12px 20px", borderRadius: "12px", fontSize: "14px", fontWeight: "500", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}