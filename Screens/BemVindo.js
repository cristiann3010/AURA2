import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";


const { width, height } = Dimensions.get('window');

export default function BemVindo({ navigation }) {
  const [fontsLoaded] = useFonts({
    Kodchasan: require("../assets/fonts/Kodchasan-Regular.ttf"),
   
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Apenas fade in da tela
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePress = () => {
    // Navegação simples sem animações
    navigation.navigate("Scan");
  };

   if (!fontsLoaded) {
    // Retorna algo fixo, sem parar o fluxo dos hooks
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }


  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/background.png')} 
        style={styles.backgroundImage} 
        resizeMode="cover" 
      />
      <View style={styles.overlay} />

      <Animated.View 
        style={[
          styles.content, 
          { opacity: fadeAnim }
        ]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>AURA</Text>
          <Text style={styles.subtitleText}>Escaneie a carta{"\n"} e descubra um{"\n"} mundo magico </Text>
        </View>

        {/* BOTÃO SIMPLES SEM ANIMAÇÕES */}
        <TouchableOpacity
          style={styles.jogarButton}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={styles.jogarText}>Jogar</Text>
        </TouchableOpacity>

        {/* IMAGEM COM BRILHO ROXO E SOMBRA */}
        <View style={styles.imageContainer}>
          {/* Container com brilho roxo */}
          <View style={styles.glowContainer}>
            <Image 
              source={require('../assets/trio.png')} 
              style={styles.normalImage} 
              resizeMode="contain" 
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(57, 13, 105, 0.7)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  // CONTAINER DO TEXTO
  textContainer: {
    position: 'absolute',
    top: height * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 92,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 7,
    textShadowColor: 'rgba(139, 92, 246, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 10,
    fontFamily: "Kodchasan"
  },
  subtitleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#E0E7FF',
    textTransform: 'uppercase',
    letterSpacing: 3,
    textShadowColor: 'rgba(139, 92, 246, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 32,
  },
  // CONTAINER DA IMAGEM
  imageContainer: {
    position: 'absolute',
    bottom: -10,
    width: width,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // CONTAINER COM BRILHO ROXO E SOMBRA
  glowContainer: {
    width: '100%',
    height: '100%',
    shadowColor: '#8B5CF6', // Roxo vibrante
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 40,
    elevation: 20,
  },
  // IMAGEM
  normalImage: {
    width: '100%',
    height: '100%',
    shadowColor: '#A78BFA', // Roxo mais claro
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 25,
  },
  // BOTÃO ROXO
  jogarButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 45,
    paddingVertical: 20,
    width: width * 0.5,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#b096ffff',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  jogarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});