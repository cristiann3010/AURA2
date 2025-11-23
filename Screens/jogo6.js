// Jogo6.js - O Que o Macaco Come?
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

// Frutas que o macaco come
const FOODS = [
  { emoji: '🍌', name: 'Banana', isFood: true },
  { emoji: '🍎', name: 'Maçã', isFood: true },
  { emoji: '🥭', name: 'Manga', isFood: true },
  { emoji: '🍊', name: 'Laranja', isFood: true },
  { emoji: '🍇', name: 'Uva', isFood: true },
  { emoji: '🍓', name: 'Morango', isFood: true },
  { emoji: '🍉', name: 'Melancia', isFood: true },
  { emoji: '🍑', name: 'Pêssego', isFood: true },
];

// Objetos que NÃO são comida
const NOT_FOODS = [
  { emoji: '🪨', name: 'Pedra', isFood: false },
  { emoji: '🍂', name: 'Folha', isFood: false },
  { emoji: '🪵', name: 'Graveto', isFood: false },
  { emoji: '🧱', name: 'Tijolo', isFood: false },
  { emoji: '🪃', name: 'Bumerangue', isFood: false },
  { emoji: '🧸', name: 'Ursinho', isFood: false },
  { emoji: '⚽', name: 'Bola', isFood: false },
  { emoji: '🎈', name: 'Balão', isFood: false },
  { emoji: '🧩', name: 'Quebra-cabeça', isFood: false },
  { emoji: '🔑', name: 'Chave', isFood: false },
];

export default function Jogo6({ navigation }) {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [objects, setObjects] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [monkeyMood, setMonkeyMood] = useState('normal');
  const [isWaiting, setIsWaiting] = useState(false);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateObjects = () => {
    const shuffledFoods = shuffleArray(FOODS);
    const selectedFood = { ...shuffledFoods[0], id: 1 };
    
    const shuffledNotFoods = shuffleArray(NOT_FOODS);
    const selectedNotFoods = shuffledNotFoods.slice(0, 3).map((obj, index) => ({
      ...obj,
      id: index + 2,
    }));

    const allObjects = shuffleArray([selectedFood, ...selectedNotFoods]);
    const finalObjects = shuffleArray(allObjects).map((obj, index) => ({
      ...obj,
      id: index + 1,
    }));
    
    setObjects(finalObjects);
  };

  const startGame = () => {
    setScore(0);
    setRound(1);
    setGameActive(true);
    setMessage('');
    setMonkeyMood('normal');
    setIsWaiting(false);
    generateObjects();
  };

  const handleObjectTap = (obj) => {
    if (!gameActive || isWaiting) return;

    setIsWaiting(true);

    if (obj.isFood) {
      setMonkeyMood('acerto');
      setMessage(`🎉 Muito bem! ${obj.name} é gostosa!`);
      setMessageType('success');
      setScore(prev => prev + 10);

      setTimeout(() => {
        if (round >= 10) {
          endGame();
        } else {
          setRound(prev => prev + 1);
          setMessage('');
          setMonkeyMood('normal');
          setIsWaiting(false);
          generateObjects();
        }
      }, 1500);
    } else {
      setMonkeyMood('erro');
      setMessage(`❌ Opa! ${obj.name} não é comida!`);
      setMessageType('error');

      setTimeout(() => {
        setMessage('');
        setMonkeyMood('normal');
        setIsWaiting(false);
      }, 1500);
    }
  };

  const endGame = () => {
    setGameActive(false);
    setMonkeyMood('normal');

    setTimeout(() => {
      let feedback = '';
      if (score >= 80) feedback = '🏆 Perfeito! Você é demais!';
      else if (score >= 50) feedback = '⭐ Muito bem!';
      else feedback = '💪 Continue tentando!';

      Alert.alert(
        '🐵 Parabéns!',
        `Frutas coletadas: ${score / 10} 🍎\nPontos: ${score}\n\n${feedback}`,
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
          <Text style={styles.headerTitle}>🐵 O Que Como?</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      {/* Pontuação */}
      {gameActive && (
        <View style={styles.scorePanel}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>FRUTAS</Text>
            <Text style={styles.scoreValue}>🍎 {score / 10}</Text>
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
              <Text style={styles.startTitle}>O Que o Macaco Come?</Text>
              <Text style={styles.startDescription}>
                Toque na comida do macaco!{'\n'}
                Ele adora frutas! 🍌🍎🥭
              </Text>
              
              <View style={styles.legendBox}>
                <Text style={styles.legendTitle}>Lembre-se:</Text>
                <Text style={styles.legendItem}>✅ Frutas = Comida!</Text>
                <Text style={styles.legendItem}>🍌🍎🥭🍊🍇🍓🍉🍑</Text>
                <Text style={styles.legendItem}>❌ Outros = Não é comida!</Text>
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
                <Text style={styles.monkeyQuestion}>
                  O que eu como? Toque na minha comida!
                </Text>
              </View>

              {/* Mensagem de Feedback */}
              {message !== '' && (
                <View style={[
                  styles.messageBox,
                  messageType === 'success' ? styles.successBox : styles.errorBox
                ]}>
                  <Text style={styles.messageText}>{message}</Text>
                </View>
              )}

              {/* Objetos para escolher */}
              <View style={styles.objectsGrid}>
                {objects.map((obj) => (
                  <TouchableOpacity
                    key={obj.id}
                    style={styles.objectButton}
                    onPress={() => handleObjectTap(obj)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.objectGradient}>
                      <Text style={styles.objectEmoji}>{obj.emoji}</Text>
                      <Text style={styles.objectName}>{obj.name}</Text>
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
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8bc34a',
    marginBottom: 15,
    backgroundColor: 'rgba(45, 95, 63, 0.85)',
  },
  monkeyImage: {
    width: 90,
    height: 90,
  },
  monkeyQuestion: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  messageBox: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
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
  objectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: width - 40,
  },
  objectButton: {
    width: '45%',
    height: 120,
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 6,
  },
  objectGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8bc34a',
    backgroundColor: 'rgba(255, 249, 230, 0.95)',
  },
  objectEmoji: {
    fontSize: 55,
    marginBottom: 8,
  },
  objectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a4d2e',
  },
});