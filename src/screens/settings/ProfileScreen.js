import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function ProfileScreen({ navigation }) {
  // Form state
  const [fullName, setFullName] = useState('Bradley Shazima');
  const [businessName, setBusinessName] = useState('PolicyPal Insurance Agency');
  const [email, setEmail] = useState('brad@policy.com');
  const [phone, setPhone] = useState('+254 712 345 678');
  const [address, setAddress] = useState('Nairobi, Kenya');
  const [licenseNumber, setLicenseNumber] = useState('INS-LIC-2024-001');
  const [bio, setBio] = useState('Professional insurance agent with 5+ years of experience helping clients secure their assets and peace of mind.');
  
  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailVerified = true; // Mock verification status

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    }, 1500);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values (in real app, restore from state backup)
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => console.log('Camera') },
        { text: 'Choose from Gallery', onPress: () => console.log('Gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ==================== PROFILE HEADER ==================== */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Octicons name="person" size={48} color={COLORS.blue} />
          </View>
          {isEditing && (
            <TouchableOpacity
              style={styles.editPhotoButton}
              onPress={handleChangePhoto}
            >
              <Octicons name="pencil" size={14} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.headerName}>{fullName}</Text>
        <Text style={styles.headerRole}>{businessName}</Text>
        
        {!isEditing && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Octicons name="pencil" size={16} color={COLORS.blue} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ==================== PROFILE INFORMATION ==================== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        
        <View style={styles.card}>
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter full name"
            inputStyle={!isEditing && styles.disabledInput}
            editable={isEditing}
          />

          <Input
            label="Business/Agency Name"
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Enter business name"
            inputStyle={!isEditing && styles.disabledInput}
            editable={isEditing}
          />

          {/* Email with verification status */}
          <View style={styles.inputWithBadge}>
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              inputStyle={styles.disabledInput}
              editable={false}
            />
            <View style={[
              styles.verificationBadge,
              emailVerified ? styles.verifiedBadge : styles.unverifiedBadge
            ]}>
              <Octicons
                name={emailVerified ? "check-circle" : "alert"}
                size={12}
                color={COLORS.white}
              />
              <Text style={styles.badgeText}>
                {emailVerified ? 'Verified' : 'Unverified'}
              </Text>
            </View>
          </View>

          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            inputStyle={!isEditing && styles.disabledInput}
            editable={isEditing}
          />

          <Input
            label="Physical Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address"
            inputStyle={!isEditing && styles.disabledInput}
            editable={isEditing}
          />

          <Input
            label="License Number"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            placeholder="Enter license number"
            inputStyle={!isEditing && styles.disabledInput}
            editable={isEditing}
          />

          <View style={styles.bioContainer}>
            <Text style={styles.bioLabel}>Bio / About</Text>
            <View style={[
              styles.bioInputWrapper,
              !isEditing && styles.disabledInput
            ]}>
              <Text style={styles.bioInput}>
                {bio}
              </Text>
            </View>
            {isEditing && (
              <Text style={styles.bioHelper}>
                Tell clients about your experience and expertise
              </Text>
            )}
          </View>
        </View>

        {/* Save/Cancel buttons when editing */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
            />
            <Button
              title="Cancel"
              variant="secondary"
              onPress={handleCancel}
            />
          </View>
        )}
      </View>

      {/* ==================== STATISTICS ==================== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        
        <View style={styles.statsGrid}>
          {/* Member Since */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Octicons name="calendar" size={20} color={COLORS.blue} />
            </View>
            <Text style={styles.statLabel}>Member Since</Text>
            <Text style={styles.statValue}>Jan 2024</Text>
          </View>

          {/* Total Clients */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Octicons name="people" size={20} color={COLORS.blue} />
            </View>
            <Text style={styles.statLabel}>Total Clients</Text>
            <Text style={styles.statValue}>287</Text>
          </View>

          {/* Reminders Sent */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Octicons name="paper-airplane" size={20} color={COLORS.blue} />
            </View>
            <Text style={styles.statLabel}>Reminders Sent</Text>
            <Text style={styles.statValue}>1,245</Text>
          </View>

          {/* Success Rate */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Octicons name="graph" size={20} color={COLORS.blue} />
            </View>
            <Text style={styles.statLabel}>Success Rate</Text>
            <Text style={styles.statValue}>94.5%</Text>
          </View>
        </View>
      </View>

      {/* ==================== ACHIEVEMENTS ==================== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        
        <View style={styles.card}>
          <AchievementItem
            icon="trophy"
            title="Top Performer"
            description="Highest renewal rate this quarter"
          />
          <AchievementItem
            icon="star"
            title="Client Favorite"
            description="100+ five-star reviews"
          />
          <AchievementItem
            icon="zap"
            title="Early Adopter"
            description="Member since beta launch"
          />
        </View>
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ==================== COMPONENTS ==================== */

const AchievementItem = ({ icon, title, description }) => (
  <View style={styles.achievementItem}>
    <View style={styles.achievementIcon}>
      <Octicons name={icon} size={20} color={COLORS.blue} />
    </View>
    <View style={styles.achievementContent}>
      <Text style={styles.achievementTitle}>{title}</Text>
      <Text style={styles.achievementDescription}>{description}</Text>
    </View>
  </View>
);

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    paddingBottom: 40,
  },

  /* Header */
  header: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.blue,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  headerName: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.black,
    marginBottom: 4,
  },
  headerRole: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 20,
  },
  editButtonText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.blue,
  },

  /* Section */
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.black,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
  },

  /* Input */
  disabledInput: {
    backgroundColor: COLORS.lightGray,
    color: COLORS.black,
    borderColor: 'transparent',
  },
  inputWithBadge: {
    position: 'relative',
  },
  verificationBadge: {
    position: 'absolute',
    top: 32,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedBadge: {
    backgroundColor: COLORS.success,
  },
  unverifiedBadge: {
    backgroundColor: COLORS.warning,
  },
  badgeText: {
    fontFamily: 'Medium',
    fontSize: 10,
    color: COLORS.white,
  },

  /* Bio */
  bioContainer: {
    marginBottom: 0,
  },
  bioLabel: {
    marginBottom: 6,
    fontSize: SIZES.small,
    fontFamily: 'Medium',
    color: COLORS.black,
  },
  bioInputWrapper: {
    minHeight: 100,
    borderWidth: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 14,
    borderColor: COLORS.gray,
  },
  bioInput: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
    lineHeight: 20,
  },
  bioHelper: {
    marginTop: 4,
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    fontFamily: 'Regular',
  },

  /* Action Buttons */
  actionButtons: {
    marginTop: 16,
  },

  /* Statistics */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.blue,
  },

  /* Achievements */
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 2,
  },
  achievementDescription: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
});