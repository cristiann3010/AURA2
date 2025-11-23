// Jogo7.js - Conte as Bananas
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  Image,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Jogo7({ navigation }) {
  const [bananaCount, setBananaCount] = useState(0);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [monkeyMood, setMonkeyMood] = useState('normal');

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateRound = () => {
    // Gera quantidade de bananas (1 a 9)
    const count = Math.floor(Math.random() * 9) + 1;
    setBananaCount(count);

    // Gera 4 opções (1 correta + 3 erradas)
    let wrongOptions = [];
    while (wrongOptions.length < 3) {
      const wrong = Math.floor(Math.random() * 9) + 1;
      if (wrong !== count && !wrongOptions.includes(wrong)) {
        wrongOptions.push(wrong);
      }
    }

    const allOptions = shuffleArray([count, ...wrongOptions]);
    setOptions(allOptions);
    setMessage('Quantas bananas tem? 🐵');
    setMonkeyMood('normal');
  };

  const startGame = () => {
    setScore(0);
    setRound(1);
    setGameActive(true);
    setIsWaiting(false);
    setMessageType('');
    generateRound();
  };

  const handleOptionPress = (selectedNumber) => {
    if (!gameActive || isWaiting) return;

    setIsWaiting(true);

    if (selectedNumber === bananaCount) {
      // Acertou!
      setMonkeyMood('acerto');
      setMessage(`🎉 Isso! Tem ${bananaCount} banana${bananaCount > 1 ? 's' : ''}!`);
      setMessageType('success');
      setScore(prev => prev + 10);

      setTimeout(() => {
        if (round >= 10) {
          endGame();
        } else {
          setRound(prev => prev + 1);
          setMessageType('');
          setIsWaiting(false);
          generateRound();
        }
      }, 1500);
    } else {
      // Errou
      setMonkeyMood('erro');
      setMessage(`❌ Opa! Tem ${bananaCount}, não ${selectedNumber}!`);
      setMessageType('error');

      setTimeout(() => {
        setMessageType('');
        setMonkeyMood('normal');
        setMessage('Tente de novo! 🐵');
        setIsWaiting(false);
      }, 1500);
    }
  };

  const endGame = () => {
    setGameActive(false);
    setMonkeyMood('normal');

    setTimeout(() => {
      let feedback = '';
      if (score >= 80) feedback = '🏆 Perfeito! Você sabe contar muito bem!';
      else if (score >= 50) feedback = '⭐ Muito bem!';
      else feedback = '💪 Continue praticando!';

      Alert.alert(
        '🐵 Parabéns!',
        `Acertos: ${score / 10}/10 🍌\nPontos: ${score}\n\n${feedback}`,
        [
          { text: 'Jogar de Novo', onPress: startGame },
          { text: 'Voltar', onPress: () => navigation.goBack() }
        ]
      );
    }, 500);
  };

  const getMonkeyImage = () => {
    if (monkeyMood === 'acerto') {
      return require('../assets/macacoAcerto.png');
    } else if (monkeyMood === 'erro') {
      return require('../assets/macacoErro.png');
    } else {
      return require('../assets/monk3.png');
    }
  };

  // Renderiza as bananas na tela
  const renderBananas = () => {
    const bananas = [];
    for (let i = 0; i < bananaCount; i++) {
      bananas.push(
        <Image
          key={i}
          source={require('../assets/banana.png.png')}
          style={styles.bananaImage}
          resizeMode="contain"
        />
      );
    }
    return bananas;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2d004d" barStyle="light-content" />
      
      {/* Header */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🍌 Conte as Bananas</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      {/* Pontuação */}
      {gameActive && (
        <View style={styles.scorePanel}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>ACERTOS</Text>
            <Text style={styles.scoreValue}>🍌 {score / 10}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>RODADA</Text>
            <Text style={styles.scoreValue}>{round}/10</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>PONTOS</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        </View>
      )}

      {/* Área do Jogo com Background */}
      <ImageBackground
        source={require('../assets/bgmonk.png')}
        style={styles.gameArea}
        resizeMode="cover"
      >
        <View style={styles.gameOverlay}>
          {/* Tela Inicial */}
          {!gameActive && (
            <View style={styles.startScreen}>
              <Image
                source={require('../assets/monk3.png')}
                style={styles.bigMonkey}
                resizeMode="contain"
              />
              <Text style={styles.startTitle}>Conte as Bananas!</Text>
              <Text style={styles.startDescription}>
                Conte quantas bananas aparecem{'\n'}
                e toque no número certo! 🍌
              </Text>
              
              <View style={styles.legendBox}>
                <Text style={styles.legendTitle}>Como jogar:</Text>
                <Text style={styles.legendItem}>👀 Olhe as bananas</Text>
                <Text style={styles.legendItem}>🔢 Conte quantas tem</Text>
                <Text style={styles.legendItem}>👆 Toque no número certo!</Text>
              </View>

              <TouchableOpacity style={styles.startButton} onPress={startGame}>
                <Text style={styles.startButtonText}>COMEÇAR</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Jogo Ativo */}
          {gameActive && (
            <View style={styles.gameContent}>
              {/* Macaco */}
              <View style={styles.monkeyBox}>
                <Image
                  source={getMonkeyImage()}
                  style={styles.monkeyImage}
                />
              </View>

              {/* Mensagem */}
              {message !== '' && (
                <View style={[
                  styles.messageBox,
                  messageType === 'success' && styles.successBox,
                  messageType === 'error' && styles.errorBox,
                ]}>
                  <Text style={styles.messageText}>{message}</Text>
                </View>
              )}

              {/* Área das Bananas */}
              <View style={styles.bananasArea}>
                <View style={styles.bananasContainer}>
                  {renderBananas()}
                </View>
              </View>

              {/* Opções de Números */}
              <View style={styles.optionsGrid}>
                {options.map((num, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => handleOptionPress(num)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionGradient}>
                      <Text style={styles.optionNumber}>{num}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
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
    backgroundColor: '#1a4d2e',
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
  scorePanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(45, 95, 63, 0.9)',
    margin: 15,
    marginTop: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(139, 195, 74, 0.5)',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#c8e6c9',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  scoreValue: {
    color: '#8bc34a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8bc34a',
    overflow: 'hidden',
  },
  gameOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  startScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'rgba(45, 95, 63, 0.9)',
  },
  bigMonkey: {
    width: 140,
    height: 140,
    marginBottom: 15,
  },
  startTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  startDescription: {
    color: '#c8e6c9',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  legendBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
    borderWidth: 2,
    borderColor: '#8bc34a',
  },
  legendTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  legendItem: {
    color: '#c8e6c9',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 4,
  },
  startButton: {
    backgroundColor: '#8bc34a',
    paddingHorizontal: 60,
    paddingVertical: 18,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#c8e6c9',
  },
  startButtonText: {
    color: '#1a4d2e',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  gameContent: {
    flex: 1,
    padding: 15,
  },
  monkeyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#8bc34a',
    marginBottom: 10,
    backgroundColor: 'rgba(45, 95, 63, 0.85)',
    alignSelf: 'center',
  },
  monkeyImage: {
    width: 70,
    height: 70,
  },
  messageBox: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#8bc34a',
    backgroundColor: 'rgba(90, 143, 42, 0.9)',
  },
  successBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderColor: '#2e7d32',
  },
  errorBox: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    borderColor: '#c62828',
  },
  messageText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bananasArea: {
    width: '100%',
    minHeight: 120,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8bc34a',
    marginBottom: 20,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 249, 230, 0.95)',
  },
  bananasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  bananaImage: {
    width: 50,
    height: 50,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  optionButton: {
    width: '45%',
    height: 90,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 6,
  },
  optionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8bc34a',
    backgroundColor: 'rgba(255, 249, 230, 0.95)',
  },
  optionNumber: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#1a4d2e',
  },
});