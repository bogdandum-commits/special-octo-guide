import { useEffect, useState } from "react";
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { euro, getListings, originalListing, type Listing } from "../../lib/api";
import { blockPhone } from "../../lib/blocked";

export default function ListingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(id === "1" ? originalListing : null);
  const [active, setActive] = useState(0);
  useEffect(() => { getListings().then(rows => setListing(rows.find(p => p.id === id) ?? null)).catch(() => {}); }, [id]);
  function blockPublisher() {
    if (!listing) return;
    Alert.alert("Blochează publicatorul", "Nu vei mai vedea anunțurile acestui număr de telefon pe acest dispozitiv.", [
      { text: "Renunță", style: "cancel" },
      { text: "Blochează", style: "destructive", onPress: () => { blockPhone(listing.phone); router.back(); } },
    ]);
  }
  if (!listing) return <View style={styles.center}><Text>Proprietatea nu este disponibilă.</Text></View>;
  return <SafeAreaView style={styles.safe} edges={["bottom"]}><ScrollView contentContainerStyle={styles.content}><Image alt={`Fotografie ${listing.name}`} source={{uri:listing.photos[active]}} style={styles.mainImage}/><ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnails}>{listing.photos.map((url,index)=><Pressable key={url} onPress={()=>setActive(index)}><Image alt={`Fotografia ${index+1}`} source={{uri:url}} style={[styles.thumb,active===index&&styles.selected]}/></Pressable>)}</ScrollView><Text style={styles.eyebrow}>{listing.transaction==="vanzare"?"VÂNZARE":"ÎNCHIRIERE"}</Text><Text style={styles.title}>{listing.name}</Text><Text style={styles.area}>⌖ {listing.area}</Text><Text style={styles.price}>{euro(listing.price)}{listing.negotiable?" · negociabil":""}{listing.transaction==="inchiriere"?" / lună":""}</Text><View style={styles.specs}><Text style={styles.spec}>{listing.rooms?`${listing.rooms} camere`:"Teren"}</Text>{listing.size?<Text style={styles.spec}>{listing.size} m²</Text>:null}{listing.floor?<Text style={styles.spec}>Etajul {listing.floor}</Text>:null}</View><Text style={styles.section}>Despre proprietate</Text><Text style={styles.body}>{listing.description}</Text>{listing.features?.length?<><Text style={styles.section}>Dotări</Text>{listing.features.map(feature=><Text key={feature} style={styles.body}>• {feature}</Text>)}</>:null}<Pressable style={styles.call} onPress={()=>Linking.openURL(`tel:${listing.phone}`)}><Text style={styles.callText}>Sună {listing.phone}</Text></Pressable><View style={styles.actions}><Pressable onPress={() => router.push({ pathname: "/report/[id]", params: { id: listing.id } })}><Text style={styles.actionText}>Raportează anunțul</Text></Pressable><Pressable onPress={blockPublisher}><Text style={styles.actionText}>Blochează publicatorul</Text></Pressable></View></ScrollView></SafeAreaView>;
}

const styles=StyleSheet.create({safe:{flex:1},content:{paddingBottom:40,backgroundColor:"#f5f6f7"},center:{flex:1,alignItems:"center",justifyContent:"center"},mainImage:{height:300,width:"100%",backgroundColor:"#dce1e5"},thumbnails:{paddingHorizontal:16,marginVertical:14},thumb:{width:66,height:58,borderRadius:7,marginRight:7,borderWidth:2,borderColor:"transparent"},selected:{borderColor:"#b88c50"},eyebrow:{marginHorizontal:20,marginTop:8,color:"#a17742",fontSize:12,fontWeight:"800",letterSpacing:1},title:{fontFamily:"serif",fontSize:29,lineHeight:35,color:"#142337",marginHorizontal:20,marginTop:8},area:{marginHorizontal:20,color:"#69798a",fontSize:15,marginTop:8},price:{fontSize:24,fontWeight:"800",color:"#142337",marginHorizontal:20,marginTop:18},specs:{flexDirection:"row",flexWrap:"wrap",gap:8,marginHorizontal:20,marginTop:20},spec:{backgroundColor:"white",borderRadius:8,padding:10,color:"#37495a"},section:{fontSize:19,fontWeight:"700",color:"#182b40",marginHorizontal:20,marginTop:26,marginBottom:9},body:{fontSize:16,color:"#536476",marginHorizontal:20,lineHeight:24,marginBottom:6},call:{backgroundColor:"#c39a5d",marginHorizontal:20,padding:15,alignItems:"center",borderRadius:11,marginTop:27},callText:{color:"#142337",fontWeight:"800",fontSize:16},actions:{marginHorizontal:20,marginTop:24,gap:17},actionText:{color:"#74512e",fontSize:15,textDecorationLine:"underline"}});
