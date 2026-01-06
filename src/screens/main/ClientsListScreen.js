import { View, Text, ScrollView, StyleSheet, TextInput, SectionList, Pressable, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../../constants/theme';
import { Octicons } from '@expo/vector-icons';
import SearchBar from '../../components/common/SearchBar';
import { useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';


export default function ClientsListScreen() {
  const [search, setSearch] = useState('');

  const clients = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Michael Jordan' },
  ];

  const filteredClients = useMemo(() => {
    if (!search) return clients;
    return clients.filter(client =>
      client.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const navigation = useNavigation();


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
        <Pressable style={styles.clientCard} onPress={() => navigation.navigate('ClientDetail')}>
          <View style={{width:'50%'}}>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.base, color:COLORS.blue}}>Bradley Shazima</Text>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Third Party</Text>
          </View>
          <View>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Mortocycle</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>KMTC 114A</Text>
          </View>
          <View style={{width:'20%'}}>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Status</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>Expiring soon</Text>
          </View>
        </Pressable>     
        <Pressable style={styles.clientCard}>
          <View style={{width:'50%'}}>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.base, color:COLORS.blue}}>Henry Shikoli</Text>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Comprehensive</Text>
          </View>
          <View>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Lorry</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>KCD 222D</Text>
          </View>
          <View style={{width:'20%'}}>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Status</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>Expired</Text>
          </View>
        </Pressable>     
        <Pressable style={styles.clientCard}>
          <View style={{width:'50%'}}>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.base, color:COLORS.blue}}>Wycleff Jean</Text>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Comprehensive</Text>
          </View>
          <View>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Sedan</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>KDE 218E</Text>
          </View>
          <View style={{width:'20%'}}>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Status</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>Active</Text>
          </View>
        </Pressable>     
        <Pressable style={styles.clientCard}>
          <View style={{width:'50%'}}>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.base, color:COLORS.blue}}>Faith Busolo</Text>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Comprehensive</Text>
          </View>
          <View>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>SUV</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>KCY 184Y</Text>
          </View>
          <View style={{width:'20%'}}>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Status</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>Suspended</Text>
          </View>
        </Pressable>     
        <Pressable style={styles.clientCard}>
          <View style={{width:'50%'}}>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.base, color:COLORS.blue}}>Bradley Shazima</Text>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Third Party</Text>
          </View>
          <View>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Mortocycle</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>KMTC 114A</Text>
          </View>
          <View style={{width:'20%'}}>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Status</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>Expiring soon</Text>
          </View>
        </Pressable>     
        <Pressable style={styles.clientCard}>
          <View style={{width:'50%'}}>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.base, color:COLORS.blue}}>Henry Shikoli</Text>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Comprehensive</Text>
          </View>
          <View>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Lorry</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>KCD 222D</Text>
          </View>
          <View style={{width:'20%'}}>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Status</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>Expired</Text>
          </View>
        </Pressable>     
        <Pressable style={styles.clientCard}>
          <View style={{width:'50%'}}>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.base, color:COLORS.blue}}>Wycleff Jean</Text>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Comprehensive</Text>
          </View>
          <View>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Sedan</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>KDE 218E</Text>
          </View>
          <View style={{width:'20%'}}>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Status</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>Active</Text>
          </View>
        </Pressable>     
        <Pressable style={styles.clientCard}>
          <View style={{width:'50%'}}>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.base, color:COLORS.blue}}>Faith Busolo</Text>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Comprehensive</Text>
          </View>
          <View>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>SUV</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>KCY 184Y</Text>
          </View>
          <View style={{width:'20%'}}>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Status</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>Suspended</Text>
          </View>
        </Pressable>     
        <Pressable style={styles.clientCard}>
          <View style={{width:'50%'}}>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.base, color:COLORS.blue}}>Bradley Shazima</Text>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Third Party</Text>
          </View>
          <View>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Mortocycle</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>KMTC 114A</Text>
          </View>
          <View style={{width:'20%'}}>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Status</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>Expiring soon</Text>
          </View>
        </Pressable>     
        <Pressable style={styles.clientCard}>
          <View style={{width:'50%'}}>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.base, color:COLORS.blue}}>Henry Shikoli</Text>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Comprehensive</Text>
          </View>
          <View>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Lorry</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>KCD 222D</Text>
          </View>
          <View style={{width:'20%'}}>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Status</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>Expired</Text>
          </View>
        </Pressable>     
        <Pressable style={styles.clientCard}>
          <View style={{width:'50%'}}>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.base, color:COLORS.blue}}>Wycleff Jean</Text>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Comprehensive</Text>
          </View>
          <View>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Sedan</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>KDE 218E</Text>
          </View>
          <View style={{width:'20%'}}>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Status</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>Active</Text>
          </View>
        </Pressable>     
        <Pressable style={styles.clientCard}>
          <View style={{width:'50%'}}>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.base, color:COLORS.blue}}>Faith Busolo</Text>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Comprehensive</Text>
          </View>
          <View>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>SUV</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>KCY 184Y</Text>
          </View>
          <View style={{width:'20%'}}>
            <Text style={{fontFamily:'Regular', fontSize:SIZES.xsmall, color:COLORS.gray}}>Status</Text>
            <Text style={{fontFamily:'Medium', fontSize:SIZES.xsmall}}>Suspended</Text>
          </View>
        </Pressable>  
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
    width: 64,
    height: 64,
    backgroundColor:COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    position: 'absolute',
    bottom: 80,
    right: 16
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
  }
});