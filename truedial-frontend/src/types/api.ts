export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface BusinessProfileDTO {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  gallery?: string[];
  features?: string[];
}

export interface RequirementDTO {
  id: string;
  title: string;
  budget: number;
  status: 'POSTED' | 'RECEIVING_BIDS' | 'AWARDED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETION_REQUESTED' | 'COMPLETED' | 'CLOSED' | 'PAUSED' | 'ARCHIVED';
  createdAt: string;
  bids?: BidDTO[];
}

export interface VendorDTO {
  id: string;
  name: string;
  rating?: number;
  isVerified?: boolean;
}

export interface BidDTO {
  id: string;
  amount: number;
  timelineDays: number;
  message?: string;
  status: 'submitted' | 'viewed' | 'shortlisted' | 'awarded' | 'rejected' | 'withdrawn';
  vendor: VendorDTO;
}

export interface MessageDTO {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
}

export interface ConversationDTO {
  id: string;
  opportunityId: string;
  opportunityType: 'requirement' | 'rfq' | 'job' | 'cross_platform_bid';
  opportunityTitle: string;
  status: string;
  participants: UserDTO[];
  lastMessage?: MessageDTO;
  unreadCount: number;
}

export interface QuoteDTO {
  id: string;
  supplierId: string;
  pricePerUnit: number;
  totalValue: number;
  deliveryTimelineDays: number;
  notes?: string;
  status: 'submitted' | 'selected' | 'rejected';
}

export interface RFQDto {
  id: string;
  materialCategory: string;
  quantity: number;
  unit: string;
  deliveryCity: string;
  deadline: string;
  status: 'POSTED' | 'QUOTES_RECEIVED' | 'QUOTE_SELECTED' | 'ORDER_CONFIRMED' | 'DELIVERED' | 'CLOSED';
  quotes?: QuoteDTO[];
}

export interface ApplicationDTO {
  id: string;
  workerId: string;
  status: 'applied' | 'viewed' | 'selected' | 'hired' | 'rejected';
}

export interface JobDTO {
  id: string;
  skillRequired: string;
  dailyWage: number;
  location: string;
  durationDays: number;
  startDate?: string;
  status: 'open' | 'closed';
  applications?: ApplicationDTO[];
}

export interface NotificationDTO {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface SyndicatedListingDTO {
  sourceId: string;
  sourcePlatform: string;
  category: string;
  city: string;
  profileUrl: string;
  isVerified: boolean;
  rating?: number;
  reviewCount?: number;
}
