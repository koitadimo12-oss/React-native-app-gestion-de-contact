// configuere les onglets
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
export default function configurationonglet(){
  return(
    <Tabs>
      <Tabs.Screen
      name="acceuil"
      options={{
        title:'Acceuil',
        tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
      }}

      />


      <Tabs.Screen
      name="contact"
      options={{
        title:'Contacts',
        tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
      }}
      />

      <Tabs.Screen
      name="favori"
      options={{
        title:'Favoris',
        tabBarIcon: ({color,size})=>(
          <Ionicons name="heart" size={size} color={color}/>
        ),
      }}
      />
      <Tabs.Screen
      name="profil"
      options={{
        title:'Profil',
        tabBarIcon: ({color,size})=>(
        <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
      />


    </Tabs>
  )
}

