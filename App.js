import furry1 from "./Screens/furry1";
import furry2 from "./Screens/furry2";
import furry3 from "./Screens/furry3";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoadingScreen from "./Screens/LoadingScreen";
import BemVindo from "./Screens/BemVindo";
import Scan from "./Screens/scan";
import generateQR from "./Screens/generateQR";
import React from 'react';
import jogo1 from "./Screens/jogo1";
import jogo2 from "./Screens/jogo2";
import jogo3 from "./Screens/jogo3";
import game1 from "./Screens/game1";
import game2 from "./Screens/game2";
import game3 from "./Screens/game3";

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="LoadingScreen"
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: '#000000ff' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="LoadingScreen" 
          component={LoadingScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="BemVindo" 
          component={BemVindo} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Scan" 
          component={Scan} 
          options={{ title: 'Escanear QR Code' }}
        />
        <Stack.Screen 
          name="furry1" 
          component={furry1} 
          options={{ title: 'Carta Furry 1' }}
        />
        <Stack.Screen 
          name="furry2" 
          component={furry2} 
          options={{ title: 'Carta Furry 2' }}
        />
        <Stack.Screen 
          name="furry3" 
          component={furry3} 
          options={{ title: 'Carta Furry 3' }}
        />
        <Stack.Screen 
          name="game1" 
          component={game1} 
          options={{ title: 'game1' }}
        />
        <Stack.Screen 
          name="game2" 
          component={game2} 
          options={{ title: 'game2' }}
        />
        <Stack.Screen 
          name="game3" 
          component={game3} 
          options={{ title: 'game3' }}
        />
        <Stack.Screen 
          name="generateQR" 
          component={generateQR} 
          options={{ title: 'Gerar QR Code' }}
        />
        <Stack.Screen 
          name="Jogo1" 
          component={jogo1}
          options={{ title: 'jogo da memoria' }}
        />
        <Stack.Screen 
          name="Jogo2" 
          component={jogo2}
          options={{ title: 'Espermatozoides' }}
        />
        {/* 🔧 MUDEI DE "jogo3" PARA "Jogo3" */}
        <Stack.Screen 
          name="Jogo3" 
          component={jogo3}
          options={{ title: 'Reflexo Rápido' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}