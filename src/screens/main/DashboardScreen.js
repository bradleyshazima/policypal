import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import React, { use } from 'react'
import { COLORS, SIZES } from '../../constants/theme';
import { Octicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SignupScreen from '../auth/SignupScreen';

export default function DashboardScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.main} showsVerticalScrollIndicator={false}>
      <View style={[styles.card]}>
        <View style={{display:'flex', flexDirection:'row', gap: 8}}>
          <View style={styles.avatar}></View>
          <View style={{justifyContent: 'center'}}>
            <Text style={{fontFamily:'Medium', color:COLORS.gray}}>Welcome Back!</Text>
            <Text style={{fontFamily:"Bold", fontSize:SIZES.large, color:COLORS.blue}}>Bradley</Text>
          </View>
        </View>
        <TouchableOpacity style={{padding:20}} onPress={() => navigation.navigate('Notifications')}>
          <Octicons name='bell' size={20} color={COLORS.blue} />
        </TouchableOpacity>
      </View>
      
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end', marginTop:20}}>
        <Text style={{fontFamily:'Medium', fontSize:SIZES.medium}}>Stats</Text>
        <Text style={{fontFamily:'Regular', fontSize:SIZES.small, color:COLORS.gray}}>Past 30 days</Text>
      </View>

      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', marginTop:12}}>
        <View style={[{backgroundColor:COLORS.lightGray, borderRadius:12, paddingVertical:8, paddingHorizontal:16, width:'48%', gap:12}]}>
          <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
            <View style={{height:24, width:24, backgroundColor:COLORS.accent, borderRadius:'100%', alignItems:'center',justifyContent:'center'}}>
              <Octicons name='people' size={12} color={COLORS.blue} />
            </View>
            <Text style={{fontFamily:'Medium', color:COLORS.gray, fontSize:SIZES.small}}>Total Clients</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{fontSize:SIZES.xlarge, fontFamily:'SemiBold', color:COLORS.blue}}>28</Text>
            <View style={{ flexDirection:'row', alignItems:'flex-end'}}>
              <Octicons name='triangle-up' size={20} color={COLORS.success} style={{marginBottom:-4}} />
              <Text style={{fontFamily:'Regular', fontSize:SIZES.small, color:COLORS.success}}>+50%</Text>
            </View>
          </View>
        </View>
        <View style={[{backgroundColor:COLORS.lightGray, borderRadius:12, paddingVertical:8, paddingHorizontal:16, width:'48%', gap:12}]}>
          <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
            <View style={{height:24, width:24, backgroundColor:COLORS.accent, borderRadius:'100%', alignItems:'center',justifyContent:'center'}}>
              <Octicons name='checklist' size={12} color={COLORS.blue} />
            </View>
            <Text style={{fontFamily:'Medium', color:COLORS.gray, fontSize:SIZES.small}}>Active Policies</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{fontSize:SIZES.xlarge, fontFamily:'SemiBold', color:COLORS.blue}}>19</Text>
            <View style={{ flexDirection:'row', alignItems:'flex-end'}}>
              <Octicons name='triangle-down' size={20} color={COLORS.danger} style={{marginBottom:-3}} />
              <Text style={{fontFamily:'Regular', fontSize:SIZES.small, color:COLORS.danger}}>-28%</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', marginTop:16}}>
        <View style={[{backgroundColor:COLORS.lightGray, borderRadius:12, paddingVertical:8, paddingHorizontal:16, width:'48%', gap:12}]}>
          <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
            <View style={{height:24, width:24, backgroundColor:COLORS.accent, borderRadius:'100%', alignItems:'center',justifyContent:'center'}}>
              <Octicons name='megaphone' size={12} color={COLORS.blue} />
            </View>
            <Text style={{fontFamily:'Medium', color:COLORS.gray, fontSize:SIZES.small}}>Reminders sent</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{fontSize:SIZES.xlarge, fontFamily:'SemiBold', color:COLORS.blue}}>24</Text>
            <View style={{ flexDirection:'row', alignItems:'flex-end'}}>
              <Octicons name='triangle-up' size={20} color={COLORS.success} style={{marginBottom:-4}} />
              <Text style={{fontFamily:'Regular', fontSize:SIZES.small, color:COLORS.success}}>+50%</Text>
            </View>
          </View>
        </View>
        <View style={[{backgroundColor:COLORS.lightGray, borderRadius:12, paddingVertical:8, paddingHorizontal:16, width:'48%', gap:12}]}>
          <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
            <View style={{height:24, width:24, backgroundColor:COLORS.accent, borderRadius:'100%', alignItems:'center',justifyContent:'center'}}>
              <Octicons name='stopwatch' size={12} color={COLORS.blue} />
            </View>
            <Text style={{fontFamily:'Medium', color:COLORS.gray, fontSize:SIZES.small}}>Due renewals</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{fontSize:SIZES.xlarge, fontFamily:'SemiBold', color:COLORS.blue}}>19</Text>
            <View style={{ flexDirection:'row', alignItems:'flex-end'}}>
              <Octicons name='triangle-up' size={20} color={COLORS.success} style={{marginBottom:-4}} />
              <Text style={{fontFamily:'Regular', fontSize:SIZES.small, color:COLORS.success}}>+50%</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end', marginTop:20}}>
        <Text style={{fontFamily:'Medium', fontSize:SIZES.medium}}>Quick actions</Text>
      </View>

      <View style={{marginTop:12, flexDirection:'row', justifyContent:'space-between'}}>
        <TouchableOpacity style={[{backgroundColor:COLORS.lightGray, borderRadius:12, padding:16, width:'32%',aspectRatio:1, gap:12}]}>
          <View style={{ display:'flex' ,alignItems:'center', gap:8, justifyContent:'center'}}>
            <Text style={{fontFamily:'Medium', color:COLORS.gray, fontSize:SIZES.small}}>Add Client</Text>
            <View>
              <Octicons name='feed-plus' size={24} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[{backgroundColor:COLORS.lightGray, borderRadius:12, padding:16, width:'32%',aspectRatio:1, gap:12}]}>
          <View style={{ alignItems:'center', gap:8}}>
            <Text style={{fontFamily:'Medium', color:COLORS.gray, fontSize:SIZES.small, textAlign:'center'}}>Send Reminder</Text>
            <View>
              <FontAwesome name='send' size={24} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[{backgroundColor:COLORS.lightGray, borderRadius:12, padding:16, width:'32%',aspectRatio:1, gap:12}]}>
          <View style={{ alignItems:'center', gap:8}}>
            <Text style={{fontFamily:'Medium', color:COLORS.gray, fontSize:SIZES.small}}>View Reports</Text>
            <View>
              <Octicons name='log' size={24} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end', marginTop:20}}>
        <Text style={{fontFamily:'Medium', fontSize:SIZES.medium}}>Recent activity</Text>
      </View>

      <View style={{backgroundColor:COLORS.lightGray, marginTop:8, borderRadius:12, overflow:'hidden', paddingVertical:4}}>
        <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:12, paddingVertical:8, borderBottomWidth:1, borderColor:'#e6e6e6' }}>
          <Text style={{fontFamily:'Regular', fontSize:SIZES.small,color:COLORS.gray }} >Reminder sent to John Kinyua <Text style={{fontFamily:'SemiBold'}}>KDC 204D</Text></Text>
          <Text style={{fontFamily:'Regular', fontSize:SIZES.small, color:COLORS.gray }}>12:17</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:12, paddingVertical:8, borderBottomWidth:1, borderColor:'#e6e6e6' }}>
          <Text style={{fontFamily:'Regular', fontSize:SIZES.small, color:COLORS.danger }} >Send reminder failed: <Text style={{fontFamily:'SemiBold'}}>Brandon Ogola</Text></Text>
          <Text style={{fontFamily:'Regular', fontSize:SIZES.small, color:COLORS.gray }}>12:15</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:12, paddingVertical:8, borderBottomWidth:1, borderColor:'#e6e6e6' }}>
          <Text style={{fontFamily:'Regular', fontSize:SIZES.small,color:COLORS.gray }} >Added new client successfully: <Text style={{fontFamily:'SemiBold'}}>Danford Kweli</Text></Text>
          <Text style={{fontFamily:'Regular', fontSize:SIZES.small, color:COLORS.gray }}>12:00</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:12, paddingVertical:8, borderBottomWidth:1, borderColor:'#e6e6e6' }}>
          <Text style={{fontFamily:'Regular', fontSize:SIZES.small,color:COLORS.gray }} >Policy renewed: <Text style={{fontFamily:'SemiBold'}}>Henry Shikoli</Text></Text>
          <Text style={{fontFamily:'Regular', fontSize:SIZES.small, color:COLORS.gray }}>11:45</Text>
        </View>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  main: {
    padding: 16,
    backgroundColor:COLORS.primary,
  },
  card: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.accent,
    borderRadius: '100%'
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