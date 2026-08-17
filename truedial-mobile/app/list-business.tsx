import React, { useState, useEffect } from 'react';
import { 
  Text, View, TextInput, ScrollView, Alert,
  TouchableOpacity, ActivityIndicator, StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';
import LocationSelectorModal from '../components/LocationSelectorModal';
import CategorySelectorModal from '../components/CategorySelectorModal';
import { 
  Building, MapPin, Phone, ArrowLeft, CheckCircle2, 
  Globe, Mail, Clock, MessageSquare, Briefcase, Tag, Check, ChevronDown
} from 'lucide-react-native';
import { useAuth } from '../context/auth';

interface Category {
  id: number;
  name: string;
}

const BUSINESS_TYPES = ['Individual / Freelance', 'Proprietorship', 'Private Limited', 'Partnership'];
const AMENITY_OPTIONS = ['Free Wi-Fi', 'Parking Available', 'Air Conditioned', 'Home Delivery', 'Card Payment Accepted', 'Online Booking'];

export default function ListBusinessScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    address: '',
    locality: '',
    city: 'Patna',
    state: 'Bihar',
    pincode: '',
    phone: user?.phone || '',
    whatsapp: user?.phone || '',
    email: user?.email || '',
    website: '',
    opening_hours: '09:00 AM - 08:00 PM',
    business_type: 'Proprietorship',
    description: '',
    selectedAmenities: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: String(data[0].id) }));
        }
      } catch {
        setCategories([
          { id: 1, name: 'Restaurants & Cafes' },
          { id: 2, name: 'Hotels & Lodging' },
          { id: 3, name: 'Hospitals & Healthcare' },
          { id: 4, name: 'Education & Coaching' },
          { id: 5, name: 'Interior & Architecture' },
          { id: 6, name: 'Repair & Maintenance' },
          { id: 7, name: 'Digital Marketing & IT' },
          { id: 8, name: 'Fitness & Gyms' },
          { id: 9, name: 'Event Management' },
          { id: 10, name: 'Salons & Beauty' },
          { id: 11, name: 'Automobile Services' },
          { id: 12, name: 'Travel & Tourism' },
          { id: 13, name: 'Real Estate & Property' },
          { id: 14, name: 'Legal & Financial Services' },
          { id: 15, name: 'Grocery & Supermarket' },
          { id: 16, name: 'Pharmacy & Medical Store' },
          { id: 17, name: 'Electronics & Gadgets' },
          { id: 18, name: 'Clothing & Fashion' },
          { id: 19, name: 'Furniture & Home Decor' },
          { id: 20, name: 'Photography & Videography' },
          { id: 21, name: 'Packers & Movers' },
          { id: 22, name: 'Printing & Advertising' },
          { id: 23, name: 'Catering & Tiffin Service' },
          { id: 24, name: 'Pet Services & Veterinary' },
          { id: 25, name: 'Jewellery & Accessories' },
          { id: 26, name: 'Banking & Insurance' },
          { id: 27, name: 'Courier & Delivery' },
          { id: 28, name: 'Hardware & Building Supplies' },
          { id: 29, name: 'Books & Stationery' },
          { id: 30, name: 'Nursery & Garden' },
          { id: 31, name: 'Security Services' },
          { id: 32, name: 'Astrology & Vastu' },
          { id: 33, name: 'Bakery & Sweets' },
          { id: 34, name: 'Opticals & Eyewear' },
          { id: 35, name: 'Mobile & Computer Repair' },
        ]);
        setFormData(prev => ({ ...prev, category_id: '1' }));
      }
    };
    fetchCategories();
  }, []);

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => {
      const exists = prev.selectedAmenities.includes(amenity);
      return {
        ...prev,
        selectedAmenities: exists 
          ? prev.selectedAmenities.filter(a => a !== amenity)
          : [...prev.selectedAmenities, amenity]
      };
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.city || !formData.phone || !formData.address) {
      Alert.alert('Missing Required Fields', 'Please fill in Business Title, Street Address, City, and Business Phone.');
      return;
    }

    setLoading(true);
    try {
      const fullDescription = `${formData.description}\n\nOperating Hours: ${formData.opening_hours}\nAmenities: ${formData.selectedAmenities.join(', ')}`;

      await api.post('/truedial/vendor/businesses', {
        title: formData.title,
        category_id: parseInt(formData.category_id),
        city_id: 1,
        address: `${formData.address}${formData.locality ? ', ' + formData.locality : ''}`,
        district: formData.city,
        city: formData.city,
        state: formData.state || 'Bihar',
        pincode: formData.pincode || '',
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        email: formData.email,
        website: formData.website,
        business_type: formData.business_type,
        description: fullDescription
      });
      
      if (refreshUser) {
        await refreshUser();
      }
      setSuccess(true);
    } catch (error: any) {
      console.error('List business error:', error);
      const errMsg = error?.response?.data?.message || error?.message || '';
      
      if (errMsg.includes('already have a business listing')) {
        Alert.alert(
          'Business Already Listed',
          'You already have an active business listing. Redirecting to your dashboard...',
          [{ text: 'Go to Dashboard', onPress: async () => {
            if (refreshUser) await refreshUser();
            router.replace('/(tabs)/dashboard');
          }}]
        );
      } else {
        Alert.alert('Error', errMsg || 'Failed to list business. Please check details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 justify-center items-center p-8">
        <CheckCircle2 size={64} color="#10B981" className="mb-5" />
        <Text className="text-[24px] font-extrabold text-slate-900 dark:text-white mb-2 text-center">Business Listed Successfully!</Text>
        <Text className="text-[15px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
          Your business listing is live on the TrueDial network. Customers can now discover your services and contact you directly.
        </Text>
        <CustomButton 
          title="Go to Business Dashboard" 
          onPress={() => router.replace('/(tabs)/dashboard')}
          className="w-full mt-6"
        />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 100 }}>
      <TouchableOpacity className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 justify-center items-center border border-slate-200 dark:border-slate-800 mb-6" onPress={() => router.back()}>
        <ArrowLeft size={24} color="#1E293B" className="dark:text-white" />
      </TouchableOpacity>

      <Text className="text-[28px] font-extrabold text-slate-900 dark:text-white mb-2">List Your Business</Text>
      <Text className="text-[15px] text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">Provide details to register your business on TrueDial.</Text>

      <GlassCard className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        
        {/* Business Name */}
        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">BUSINESS NAME *</Text>
          <View className="flex-row items-center h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5">
            <Building size={18} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-[15px] text-slate-900 dark:text-white font-medium"
              placeholder="e.g. Royal Grand Restaurant & Caterers"
              placeholderTextColor="#94A3B8"
              value={formData.title}
              onChangeText={(text) => setFormData({...formData, title: text})}
            />
          </View>
        </View>

        {/* Category Dropdown Picker */}
        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">BUSINESS CATEGORY *</Text>
          <TouchableOpacity
            className="flex-row items-center justify-between h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5"
            onPress={() => setCategoryModalVisible(true)}
          >
            <View className="flex-row items-center flex-1">
              <Tag size={18} color="#1E40AF" style={{ marginRight: 10 }} />
              <Text className="text-[15px] font-bold text-slate-900 dark:text-white" numberOfLines={1}>
                {categories.find(c => String(c.id) === formData.category_id)?.name || 'Select Business Category'}
              </Text>
            </View>
            <ChevronDown size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Business Type */}
        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">REGISTRATION TYPE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {BUSINESS_TYPES.map(type => {
              const isSelected = formData.business_type === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFormData({...formData, business_type: type})}
                  className={`px-3 py-1.5 rounded-lg mr-2 border ${isSelected ? 'bg-slate-900 border-slate-900 dark:bg-white dark:border-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
                >
                  <Text className={`text-[12px] font-bold ${isSelected ? 'text-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-300'}`}>{type}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Street Address & Locality */}
        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">STREET ADDRESS & BUILDING *</Text>
          <View className="flex-row items-center h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 mb-3">
            <MapPin size={18} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-[15px] text-slate-900 dark:text-white font-medium"
              placeholder="e.g. Shop 12, Exhibition Road"
              placeholderTextColor="#94A3B8"
              value={formData.address}
              onChangeText={(text) => setFormData({...formData, address: text})}
            />
          </View>
          <View className="flex-row items-center h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5">
            <Tag size={18} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-[15px] text-slate-900 dark:text-white font-medium"
              placeholder="Locality / Landmark (e.g. Near Gandhi Maidan)"
              placeholderTextColor="#94A3B8"
              value={formData.locality}
              onChangeText={(text) => setFormData({...formData, locality: text})}
            />
          </View>
        </View>

        {/* City & Pincode */}
        <View className="flex-row gap-3 mb-5">
          <View className="flex-1">
            <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">CITY *</Text>
            <TouchableOpacity 
              className="flex-row items-center justify-between h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5"
              onPress={() => setLocationModalVisible(true)}
            >
              <View className="flex-row items-center flex-1">
                <MapPin size={16} color="#1E40AF" style={{ marginRight: 6 }} />
                <Text className="text-[14px] font-bold text-slate-900 dark:text-white" numberOfLines={1}>{formData.city}</Text>
              </View>
              <ChevronDown size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View className="w-[40%]">
            <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">PINCODE</Text>
            <TextInput
              className="h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 text-[15px] text-slate-900 dark:text-white font-medium"
              placeholder="e.g. 800001"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={6}
              value={formData.pincode}
              onChangeText={(text) => setFormData({...formData, pincode: text})}
            />
          </View>
        </View>

        {/* Phone & WhatsApp */}
        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">PRIMARY PHONE *</Text>
          <View className="flex-row items-center h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 mb-3">
            <Phone size={18} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-[15px] text-slate-900 dark:text-white font-medium"
              placeholder="e.g. +91 9876543210"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
            />
          </View>

          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">WHATSAPP NUMBER</Text>
          <View className="flex-row items-center h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5">
            <MessageSquare size={18} color="#10B981" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-[15px] text-slate-900 dark:text-white font-medium"
              placeholder="e.g. +91 9876543210"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={formData.whatsapp}
              onChangeText={(text) => setFormData({...formData, whatsapp: text})}
            />
          </View>
        </View>

        {/* Email & Website */}
        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">BUSINESS EMAIL & WEBSITE</Text>
          <View className="flex-row items-center h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 mb-3">
            <Mail size={18} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-[15px] text-slate-900 dark:text-white font-medium"
              placeholder="contact@business.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
            />
          </View>

          <View className="flex-row items-center h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5">
            <Globe size={18} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-[15px] text-slate-900 dark:text-white font-medium"
              placeholder="https://www.yourbusiness.com"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              value={formData.website}
              onChangeText={(text) => setFormData({...formData, website: text})}
            />
          </View>
        </View>

        {/* Operating Hours */}
        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">OPERATING HOURS</Text>
          <View className="flex-row items-center h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5">
            <Clock size={18} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-[15px] text-slate-900 dark:text-white font-medium"
              placeholder="e.g. Mon-Sat: 09:00 AM - 08:00 PM"
              placeholderTextColor="#94A3B8"
              value={formData.opening_hours}
              onChangeText={(text) => setFormData({...formData, opening_hours: text})}
            />
          </View>
        </View>

        {/* Amenities */}
        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">AMENITIES & SERVICES</Text>
          <View className="flex-row flex-wrap gap-2 mt-1">
            {AMENITY_OPTIONS.map(amenity => {
              const isChecked = formData.selectedAmenities.includes(amenity);
              return (
                <TouchableOpacity
                  key={amenity}
                  onPress={() => toggleAmenity(amenity)}
                  className={`flex-row items-center px-3 py-2 rounded-xl border ${isChecked ? 'bg-blue-50 border-blue-500 dark:bg-blue-950' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}
                >
                  {isChecked && <Check size={14} color="#1E40AF" style={{ marginRight: 6 }} />}
                  <Text className={`text-[12px] font-bold ${isChecked ? 'text-[#1E40AF] dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {amenity}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Description */}
        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">BUSINESS DESCRIPTION</Text>
          <TextInput
            className="h-[100px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-[15px] text-slate-900 dark:text-white font-medium"
            placeholder="Describe your services, specialties, and key offerings..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
            style={{ textAlignVertical: 'top' }}
          />
        </View>

        <CustomButton 
          title={loading ? "Registering Business..." : "List Business for Free"} 
          onPress={handleSubmit} 
          disabled={loading}
          className="mt-2"
        />
      </GlassCard>

      <LocationSelectorModal
        visible={locationModalVisible}
        currentCity={formData.city}
        onClose={() => setLocationModalVisible(false)}
        onSelectCity={(city) => setFormData({ ...formData, city })}
      />

      <CategorySelectorModal
        visible={categoryModalVisible}
        categories={categories}
        selectedCategoryId={formData.category_id}
        onClose={() => setCategoryModalVisible(false)}
        onSelectCategory={(cat) => setFormData({ ...formData, category_id: String(cat.id) })}
      />
    </ScrollView>
  );
}
