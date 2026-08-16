import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database Seed Data
let messProviders = [
  {
    id: 'mess_101',
    name: 'Royal North Central Mess',
    providerCompany: 'Royal Hospitality Services Pvt Ltd',
    location: 'Hostel Block-B Ground Floor',
    cuisineType: 'North Indian',
    monthlyFee: 3200,
    quarterlyFee: 8999,
    semesterFee: 14500,
    rating: 4.8,
    reviewCount: 240,
    capacity: 250,
    activeSubscribers: 185,
    timings: {
      breakfast: '07:30 AM - 09:30 AM',
      lunch: '12:30 PM - 02:30 PM',
      snacks: '05:00 PM - 06:15 PM',
      dinner: '07:30 PM - 09:30 PM',
    },
    contactPerson: 'Mr. Vikram Singh (Head Chef & Manager)',
    contactPhone: '+91 98765 11223',
    description: 'Specializing in authentic North Indian delicacies, Paneer Butter Masala, Tandoori Roti, and rich Dal Makhani with Sunday Grand Feasts.',
    tags: ['Pure Butter Roti', 'Unlimited Rice & Dal', 'Sunday Ice Cream Feast', 'Egg Option Available'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
    todaysSpecial: ['Paneer Butter Masala', 'Gulab Jamun', 'Jeera Basmati Rice'],
    features: ['Air Conditioned Dining', 'QR Pass Entry', 'RO UV Water Filter', 'Daily Quality Audit']
  },
  {
    id: 'mess_102',
    name: 'Dakshin South Indian Dining Hall',
    providerCompany: 'Sri Ananda Catering & Mess Co.',
    location: 'Hostel Block-A Annexe Complex',
    cuisineType: 'South Indian',
    monthlyFee: 2900,
    quarterlyFee: 8200,
    semesterFee: 13200,
    rating: 4.7,
    reviewCount: 195,
    capacity: 200,
    activeSubscribers: 160,
    timings: {
      breakfast: '07:15 AM - 09:15 AM',
      lunch: '12:15 PM - 02:15 PM',
      snacks: '04:45 PM - 06:00 PM',
      dinner: '07:15 PM - 09:15 PM',
    },
    contactPerson: 'Mr. S. Ramanathan (Senior Manager)',
    contactPhone: '+91 98123 99887',
    description: 'Crispy Dosa, Fluffy Idlis, Filter Coffee, Mysore Masala, Unlimited Sambar & Chutney Thalis prepared with traditional authentic recipes.',
    tags: ['Crispy Masala Dosa', 'Filter Coffee', 'Gluten Free Options', 'Authentic Sambar'],
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=600',
    todaysSpecial: ['Masala Dosa', 'Coconut Chutney', 'Filter Coffee'],
    features: ['Traditional Brass Cookware', 'Quick Counter Service', 'Zero Preservatives', 'Live Dosa Station']
  },
  {
    id: 'mess_103',
    name: 'Green Leaf Pure Veg Mess',
    providerCompany: 'Satvik Pure Veg Mess Ltd',
    location: 'Hostel Block-C Dining Pavilion',
    cuisineType: 'Pure Veg Mess',
    monthlyFee: 3000,
    quarterlyFee: 8500,
    semesterFee: 13800,
    rating: 4.9,
    reviewCount: 310,
    capacity: 180,
    activeSubscribers: 140,
    timings: {
      breakfast: '07:30 AM - 09:30 AM',
      lunch: '12:30 PM - 02:30 PM',
      snacks: '05:00 PM - 06:15 PM',
      dinner: '07:30 PM - 09:30 PM',
    },
    contactPerson: 'Mr. Arvind Shah (Quality Supervisor)',
    contactPhone: '+91 97654 88776',
    description: '100% Pure Veg and Jain dining with separate oil & utensil preparation, organic vegetables, zero garlic/onion counters available.',
    tags: ['100% Pure Veg', 'Jain Option (No Garlic/Onion)', 'Organic Veggies', 'Hygienic Steam Kitchen'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    todaysSpecial: ['Aloo Gobi Jain Style', 'Fruit Salad', 'Moong Dal Halwa'],
    features: ['Separate Jain Kitchen Counter', 'Organic Produce', 'Sanitized Dining Tables', 'Eco-friendly Cutlery']
  },
  {
    id: 'mess_104',
    name: 'Flavors Multi-Cuisine Hostel Mess',
    providerCompany: 'Elite Campus Food & Hospitality',
    location: 'Central Student Activity Center',
    cuisineType: 'Multi-Cuisine Special',
    monthlyFee: 3500,
    quarterlyFee: 9800,
    semesterFee: 15900,
    rating: 4.85,
    reviewCount: 280,
    capacity: 300,
    activeSubscribers: 220,
    timings: {
      breakfast: '07:30 AM - 09:30 AM',
      lunch: '12:30 PM - 02:30 PM',
      snacks: '05:00 PM - 06:30 PM',
      dinner: '07:30 PM - 09:45 PM',
    },
    contactPerson: 'Chef Rajesh Khanna (Executive Chef)',
    contactPhone: '+91 98999 44332',
    description: 'Grand variety including Chicken Dum Biryani on Wednesdays/Saturdays, Chinese Noodles, Continental Salads, Paneer Tikka, and Ice Creams.',
    tags: ['Chicken Biryani Wednesdays', 'Chinese & Continental', 'Salad Bar', 'Chef Special Desserts'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    todaysSpecial: ['Hyderabadi Biryani', 'Mirchi Ka Salan', 'Double Ka Meetha'],
    features: ['Salad & Soup Bar', 'Spacious Seating for 300+', 'Live Barbecue Nights', 'Digital Pass Counter']
  }
];

let users: any[] = [
  {
    id: 'usr_stu_1',
    name: 'Aarav Sharma',
    email: 'student@messmate.com',
    role: 'student',
    hostelBlock: 'Block-B',
    roomNo: 'B-304',
    address: 'Room B-304, Boys Hostel Block-B, University North Campus, Delhi - 110007',
    rollNo: '2023CS108',
    foodPreference: 'Veg',
    phone: '+91 98765 43210',
    avatar: '',
    allottedMessId: 'mess_101',
    allottedMessName: 'Royal North Central Mess',
    subscriptionStatus: 'Active',
    subscriptionValidUntil: '2026-09-30',
    paymentHistory: [
      {
        id: 'pay_90812',
        studentId: 'usr_stu_1',
        messId: 'mess_101',
        messName: 'Royal North Central Mess',
        amount: 3200,
        planDuration: '1 Month',
        paymentMethod: 'UPI',
        transactionId: 'TXN_MM_99182310',
        date: '2026-08-01',
        validUntil: '2026-09-30',
        status: 'Success'
      }
    ]
  },
  {
    id: 'usr_stu_2',
    name: 'Ananya Patel',
    email: 'ananya@messmate.com',
    role: 'student',
    hostelBlock: 'Block-A',
    roomNo: 'A-212',
    address: 'Room A-212, Girls Hostel Block-A, University South Campus, Delhi',
    rollNo: '2023EC045',
    foodPreference: 'Non-Veg',
    phone: '+91 98123 45678',
    avatar: '',
  },
  {
    id: 'usr_stu_3',
    name: 'Rohan Gupta',
    email: 'rohan@messmate.com',
    role: 'student',
    hostelBlock: 'Block-C',
    roomNo: 'C-105',
    address: 'Room C-105, PG Resident Hostel Block-C, University Campus, Delhi',
    rollNo: '2023ME092',
    foodPreference: 'Jain',
    phone: '+91 97654 32109',
    avatar: '',
  },
  {
    id: 'usr_adm_1',
    name: 'Dr. Ramesh Verma',
    email: 'admin@messmate.com',
    role: 'admin',
    hostelBlock: 'Main Mess Office',
    roomNo: 'M-01',
    address: 'Admin Office M-01, Central Dining Complex, University Campus',
    rollNo: 'STAFF-001',
    foodPreference: 'Veg',
    phone: '+91 98111 22233',
    avatar: '',
  }
];

let weeklyMenu = [
  {
    id: 'm_mon_bf',
    day: 'Monday',
    mealType: 'Breakfast',
    items: ['Aloo Paratha', 'Curd', 'Butter', 'Pickle', 'Masala Tea', 'Boiled Eggs / Bananas'],
    calories: 420,
    dietaryTags: ['Veg', 'Egg Option', 'High Carb'],
    timing: '07:30 AM - 09:30 AM',
    rating: 4.6,
    reviewCount: 128,
  },
  {
    id: 'm_mon_lu',
    day: 'Monday',
    mealType: 'Lunch',
    items: ['Paneer Butter Masala', 'Dal Tadka', 'Jeera Rice', 'Phulka Chapati', 'Cucumber Salad', 'Gulab Jamun'],
    calories: 680,
    dietaryTags: ['Veg', 'Special Dessert', 'Rich Protein'],
    timing: '12:30 PM - 02:30 PM',
    rating: 4.8,
    reviewCount: 210,
    special: true,
  },
  {
    id: 'm_mon_sn',
    day: 'Monday',
    mealType: 'Snacks',
    items: ['Samosa (2 pcs)', 'Green Chutney', 'Coffee / Tea', 'Biscuits'],
    calories: 310,
    dietaryTags: ['Veg', 'Crispy Snack'],
    timing: '05:00 PM - 06:15 PM',
    rating: 4.4,
    reviewCount: 95,
  },
  {
    id: 'm_mon_dn',
    day: 'Monday',
    mealType: 'Dinner',
    items: ['Kadai Vegetable', 'Mix Dal Fry', 'Plain Rice', 'Tawa Roti', 'Papad', 'Fruit Custard'],
    calories: 550,
    dietaryTags: ['Veg', 'Light Evening Meal'],
    timing: '07:30 PM - 09:30 PM',
    rating: 4.2,
    reviewCount: 160,
  },
  {
    id: 'm_tue_bf',
    day: 'Tuesday',
    mealType: 'Breakfast',
    items: ['Idli & Medu Vada', 'Coconut Chutney', 'Sambar', 'Filter Coffee'],
    calories: 380,
    dietaryTags: ['Veg', 'Gluten-Free', 'South Indian'],
    timing: '07:30 AM - 09:30 AM',
    rating: 4.7,
    reviewCount: 145,
  },
  {
    id: 'm_tue_lu',
    day: 'Tuesday',
    mealType: 'Lunch',
    items: ['Rajma Masala', 'Aloo Gobi Fry', 'Steamed Basmati Rice', 'Butter Roti', 'Curd', 'Kheer'],
    calories: 640,
    dietaryTags: ['Veg', 'Protein Rich'],
    timing: '12:30 PM - 02:30 PM',
    rating: 4.5,
    reviewCount: 185,
  },
  {
    id: 'm_tue_dn',
    day: 'Tuesday',
    mealType: 'Dinner',
    items: ['Egg Curry / Shahi Paneer', 'Yellow Dal', 'Jeera Rice', 'Chapati', 'Green Salad'],
    calories: 590,
    dietaryTags: ['Veg', 'Non-Veg Option'],
    timing: '07:30 PM - 09:30 PM',
    rating: 4.6,
    reviewCount: 172,
  },
  {
    id: 'm_wed_bf',
    day: 'Wednesday',
    mealType: 'Breakfast',
    items: ['Poha with Sev', 'Mint Chutney', 'Sprouted Moong Salad', 'Ginger Tea'],
    calories: 350,
    dietaryTags: ['Veg', 'Low Fat', 'Healthy'],
    timing: '07:30 AM - 09:30 AM',
    rating: 4.3,
    reviewCount: 110,
  },
  {
    id: 'm_wed_lu',
    day: 'Wednesday',
    mealType: 'Lunch',
    items: ['Chicken Curry / Mushroom Matar', 'Dal Makhani', 'Veg Pulao', 'Naan / Chapati', 'Raita'],
    calories: 720,
    dietaryTags: ['Special Non-Veg', 'Veg Option'],
    timing: '12:30 PM - 02:30 PM',
    rating: 4.9,
    reviewCount: 260,
    special: true,
  },
  {
    id: 'm_thu_bf',
    day: 'Thursday',
    mealType: 'Breakfast',
    items: ['Chole Bhature', 'Pickled Onion', 'Mint Lassi'],
    calories: 520,
    dietaryTags: ['Veg', 'Indulgent Breakfast'],
    timing: '07:30 AM - 09:30 AM',
    rating: 4.8,
    reviewCount: 220,
  },
  {
    id: 'm_fri_bf',
    day: 'Friday',
    mealType: 'Breakfast',
    items: ['Masala Dosa', 'Coconut Chutney', 'Tomato Chutney', 'Sambar', 'Tea / Coffee'],
    calories: 410,
    dietaryTags: ['Veg', 'South Indian Special'],
    timing: '07:30 AM - 09:30 AM',
    rating: 4.7,
    reviewCount: 190,
  },
  {
    id: 'm_sat_dn',
    day: 'Saturday',
    mealType: 'Dinner',
    items: ['Veg Biryani', 'Chicken Biryani', 'Mirchi Ka Salan', 'Burani Raita', 'Double Ka Meetha'],
    calories: 750,
    dietaryTags: ['Weekend Special', 'Non-Veg Option'],
    timing: '07:30 PM - 09:45 PM',
    rating: 4.95,
    reviewCount: 310,
    special: true,
  },
  {
    id: 'm_sun_lu',
    day: 'Sunday',
    mealType: 'Lunch',
    items: ['Special Sunday Feast', 'Paneer Tikka Masala', 'Butter Chicken', 'Jeera Pulao', 'Garlic Naan', 'Ice Cream'],
    calories: 820,
    dietaryTags: ['Grand Feast', 'Veg & Non-Veg'],
    timing: '12:30 PM - 03:00 PM',
    rating: 4.9,
    reviewCount: 340,
    special: true,
  }
];

let mealRegistrations = [
  {
    id: 'reg_1',
    studentId: 'usr_stu_1',
    studentName: 'Aarav Sharma',
    rollNo: '2023CS108',
    date: new Date().toISOString().split('T')[0],
    mealType: 'Breakfast',
    status: 'Attended',
    tokenCode: 'MM-BF-9812',
  },
  {
    id: 'reg_2',
    studentId: 'usr_stu_1',
    studentName: 'Aarav Sharma',
    rollNo: '2023CS108',
    date: new Date().toISOString().split('T')[0],
    mealType: 'Lunch',
    status: 'Registered',
    tokenCode: 'MM-LU-4431',
  },
  {
    id: 'reg_3',
    studentId: 'usr_stu_1',
    studentName: 'Aarav Sharma',
    rollNo: '2023CS108',
    date: new Date().toISOString().split('T')[0],
    mealType: 'Dinner',
    status: 'Registered',
    tokenCode: 'MM-DN-7719',
  },
  {
    id: 'reg_4',
    studentId: 'usr_stu_2',
    studentName: 'Ananya Patel',
    rollNo: '2023EC045',
    date: new Date().toISOString().split('T')[0],
    mealType: 'Lunch',
    status: 'Registered',
    tokenCode: 'MM-LU-1092',
  }
];

let complaints = [
  {
    id: 'cmp_101',
    studentId: 'usr_stu_1',
    studentName: 'Aarav Sharma',
    rollNo: '2023CS108',
    hostelBlock: 'Block-B',
    title: 'Warm Water Dispenser Malfunctioning',
    category: 'Equipment',
    description: 'The drinking water cooler near the dining hall entrance is dispersing lukewarm water instead of cold water during lunch peak hours.',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-08-02T10:15:00Z',
    updatedAt: '2026-08-03T14:20:00Z',
    adminResponse: 'Technician dispatched for cooler maintenance. Replacement filter scheduled for installation by Wednesday morning.',
  },
  {
    id: 'cmp_102',
    studentId: 'usr_stu_2',
    studentName: 'Ananya Patel',
    rollNo: '2023EC045',
    hostelBlock: 'Block-A',
    title: 'Chapati Counter Delay during Dinner',
    category: 'Timing',
    description: 'Extremely long queues at the chapati counter between 8:15 PM and 8:45 PM. Requests adding a second hot plate staff.',
    priority: 'High',
    status: 'Pending',
    createdAt: '2026-08-03T20:30:00Z',
    updatedAt: '2026-08-03T20:30:00Z',
  },
  {
    id: 'cmp_103',
    studentId: 'usr_stu_3',
    studentName: 'Rohan Gupta',
    rollNo: '2023ME092',
    hostelBlock: 'Block-C',
    title: 'Salty Dal in Wednesday Lunch',
    category: 'Food Quality',
    description: 'The Dal Tadka served during yesterday lunch had excessive salt. Please instruct kitchen staff to monitor seasoning.',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2026-07-29T13:45:00Z',
    updatedAt: '2026-07-30T09:00:00Z',
    adminResponse: 'Reviewed recipe guidelines with head chef. Quality check step added before meal serving.',
  }
];

let feedbackList = [
  {
    id: 'fb_1',
    studentId: 'usr_stu_1',
    studentName: 'Aarav Sharma',
    mealType: 'Lunch',
    date: '2026-08-03',
    rating: 5,
    tags: ['Delicious Paneer', 'Fresh Roti', 'Hygienic Serving'],
    comment: 'Paneer Butter Masala was top-notch! Great quality and prompt refill.',
    createdAt: '2026-08-03T13:30:00Z',
  },
  {
    id: 'fb_2',
    studentId: 'usr_stu_2',
    studentName: 'Ananya Patel',
    mealType: 'Breakfast',
    date: '2026-08-04',
    rating: 4,
    tags: ['Hot Food', 'Quick Counter'],
    comment: 'Aloo Paratha was crispy and hot. Mint chutney was fresh.',
    createdAt: '2026-08-04T08:45:00Z',
  }
];

let announcements = [
  {
    id: 'ann_1',
    title: 'Special Independence Day Grand Feast Announced!',
    content: 'On 15th August, a special traditional buffet including Paneer Lababdar, Dum Biryani, Jalebi, and Mango Lassi will be served for lunch.',
    category: 'Important',
    date: '2026-08-04',
    author: 'Mess Management Committee',
    isPinned: true,
  },
  {
    id: 'ann_2',
    title: 'Meal Opt-Out Cutoff Time Reminder',
    content: 'Students are requested to opt-out at least 3 hours before meal timing to avoid food wastage. Your cooperation reduces daily mess waste by up to 25%.',
    category: 'Menu Update',
    date: '2026-08-01',
    author: 'Chief Warden',
    isPinned: false,
  },
  {
    id: 'ann_3',
    title: 'Pest Control & Kitchen Hygiene Maintenance',
    content: 'The central mess kitchen will undergo deep sanitization on Saturday evening after dinner. Sunday breakfast timings will remain normal.',
    category: 'Maintenance',
    date: '2026-07-28',
    author: 'Hygiene Audit Cell',
    isPinned: false,
  }
];

let systemSettings = {
  messName: 'Hostel Central Mess #1',
  breakfastTiming: '07:30 AM - 09:30 AM',
  lunchTiming: '12:30 PM - 02:30 PM',
  snacksTiming: '05:00 PM - 06:15 PM',
  dinnerTiming: '07:30 PM - 09:30 PM',
  registrationCutoffHours: 3,
  guestMealPrice: 85,
  autoOptOutEnabled: false,
  notificationAlerts: true,
};

// API ROUTES

// Auth
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user) {
    return res.json({
      token: `token_${user.id}_${Date.now()}`,
      user,
    });
  }

  // Fallback demo user
  const isDemoAdmin = email.includes('admin');
  const demoUser = isDemoAdmin ? users.find(u => u.role === 'admin') : users.find(u => u.role === 'student');
  return res.json({
    token: `token_demo_${Date.now()}`,
    user: demoUser,
  });
});

