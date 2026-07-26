import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Platform,
  Animated,
  PanResponder,
  Modal,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import InquiryModal from '../../components/InquiryModal';
import { 
  Search, MapPin, Grid, Star, Sparkles, Utensils, Building, 
  GraduationCap, Key, HeartPulse, Wrench, PawPrint, Building2, 
  Dumbbell, Briefcase, Calendar, Car, Truck, Package, Plane, 
  Tag, CreditCard, Smartphone, Zap, Tv, Droplet, Flame, 
  ShieldCheck, Bus, Train, Film, Gift, RefreshCw, Award, ArrowRight,
  ChevronDown, CheckCircle, Bell, User as UserIcon, Scan, Mic,
  ChevronRight, ShoppingBag, DollarSign, Globe, TrendingUp, Newspaper, 
  MoreHorizontal, ArrowLeft, Pill, ShoppingCart, Film as MovieIcon, Home as HomeIcon
} from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLLAPSED_HEIGHT = SCREEN_HEIGHT * 0.45;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.88;

interface Listing {
  id: number;
  title: string;
  slug: string;
  description: string;
  city: string;
  category?: {
    id: number;
    name: string;
  };
  reviews_avg_rating?: string;
  featured?: boolean;
}

export default function SearchIndex() {
  const router = useRouter();
  
  // Search & Filter state
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('Patna, Bihar');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeTabFilter, setActiveTabFilter] = useState<'POPULAR' | 'B2B'>('POPULAR');
  
  // Modals & Sheet State
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [activeModalCategory, setActiveModalCategory] = useState('Daily Needs');
  const [sheetExpanded, setSheetExpanded] = useState(false);

  // Inquiry Modal State
  const [inquiryVisible, setInquiryVisible] = useState(false);
  const [inquiryTargetTitle, setInquiryTargetTitle] = useState('Business');
  const [inquiryTargetType, setInquiryTargetType] = useState<'business' | 'worker' | 'supplier' | 'builder' | 'product' | 'requirement'>('business');
  const [inquiryTargetId, setInquiryTargetId] = useState<string | number | undefined>(undefined);

  const openInquiry = (title: string, type: 'business' | 'worker' | 'supplier' | 'builder' | 'product' | 'requirement' = 'business', id?: string | number) => {
    setInquiryTargetTitle(title);
    setInquiryTargetType(type);
    setInquiryTargetId(id);
    setInquiryVisible(true);
  };

  // Data states
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  // Animated Sheet Height
  const sheetAnimHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;

  const expandSheet = () => {
    Animated.spring(sheetAnimHeight, {
      toValue: EXPANDED_HEIGHT,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
    setSheetExpanded(true);
  };

  const collapseSheet = () => {
    Animated.spring(sheetAnimHeight, {
      toValue: COLLAPSED_HEIGHT,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
    setSheetExpanded(false);
  };

  const toggleSheet = () => {
    if (sheetExpanded) {
      collapseSheet();
    } else {
      expandSheet();
    }
  };

  // PanResponder bound to handle bar for smooth real-time 1-to-1 dragging
  const handlePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const baseHeight = sheetExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
        const targetH = baseHeight - gestureState.dy;
        if (targetH >= COLLAPSED_HEIGHT - 20 && targetH <= EXPANDED_HEIGHT + 20) {
          sheetAnimHeight.setValue(targetH);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -30 || gestureState.vy < -0.3) {
          expandSheet();
        } else if (gestureState.dy > 30 || gestureState.vy > 0.3) {
          collapseSheet();
        } else {
          toggleSheet();
        }
      },
    })
  ).current;

  const handleSheetScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= -10 && sheetExpanded) {
      collapseSheet();
    } else if (offsetY > 30 && !sheetExpanded) {
      expandSheet();
    }
  };

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/listings');
      const data = response.data.data || response.data;
      const apiListings = Array.isArray(data) ? data : data.data || [];
      if (apiListings.length > 0) {
        setListings(apiListings);
      } else {
        throw new Error('No backend data, loading Patna mock dataset');
      }
    } catch (error) {
      console.warn('Using Patna, Bihar mock listings feed');
      setListings([
        {
          id: 1,
          title: "Samosewali Restaurant & Litti Corner",
          slug: "samosewali-restaurant-patna",
          description: "Famous for authentic Bihari Litti Chokha, samosas, regional sweets & multi-cuisine delights. Fraser Road, Near Patna Junction, Patna, Bihar. Use code TD30PATNA for 30% discount.",
          city: "Patna, Bihar",
          category: { id: 1, name: "Restaurant" },
          reviews_avg_rating: "4.9",
          featured: true,
        },
        {
          id: 2,
          title: "Apex Multi-Specialty Hospital & Trauma Centre",
          slug: "apex-multi-specialty-hospital-patna",
          description: "Top-tier 24/7 ICU emergency trauma, cardiology & multi-specialty healthcare services in Central Bihar. Bailey Road, Near Pillar 62, Patna, Bihar.",
          city: "Patna, Bihar",
          category: { id: 3, name: "Doctors" },
          reviews_avg_rating: "4.8",
          featured: true,
        },
        {
          id: 3,
          title: "Hotel Maurya Patna & Luxury Banquets",
          slug: "hotel-maurya-patna",
          description: "Premium 5-star hospitality, luxury suites, fine dining, swimming pool & convention hall. South Gandhi Maidan, Patna, Bihar.",
          city: "Patna, Bihar",
          category: { id: 2, name: "Hotels" },
          reviews_avg_rating: "4.7",
          featured: true,
        },
        {
          id: 4,
          title: "Patliputra Education & UPSC Coaching Hub",
          slug: "patliputra-education-patna",
          description: "Premier IIT-JEE, NEET & Bihar Public Service Commission (BPSC) coaching center. Boring Road Crossing, Patna, Bihar.",
          city: "Patna, Bihar",
          category: { id: 4, name: "Education" },
          reviews_avg_rating: "4.9",
          featured: true,
        },
        {
          id: 5,
          title: "Bihari Packers & Logistics",
          slug: "bihari-packers-movers-patna",
          description: "Safe & quick home relocation, office shifting, car carrier & transport services across Patna, Gaya, Muzaffarpur & Pan India. Kankarbagh Main Road, Patna, Bihar.",
          city: "Patna, Bihar",
          category: { id: 5, name: "Packers & Movers" },
          reviews_avg_rating: "4.6",
          featured: false,
        },
        {
          id: 6,
          title: "Patna AC Repair & Electrical Services",
          slug: "patna-ac-repair-services",
          description: "Instant doorstep AC installation, gas refilling, plumbing, electrical & deep home cleaning services. Rajendra Nagar, Patna, Bihar.",
          city: "Patna, Bihar",
          category: { id: 6, name: "Repairs & Services" },
          reviews_avg_rating: "4.8",
          featured: false,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = '/listings?';
      if (selectedCategory) url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (city) url += `city=${encodeURIComponent(city)}&`;
      if (query) url += `q=${encodeURIComponent(query)}&`;

      const response = await api.get(url);
      const data = response.data.data || response.data;
      setListings(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Top 12 Categories (Grid on Home Page)
  const topCategories = [
    { name: 'B2B', icon: <Briefcase size={22} color="#0284C7" />, bg: '#E0F2FE' },
    { name: 'Doctors', icon: <HeartPulse size={22} color="#0D9488" />, bg: '#CCFBF1' },
    { name: 'Travel', icon: <Plane size={22} color="#2563EB" />, bg: '#EFF6FF' },
    { name: 'Beauty', icon: <Sparkles size={22} color="#DB2777" />, bg: '#FDF2F8' },
    
    { name: 'Education', icon: <GraduationCap size={22} color="#059669" />, bg: '#D1FAE5' },
    { name: 'Consultants', icon: <Briefcase size={22} color="#9333EA" />, bg: '#F3E8FF' },
    { name: 'Ask Astro', badge: 'Beta', icon: <Sparkles size={22} color="#CA8A04" />, bg: '#FEF9C3' },
    { name: 'Wedding Requisites', icon: <HeartPulse size={22} color="#2563EB" />, bg: '#EFF6FF' },
    
    { name: 'Interiors Designers', icon: <Building2 size={22} color="#EC4899" />, bg: '#FCE7F3' },
    { name: 'Packers & Movers', icon: <Truck size={22} color="#EA580C" />, bg: '#FFEDD5' },
    { name: 'Repairs & Services', icon: <Wrench size={22} color="#4F46E5" />, bg: '#EEF2FF' },
    { name: 'Show More', isMore: true, icon: <ChevronDown size={22} color="#FFFFFF" />, bg: '#0284C7' },
  ];

  // Show More Detailed Categories (From Frame 348)
  const modalCategories = ['Daily Needs', 'Food', 'Automobile', 'B2B', 'Baby Care', 'Banquet'];
  
  const modalSubItems: Record<string, Array<{ name: string; icon: React.ReactNode }>> = {
    'Daily Needs': [
      { name: 'Movies', icon: <MovieIcon size={18} color="#D97706" /> },
      { name: 'Grocery', icon: <ShoppingCart size={18} color="#059669" /> },
      { name: 'Medicines', icon: <Pill size={18} color="#DC2626" /> },
      { name: 'Milk & Milk Products', icon: <Tv size={18} color="#0284C7" /> },
      { name: 'Electricians', icon: <Zap size={18} color="#D97706" /> },
      { name: 'Plumber', icon: <Droplet size={18} color="#0284C7" /> },
      { name: 'AC Service', icon: <Tv size={18} color="#2563EB" /> },
      { name: 'More Categories', icon: <MoreHorizontal size={18} color="#64748B" /> },
    ],
    'Food': [
      { name: 'Cuisines', icon: <Utensils size={18} color="#F05A24" /> },
      { name: 'Home Delivery', icon: <Truck size={18} color="#D97706" /> },
    ],
    'Automobile': [
      { name: 'New Cars', icon: <Car size={18} color="#2563EB" /> },
      { name: 'Sell Cars', icon: <Car size={18} color="#059669" /> },
      { name: 'New Two Wheelers', icon: <Car size={18} color="#DC2626" /> },
      { name: 'Sell Two Wheelers', icon: <Car size={18} color="#7C3AED" /> },
    ]
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* 1. TOP TRUEDIAL HEADER (Official Branding) */}
        <View style={styles.fixedTopHeader}>
          <View style={styles.topNavRow}>
            <TouchableOpacity style={styles.avatarCircle} onPress={() => router.push('/profile')}>
              <UserIcon size={18} color="#E8701A" />
            </TouchableOpacity>

            <View style={styles.brandTitleContainer}>
              <Text style={styles.brandMainText}>True<Text style={{ color: '#E8701A' }}>Dial</Text></Text>
              <Text style={styles.brandSubTag}>GROWTH PLATFORM</Text>
            </View>

            <TouchableOpacity style={styles.bellIconBtn}>
              <Bell size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>

          {/* Search Bar Input */}
          <View style={styles.searchBarWrapper}>
            <Search size={18} color="#E8701A" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchBarInput}
              placeholder={`Search TrueDial in ${city || 'City'}`}
              placeholderTextColor="#64748B"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={{ padding: 4 }}>
              <Scan size={18} color="#1E293B" />
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 4, marginLeft: 4 }}>
              <Mic size={18} color="#E8701A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. TOP CATEGORIES GRID (Fixed Grid behind Draggable Sheet) */}
        <View style={styles.topGridContainer}>
          {topCategories.map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.topGridCard}
              onPress={() => {
                if (item.isMore) {
                  setShowMoreModal(true);
                } else {
                  setSelectedCategory(item.name);
                  handleSearch();
                }
              }}
            >
              <View style={[styles.gridIconBox, { backgroundColor: item.bg }]}>
                {item.icon}
              </View>
              {item.badge && (
                <View style={styles.betaBadge}>
                  <Text style={styles.betaBadgeText}>{item.badge}</Text>
                </View>
              )}
              <Text numberOfLines={2} style={styles.gridCardName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. ANIMATED SLIDING BOTTOM SHEET CONTAINER (Matching Frame 0 & Frame 174) */}
        <Animated.View style={[styles.draggableSheetContainer, { height: sheetAnimHeight }]}>
          {/* DRAG HANDLE BAR AREA */}
          <View {...handlePanResponder.panHandlers} style={styles.dragHandleArea}>
            <TouchableOpacity onPress={toggleSheet} style={styles.dragHandleTouchArea}>
              <View style={styles.dragHandleBar} />
            </TouchableOpacity>
          </View>

          {/* SHEET SCROLLABLE CONTENT */}
          <ScrollView 
            style={styles.sheetScrollView} 
            showsVerticalScrollIndicator={false}
            onScroll={handleSheetScroll}
            scrollEventThrottle={16}
          >
            {/* LIST YOUR BUSINESS FREE BANNER */}
            <View style={styles.listBusinessBanner}>
              <View style={styles.listBusinessLeft}>
                <Text style={styles.listBusinessText}>List your business</Text>
                <View style={styles.freePillBadge}>
                  <Text style={styles.freePillText}>Free</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.startNowBtn} onPress={() => router.push('/profile')}>
                <Text style={styles.startNowBtnText}>Start Now</Text>
              </TouchableOpacity>
            </View>

            {/* HOME SERVICES SECTION */}
            <View style={styles.sheetSectionHeaderRow}>
              <Text style={styles.sheetSectionTitle}>HOME SERVICES</Text>
              <ChevronRight size={18} color="#1E293B" />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalTileScroll}>
              <TouchableOpacity style={styles.homeServiceTile} onPress={() => { setSelectedCategory('Repairs'); handleSearch(); }}>
                <View style={[styles.tileImagePlaceholder, { backgroundColor: '#3B82F6' }]}>
                  <Wrench size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.tileTitleText}>AC REPAIR & SERVICE</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.homeServiceTile} onPress={() => { setSelectedCategory('Repairs'); handleSearch(); }}>
                <View style={[styles.tileImagePlaceholder, { backgroundColor: '#F59E0B' }]}>
                  <PawPrint size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.tileTitleText}>PEST CONTROL</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.homeServiceTile} onPress={() => { setSelectedCategory('Packers'); handleSearch(); }}>
                <View style={[styles.tileImagePlaceholder, { backgroundColor: '#10B981' }]}>
                  <Truck size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.tileTitleText}>PACKERS & MOVERS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.homeServiceTile} onPress={() => { setSelectedCategory('Repairs'); handleSearch(); }}>
                <View style={[styles.tileImagePlaceholder, { backgroundColor: '#EC4899' }]}>
                  <Sparkles size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.tileTitleText}>DEEP CLEANING</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* SHOPPING TILES ROW */}
            <View style={styles.shoppingTilesRow}>
              <TouchableOpacity style={[styles.shoppingSquareTile, { backgroundColor: '#0284C7' }]}>
                <ShoppingBag size={24} color="#FFFFFF" style={{ marginBottom: 4 }} />
                <Text style={styles.shopBrandTitle}>JioMart</Text>
                <Text style={styles.shopSubTitle}>SHOPPING</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.shoppingSquareTile, { backgroundColor: '#1E293B' }]}>
                <Sparkles size={24} color="#FFFFFF" style={{ marginBottom: 4 }} />
                <Text style={styles.shopBrandTitle}>AJIO</Text>
                <Text style={styles.shopSubTitle}>FASHION</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.shoppingSquareTile, { backgroundColor: '#FECDD3' }]}>
                <HeartPulse size={24} color="#E11D48" style={{ marginBottom: 4 }} />
                <Text style={[styles.shopBrandTitle, { color: '#E11D48' }]}>tira</Text>
                <Text style={[styles.shopSubTitle, { color: '#E11D48' }]}>BEAUTY</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.shoppingSquareTile, { backgroundColor: '#F97316' }]}>
                <Utensils size={24} color="#FFFFFF" style={{ marginBottom: 4 }} />
                <Text style={styles.shopBrandTitle}>ORDER</Text>
                <Text style={styles.shopSubTitle}>FOOD</Text>
              </TouchableOpacity>
            </View>

            {/* MATERIALS & BUILDING SUPPLIES (FindMyInterior Marketplace) */}
            <View style={styles.sheetSectionHeaderRow}>
              <Text style={styles.sheetSectionTitle}>MATERIALS & SUPPLIES STORE</Text>
              <TouchableOpacity onPress={() => openInquiry('Building Materials', 'product')}>
                <Text style={styles.refreshText}>View All →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalTileScroll}>
              <GlassCard style={styles.materialCardTile}>
                <View style={[styles.tileImagePlaceholder, { backgroundColor: '#EFF6FF' }]}>
                  <Package size={28} color="#0284C7" />
                </View>
                <Text numberOfLines={1} style={styles.matTitleText}>Italian Marble & Tiles</Text>
                <Text style={styles.matPriceText}>₹45 / sqft</Text>
                <Text style={styles.matSupplierText}>Patna Marble House</Text>
                <TouchableOpacity style={styles.inquireMiniBtn} onPress={() => openInquiry('Italian Marble & Tiles', 'product')}>
                  <Text style={styles.inquireMiniBtnText}>Inquire</Text>
                </TouchableOpacity>
              </GlassCard>

              <GlassCard style={styles.materialCardTile}>
                <View style={[styles.tileImagePlaceholder, { backgroundColor: '#FEF3C7' }]}>
                  <Building2 size={28} color="#D97706" />
                </View>
                <Text numberOfLines={1} style={styles.matTitleText}>Teak Plywood & Doors</Text>
                <Text style={styles.matPriceText}>₹85 / sqft</Text>
                <Text style={styles.matSupplierText}>Patliputra Plywood</Text>
                <TouchableOpacity style={styles.inquireMiniBtn} onPress={() => openInquiry('Teak Plywood & Doors', 'product')}>
                  <Text style={styles.inquireMiniBtnText}>Inquire</Text>
                </TouchableOpacity>
              </GlassCard>

              <GlassCard style={styles.materialCardTile}>
                <View style={[styles.tileImagePlaceholder, { backgroundColor: '#ECFDF5' }]}>
                  <Droplet size={28} color="#059669" />
                </View>
                <Text numberOfLines={1} style={styles.matTitleText}>Sanitaryware Fittings</Text>
                <Text style={styles.matPriceText}>₹1,250 / set</Text>
                <Text style={styles.matSupplierText}>Jaquar Studio Patna</Text>
                <TouchableOpacity style={styles.inquireMiniBtn} onPress={() => openInquiry('Sanitaryware Fittings', 'product')}>
                  <Text style={styles.inquireMiniBtnText}>Inquire</Text>
                </TouchableOpacity>
              </GlassCard>

              <GlassCard style={styles.materialCardTile}>
                <View style={[styles.tileImagePlaceholder, { backgroundColor: '#FDF2F8' }]}>
                  <Zap size={28} color="#DB2777" />
                </View>
                <Text numberOfLines={1} style={styles.matTitleText}>Concealed LED Lights</Text>
                <Text style={styles.matPriceText}>₹320 / pc</Text>
                <Text style={styles.matSupplierText}>Bihar Electricals</Text>
                <TouchableOpacity style={styles.inquireMiniBtn} onPress={() => openInquiry('Concealed LED Lights', 'product')}>
                  <Text style={styles.inquireMiniBtnText}>Inquire</Text>
                </TouchableOpacity>
              </GlassCard>
            </ScrollView>

            {/* SKILLED WORKERS DIRECTORY */}
            <View style={styles.sheetSectionHeaderRow}>
              <Text style={styles.sheetSectionTitle}>HIRE SKILLED WORKERS</Text>
              <TouchableOpacity onPress={() => openInquiry('Skilled Workers', 'worker')}>
                <Text style={styles.refreshText}>View All →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalTileScroll}>
              <GlassCard style={styles.workerCardTile}>
                <View style={styles.workerHeaderRow}>
                  <View style={styles.workerAvatar}>
                    <UserIcon size={18} color="#E8701A" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.workerNameText}>Ramesh M.</Text>
                    <Text style={styles.workerTradeText}>Certified Plumber</Text>
                  </View>
                </View>
                <Text style={styles.workerRateText}>₹750 / Day</Text>
                <Text style={styles.workerLocText}>Boring Road, Patna</Text>
                <TouchableOpacity style={styles.bookWorkerBtn} onPress={() => openInquiry('Ramesh M. (Plumber)', 'worker')}>
                  <Text style={styles.bookWorkerBtnText}>Book Worker</Text>
                </TouchableOpacity>
              </GlassCard>

              <GlassCard style={styles.workerCardTile}>
                <View style={styles.workerHeaderRow}>
                  <View style={styles.workerAvatar}>
                    <UserIcon size={18} color="#0284C7" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.workerNameText}>Vikash K.</Text>
                    <Text style={styles.workerTradeText}>Master Electrician</Text>
                  </View>
                </View>
                <Text style={styles.workerRateText}>₹800 / Day</Text>
                <Text style={styles.workerLocText}>Kankarbagh, Patna</Text>
                <TouchableOpacity style={styles.bookWorkerBtn} onPress={() => openInquiry('Vikash K. (Electrician)', 'worker')}>
                  <Text style={styles.bookWorkerBtnText}>Book Worker</Text>
                </TouchableOpacity>
              </GlassCard>

              <GlassCard style={styles.workerCardTile}>
                <View style={styles.workerHeaderRow}>
                  <View style={styles.workerAvatar}>
                    <UserIcon size={18} color="#059669" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.workerNameText}>Sanjay T.</Text>
                    <Text style={styles.workerTradeText}>Furniture Carpenter</Text>
                  </View>
                </View>
                <Text style={styles.workerRateText}>₹900 / Day</Text>
                <Text style={styles.workerLocText}>Bailey Road, Patna</Text>
                <TouchableOpacity style={styles.bookWorkerBtn} onPress={() => openInquiry('Sanjay T. (Carpenter)', 'worker')}>
                  <Text style={styles.bookWorkerBtnText}>Book Worker</Text>
                </TouchableOpacity>
              </GlassCard>
            </ScrollView>

            {/* PROJECT REQUIREMENTS & RFQ BIDDING */}
            <View style={styles.sheetSectionHeaderRow}>
              <Text style={styles.sheetSectionTitle}>PROJECT REQUIREMENTS & RFQS</Text>
              <TouchableOpacity onPress={() => router.push('/offers')}>
                <Text style={styles.refreshText}>Post Requirement +</Text>
              </TouchableOpacity>
            </View>

            <GlassCard style={styles.rfqCardBox}>
              <View style={styles.rfqHeaderRow}>
                <Text style={styles.rfqTitleText}>3BHK Luxury Interior Renovation</Text>
                <View style={styles.rfqBudgetBadge}>
                  <Text style={styles.rfqBudgetText}>₹4.5 Lakhs</Text>
                </View>
              </View>
              <Text style={styles.rfqSubText}>Boring Road Crossing, Patna • Need Designer & Contractor</Text>
              <TouchableOpacity style={styles.bidNowBtn} onPress={() => openInquiry('3BHK Interior Renovation RFQ', 'requirement')}>
                <Text style={styles.bidNowBtnText}>Submit Bid / Quote →</Text>
              </TouchableOpacity>
            </GlassCard>

            {/* PRIVILEGE CLUB OFFER SHOWCASE */}
            <GlassCard style={styles.privilegeBannerBox}>
              <View style={styles.privilegeBannerHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.privilegeTitleText}>TrueDial Privilege Card</Text>
                  <Text style={styles.privilegeSubText}>Save up to 50% on medical, dining & stay in Patna!</Text>
                </View>
                <Award size={28} color="#F05A24" />
              </View>

              <View style={styles.cardOfferRow}>
                <View style={styles.cardMiniItem}>
                  <Text style={styles.cardMiniName}>City Card</Text>
                  <Text style={styles.cardMiniPrice}>₹999/- Only</Text>
                </View>

                <View style={styles.cardMiniItem}>
                  <Text style={styles.cardMiniName}>Multi-City Card</Text>
                  <Text style={styles.cardMiniPrice}>₹2,999/- Only</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.buyCardBtn} onPress={() => router.push('/privilege')}>
                <Text style={styles.buyCardBtnText}>Explore Privilege Cards →</Text>
              </TouchableOpacity>
            </GlassCard>

            {/* VERIFIED BUSINESS LISTINGS FEED */}
            <View style={styles.sheetSectionHeaderRow}>
              <Text style={styles.sheetSectionTitle}>VERIFIED BUSINESSES ({listings.length})</Text>
              <TouchableOpacity onPress={fetchFeaturedListings}>
                <Text style={styles.refreshText}>Refresh</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator color="#0284C7" style={{ marginVertical: 20 }} />
            ) : (
              listings.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  activeOpacity={0.9} 
                  onPress={() => router.push(`/listing/${item.slug}`)}
                >
                  <GlassCard style={styles.listingItemCard}>
                    <View style={styles.listingHeaderRow}>
                      <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={styles.listingTitleText}>{item.title}</Text>
                        <Text style={styles.listingCatCityText}>
                          {item.category?.name || 'Business'} • {item.city}
                        </Text>
                      </View>
                      <View style={styles.ratingBox}>
                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.ratingNumber}>
                          {item.reviews_avg_rating ? parseFloat(item.reviews_avg_rating).toFixed(1) : '4.5'}
                        </Text>
                      </View>
                    </View>

                    <Text numberOfLines={2} style={styles.listingDescText}>
                      {item.description}
                    </Text>

                    <View style={styles.listingFooterRow}>
                      <View style={styles.locCol}>
                        <MapPin size={14} color="#64748B" />
                        <Text style={styles.locNameText}>{item.city}</Text>
                      </View>
                      <Text style={styles.viewLinkText}>View Details →</Text>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              ))
            )}

            <View style={{ height: 120 }} />
          </ScrollView>
        </Animated.View>

        {/* 4. FLOATING TAB PILL OVERLAY (POPULAR | B2B) */}
        <View style={styles.floatingTabPill}>
          <TouchableOpacity 
            style={[styles.pillBtn, activeTabFilter === 'POPULAR' && styles.pillBtnActive]}
            onPress={() => setActiveTabFilter('POPULAR')}
          >
            <Text style={[styles.pillText, activeTabFilter === 'POPULAR' && styles.pillTextActive]}>
              POPULAR
            </Text>
          </TouchableOpacity>

          <View style={styles.pillDivider} />

          <TouchableOpacity 
            style={[styles.pillBtn, activeTabFilter === 'B2B' && styles.pillBtnActive]}
            onPress={() => setActiveTabFilter('B2B')}
          >
            <Text style={[styles.pillText, activeTabFilter === 'B2B' && styles.pillTextActive]}>
              B2B
            </Text>
          </TouchableOpacity>
        </View>

        {/* 5. ALL CATEGORIES EXPLORER MODAL (Matching Frame 348 from Video) */}
        <Modal
          visible={showMoreModal}
          animationType="slide"
          onRequestClose={() => setShowMoreModal(false)}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            {/* Modal Top Search Header */}
            <View style={styles.modalHeaderRow}>
              <TouchableOpacity onPress={() => setShowMoreModal(false)} style={styles.modalBackBtn}>
                <ArrowLeft size={22} color="#1E293B" />
              </TouchableOpacity>
              <View style={styles.modalSearchInputWrapper}>
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Type here..."
                  placeholderTextColor="#94A3B8"
                  value={query}
                  onChangeText={setQuery}
                  autoFocus
                />
              </View>
            </View>

            {/* Modal Horizontal Category Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalTabScroll}>
              {modalCategories.map((cat, idx) => {
                const isSelected = activeModalCategory === cat;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.modalCatTab, isSelected && styles.modalCatTabSelected]}
                    onPress={() => setActiveModalCategory(cat)}
                  >
                    <Text style={[styles.modalCatTabText, isSelected && styles.modalCatTabTextSelected]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Detailed Sub-Category Pill Items Grid */}
            <ScrollView style={styles.modalBodyScroll}>
              {Object.keys(modalSubItems).map((sectionKey) => (
                <View key={sectionKey} style={styles.modalSectionContainer}>
                  <Text style={styles.modalSectionTitle}>{sectionKey}</Text>
                  <View style={styles.pillGridRow}>
                    {(modalSubItems[sectionKey] || []).map((sub, sIdx) => (
                      <TouchableOpacity 
                        key={sIdx} 
                        style={styles.categoryPillItem}
                        onPress={() => {
                          setSelectedCategory(sub.name);
                          setShowMoreModal(false);
                          handleSearch();
                        }}
                      >
                        <View style={styles.pillIconBox}>
                          {sub.icon}
                        </View>
                        <Text style={styles.pillItemName}>{sub.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* 6. INSTANT INQUIRY MODAL */}
        <InquiryModal
          visible={inquiryVisible}
          onClose={() => setInquiryVisible(false)}
          targetTitle={inquiryTargetTitle}
          targetType={inquiryTargetType}
          targetId={inquiryTargetId}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fixedTopHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 12 : 6,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitleContainer: {
    alignItems: 'center',
  },
  brandMainText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  brandSubTag: {
    fontSize: 8,
    fontWeight: '800',
    color: '#E8701A',
    letterSpacing: 1,
    marginTop: -3,
  },
  bellIconBtn: {
    padding: 6,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchBarInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  topGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  topGridCard: {
    width: '25%', // 4 items per row matching screenshots
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  gridIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  betaBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginBottom: 2,
  },
  betaBadgeText: {
    fontSize: 8,
    color: '#DC2626',
    fontWeight: '700',
  },
  gridCardName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 14,
  },
  draggableSheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    borderColor: '#E2E8F0',
    borderTopWidth: 1,
  },
  dragHandleArea: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  dragHandleTouchArea: {
    padding: 6,
  },
  dragHandleBar: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CBD5E1',
  },
  sheetScrollView: {
    paddingHorizontal: 16,
  },
  listBusinessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderColor: '#0284C7',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  listBusinessLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listBusinessText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  freePillBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  freePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  startNowBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  startNowBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sheetSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  sheetSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.3,
  },
  horizontalTileScroll: {
    marginBottom: 14,
  },
  homeServiceTile: {
    width: 120,
    marginRight: 10,
  },
  tileImagePlaceholder: {
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  tileTitleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 14,
  },
  shoppingTilesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  shoppingSquareTile: {
    width: '23%',
    height: 90,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  shopBrandTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  shopSubTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  privilegeBannerBox: {
    padding: 14,
    marginBottom: 16,
  },
  privilegeBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  privilegeTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  privilegeSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  cardOfferRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardMiniItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginRight: 6,
  },
  cardMiniName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  cardMiniPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F05A24',
    marginTop: 2,
  },
  buyCardBtn: {
    backgroundColor: '#F05A24',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buyCardBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  refreshText: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '700',
  },
  listingItemCard: {
    marginBottom: 10,
    padding: 12,
  },
  listingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  listingTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  listingCatCityText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 3,
  },
  listingDescText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 8,
  },
  listingFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  locCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locNameText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
  },
  viewLinkText: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
  },
  floatingTabPill: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  pillBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
  },
  pillBtnActive: {
    backgroundColor: '#334155',
  },
  pillText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  pillDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#475569',
  },

  /* MODAL STYLES (Matching Frame 348) */
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalBackBtn: {
    marginRight: 12,
  },
  modalSearchInputWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
  },
  modalSearchInput: {
    fontSize: 14,
    color: '#0F172A',
  },
  modalTabScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalCatTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
  },
  modalCatTabSelected: {
    backgroundColor: '#EFF6FF',
  },
  modalCatTabText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  modalCatTabTextSelected: {
    color: '#0284C7',
    fontWeight: '700',
  },
  modalBodyScroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalSectionContainer: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  pillGridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryPillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  pillIconBox: {
    marginRight: 8,
  },
  pillItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },

  /* FINDMYINTERIOR INTEGRATED STYLES */
  materialCardTile: {
    width: 140,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  matTitleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 4,
  },
  matPriceText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E8701A',
    marginTop: 2,
  },
  matSupplierText: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 6,
  },
  inquireMiniBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: 'center',
  },
  inquireMiniBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  workerCardTile: {
    width: 160,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  workerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  workerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workerNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  workerTradeText: {
    fontSize: 9,
    color: '#64748B',
  },
  workerRateText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 2,
  },
  workerLocText: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 8,
  },
  bookWorkerBtn: {
    backgroundColor: '#E8701A',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  bookWorkerBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  rfqCardBox: {
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  rfqHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  rfqTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  rfqBudgetBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  rfqBudgetText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  rfqSubText: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 10,
  },
  bidNowBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  bidNowBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
