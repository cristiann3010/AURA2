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
        <LinearGradient
          colors={['#4a7c23', '#2d5016']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.scorePanel}
        >
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
              <Text style={styles.monkeyQuestion}>
                O que eu como? Toque na minha comida!
              </Text>
            </LinearGradient>

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
                  <LinearGradient
                    colors={['#fff9e6', '#ffe066']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.objectGradient}
                  >
                    <Text style={styles.objectEmoji}>{obj.emoji}</Text>
                    <Text style={styles.objectName}>{obj.name}</Text>
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
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8bc34a',
    marginBottom: 15,
    width: '100%',
    height: 160,
    justifyContent: 'center',
  },
  monkeyImage: {
    width: 90,
    height: 90,
  },
  monkeyQuestion: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  messageBox: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
    width: '100%',
    borderWidth: 2,
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  objectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 5,
  },
  objectButton: {
    width: (width - 80) / 2,
    aspectRatio: 1,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  objectGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#d4a800',
  },
  objectEmoji: {
    fontSize: 55,
    marginBottom: 8,
  },
  objectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5a3d00',
  },
});