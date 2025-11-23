import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ImageBackground,
  StatusBar,
  Image
} from "react-native";

export default function Jogo9({ navigation }) {
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [owlMood, setOwlMood] = useState('normal');

  const startNewGame = () => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(randomNum);
    setGuess('');
    setAttempts(0);
    setMessage('Adivinhe o número entre 1 e 100!');
    setGameStarted(true);
    setGameOver(false);
    setOwlMood('normal');
  };

  const getOwlImage = () => {
    if (owlMood === 'acerto') {
      return require('../assets/owlAcerto.png');
    } else if (owlMood === 'erro') {
      return require('../assets/owlErro.png');
    } else {
      return require('../assets/owlNormal.png');
    }
  };

  const handleGuess = () => {
    if (!guess) return;

    const guessNum = parseInt(guess);
    
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setMessage('Digite um número entre 1 e 100!');
      setOwlMood('erro');
      setTimeout(() => setOwlMood('normal'), 1500);
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessNum === targetNumber) {
      setMessage(`🎉 Acertou em ${newAttempts} tentativas!`);
      setGameOver(true);
      setOwlMood('acerto');
    } else if (guessNum < targetNumber) {
      setMessage('📈 Tente um número MAIOR!');
      setOwlMood('erro');
      setTimeout(() => setOwlMood('normal'), 1500);
    } else {
      setMessage('📉 Tente um número MENOR!');
      setOwlMood('erro');
      setTimeout(() => setOwlMood('normal'), 1500);
    }

    setGuess('');
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
          
          <Text style={styles.title}>🔮 Adivinhação</Text>
          
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={startNewGame}
          >
            <Text style={styles.resetButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {gameStarted && (
        <View style={styles.infoPanel}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>TENTATIVAS</Text>
            <Text style={styles.infoValue}>{attempts}</Text>
          </View>
        </View>
      )}

      <ImageBackground
        source={require('../assets/batata.jpeg')}
        style={styles.gameArea}
        resizeMode="cover"
      >
        <View style={styles.gameOverlay}>
          {!gameStarted ? (
            <View style={styles.startScreen}>
              <Text style={styles.emojiLarge}>🔮</Text>
              <Text style={styles.startTitle}>Adivinhação</Text>
              <Text style={styles.startDescription}>
                Vou pensar em um número{'\n'}
                entre 1 e 100!{'\n'}
                Tente adivinhar! 🦉
              </Text>
              <TouchableOpacity 
                style={styles.button}
                onPress={startNewGame}
              >
                <Text style={styles.buttonText}>COMEÇAR</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.gameContent}>
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>{message}</Text>
              </View>

              <View style={styles.inputArea}>
                <Text style={styles.inputLabel}>Seu palpite:</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={guess}
                    onChangeText={setGuess}
                    keyboardType="numeric"
                    placeholder="1 a 100"
                    placeholderTextColor="#999"
                    editable={!gameOver}
                    maxLength={3}
                  />
                  <TouchableOpacity 
                    style={[styles.guessButton, gameOver && styles.buttonDisabled]}
                    onPress={handleGuess}
                    disabled={gameOver}
                  >
                    <Text style={styles.guessButtonText}>TENTAR</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Coruja que reage - posicionada embaixo */}
              <View style={styles.owlContainer}>
                <Image
                  source={getOwlImage()}
                  style={styles.owlImage}
                  resizeMode="contain"
                />
              </View>

              {gameOver && (
                <View style={styles.gameOverContainer}>
                  <Text style={styles.gameOverEmoji}>🎉</Text>
                  <Text style={styles.gameOverText}>
                    Parabéns!{'\n'}
                    Você acertou!
                  </Text>
                  <TouchableOpacity 
                    style={styles.button}
                    onPress={startNewGame}
                  >
                    <Text style={styles.buttonText}>NOVO JOGO</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  resetButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 20,
  },
  infoPanel: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  emojiLarge: {
    fontSize: 70,
    marginBottom: 15,
  },
  startTitle: {
    color: '#e9d5ff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  startDescription: {
    color: '#c4b5fd',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  gameContent: {
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'space-between', // Alterado para distribuir espaço
  },
  statusContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputArea: {
    backgroundColor: 'rgba(45, 0, 77, 0.9)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    marginBottom: 20,
  },
  inputLabel: {
    color: '#e9d5ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  guessButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#a78bfa',
  },
  guessButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  // Container da coruja
  owlContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Ocupa o espaço restante
    minHeight: 150, // Altura mínima
  },
  owlImage: {
    width: 500,
    height: 500,
  },
  gameOverContainer: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(45, 0, 77, 0.95)',
    padding: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    transform: [{ translateY: -100 }],
    zIndex: 10,
  },
  gameOverEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  gameOverText: {
    color: '#e9d5ff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 28,
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
});