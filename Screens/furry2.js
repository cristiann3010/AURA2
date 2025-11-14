// furry1.js - VERSÃO COM HEADER FIXA NO TOPO
import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function Furry1({ route, navigation }) {
  const { cartaId, scannedFromQR } = route.params || {};
  const [showSobre, setShowSobre] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const buttonScaleAnim1 = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    async function loadFont() {
      try {
        await Font.loadAsync({
         
        });
        setFontLoaded(true);
      } catch (error) {
        console.log('Erro ao carregar fonte:', error);
        setFontLoaded(true);
      }
    }
    loadFont();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Função de animação de press
  const handlePress = (buttonScaleAnim, callback) => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  if (!fontLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#fff' }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ImageBackground 
      source={require('../assets/bgdosfurry.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar backgroundColor="#2d004d" barStyle="light-content" />
      
      {/* ESTRUTURA FIXA NO TOPO - MESMA DA TELA SCAN */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carta Macaquini</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      {/* CONTEÚDO PRINCIPAL */}
      <View style={styles.content}>
        {/* === FORMAS GEOMÉTRICAS NO FUNDO === */}
        <Image
          source={require('../assets/owlgeo.png')}
          style={styles.shapesBackground}
          resizeMode="contain"
        />

        <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
          
          {/* === CORUJA MUITO GRANDE COM RETÂNGULO VISÍVEL ATRÁS === */}
          <View style={styles.elephantMainContainer}>
            {/* Retângulo azul ATRÁS da coruja */}
            <View style={styles.rectangleContainer}>
              <Image
                source={require('../assets/bgdoele.png')}
                style={styles.blueRectangle}
                resizeMode="contain"
              />
            </View>
            {/* Coruja MUITO GRANDE em cima do retângulo */}
            <Image
              source={require('../assets/monkre.png')}
              style={styles.elephantImage}
              resizeMode="contain"
            />
          </View>

          {/* === BOTÕES COM GRADIENTE === */}
          <View style={styles.buttonsContainer}>
            
            {/* BOTÃO 1 - APRENDER */}
            <Animated.View 
              style={[
                styles.buttonWrapper,
                { transform: [{ scale: buttonScaleAnim1 }] }
              ]}
            >
              <TouchableOpacity
                onPress={() => handlePress(buttonScaleAnim1, () => navigation.navigate('game2'))}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#5DB2E0', '#1D6E9A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>APRENDER</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* BOTÃO 3 - INFORMAÇÕES */}
            <Animated.View 
              style={[
                styles.buttonWrapper,
                { transform: [{ scale: buttonScaleAnim3 }] }
              ]}
            >
              <TouchableOpacity
                onPress={() => handlePress(buttonScaleAnim3, () => setShowSobre(true))}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#5DB2E0', '#1D6E9A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>INFORMAÇÕES</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {scannedFromQR && (
            <View style={styles.scanInfo}>
              <Text style={styles.scanText}>Carta Escaneada!</Text>
            </View>
          )}
        </Animated.View>

        {/* === MODAL INFORMAÇÕES === */}
        <Modal
          visible={showSobre}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowSobre(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>SOBRE A CORUJA</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowSobre(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
              >
                <View style={styles.modalBody}>
                  
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>🦉 Características da Coruja</Text>
                    <Text style={styles.sectionText}>
                      • Aves noturnas e silenciosas{"\n"}
                      • Excelente visão noturna{"\n"}
                      • Voo silencioso graças às penas especiais{"\n"}
                      • Predadores naturais de roedores
                    </Text>
                  </View>

                  <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>🌲 Habitat Natural</Text>
                    <Text style={styles.sectionText}>
                      • Florestas e bosques{"\n"}
                      • Áreas arborizadas{"\n"}
                      • Montanhas e vales{"\n"}
                      • Zonas rurais e urbanas
                    </Text>
                  </View>

                  <View style={styles.finalSection}>
                    <Text style={styles.finalText}>
                      Descubra mais sobre esta incrível ave!
                    </Text>
                  </View>

                </View>
              </ScrollView>

            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a0033',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  safeArea: {
    backgroundColor: '#2d004d',
  },
  // 🔥 HEADER FIXA NO TOPO - MESMA ESTRUTURA DA TELA SCAN
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2d004d',
    borderBottomWidth: 2,
    borderBottomColor: '#8b5cf6',
     marginTop: 30,
    
    // ✅ REMOVIDA A MARGEM QUE CAUSAVA PROBLEMAS
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 21,
    includeFontPadding: false,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20, // ✅ REDUZIDO PARA COMPENSAR A HEADER FIXA
    paddingBottom: 30,
  },
  shapesBackground: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    left: -40,
    top: 0,
    opacity: 100,
    zIndex: 0,
  },
  elephantMainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  rectangleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  blueRectangle: {
    width: 450,
    height: 450,
    opacity: 1,
  },
  elephantImage: {
    width: 550,
    height: 550,
    zIndex: 1,
  },
  buttonsContainer: {
    width: '60%',
    alignItems: 'center',
    gap: 15,
    marginBottom: 50,
    shadowColor: '#1D6E9A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonWrapper: {
    width: '100%',
  },
  gradientButton: {
    borderRadius: 20,
    paddingVertical: 18,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1.0,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    
  },
  scanInfo: {
    backgroundColor: 'rgba(179, 102, 255, 0.3)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#a78bfa',
  },
  scanText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  modalContent: {
    backgroundColor: '#1a0033',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8b5cf6',
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#a78bfa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#2d004d',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomWidth: 2,
    borderBottomColor: '#8b5cf6',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#8b5cf6',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 25,
  },
  modalBody: {
    gap: 16,
  },
  infoSection: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#a78bfa',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionText: {
    color: '#e6ccff',
    fontSize: 14,
    lineHeight: 20,
  },
  finalSection: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  finalText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});