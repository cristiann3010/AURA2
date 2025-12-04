import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // ⬅️ gradiente igual furry1.js

const { width, height } = Dimensions.get('window');

export default function MemoryGame({ navigation }) {

  const handlePressGame1 = () => {
    navigation.navigate('Jogo1');
  };

  const handlePressGame2 = () => {
    navigation.navigate('Jogo4');
  };

  const handlePressGame3 = () => {
    navigation.navigate('Jogo5');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2d004d" barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Escolher Jogo</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <View style={styles.content}>
        <View style={styles.rectanglesContainer}>

          {/* === Retângulo 1 === */}
          <TouchableOpacity
            onPress={handlePressGame1}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#9B5DE0', '#54337A']} // 💜 gradiente roxo e preto
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.rectangle, styles.rectangle1]}
            >
              <Image
                source={require('../assets/eleOi.png')}
                style={styles.rectangleImage2}
                resizeMode="contain"
              />
              <View style={styles.textContainer}>
                <Text style={styles.gameTitle2}>JOGO DA MEMÓRIA</Text>
                <Text style={styles.gameSubtitle}></Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* === Retângulo 2 === */}
          <TouchableOpacity
            onPress={handlePressGame2}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#9B5DE0', '#54337A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.rectangle, styles.rectangle2]}
            >
              <Image
                source={require('../assets/eleOi2.png')}
                style={styles.rectangleImage}
                resizeMode="contain"
              />
              <View style={styles.textContainer}>
                <Text style={styles.gameTitle}>LEMBRANÇA DO ELEFANTE</Text>
                <Text style={styles.gameSubtitle}></Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* === Retângulo 3 === */}
          <TouchableOpacity
            onPress={handlePressGame3}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#9B5DE0', '#54337A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.rectangle, styles.rectangle3]}
            >
              <Image
                source={require('../assets/eleOi3.png')}
                style={styles.rectangleImage}
                resizeMode="contain"
              />
              <View style={styles.textContainer}>
                <Text style={styles.gameTitle}>ELEFANTE COMILÃO</Text>
                <Text style={styles.gameSubtitle}></Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  safeArea: { backgroundColor: '#2d004d' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2d004d',
    borderBottomWidth: 2,
    borderBottomColor: '#8b5cf6',
    marginTop: 20,
  },
  backButton: {
    padding: 2,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: { width: 40 },
  content: { flex: 1 },
  rectanglesContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  rectangle: {
    width: 350,
    height: 180,
    borderRadius: 16,
    borderWidth: 2,
    
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  rectangleImage: {
    width: 250,
    height: 250,
    marginLeft: -90,
  },
  rectangleImage2: {
    width: 220,
    height: 220,
    marginLeft: -80,
    marginBottom: 25,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: -30,
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginLeft: 30,
  },
  gameTitle2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginLeft: 55,
  },
  gameSubtitle: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'left',
    fontStyle: 'italic',
  },
  rectangle1: {},
  rectangle2: {},
  rectangle3: {},
});
