// ===========================================
// src/components/admin/AdminHotelListPanel.tsx
// Admin: รายการโรงแรมทั้งหมด (ฝั่งขวา)
// - แยกออกมาจาก admin/hotels/page.tsx เพื่อให้ไฟล์ไม่ยาวเกิน
// - รับ hotels + handlers เป็น props จาก parent
// ===========================================

"use client";
import { CircularProgress, Rating } from "@mui/material";
import { getHotelMeta, HotelMeta } from "@/redux/features/bookSlice";

interface Hotel {
  _id: string;
  name: string;
  address: string;
  tel: string;
  picture?: string;
}

interface AdminHotelListPanelProps {
  hotels: Hotel[];
  loadingHotels: boolean;
  hotelMetaStore: { [hotelId: string]: HotelMeta };
  onEdit: (hotel: Hotel) => void;
  onDeleteRequest: (hotel: Hotel) => void;
}

export default function AdminHotelListPanel({
  hotels,
  loadingHotels,
  hotelMetaStore,
  onEdit,
  onDeleteRequest,
}: AdminHotelListPanelProps) {
  return (
    // flex: 1 ขยายเต็มพื้นที่ที่เหลือ
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" }}>
          All Hotels
        </span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", padding: "4px 10px", borderRadius: "20px", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {loadingHotels ? "..." : `${hotels.length} total`}
        </span>
      </div>

      {/* Loading state */}
      {loadingHotels ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
          <CircularProgress sx={{ color: "#dcb771" }} />
        </div>
      ) : hotels.length === 0 ? (
        // Empty state
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 0", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.2)" }}>
          <p style={{ fontSize: "14px" }}>No hotels yet.</p>
          <p style={{ fontSize: "12px", marginTop: "4px" }}>Add your first hotel using the form.</p>
        </div>
      ) : (
        // Hotel cards
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {hotels.map((hotel) => {
            const meta = getHotelMeta(hotelMetaStore, hotel._id, hotel.name);
            return (
              <div
                key={hotel._id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px 20px",
                  borderRadius: "16px",
                  backgroundColor: "#1a1730",
                  border: "1px solid rgba(255,255,255,0.05)",
                  transition: "border-color 0.2s",
                }}
              >
                {/* Hotel info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: "700", color: "white", fontSize: "14px", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {hotel.name}
                  </h3>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {hotel.address}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Rating
                      value={meta.rating}
                      readOnly
                      size="small"
                      sx={{
                        "& .MuiRating-iconFilled": { color: "#dcb771" },
                        "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.1)" },
                      }}
                    />
                    {meta.description && (
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
                        {meta.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit / Delete buttons */}
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={() => onEdit(hotel)}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
                    style={{
                      color: "#dcb771",
                      border: "1px solid rgba(220,183,113,0.2)",
                      backgroundColor: "rgba(220,183,113,0.05)",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteRequest(hotel)}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
                    style={{
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.2)",
                      backgroundColor: "rgba(239,68,68,0.05)",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}