import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ImageBackground,
} from 'react-native';
import { loginUser } from '../../services/api';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [ctuId, setCtuId] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formatDateInput = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Format as MM/DD/YYYY
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length <= 8) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDateInput(text);
    setBirthdate(formatted);
    clearError();
  };

  const handleLogin = async () => {
    if (!ctuId.trim() || !birthdate.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Convert MM/DD/YYYY to YYYY-MM-DD for API
      const parts = birthdate.split('/');
      if (parts.length === 3) {
        const apiDate = `${parts[2]}-${parts[0]}-${parts[1]}`;
        const data = await loginUser(ctuId.trim(), apiDate);
        if (data.user && data.user.account_type && data.user.account_type.user) {
          router.replace('/homepage/home');
        } else {
          setError('Only alumni accounts can access the mobile app');
        }
      } else {
        setError('Please enter a valid date');
      }
    } catch (e: any) {
      if (e.response?.status === 401) {
        setError('Invalid CTU ID or birthdate');
      } else if (e.response?.status === 400) {
        setError('Please check your input format');
      } else {
        setError('Network error. Please check your connection and try again');
      }
      console.error('Login error:', e);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    if (error) setError('');
  };

  const DatePickerModal = () => (
    <Modal
      visible={showDatePicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDatePicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Birthdate</Text>
          <Text style={styles.modalSubtitle}>Enter your birthdate in MM/DD/YYYY format</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="MM/DD/YYYY"
            value={birthdate}
            onChangeText={handleDateChange}
            keyboardType="numeric"
            maxLength={10}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/ctu.jpg')}
      style={styles.background}
      blurRadius={3}
    >
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.innerContent}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Technologist</Text>
          <Text style={styles.tagline}>Connect & Collaborate</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>CTU ID</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Enter your CTU ID"
              placeholderTextColor="#ddd"
              value={ctuId}
              onChangeText={(text) => {
                setCtuId(text);
                clearError();
              }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <Text style={styles.label}>Birthdate</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={[styles.input, error && styles.inputError, { flex: 1 }]}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#ddd"
                value={birthdate}
                onChangeText={handleDateChange}
                keyboardType="numeric"
                maxLength={10}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.calendarIcon}
                onPress={() => setShowDatePicker(true)}
                disabled={loading}
              >
                <Text style={styles.calendarIconText}>📅</Text>
              </TouchableOpacity>
            </View>
            <DatePickerModal />
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#1e3a8a" size="small" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 45, 98, 0.5)',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContent: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  tagline: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
    marginTop: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarIconText: {
    fontSize: 20,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorContainer: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  signupText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  signupLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#1e3a8a',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextPrimary: {
    color: 'white',
  },
}); 