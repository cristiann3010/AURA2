import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  TextInput
} from "react-native";

export default function Jogo9({ navigation }) {
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startNewGame = () => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(randomNum);
    setGuess('');
    setAttempts(0);
    setMessage('Adivinhe o número entre 1 e 100!');
    setGameStarted(true);
    setGameOver(false);
  };

  const handleGuess = () => {
    if (!guess) return;

    const guessNum = parseInt(guess);
    
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setMessage('Digite um número entre 1 e 100!');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessNum === targetNumber) {
      setMessage(`🎉 Acertou em ${newAttempts} tentativas!`);
      setGameOver(true);
    } else if (guessNum < targetNumber) {
      setMessage('📈 Tente um número MAIOR!');
    } else {
      setMessage('📉 Tente um número MENOR!');
    }

    setGuess('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Adivinhação</Text>
        
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={startNewGame}
        >
          <Text style={styles.resetButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {!gameStarted ? (
          <View style={styles.startScreen}>
            <Text style={styles.emojiLarge}>🔮</Text>
            <Text style={styles.startTitle}>Adivinhação</Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={startNewGame}
            >
              <Text style={styles.buttonText}>INICIAR JOGO</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.infoPanel}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Tentativas</Text>
                <Text style={styles.infoValue}>{attempts}</Text>
              </View>
            </View>

            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>{message}</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={guess}
                onChangeText={setGuess}
                keyboardType="numeric"
                placeholder="Digite seu palpite..."
                placeholderTextColor="#999"
                editable={!gameOver}
              />
              <TouchableOpacity 
                style={[styles.guessButton, gameOver && styles.buttonDisabled]}
                onPress={handleGuess}
                disabled={gameOver}
              >
                <Text style={styles.guessButtonText}>Tentar</Text>
              </TouchableOpacity>
            </View>

            {gameOver && (
              <TouchableOpacity 
                style={styles.button}
                onPress={startNewGame}
              >
                <Text style={styles.buttonText}>NOVO JOGO</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0033",
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
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#a78bfa',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: '#e9d5ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    padding: 8,
  },
  resetButtonText: {
    color: '#a78bfa',
    fontSize: 18,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiLarge: {
    fontSize: 60,
    marginBottom: 15,
  },
  startTitle: {
    color: '#e9d5ff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoPanel: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    color: '#c4b5fd',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoValue: {
    color: '#e9d5ff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statusContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    minWidth: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  guessButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  guessButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  button: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});