app.post('/api/auth/register', (req, res) => {
  const { 
    name, 
    email, 
    role, 
    hostelBlock, 
    roomNo, 
    address,
    rollNo, 
    foodPreference, 
    phone,
    messName,
    providerCompany,
    location,
    cuisineType,
    monthlyFee,
    quarterlyFee,
    semesterFee,
    capacity,
    contactPerson,
    contactPhone,
    description,
    tags,
    todaysSpecial,
    features,
    image,
    timings
  } = req.body;

  let createdMess = null;

  // If registering as mess_provider or if mess details exist, create a new Mess Provider card
  if (role === 'mess_provider' || role === 'admin' || messName) {
    const finalMessName = messName || (name ? `${name}'s Mess` : 'New Campus Mess');
    createdMess = {
      id: `mess_${Date.now()}`,
      name: finalMessName,
      providerCompany: providerCompany || finalMessName + ' Hospitality',
      location: location || hostelBlock || 'Campus Central Pavilion',
      cuisineType: cuisineType || 'Pure Veg Mess',
      monthlyFee: Number(monthlyFee) || 3000,
      quarterlyFee: Number(quarterlyFee) || Math.round((Number(monthlyFee) || 3000) * 2.8),
      semesterFee: Number(semesterFee) || Math.round((Number(monthlyFee) || 3000) * 4.5),
      rating: 5.0,
      reviewCount: 1,
      capacity: Number(capacity) || 200,
      activeSubscribers: 1,
      timings: timings || {
        breakfast: '07:30 AM - 09:30 AM',
        lunch: '12:30 PM - 02:30 PM',
        snacks: '05:00 PM - 06:15 PM',
        dinner: '07:30 PM - 09:30 PM',
      },
      contactPerson: contactPerson || name || 'Manager',
      contactPhone: contactPhone || phone || '+91 98000 00000',
      description: description || 'Hygienic, quality campus dining service with fresh daily meals.',
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' && tags.trim() ? tags.split(',').map((s: string) => s.trim()) : ['Hygienic', 'Fresh Food', 'RO Water']),
      todaysSpecial: Array.isArray(todaysSpecial) ? todaysSpecial : (typeof todaysSpecial === 'string' && todaysSpecial.trim() ? todaysSpecial.split(',').map((s: string) => s.trim()) : ['Special Thali', 'Sweet Dish']),
      features: Array.isArray(features) ? features : ['QR Pass Entry', 'Hygienic Steam Kitchen', 'RO UV Water Filter', 'Daily Quality Audit'],
      image: image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'
    };
    messProviders.unshift(createdMess);
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name: name || 'User',
    email: email || `user_${Date.now()}@messmate.com`,
    role: role || 'student',
    hostelBlock: hostelBlock || 'Block-A',
    roomNo: roomNo || 'A-101',
    address: address || (roomNo ? `Room ${roomNo}, ${hostelBlock || 'Hostel Block'}, University Campus` : 'University North Campus, Delhi'),
    rollNo: rollNo || '2024CS' + Math.floor(100 + Math.random() * 900),
    foodPreference: foodPreference || 'Veg',
    phone: phone || '+91 98000 00000',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    allottedMessId: createdMess ? createdMess.id : undefined,
    allottedMessName: createdMess ? createdMess.name : undefined,
  };

  users.push(newUser);
  res.status(201).json({
    token: `token_${newUser.id}`,
    user: newUser,
    createdMess
  });
});

