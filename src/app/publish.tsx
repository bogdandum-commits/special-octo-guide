import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ORIGIN } from "../lib/api";

const kinds = [["apartament","Apartament"],["casa","Casă"],["teren","Teren"]];

export default function Publish() {
  const [form, setForm] = useState({title:"",city:"",district:"",kind:"apartament",transaction:"vanzare",rooms:"2",area:"",price:"",phone:"",description:""});
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const update=(key:keyof typeof form)=>(value:string)=>setForm(current=>({...current,[key]:value}));
  async function choosePhotos() {
    const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:["images"],allowsMultipleSelection:true,selectionLimit:6,quality:0.8,preferredAssetRepresentationMode:ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible});
    if (!result.canceled) setPhotos(result.assets.slice(0,6));
  }
  async function submit() {
    if(form.title.trim().length<8||form.city.trim().length<2||form.description.trim().length<30||!/^07\d{8}$/.test(form.phone.replace(/[\s()-]/g,""))||!Number(form.area)||!Number(form.price)||!photos.length||!consent){setError("Completează toate câmpurile, adaugă fotografii și confirmă acordul.");return}
    if(photos.some(p=>p.fileSize&&p.fileSize>4_000_000)){setError("Fiecare fotografie trebuie să fie mai mică de 4 MB.");return}
    setBusy(true);setError("");
    const data=new FormData();
    Object.entries(form).forEach(([key,value])=>data.append(key,value));
    data.append("consent","yes");
    for (let index=0;index<photos.length;index++) {
      const asset=photos[index];
      const type=asset.mimeType??"image/jpeg";
      if(!["image/jpeg","image/png","image/webp"].includes(type)){setError("Alege fotografii JPG, PNG sau WebP.");setBusy(false);return}
      data.append("photos",{uri:asset.uri,name:asset.fileName??`fotografie-${index}.jpg`,type} as unknown as Blob);
    }
    try {
      const response=await fetch(`${ORIGIN}/api/listings`,{method:"POST",body:data});
      const result=await response.json() as {error?:string};
      if(!response.ok)throw new Error(result.error??"Anunțul nu a putut fi trimis.");
      Alert.alert("Anunț trimis","Va apărea în aplicație după verificare.",[{text:"Închide",onPress:()=>router.back()}]);
    } catch(e) {setError(e instanceof Error?e.message:"Anunțul nu a putut fi trimis.")}
    finally {setBusy(false)}
  }
  return <SafeAreaView style={styles.safe} edges={["bottom"]}><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==="ios"?"padding":undefined}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Text style={styles.title}>Publică gratuit</Text><Text style={styles.intro}>Completează datele proprietății. Anunțul este verificat înainte de publicare.</Text><Field label="Titlul anunțului" value={form.title} onChangeText={update("title")} placeholder="Apartament cu 2 camere"/><Field label="Oraș" value={form.city} onChangeText={update("city")} placeholder="București"/><Field label="Cartier / zonă" value={form.district} onChangeText={update("district")} placeholder="Opțional"/><Text style={styles.label}>Tip proprietate</Text><View style={styles.choices}>{kinds.map(([value,label])=><Choice key={value} title={label} selected={form.kind===value} onPress={()=>update("kind")(value)}/>)}</View><Text style={styles.label}>Tranzacție</Text><View style={styles.choices}><Choice title="Vânzare" selected={form.transaction==="vanzare"} onPress={()=>update("transaction")("vanzare")}/><Choice title="Închiriere" selected={form.transaction==="inchiriere"} onPress={()=>update("transaction")("inchiriere")}/></View><Field label="Camere (0 pentru teren)" value={form.rooms} onChangeText={update("rooms")} keyboardType="number-pad"/><Field label="Suprafață (m²)" value={form.area} onChangeText={update("area")} keyboardType="number-pad"/><Field label="Preț (€)" value={form.price} onChangeText={update("price")} keyboardType="number-pad"/><Field label="Telefon de contact" value={form.phone} onChangeText={update("phone")} keyboardType="phone-pad" placeholder="07xx xxx xxx"/><Field label="Descriere" value={form.description} onChangeText={update("description")} multiline numberOfLines={5} placeholder="Descrie dotările și zona."/><Text style={styles.label}>Fotografii (1–6)</Text><Pressable style={styles.photosButton} onPress={choosePhotos}><Text style={styles.photosText}>Alege fotografii · {photos.length} selectate</Text></Pressable><ScrollView horizontal style={{marginVertical:12}}>{photos.map((photo,index)=><Image alt={`Fotografia selectată ${index+1}`} key={`${photo.uri}-${index}`} source={{uri:photo.uri}} style={styles.thumb}/>)}</ScrollView><Pressable style={styles.consent} onPress={()=>setConsent(!consent)} accessibilityRole="checkbox" accessibilityState={{checked:consent}}><Text style={styles.box}>{consent?"☑":"□"}</Text><Text style={styles.consentText}>Confirm că am dreptul să public fotografiile și numărul de telefon și accept regulile de publicare.</Text></Pressable><Pressable onPress={()=>Linking.openURL(`${ORIGIN}/reguli.html`)}><Text style={styles.link}>Reguli de publicare</Text></Pressable><Pressable onPress={()=>Linking.openURL(`${ORIGIN}/confidentialitate.html`)}><Text style={styles.link}>Confidențialitate</Text></Pressable>{error?<Text style={styles.error}>{error}</Text>:null}<Pressable style={[styles.submit,busy&&{opacity:0.5}]} disabled={busy} onPress={submit}><Text style={styles.submitText}>{busy?"Se trimite…":"Trimite spre verificare"}</Text></Pressable></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

