import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Image,
  StatusBar
} from "react-native";

export default function Jogo8({ navigation }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const [owlPosition, setOwlPosition] = useState({ top: 150, left: 100 });
  const [showOwl, setShowOwl] = useState(false);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setGameActive(true);
    setShowOwl(true);
    moveOwl();
  };

  const moveOwl = () => {
    if (!gameActive) return;

    const newPosition = {
      top: 50 + Math.random() * 250,
      left: 30 + Math.random() * 220
    };
    setOwlPosition(newPosition);
  };

  const touchOwl = () => {
    if (!gameActive || !showOwl) return;
    
    setScore(score + 1);
    moveOwl();
  };

  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          setShowOwl(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

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
          
          <Text style={styles.title}>Toque na Coruja</Text>
          
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <View style={styles.infoPanel}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>TEMPO</Text>
          <Text style={styles.infoValue}>{timeLeft}s</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>PONTOS</Text>
          <Text style={styles.infoValue}>{score}</Text>
        </View>
      </View>

      <ImageBackground
        source={require('../assets/batata.jpeg')}
        style={styles.gameArea}
        resizeMode="cover"
      >
        <View style={styles.gameOverlay}>
          {showOwl && gameActive && (
            <TouchableOpacity 
              style={[
                styles.owl,
                {
                  top: owlPosition.top,
                  left: owlPosition.left
                }
              ]}
              onPress={touchOwl}
            >
              <Image 
                source={require('../assets/owlAcerto.png')}
                style={styles.owlImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}

          {!gameActive && timeLeft === 10 && (
            <View style={styles.startScreen}>
              <Image 
                source={require('../assets/owlAcerto.png')}
                style={styles.owlLargeImage}
                resizeMode="contain"
              />
              <Text style={styles.messageTitle}>Toque na Coruja!</Text>
              <Text style={styles.messageText}>
                A coruja vai pular pela tela{'\n'}
                Toque nela para ganhar pontos!
              </Text>
              <TouchableOpacity 
                style={styles.button}
                onPress={startGame}
              >
                <Text style={styles.buttonText}>COMEÇAR</Text>
              </TouchableOpacity>
            </View>
          )}

          {!gameActive && timeLeft === 0 && (
            <View style={styles.startScreen}>
              <Text style={styles.owlLarge}>🎉</Text>
              <Text style={styles.messageTitle}>Fim do Jogo!</Text>
              <Text style={styles.messageScore}>Pontuação: {score}</Text>
              <Text style={styles.messageSubtext}>
                {score >= 15 ? '🏆 Incrível!' : score >= 10 ? '⭐ Muito bem!' : '💪 Tente novamente!'}
              </Text>
              <TouchableOpacity 
                style={styles.button}
                onPress={startGame}
              >
                <Text style={styles.buttonText}>JOGAR NOVAMENTE</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0033",
  },
  safeArea: {
    backgroundColor: '#2d004d',
  },
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
  title: {
    color: '#e9d5ff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  infoPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(45, 0, 77, 0.9)',
    margin: 15,
    marginTop: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    color: '#c4b5fd',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  infoValue: {
    color: '#8b5cf6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8b5cf6',
    overflow: 'hidden',
  },
  gameOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 0, 51, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  owl: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#a78bfa',
  },
  owlImage: {
    width: 50,
    height: 50,
  },
  owlLargeImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  startScreen: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(45, 0, 77, 0.95)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    marginHorizontal: 20,
  },
  owlLarge: {
    fontSize: 70,
    marginBottom: 15,
  },
  messageTitle: {
    color: '#e9d5ff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  messageText: {
    color: '#c4b5fd',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  messageScore: {
    color: '#e9d5ff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageSubtext: {
    color: '#a78bfa',
    fontSize: 18,
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 60,
    paddingVertical: 18,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#a78bfa',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  instructions: {
    backgroundColor: 'rgba(45, 0, 77, 0.9)',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  instructionsText: {
    color: '#e9d5ff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});