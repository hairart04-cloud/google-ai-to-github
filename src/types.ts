export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  bikeModel?: string;
  reservationType: 'maintenance' | 'visit' | 'rental';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'pending' | 'approved' | 'cancelled';
  details?: string;
  createdAt: number;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  region: string;
  content: string;
  status: 'pending' | 'completed';
  createdAt: number;
}

export interface RiderApplication {
  id: string;
  name: string;
  phone: string;
  age: number;
  region: string;
  experience: string;
  hasLicense: boolean;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  attachmentName?: string;
  createdAt: number;
}

export interface EVBike {
  id: string;
  name: string;
  type: string; // e.g., 'Delivery Special', 'High Range', 'Economy'
  batteryCapacity: string;
  maxSpeed: string;
  range: string;
  monthlyFee: number;
  imageUrl: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  text: string;
  timestamp: number;
}
