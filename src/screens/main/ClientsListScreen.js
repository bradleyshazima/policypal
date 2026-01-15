import { View, Text, ScrollView, StyleSheet, TextInput, SectionList, Pressable, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../../constants/theme';
import { Octicons } from '@expo/vector-icons';
import SearchBar from '../../components/common/SearchBar';
import { useState, useMemo } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useEffect } from 'react';
import { useCallback } from 'react';
import api from '../../services/api';
import { ActivityIndicator } from 'react-native';


export default function ClientsListScreen() {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await api.clients.getAll();
      setClients(data.clients || []);
    } catch (error) {
      console.error('Fetch clients error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchClients();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClients();
    setRefreshing(false);
  };

  const filteredClients = useMemo(() => {
    if (!search) return clients;
    return clients.filter(client =>
      client.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      client.phone?.toLowerCase().includes(search.toLowerCase()) ||
      client.plate_number?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, clients]);

  const getStatusColor = (expiryDate) => {
    if (!expiryDate) return COLORS.gray;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return COLORS.danger;
    if (daysUntilExpiry <= 7) return COLORS.warning;
    return COLORS.success;
  };

  const getStatusText = (expiryDate) => {
    if (!expiryDate) return 'No expiry date';
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry === 0) return 'Expires Today';
    if (daysUntilExpiry <= 7) return `${daysUntilExpiry}d left`;
    return 'Active';
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Loading clients...</Text>
      </View>
    );
  }



  return (
    <View>
      <View style={{backgroundColor:COLORS.lightGray, width:'100%', paddingHorizontal:16, paddingBottom:16}}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search clients"
        />
      </View>

      <ScrollView contentContainerStyle={styles.main} showsVerticalScrollIndicator={false}>
        {filteredClients.length === 0 ? (
          <View style={styles.emptyState}>
            <Octicons name="people" size={64} color={COLORS.gray} opacity={0.5} />
            <Text style={styles.emptyTitle}>
              {search ? 'No clients found' : 'No clients yet'}
            </Text>
            <Text style={styles.emptyMessage}>
              {search ? 'Try a different search term' : 'Tap the + button to add your first client'}
            </Text>
          </View>
        ) : (
          filteredClients.map((client) => (
            <Pressable 
              key={client.id}
              style={styles.clientCard} 
              onPress={() => navigation.navigate('ClientDetail', { clientId: client.id })}
            >
              <View style={{width:'45%'}}>
                <Text style={{fontFamily:'Medium', fontSize:SIZES.base, color:COLORS.blue}} numberOfLines={1}>
                  {client.full_name}
                </Text>
                <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>
                  {client.insurance_type || 'N/A'}
                </Text>
              </View>
              <View>
                <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>
                  {client.car_make} {client.car_model}
                </Text>
                <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>
                  {client.plate_number || 'No plate'}
                </Text>
              </View>
              <View style={{width:'20%', alignItems:'flex-end'}}>
                <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Status</Text>
                <Text style={{
                  fontFamily:'Medium', 
                  fontSize:SIZES.xsmall,
                  color: getStatusColor(client.expiry_date)
                }}>
                  {getStatusText(client.expiry_date)}
                </Text>
              </View>
            </Pressable>
          ))
        )}      
        </ScrollView>

      <TouchableOpacity 
        style={[styles.hoverBtn, styles.shadow]}
        onPress = {() =>navigation.navigate('AddClient')}
      >
        <Octicons name='plus' size={24} color={COLORS.lightGray} />
      </TouchableOpacity> 
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 8,
    backgroundColor:COLORS.primary,
    minHeight:'100%',
    paddingVertical:8,
    alignItems:'center',
    paddingBottom: 80,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor:COLORS.lightGray,
    borderRadius:12,
    overflow:'hidden',
    paddingHorizontal:8,
    paddingVertical: 12,
    marginVertical:2,
    width:'100%'
  },
  hoverBtn: {
    width: 56,
    height: 56,
    backgroundColor:COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    position: 'absolute',
    bottom: 98,
    right: 20
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.large,
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});