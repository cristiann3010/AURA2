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
  Image,
  Modal
} from "react-native";

export default function Jogo9({ navigation }) {
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [owlMood, setOwlMood] = useState('normal');
  const [showWinModal, setShowWinModal] = useState(false);

  const startNewGame = () => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(randomNum);
    setGuess('');
    setAttempts(0);
    setMessage('Adivinhe o número entre 1 e 100!');
    setGameStarted(true);
    setGameOver(false);
    setOwlMood('normal');
    setShowWinModal(false);
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
      setShowWinModal(true); // Mostra o modal quando ganha
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

  const closeWinModal = () => {
    setShowWinModal(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2d004d" barStyle="light-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Adivinhação</Text>
          
         
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
                style={styles.startButton}
                onPress={startNewGame}
                activeOpacity={0.7}
              >
                <Text style={styles.startButtonText}>COMEÇAR</Text>
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
                    activeOpacity={0.7}
                  >
                    <Text style={styles.guessButtonText}>TENTAR</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Container da coruja com tamanho otimizado */}
              <View style={styles.owlContainer}>
                <Image
                  source={getOwlImage()}
                  style={styles.owlImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        </View>
      </ImageBackground>

      {/* Modal de Vitória */}
      <Modal
        visible={showWinModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeWinModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalEmoji}>🎉</Text>
              <Text style={styles.modalTitle}>Parabéns!</Text>
              <Text style={styles.modalMessage}>
                Você acertou o número{'\n'}
                em {attempts} tentativas!
              </Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.continueButton]}
                  onPress={closeWinModal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonText}>CONTINUAR</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.newGameButton]}
                  onPress={startNewGame}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonText}>NOVO JOGO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 12,
    backgroundColor: '#2d004d',
    borderBottomWidth: 2,
    borderBottomColor: '#8b5cf6',
    marginTop: 30,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  title: {
    color: '#e9d5ff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 110,
    textAlign: 'center',
  },
  resetButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    width: 44,
    height: 44,
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
    margin: 12,
    marginTop: 8,
    borderRadius: 12,
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
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 16,
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
    padding: 24,
    backgroundColor: 'rgba(45, 0, 77, 0.95)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    marginHorizontal: 20,
    maxWidth: '90%',
  },
  emojiLarge: {
    fontSize: 64,
    marginBottom: 12,
  },
  startTitle: {
    color: '#e9d5ff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  startDescription: {
    color: '#c4b5fd',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  // Botão COMEÇAR com fundo branco
  startButton: {
    backgroundColor: 'rgba(72, 15, 119, 0.9)',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8b5cf6',
    minHeight: 50,
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  gameContent: {
    flex: 1,
    width: '100%',
    padding: 16,
    justifyContent: 'space-between',
  },
  statusContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    minHeight: 60,
    justifyContent: 'center',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputArea: {
    backgroundColor: 'rgba(45, 0, 77, 0.9)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    marginBottom: 16,
  },
  inputLabel: {
    color: '#e9d5ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    minHeight: 50,
  },
  guessButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#a78bfa',
    minHeight: 50,
    minWidth: 80,
  },
  guessButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  // Container da coruja com tamanho otimizado
  owlContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 120,
    maxHeight: 200,
  },
  owlImage: {
    width: 180,
    height: 180,
    maxWidth: '100%',
  },
  
  // Estilos do Modal de Vitória
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: 'rgba(45, 0, 77, 0.95)',
    padding: 30,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8b5cf6',
    alignItems: 'center',
  },
  modalEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  modalTitle: {
    color: '#e9d5ff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    color: '#c4b5fd',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    minHeight: 50,
  },
  continueButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderColor: '#8b5cf6',
  },
  newGameButton: {
    backgroundColor: '#8b5cf6',
    borderColor: '#a78bfa',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});