app.get('/api/auth/me', (req, res) => {
  // Return first student or admin as default
  res.json({ user: users[0] });
});

// Menu
app.get('/api/menu', (req, res) => {
  res.json(weeklyMenu);
});

app.get('/api/menu/today', (req, res) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const todayItems = weeklyMenu.filter(m => m.day === todayName || m.day === 'Monday');
  res.json(todayItems.length > 0 ? todayItems : weeklyMenu.slice(0, 4));
});

app.post('/api/menu', (req, res) => {
  const newItem = {
    id: `m_${Date.now()}`,
    day: req.body.day || 'Monday',
    mealType: req.body.mealType || 'Lunch',
    items: req.body.items || ['Special Dish', 'Rice', 'Roti', 'Salad'],
    calories: req.body.calories || 500,
    dietaryTags: req.body.dietaryTags || ['Veg'],
    timing: req.body.timing || '12:30 PM - 02:30 PM',
    rating: 5.0,
    reviewCount: 1,
    special: req.body.special || false,
  };
  weeklyMenu.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const index = weeklyMenu.findIndex(m => m.id === id);
  if (index !== -1) {
    weeklyMenu[index] = { ...weeklyMenu[index], ...req.body };
    return res.json(weeklyMenu[index]);
  }
  res.status(404).json({ error: 'Menu item not found' });
});

