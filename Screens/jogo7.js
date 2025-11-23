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
        <LinearGradient
          colors={['#4a7c23', '#2d5016']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.scorePanel}
        >
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
        </LinearGradient>
      )}

      {/* Área do Jogo */}
      <View style={styles.gameArea}>
        {/* Tela Inicial */}
        {!gameActive && (
          <LinearGradient
            colors={['#5a8f2a', '#3d6b1a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.startScreen}
          >
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
          </LinearGradient>
        )}

        {/* Jogo Ativo */}
        {gameActive && (
          <View style={styles.gameContent}>
            {/* Macaco */}
            <LinearGradient
              colors={['#5a8f2a', '#3d6b1a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.monkeyBox}
            >
              <Image
                source={getMonkeyImage()}
                style={styles.monkeyImage}
              />
            </LinearGradient>

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
            <LinearGradient
              colors={['#fff9e6', '#ffe066']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bananasArea}
            >
              <View style={styles.bananasContainer}>
                {renderBananas()}
              </View>
            </LinearGradient>

            {/* Opções de Números */}
            <View style={styles.optionsGrid}>
              {options.map((num, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleOptionPress(num)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#fff9e6', '#ffe066']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.optionGradient}
                  >
                    <Text style={styles.optionNumber}>{num}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a3d0c',
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
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
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
    padding: 15,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8bc34a',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#E0E0E0',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameArea: {
    flex: 1,
    margin: 20,
  },
  startScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 30,
    borderWidth: 2,
    borderColor: '#8bc34a',
  },
  bigMonkey: {
    width: 140,
    height: 140,
    marginBottom: 15,
  },
  startTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  startDescription: {
    color: '#E0E0E0',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 28,
  },
  legendBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
    borderWidth: 2,
    borderColor: '#ffe066',
  },
  legendTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  legendItem: {
    color: '#E0E0E0',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 5,
  },
  startButton: {
    backgroundColor: '#ffe066',
    paddingHorizontal: 60,
    paddingVertical: 18,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: '#d4a800',
  },
  startButtonText: {
    color: '#5a3d00',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  gameContent: {
    flex: 1,
    alignItems: 'center',
  },
  monkeyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#8bc34a',
    marginBottom: 10,
  },
  monkeyImage: {
    width: 70,
    height: 70,
  },
  messageBox: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
    width: '100%',
    backgroundColor: '#5a8f2a',
    borderWidth: 2,
    borderColor: '#8bc34a',
  },
  successBox: {
    backgroundColor: '#4caf50',
    borderColor: '#2e7d32',
  },
  errorBox: {
    backgroundColor: '#f44336',
    borderColor: '#c62828',
  },
  messageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bananasArea: {
    width: '100%',
    minHeight: 120,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#d4a800',
    marginBottom: 20,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center',
    gap: 15,
  },
  optionButton: {
    width: (width - 100) / 2,
    aspectRatio: 1.5,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  optionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#d4a800',
  },
  optionNumber: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#5a3d00',
  },
});