import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import { User, Mail, Phone, Lock, Sparkles } from 'lucide-react-native';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [role, setRole] = useState<'customer' | 'business' | 'builder' | 'supplier' | 'worker'>('customer');
  const [agreedTerms, setAgreedTerms] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [focusName, setFocusName] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPhone, setFocusPhone] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [focusConfirmPassword, setFocusConfirmPassword] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPhoneValid = /^[0-9]{10,}$/.test(phone.replace(/\D/g, ''));

  const roleOptions: Array<{ key: 'customer' | 'business' | 'builder' | 'supplier' | 'worker'; label: string }> = [
    { key: 'customer', label: 'Customer / Homeowner' },
    { key: 'business', label: 'Business / Interior Designer' },
    { key: 'builder', label: 'Real Estate Builder' },
    { key: 'supplier', label: 'Material Supplier' },
    { key: 'worker', label: 'Skilled Worker / Contractor' },
  ];

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      setErrorMsg('Please fill in all the details');
      return;
    }
    if (!isEmailValid) {
      setErrorMsg('Please enter a valid email address (e.g. rahul@patna.com)');
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
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Glow Effects */}
        <View style={[styles.glowBall, styles.glowOrange]} />
        <View style={[styles.glowBall, styles.glowBlue]} />

        {/* Logo Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoBadge}>
            <Sparkles size={24} color="#E8701A" />
          </View>
          <Text style={styles.brandName}>TrueDial</Text>
          <Text style={styles.brandSubTitle}>Create your business directory account</Text>
        </View>

        {/* Sign Up Card */}
        <GlassCard style={styles.registerCard}>
          <Text style={styles.cardHeader}>Sign Up</Text>
          <Text style={styles.cardSubHeader}>Create your account to get started with TrueDial</Text>

          {errorMsg && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* Account Role Selector (I am a...) */}
          <Text style={styles.inputLabel}>I am a...</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleScrollRow}>
            {roleOptions.map((opt) => {
              const isSelected = role === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.roleChip, isSelected && styles.roleChipSelected]}
                  onPress={() => setRole(opt.key)}
                >
                  <Text style={[styles.roleChipText, isSelected && styles.roleChipTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Full Name */}
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={[styles.inputWrapper, focusName && styles.inputWrapperFocused]}>
            <User size={20} color={focusName ? '#E8701A' : '#708090'} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Rahul Kumar"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusName(true)}
              onBlur={() => setFocusName(false)}
            />
          </View>

          {/* Email Address */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.inputLabel}>Email Address</Text>
            {isEmailValid && (
              <Text style={{ fontSize: 11, color: '#059669', fontWeight: '700', marginBottom: 6 }}>
                ✓ Verified Format
              </Text>
            )}
          </View>
          <View style={[styles.inputWrapper, focusEmail && styles.inputWrapperFocused, isEmailValid && { borderColor: '#10B981' }]}>
            <Mail size={20} color={isEmailValid ? '#10B981' : (focusEmail ? '#E8701A' : '#708090')} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            {isPhoneValid && (
              <Text style={{ fontSize: 11, color: '#059669', fontWeight: '700', marginBottom: 6 }}>
                ✓ Valid Phone
              </Text>
            )}
          </View>
          <View style={[styles.inputWrapper, focusPhone && styles.inputWrapperFocused, isPhoneValid && { borderColor: '#10B981' }]}>
            <Phone size={20} color={isPhoneValid ? '#10B981' : (focusPhone ? '#E8701A' : '#708090')} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
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
          <Text style={styles.inputLabel}>Password</Text>
          <View style={[styles.inputWrapper, focusPassword && styles.inputWrapperFocused]}>
            <Lock size={20} color={focusPassword ? '#E8701A' : '#708090'} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
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
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={[styles.inputWrapper, focusConfirmPassword && styles.inputWrapperFocused]}>
            <Lock size={20} color={focusConfirmPassword ? '#E8701A' : '#708090'} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
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
            style={styles.termsRow} 
            activeOpacity={0.8}
            onPress={() => setAgreedTerms(!agreedTerms)}
          >
            <View style={[styles.checkboxBox, agreedTerms && styles.checkboxBoxChecked]}>
              {agreedTerms && <Text style={styles.checkmarkText}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={{ color: '#E8701A', fontWeight: '700' }}>Terms of Service</Text>, <Text style={{ color: '#E8701A', fontWeight: '700' }}>Privacy Policy</Text> & Guidelines.
            </Text>
          </TouchableOpacity>

          <CustomButton 
            title="Sign Up" 
            onPress={handleRegister} 
            loading={loading}
            style={styles.submitBtn}
          />
        </GlassCard>

        {/* Bottom Nav */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}> Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  glowBall: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.1,
  },
  glowOrange: {
    backgroundColor: '#F05A24',
    top: -50,
    right: -50,
  },
  glowBlue: {
    backgroundColor: '#2563EB',
    bottom: -50,
    left: -50,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    marginBottom: 12,
  },
  brandName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  brandSubTitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  registerCard: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  cardSubHeader: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 18,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  roleScrollRow: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  roleChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    marginRight: 8,
  },
  roleChipSelected: {
    backgroundColor: '#FFF7ED',
    borderColor: '#E8701A',
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  roleChipTextSelected: {
    color: '#E8701A',
    fontWeight: '700',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderColor: '#CBD5E1',
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxBoxChecked: {
    backgroundColor: '#E8701A',
    borderColor: '#E8701A',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputWrapperFocused: {
    borderColor: '#F05A24',
    backgroundColor: '#FFF7ED',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
  },
  submitBtn: {
    marginTop: 8,
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
  },
  loginLink: {
    color: '#F05A24',
    fontWeight: '700',
    fontSize: 14,
  },
});
