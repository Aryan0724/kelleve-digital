import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Alert
} from 'react-native';
import { useAuth } from '../../context/auth';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import { User, Phone, Mail, LogOut, ChevronRight, HelpCircle, Shield, Award } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of TrueDial?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const getInitials = (name: string) => {
    if (!name) return 'TD';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Header Box */}
      <GlassCard variant="navy" style={styles.headerCard}>
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(user?.name || '')}</Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{user?.name || 'Valued User'}</Text>
            <View style={styles.badgeContainer}>
              <Award size={10} color="#E8701A" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>TrueDial Partner</Text>
            </View>
          </View>
        </View>
      </GlassCard>

      {/* Account Details */}
      <Text style={styles.sectionTitle}>Account Information</Text>
      <GlassCard style={styles.detailsCard}>
        <View style={styles.detailItem}>
          <User size={18} color="rgba(255,255,255,0.4)" style={styles.detailIcon} />
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>FULL NAME</Text>
            <Text style={styles.detailValue}>{user?.name || 'Not Available'}</Text>
          </View>
        </View>

        <View style={[styles.detailItem, styles.borderTop]}>
          <Mail size={18} color="rgba(255,255,255,0.4)" style={styles.detailIcon} />
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>EMAIL ADDRESS</Text>
            <Text style={styles.detailValue}>{user?.email || 'Not Available'}</Text>
          </View>
        </View>

        <View style={[styles.detailItem, styles.borderTop]}>
          <Phone size={18} color="rgba(255,255,255,0.4)" style={styles.detailIcon} />
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>PHONE NUMBER</Text>
            <Text style={styles.detailValue}>{user?.phone || 'Not Available'}</Text>
          </View>
        </View>

        <View style={[styles.detailItem, styles.borderTop]}>
          <Award size={18} color="#E8701A" style={styles.detailIcon} />
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>PRIMARY LOCATION</Text>
            <Text style={styles.detailValue}>{user?.city || 'Patna, Bihar'}</Text>
          </View>
        </View>
      </GlassCard>

      {/* Support & Legal Options */}
      <Text style={styles.sectionTitle}>Help & Support</Text>
      <GlassCard style={styles.menuCard}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <HelpCircle size={18} color="#E8701A" style={styles.menuIcon} />
            <Text style={styles.menuText}>FAQs & Knowledgebase</Text>
          </View>
          <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.borderTop]}>
          <View style={styles.menuLeft}>
            <Shield size={18} color="#E8701A" style={styles.menuIcon} />
            <Text style={styles.menuText}>Privacy Policy & Security</Text>
          </View>
          <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
      </GlassCard>

      {/* Logout Action */}
      <CustomButton
        title="Sign Out"
        onPress={handleLogout}
        variant="danger"
        icon={<LogOut size={18} color="#ffffff" />}
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  headerCard: {
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF7ED',
    borderColor: '#F05A24',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#F05A24',
    fontSize: 22,
    fontWeight: '800',
  },
  profileDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  badgeText: {
    color: '#F05A24',
    fontSize: 10,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
    marginBottom: 10,
    marginTop: 8,
  },
  detailsCard: {
    padding: 0,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  detailIcon: {
    marginRight: 14,
  },
  detailTextCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  menuCard: {
    padding: 0,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 14,
  },
  menuText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  logoutBtn: {
    marginTop: 8,
  },
});
