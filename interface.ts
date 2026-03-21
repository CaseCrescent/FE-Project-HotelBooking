// ===========================================
// interface.ts
// Shared TypeScript Interfaces
// - ตรงตาม Backend Models: User, Hotel, Booking
// - ใช้ร่วมกันทั้งโปรเจค
// - เทียบกับ interface.ts ของเว็บ Venue เดิม
//   (เปลี่ยนจาก VenueItem → HotelItem, BookingItem ปรับตาม schema จริง)
// ===========================================

// ----- Hotel -----
// ตาม models/Hotel.js: name, address, tel, picture, rating, description
// + _id, __v, id จาก MongoDB
interface HotelItem {
  _id: string;
  name: string;
  address: string;
  tel: string;
  picture?: string | null;
  rating?: number | null;
  description?: string | null;
  __v: number;
  id: string;
}

// Response จาก GET /api/v1/hotels
interface HotelJson {
  success: boolean;
  count: number;
  pagination: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  data: HotelItem[];
}

// Response จาก GET /api/v1/hotels/:id
interface SingleHotelJson {
  success: boolean;
  data: HotelItem;
}

// ----- Booking -----
// ตาม models/Booking.js: bookingDate, numOfNights, user, hotel, createdAt
interface BookingItem {
  _id: string;
  bookingDate: string;
  numOfNights: number;
  user: string | UserItem; // อาจเป็น ObjectId string หรือ populated User
  hotel: string | HotelItem; // อาจเป็น ObjectId string หรือ populated Hotel
  createdAt: string;
  __v: number;
}

// Response จาก GET /api/v1/bookings
interface BookingJson {
  success: boolean;
  count: number;
  data: BookingItem[];
}

// Response จาก GET/POST/PUT /api/v1/bookings/:id
interface SingleBookingJson {
  success: boolean;
  data: BookingItem;
}

// ----- User -----
// ตาม models/User.js: name, tel, email, role, createdAt
interface UserItem {
  _id: string;
  name: string;
  tel: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  __v: number;
}

// Response จาก GET /api/v1/auth/me
interface UserProfileJson {
  success: boolean;
  data: UserItem;
}

// Response จาก POST /api/v1/auth/login & /api/v1/auth/register
interface AuthJson {
  success: boolean;
  token: string;
  message?: string;
}