function Field(props:{label:string;value:string;onChangeText:(value:string)=>void;placeholder?:string;keyboardType?:"number-pad"|"phone-pad";multiline?:boolean;numberOfLines?:number}){return <View style={{marginBottom:15}}><Text style={styles.label}>{props.label}</Text><TextInput {...props} style={[styles.input,props.multiline&&{height:110,textAlignVertical:"top"}]} placeholderTextColor="#8a96a3"/></View>}
function Choice(props:{title:string;selected:boolean;onPress:()=>void}){return <Pressable onPress={props.onPress} style={[styles.choice,props.selected&&styles.choiceActive]}><Text style={[styles.choiceText,props.selected&&{color:"white"}]}>{props.title}</Text></Pressable>}

const styles=StyleSheet.create({safe:{flex:1},content:{padding:18,paddingBottom:45},title:{fontFamily:"serif",fontSize:32,color:"#142337"},intro:{color:"#67788a",fontSize:15,lineHeight:23,marginVertical:14},label:{color:"#4c6074",fontWeight:"700",fontSize:14,marginBottom:7},input:{height:48,backgroundColor:"white",borderColor:"#d8e0e7",borderWidth:1,borderRadius:9,paddingHorizontal:12,fontSize:16,color:"#16283c"},choices:{flexDirection:"row",flexWrap:"wrap",gap:7,marginBottom:16},choice:{paddingVertical:10,paddingHorizontal:13,borderRadius:8,backgroundColor:"#e9edef"},choiceActive:{backgroundColor:"#142337"},choiceText:{color:"#42546a",fontWeight:"700"},photosButton:{backgroundColor:"white",borderWidth:1,borderColor:"#cbd5dd",borderRadius:10,padding:14},photosText:{color:"#203650",fontWeight:"700"},thumb:{width:85,height:80,borderRadius:7,marginRight:8},consent:{flexDirection:"row",gap:9,alignItems:"flex-start",marginTop:10},box:{fontSize:24,color:"#9b7341"},consentText:{flex:1,color:"#45596e",fontSize:14,lineHeight:21},link:{color:"#8c673a",marginVertical:16,textDecorationLine:"underline"},error:{color:"#a13535",marginBottom:13},submit:{backgroundColor:"#c39a5d",padding:16,borderRadius:10,alignItems:"center",marginTop:6},submitText:{color:"#142337",fontWeight:"800",fontSize:16}});