app.delete('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  weeklyMenu = weeklyMenu.filter(m => m.id !== id);
  res.json({ message: 'Menu item deleted successfully' });
});

// Meals Registration & History
app.get('/api/meals/registrations', (req, res) => {
  res.json(mealRegistrations);
});

app.post('/api/meals/register', (req, res) => {
  const { date, mealType, status } = req.body;
  const today = date || new Date().toISOString().split('T')[0];
  const existingIndex = mealRegistrations.findIndex(r => r.date === today && r.mealType === mealType);

  if (existingIndex !== -1) {
    mealRegistrations[existingIndex].status = status;
    return res.json(mealRegistrations[existingIndex]);
  }

  const newReg = {
    id: `reg_${Date.now()}`,
    studentId: 'usr_stu_1',
    studentName: 'Aarav Sharma',
    rollNo: '2023CS108',
    date: today,
    mealType,
    status: status || 'Registered',
    tokenCode: `MM-${mealType.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
  };
  mealRegistrations.push(newReg);
  res.status(201).json(newReg);
});

app.get('/api/meals/history', (req, res) => {
  res.json(mealRegistrations);
});

app.post('/api/meals/verify-token', (req, res) => {
  const { tokenCode } = req.body;
  const found = mealRegistrations.find(r => r.tokenCode === tokenCode);
  if (found) {
    found.status = 'Attended';
    return res.json({ success: true, message: `Token verified for ${found.studentName} (${found.mealType})` });
  }
  res.json({ success: true, message: `Token ${tokenCode} scanned and verified successfully!` });
});

// Complaints
app.get('/api/complaints', (req, res) => {
  res.json(complaints);
});

app.post('/api/complaints', (req, res) => {
  const newComplaint = {
    id: `cmp_${100 + complaints.length + 1}`,
    studentId: 'usr_stu_1',
    studentName: 'Aarav Sharma',
    rollNo: '2023CS108',
    hostelBlock: 'Block-B',
    title: req.body.title,
    category: req.body.category || 'Food Quality',
    description: req.body.description,
    priority: req.body.priority || 'Medium',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  complaints.unshift(newComplaint);
  res.status(201).json(newComplaint);
});

app.put('/api/complaints/:id', (req, res) => {
  const { id } = req.params;
  const { status, adminResponse } = req.body;
  const complaint = complaints.find(c => c.id === id);
  if (complaint) {
    if (status) complaint.status = status;
    if (adminResponse) complaint.adminResponse = adminResponse;
    complaint.updatedAt = new Date().toISOString();
    return res.json(complaint);
  }
  res.status(404).json({ error: 'Complaint not found' });
});

// Feedback
app.get('/api/feedback', (req, res) => {
  res.json(feedbackList);
});

app.post('/api/feedback', (req, res) => {
  const newFb = {
    id: `fb_${Date.now()}`,
    studentId: 'usr_stu_1',
    studentName: 'Aarav Sharma',
    mealType: req.body.mealType || 'Lunch',
    date: new Date().toISOString().split('T')[0],
    rating: req.body.rating || 5,
    tags: req.body.tags || ['Good Taste'],
    comment: req.body.comment || '',
    createdAt: new Date().toISOString(),
  };
  feedbackList.unshift(newFb);
  res.status(201).json(newFb);
});

// Announcements
app.get('/api/announcements', (req, res) => {
  res.json(announcements);
});

app.post('/api/announcements', (req, res) => {
  const newAnn = {
    id: `ann_${Date.now()}`,
    title: req.body.title,
    content: req.body.content,
    category: req.body.category || 'General',
    date: new Date().toISOString().split('T')[0],
    author: req.body.author || 'Mess Admin',
    isPinned: req.body.isPinned || false,
  };
  announcements.unshift(newAnn);
  res.status(201).json(newAnn);
});

app.delete('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  announcements = announcements.filter(a => a.id !== id);
  res.json({ message: 'Announcement deleted' });
});

// Mess Providers & Allotment/Payment Routes
app.get('/api/messes', (req, res) => {
  res.json(messProviders);
});

app.get('/api/messes/:id', (req, res) => {
  const mess = messProviders.find(m => m.id === req.params.id);
  if (mess) {
    return res.json(mess);
  }
  res.status(404).json({ error: 'Mess provider not found' });
});

app.post('/api/messes', (req, res) => {
  const {
    name,
    providerCompany,
    location,
    cuisineType,
    monthlyFee,
    quarterlyFee,
    semesterFee,
    capacity,
    contactPerson,
    contactPhone,
    description,
    tags,
    todaysSpecial,
    features,
    image,
    timings
  } = req.body;

  const newMess = {
    id: `mess_${Date.now()}`,
    name: name || 'New Mess Provider',
    providerCompany: providerCompany || (name ? name + ' Hospitality' : 'Campus Catering'),
    location: location || 'Campus Dining Block',
    cuisineType: cuisineType || 'Pure Veg Mess',
    monthlyFee: Number(monthlyFee) || 3000,
    quarterlyFee: Number(quarterlyFee) || Math.round((Number(monthlyFee) || 3000) * 2.8),
    semesterFee: Number(semesterFee) || Math.round((Number(monthlyFee) || 3000) * 4.5),
    rating: 5.0,
    reviewCount: 1,
    capacity: Number(capacity) || 200,
    activeSubscribers: 1,
    timings: timings || {
      breakfast: '07:30 AM - 09:30 AM',
      lunch: '12:30 PM - 02:30 PM',
      snacks: '05:00 PM - 06:15 PM',
      dinner: '07:30 PM - 09:30 PM',
    },
    contactPerson: contactPerson || 'Manager',
    contactPhone: contactPhone || '+91 98000 00000',
    description: description || 'Fresh, hygienic meal service prepared daily.',
    tags: Array.isArray(tags) ? tags : (typeof tags === 'string' && tags.trim() ? tags.split(',').map((s: string) => s.trim()) : ['Pure Veg', 'Fresh Meals', 'RO Water']),
    todaysSpecial: Array.isArray(todaysSpecial) ? todaysSpecial : (typeof todaysSpecial === 'string' && todaysSpecial.trim() ? todaysSpecial.split(',').map((s: string) => s.trim()) : ['Special Thali', 'Dessert']),
    features: Array.isArray(features) ? features : ['QR Pass Entry', 'RO UV Water Filter', 'Daily Audited Hygiene'],
    image: image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'
  };

  messProviders.push(newMess);
  res.status(201).json(newMess);
});

app.put('/api/messes/:id', (req, res) => {
  const { id } = req.params;
  const index = messProviders.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Mess provider not found' });
  }

  const existing = messProviders[index];
  const updated = {
    ...existing,
    ...req.body,
    monthlyFee: req.body.monthlyFee ? Number(req.body.monthlyFee) : existing.monthlyFee,
    quarterlyFee: req.body.quarterlyFee ? Number(req.body.quarterlyFee) : existing.quarterlyFee,
    semesterFee: req.body.semesterFee ? Number(req.body.semesterFee) : existing.semesterFee,
    capacity: req.body.capacity ? Number(req.body.capacity) : existing.capacity,
    tags: Array.isArray(req.body.tags) ? req.body.tags : (typeof req.body.tags === 'string' ? req.body.tags.split(',').map((s: string) => s.trim()) : existing.tags),
    todaysSpecial: Array.isArray(req.body.todaysSpecial) ? req.body.todaysSpecial : (typeof req.body.todaysSpecial === 'string' ? req.body.todaysSpecial.split(',').map((s: string) => s.trim()) : existing.todaysSpecial),
  };

  messProviders[index] = updated;
  res.json(updated);
});

app.delete('/api/messes/:id', (req, res) => {
  const { id } = req.params;
  messProviders = messProviders.filter(m => m.id !== id);
  res.json({ message: 'Mess provider removed successfully' });
});

app.post('/api/messes/select-and-pay', (req, res) => {
  const { messId, planDuration = '1 Month', paymentMethod = 'UPI', couponCode = '' } = req.body;
  const mess = messProviders.find(m => m.id === messId);

  if (!mess) {
    return res.status(404).json({ error: 'Selected mess not found' });
  }

  // Calculate price based on duration
  let baseAmount = mess.monthlyFee;
  let durationDays = 30;
  if (planDuration === '3 Months') {
    baseAmount = mess.quarterlyFee;
    durationDays = 90;
  } else if (planDuration === '1 Semester') {
    baseAmount = mess.semesterFee;
    durationDays = 180;
  }

  let finalAmount = baseAmount;
  if (couponCode.toUpperCase() === 'WELCOME10') {
    finalAmount = Math.round(baseAmount * 0.9);
  } else if (couponCode.toUpperCase() === 'STUDENT20') {
    finalAmount = Math.round(baseAmount * 0.8);
  }

  const today = new Date();
  const validUntilDate = new Date();
  validUntilDate.setDate(today.getDate() + durationDays);

  const paymentRecord = {
    id: `pay_${Date.now()}`,
    studentId: 'usr_stu_1',
    messId: mess.id,
    messName: mess.name,
    amount: finalAmount,
    planDuration,
    paymentMethod,
    transactionId: `TXN_MM_${Math.floor(10000000 + Math.random() * 90000000)}`,
    date: today.toISOString().split('T')[0],
    validUntil: validUntilDate.toISOString().split('T')[0],
    status: 'Success',
  };

  // Update user allotment
  const user = users[0]; // Primary student user
  user.allottedMessId = mess.id;
  user.allottedMessName = mess.name;
  user.subscriptionStatus = 'Active';
  user.subscriptionValidUntil = paymentRecord.validUntil;

  if (!user.paymentHistory) {
    user.paymentHistory = [];
  }
  user.paymentHistory.unshift(paymentRecord);

  // Increment subscriber count
  mess.activeSubscribers += 1;

  res.status(200).json({
    message: 'Payment verified and mess allotted successfully!',
    user,
    paymentRecord,
    allottedMess: mess,
  });
});

app.post('/api/messes/deallot', (req, res) => {
  const user = users[0];
  user.allottedMessId = undefined;
  user.allottedMessName = undefined;
  user.subscriptionStatus = 'None';
  res.json({ message: 'Mess allotment reset', user });
});

// Admin Stats, Students, Settings
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalStudents: 485,
    todayRegistrations: 420,
    mealsServedToday: 382,
    pendingComplaints: complaints.filter(c => c.status === 'Pending').length,
    avgFeedbackRating: 4.6,
    wasteReductionPct: 24.5,
    monthlyAttendancePct: 91.2,
  });
});

app.get('/api/admin/students', (req, res) => {
  res.json(users.filter(u => u.role === 'student'));
});

app.get('/api/admin/settings', (req, res) => {
  res.json(systemSettings);
});

app.put('/api/admin/settings', (req, res) => {
  systemSettings = { ...systemSettings, ...req.body };
  res.json(systemSettings);
});

// Helper for smart quick options
function getSmartOptionsForQuery(prompt: string) {
  const q = prompt.toLowerCase();
  if (q.includes('select') || q.includes('mess') || q.includes('choose')) {
    return [
      { label: 'Browse & Pay Mess', action: 'go to select mess', link: '/select-mess' },
      { label: 'View Coupon Discounts', action: 'coupon codes' },
    ];
  }
  if (q.includes('menu') || q.includes('search') || q.includes('dish')) {
    return [
      { label: 'View Weekly Menu', action: 'weekly menu', link: '/student-dashboard' },
      { label: 'Check Meal Timings', action: 'timings' },
    ];
  }
  return [
    { label: 'Help Select Mess', action: 'help select mess' },
    { label: 'Search Messes', action: 'search messes' },
  ];
}

function generateFallbackBotResponseServer(prompt: string, messes: any[], menu: any[]) {
  const q = prompt.toLowerCase();

  if (q.includes('select') || q.includes('choose') || q.includes('recommend') || q.includes('veg') || q.includes('jain') || q.includes('north') || q.includes('south')) {
    let matched = messes;
    if (q.includes('jain') || q.includes('pure veg')) {
      matched = messes.filter(m => m.cuisineType.toLowerCase().includes('veg') || m.cuisineType.toLowerCase().includes('jain'));
    } else if (q.includes('south')) {
      matched = messes.filter(m => m.cuisineType.toLowerCase().includes('south'));
    } else if (q.includes('north')) {
      matched = messes.filter(m => m.cuisineType.toLowerCase().includes('north'));
    }

    let listStr = matched.map((m, i) => `${i + 1}. **${m.name}** (${m.cuisineType})\n   • Location: ${m.location}\n   • Monthly Fee: ₹${m.monthlyFee}\n   • Rating: ${m.rating} ★ (${m.reviewCount} reviews)\n   • Highlights: ${m.tags.join(', ')}`).join('\n\n');

    return {
      reply: `🤖 **Mess Selection Recommendation**:\n\n${listStr}\n\n💡 Use coupon code **WELCOME10** at checkout for 10% off your subscription!`,
      options: [
        { label: 'Proceed to Select & Pay Mess', action: 'select mess', link: '/select-mess' },
        { label: 'Show Discount Coupons', action: 'coupon codes' }
      ]
    };
  }

  if (q.includes('search') || q.includes('menu') || q.includes('timing') || q.includes('price') || q.includes('dish') || q.includes('today')) {
    const dishesToday = menu.slice(0, 4).map(m => `• **${m.mealType}** (${m.timing}): ${m.items.join(', ')}`).join('\n');
    return {
      reply: `🔍 **Mess Search Results**:\n\n**Today's Scheduled Meals**:\n${dishesToday}\n\n**Mess Provider Fees**:\n` +
        `• Royal North Central: ₹3,200/month\n` +
        `• Dakshin South Indian: ₹2,900/month\n` +
        `• Green Leaf Pure Veg: ₹3,000/month\n` +
        `• Flavors Multi-Cuisine: ₹3,500/month`,
      options: [
        { label: 'View Student Dashboard', action: 'dashboard', link: '/student-dashboard' },
        { label: 'Help Select Mess', action: 'help select mess' }
      ]
    };
  }

  if (q.includes('coupon') || q.includes('discount') || q.includes('offer')) {
    return {
      reply: `🎉 **Mess Subscription Coupons**:\n\n` +
        `• **WELCOME10** — 10% OFF on 1-Month Plan\n` +
        `• **STUDENT20** — 20% OFF on 3-Month or Semester Plans\n\n` +
        `Enter these codes on the Select Mess page during online payment!`,
      options: [
        { label: 'Go to Select & Pay Mess', action: 'pay mess', link: '/select-mess' }
      ]
    };
  }

  return {
    reply: `I can help you with:\n` +
      `1. **Selecting Mess**: Finding the best mess for your dietary preferences (North Indian, South Indian, Pure Veg/Jain, Multi-Cuisine).\n` +
      `2. **Searching Messes**: Checking menus, meal timings, dish ratings, and prices.\n` +
      `3. **QR Attendance & Opt-Outs**: Accessing your digital dining pass and canceling meals ahead of time.\n` +
      `4. **Discount Coupons**: Saving on mess subscriptions with codes like WELCOME10!`,
    options: [
      { label: 'Help Select Mess', action: 'help select mess', link: '/select-mess' },
      { label: 'Search Messes', action: 'search messes' },
      { label: 'Coupons', action: 'coupon codes' }
    ]
  };
}

// Chatbot AI Endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const prompt = String(message).trim();

  // Try Gemini API if available
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `You are MessBot, the official AI campus dining assistant.
Assist students with:
1. Selecting mess options (North Indian, South Indian, Pure Veg/Jain, Multi-Cuisine) based on budget, food preference, location.
2. Searching mess details, daily meal menus, timings, prices, contact numbers.
3. QR passes, meal opt-outs, and complaints.
4. Coupon discounts (WELCOME10 for 10% off, STUDENT20 for 20% off).

Mess Providers Data:
${JSON.stringify(messProviders, null, 2)}

Weekly Menu Data:
${JSON.stringify(weeklyMenu.slice(0, 8), null, 2)}

Be concise, clear, and helpful with bold headings and bullet points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      const replyText = response.text || 'I am MessBot, here to help you select and search campus messes!';
      return res.json({
        reply: replyText,
        options: getSmartOptionsForQuery(prompt)
      });
    } catch (err) {
      console.error('Gemini chat error, using fallback:', err);
    }
  }

  const fallback = generateFallbackBotResponseServer(prompt, messProviders, weeklyMenu);
  return res.json(fallback);
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MessMate server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
