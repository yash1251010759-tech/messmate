export type UserRole = 'student' | 'admin' | 'mess_provider';

export interface PaymentRecord {
  id: string;
  studentId: string;
  messId: string;
  messName: string;
  amount: number;
  planDuration: '1 Month' | '3 Months' | '1 Semester';
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Campus Wallet';
  transactionId: string;
  date: string; // YYYY-MM-DD
  validUntil: string; // YYYY-MM-DD
  status: 'Success' | 'Failed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hostelBlock?: string;
  roomNo?: string;
  address?: string;
  rollNo?: string;
  foodPreference?: 'Veg' | 'Non-Veg' | 'Jain';
  phone?: string;
  avatar?: string;
  token?: string;
  allottedMessId?: string;
  allottedMessName?: string;
  subscriptionStatus?: 'Active' | 'Expired' | 'None';
  subscriptionValidUntil?: string;
  paymentHistory?: PaymentRecord[];
}

export interface MessProvider {
  id: string;
  name: string;
  providerCompany: string;
  location: string;
  cuisineType: 'North Indian' | 'South Indian' | 'Pure Veg Mess' | 'Multi-Cuisine Special';
  monthlyFee: number;
  quarterlyFee: number;
  semesterFee: number;
  rating: number;
  reviewCount: number;
  capacity: number;
  activeSubscribers: number;
  timings: {
    breakfast: string;
    lunch: string;
    snacks: string;
    dinner: string;
  };
  contactPerson: string;
  contactPhone: string;
  description: string;
  tags: string[];
  image: string;
  todaysSpecial: string[];
  features: string[];
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type MealType = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';

export interface MenuItem {
  id: string;
  day: DayOfWeek;
  mealType: MealType;
  items: string[];
  calories: number;
  dietaryTags: string[]; // e.g. ['Veg', 'Gluten-Free', 'High-Protein', 'Jain Available']
  timing: string;
  rating: number;
  reviewCount: number;
  special?: boolean;
}

export interface MealRegistration {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  status: 'Registered' | 'Opted Out' | 'Attended' | 'Missed';
  tokenCode: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  hostelBlock: string;
  date: string;
  mealType: MealType;
  time: string;
  status: 'Present' | 'Absent';
}

export type ComplaintCategory = 'Food Quality' | 'Hygiene' | 'Timing' | 'Staff Behavior' | 'Equipment' | 'Other';
export type ComplaintPriority = 'Low' | 'Medium' | 'High';
export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  hostelBlock: string;
  title: string;
  category: ComplaintCategory;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
}

export interface FeedbackItem {
  id: string;
  studentId: string;
  studentName: string;
  mealType: MealType;
  date: string;
  rating: number; // 1 to 5
  tags: string[]; // e.g. "Tasty", "Cold Food", "Hygenic"
  comment: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Important' | 'Menu Update' | 'Timing Change' | 'Maintenance' | 'General';
  date: string;
  author: string;
  isPinned: boolean;
}

export interface AdminStats {
  totalStudents: number;
  todayRegistrations: number;
  mealsServedToday: number;
  pendingComplaints: number;
  avgFeedbackRating: number;
  wasteReductionPct: number;
  monthlyAttendancePct: number;
}

export interface SystemSettings {
  messName: string;
  breakfastTiming: string;
  lunchTiming: string;
  snacksTiming: string;
  dinnerTiming: string;
  registrationCutoffHours: number;
  guestMealPrice: number;
  autoOptOutEnabled: boolean;
  notificationAlerts: boolean;
}
