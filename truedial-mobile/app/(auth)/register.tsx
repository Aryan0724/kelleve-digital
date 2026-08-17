import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import CategorySelectorModal from '../../components/CategorySelectorModal';
import api from '../../services/api';
import { User, Mail, Phone, Lock, Sparkles, ChevronDown, Tag, Check, X } from 'lucide-react-native';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [role, setRole] = useState<'customer' | 'business' | 'builder' | 'supplier' | 'worker'>('customer');
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  const [agreedTerms, setAgreedTerms] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/truedial/public/categories');
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      } else {
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
    }
  };

  const [focusName, setFocusName] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPhone, setFocusPhone] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [focusConfirmPassword, setFocusConfirmPassword] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPhoneValid = /^[0-9]{10,}$/.test(phone.replace(/\D/g, ''));

  const roleOptions: Array<{ key: 'customer' | 'business' | 'builder' | 'supplier' | 'worker'; label: string; description: string }> = [
    { key: 'customer', label: 'Explorer / Consumer', description: 'Discover & connect with local businesses' },
    { key: 'business', label: 'Business Owner', description: 'Restaurant, Hotel, Hospital, Salon, Shop & more' },
    { key: 'builder', label: 'Real Estate Developer', description: 'Residential & commercial property projects' },
    { key: 'supplier', label: 'Service Provider', description: 'Digital marketing, IT, B2B & professional services' },
    { key: 'worker', label: 'Freelancer / Professional', description: 'Offer your individual skill or expertise' },
  ];

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      setErrorMsg('Please fill in all the details');
      return;
    }
    if (!isEmailValid) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!isPhoneValid) {
      setErrorMsg('Please enter a valid 10-digit phone number');
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Please agree to the Terms of Service & Privacy Policy');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), phone.trim(), password, confirmPassword || password, role);
      router.replace('/(tabs)');
    } catch (err: any) {
      setErrorMsg(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50 dark:bg-slate-950"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
        {/* Glow Effects */}
        <View className="absolute w-[250px] h-[250px] rounded-full opacity-10 bg-[#F05A24] -top-12 -right-12" />
        <View className="absolute w-[250px] h-[250px] rounded-full opacity-10 bg-[#2563EB] -bottom-12 -left-12" />

        {/* Logo Section */}
        <View className="items-center mb-6">
          <View className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-950 justify-center items-center border border-orange-100 dark:border-orange-900 mb-3">
            <Sparkles size={24} color="#E8701A" />
          </View>
          <Text className="text-[30px] font-extrabold text-slate-900 dark:text-white tracking-tight">TrueDial</Text>
          <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 text-center">Create your business directory account</Text>
        </View>

        {/* Sign Up Card */}
        <GlassCard className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <Text className="text-[22px] font-bold text-slate-900 dark:text-white mb-1.5">Sign Up</Text>
          <Text className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">Join India's Emerging Business Growth Platform</Text>

          {errorMsg && (
            <View className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg p-3 mb-4">
              <Text className="text-red-600 dark:text-red-400 text-[13px] font-bold text-center">{errorMsg}</Text>
            </View>
          )}

          {/* Account Role Dropdown Menu Selector */}
          <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">I am a... (Select Account Role)</Text>
          <TouchableOpacity 
            className="flex-row items-center justify-between h-12 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 mb-4"
            onPress={() => setRoleModalVisible(true)}
          >
            <View className="flex-row items-center">
              <User size={18} color="#E8701A" className="mr-2" />
              <Text className="text-[14px] font-bold text-slate-900 dark:text-white ml-2">
                {roleOptions.find(r => r.key === role)?.label || 'Select Account Role'}
              </Text>
            </View>
            <ChevronDown size={18} color="#64748B" />
          </TouchableOpacity>

          {/* Business Category Dropdown Menu Selector (when registering business or contractor) */}
          {(role === 'business' || role === 'supplier' || role === 'worker') && (
            <View className="mb-4">
              <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Business / Service Category</Text>
              <TouchableOpacity 
                className="flex-row items-center justify-between h-12 bg-orange-50/70 dark:bg-slate-800 border border-[#E8701A] rounded-xl px-4"
                onPress={() => setCategoryModalVisible(true)}
              >
                <View className="flex-row items-center">
                  <Tag size={18} color="#E8701A" className="mr-2" />
                  <Text className="text-[14px] font-bold text-[#E8701A] ml-2">
                    {selectedCategory ? selectedCategory.name : 'Select Business Category (Dropdown)...'}
                  </Text>
                </View>
                <ChevronDown size={18} color="#E8701A" />
              </TouchableOpacity>
            </View>
          )}

          {/* Full Name */}
          <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</Text>
          <View className={`flex-row items-center h-12 bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 mb-4 ${focusName ? 'border-[#E8701A] bg-orange-50 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700'}`}>
            <User size={18} color={focusName ? '#E8701A' : '#708090'} className="mr-2" />
            <TextInput
              className="flex-1 text-[14px] text-slate-900 dark:text-white"
              placeholder="e.g. Rahul Kumar"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusName(true)}
              onBlur={() => setFocusName(false)}
            />
          </View>

          {/* Email Address */}
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Email Address</Text>
            {isEmailValid && (
              <Text className="text-[11px] text-emerald-600 font-bold">✓ Verified Format</Text>
            )}
          </View>
          <View className={`flex-row items-center h-12 bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 mb-4 ${isEmailValid ? 'border-emerald-500' : (focusEmail ? 'border-[#E8701A] bg-orange-50 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700')}`}>
            <Mail size={18} color={isEmailValid ? '#10B981' : (focusEmail ? '#E8701A' : '#708090')} className="mr-2" />
            <TextInput
              className="flex-1 text-[14px] text-slate-900 dark:text-white"
              placeholder="e.g. rahul@patna.com"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusEmail(true)}
              onBlur={() => setFocusEmail(false)}
            />
          </View>

          {/* Phone Number */}
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Phone Number</Text>
            {isPhoneValid && (
              <Text className="text-[11px] text-emerald-600 font-bold">✓ Valid Phone</Text>
            )}
          </View>
          <View className={`flex-row items-center h-12 bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 mb-4 ${isPhoneValid ? 'border-emerald-500' : (focusPhone ? 'border-[#E8701A] bg-orange-50 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700')}`}>
            <Phone size={18} color={isPhoneValid ? '#10B981' : (focusPhone ? '#E8701A' : '#708090')} className="mr-2" />
            <TextInput
              className="flex-1 text-[14px] text-slate-900 dark:text-white"
              placeholder="e.g. 9876543210"
              placeholderTextColor="#94A3B8"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              onFocus={() => setFocusPhone(true)}
              onBlur={() => setFocusPhone(false)}
            />
          </View>

          {/* Password */}
          <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Password</Text>
          <View className={`flex-row items-center h-12 bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 mb-4 ${focusPassword ? 'border-[#E8701A] bg-orange-50 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700'}`}>
            <Lock size={18} color={focusPassword ? '#E8701A' : '#708090'} className="mr-2" />
            <TextInput
              className="flex-1 text-[14px] text-slate-900 dark:text-white"
              placeholder="Min. 6 characters"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              onFocus={() => setFocusPassword(true)}
              onBlur={() => setFocusPassword(false)}
            />
          </View>

          {/* Confirm Password */}
          <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</Text>
          <View className={`flex-row items-center h-12 bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 mb-4 ${focusConfirmPassword ? 'border-[#E8701A] bg-orange-50 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700'}`}>
            <Lock size={18} color={focusConfirmPassword ? '#E8701A' : '#708090'} className="mr-2" />
            <TextInput
              className="flex-1 text-[14px] text-slate-900 dark:text-white"
              placeholder="Re-enter password"
              placeholderTextColor="#94A3B8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              onFocus={() => setFocusConfirmPassword(true)}
              onBlur={() => setFocusConfirmPassword(false)}
            />
          </View>

          {/* Terms & Conditions Checkbox */}
          <TouchableOpacity 
            className="flex-row items-center mb-4 px-1" 
            activeOpacity={0.8}
            onPress={() => setAgreedTerms(!agreedTerms)}
          >
            <View className={`w-5 h-5 rounded border-2 justify-center items-center mr-2.5 ${agreedTerms ? 'bg-[#E8701A] border-[#E8701A]' : 'bg-white border-slate-300'}`}>
              {agreedTerms && <Text className="text-white text-[10px] font-extrabold">✓</Text>}
            </View>
            <Text className="flex-1 text-[12px] text-slate-500 leading-relaxed">
              I agree to the <Text className="text-[#E8701A] font-bold">Terms of Service</Text>, <Text className="text-[#E8701A] font-bold">Privacy Policy</Text> & Guidelines.
            </Text>
          </TouchableOpacity>

          <CustomButton 
            title="Sign Up" 
            onPress={handleRegister} 
            loading={loading}
            className="mt-2"
          />
        </GlassCard>

        {/* Bottom Nav */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400">Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-[#E8701A] font-extrabold text-sm"> Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Account Role Dropdown Menu Modal */}
      <Modal visible={roleModalVisible} animationType="slide" transparent={true} onRequestClose={() => setRoleModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Who are you on TrueDial?</Text>
              <TouchableOpacity onPress={() => setRoleModalVisible(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {roleOptions.map((opt) => {
              const isSelected = role === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12,
                    backgroundColor: isSelected ? '#FFF7ED' : '#F8FAFC',
                    marginBottom: 8, borderWidth: 1, borderColor: isSelected ? '#E8701A' : '#E2E8F0'
                  }}
                  onPress={() => {
                    setRole(opt.key);
                    setRoleModalVisible(false);
                  }}
                >
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={{ fontSize: 15, fontWeight: isSelected ? '800' : '700', color: isSelected ? '#E8701A' : '#334155' }}>
                      {opt.label}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '500', color: '#94A3B8', marginTop: 2 }}>
                      {opt.description}
                    </Text>
                  </View>
                  {isSelected && <Check size={18} color="#E8701A" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* Business Category Dropdown Menu Modal */}
      <CategorySelectorModal
        visible={categoryModalVisible}
        categories={categories}
        selectedCategoryId={selectedCategory ? String(selectedCategory.id) : ''}
        onClose={() => setCategoryModalVisible(false)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />
    </KeyboardAvoidingView>
  );
}
