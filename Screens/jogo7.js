// Jogo7.js - Macaco da Memória (Erro de texto corrigido)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  ImageBackground
} from 'react-native';

const { width, height } = Dimensions.get('window');
const GAME_AREA_HEIGHT = height * 0.70;

const FRUITS = [
  { emoji: '🍌', name: 'BANANA', color: '#FFD93D' },
  { emoji: '🥥', name: 'COCO', color: '#8B4513' },
  { emoji: '🍇', name: 'UVA', color: '#9B59B6' },
  { emoji: '🍉', name: 'MELANCIA', color: '#E74C3C' },
  { emoji: '🍊', name: 'LARANJA', color: '#FF8C00' },
  { emoji: '🍓', name: 'MORANGO', color: '#FF6B6B' },
];

export default function Jogo7({ navigation }) {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [lives, setLives] = useState(5);
  const [message, setMessage] = useState('');

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(5);
    setGameActive(true);
    setGameOver(false);
    setSequence([]);
    setUserSequence([]);
    setIsShowingSequence(false);
    setActiveButton(null);
    setMessage('Prepare-se! 🐵');
    
    setTimeout(() => {
      startNewRound(1);
    }, 2000);
  };

  const startNewRound = (roundLevel) => {
    setUserSequence([]);
    setActiveButton(null);
    setMessage(`Nível ${roundLevel} - Observe!`);
    
    const sequenceLength = Math.min(2 + Math.floor(roundLevel / 2), 8);
    const newSequence = [];
    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * 6));
    }
    
    setSequence(newSequence);
    
    setTimeout(() => {
      showSequence(newSequence);
    }, 1500);
  };

  const showSequence = (seq) => {
    setIsShowingSequence(true);
    setMessage('Memorize a sequência!');
    
    let index = 0;
    
    const showNextFruit = () => {
      if (index >= seq.length) {
        setTimeout(() => {
          setIsShowingSequence(false);
          setMessage('Sua vez! Repita a sequência 🐵');
        }, 1000);
        return;
      }
      
      setActiveButton(seq[index]);
      
      setTimeout(() => {
        setActiveButton(null);
        index++;
        
        if (index < seq.length) {
          setTimeout(showNextFruit, 500);
        } else {
          setTimeout(() => {
            setIsShowingSequence(false);
            setMessage('Sua vez! Repita a sequência 🐵');
          }, 1000);
        }
      }, 1200);
    };
    
    showNextFruit();
  };

  const handleFruitPress = (index) => {
    if (isShowingSequence || !gameActive || gameOver) return;
    
    setActiveButton(index);
    setTimeout(() => setActiveButton(null), 300);
    
    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);
    
    if (sequence[newUserSequence.length - 1] === index) {
      if (newUserSequence.length === sequence.length) {
        handleCorrect();
      }
    } else {
      handleWrong();
    }
  };

  const handleCorrect = () => {
    setMessage('CORRETO! 🎉');
    const pointsEarned = level * 15;
    setScore(prev => prev + pointsEarned);
    
    setTimeout(() => {
      const newLevel = level + 1;
      setLevel(newLevel);
      
      if (newLevel > 8) {
        winGame();
      } else {
        startNewRound(newLevel);
      }
    }, 2000);
  };

  const handleWrong = () => {
    setMessage('Tente novamente! 😊');
    
    setLives(prev => {
      const newLives = prev - 1;
      
      if (newLives <= 0) {
        setTimeout(() => {
          setGameActive(false);
          setGameOver(true);
          endGame();
        }, 1500);
        return 0;
      } else {
        setTimeout(() => {
          startNewRound(level);
        }, 2000);
        return newLives;
      }
    });
  };

  const winGame = () => {
    setGameActive(false);
    setGameOver(true);
    
    setTimeout(() => {
      Alert.alert(
        '🏆 VOCÊ VENCEU!',
        `Parabéns! Você é um gênio! 🐵\nPontuação Final: ${score}`,
        [
          { text: 'Jogar Novamente', onPress: startGame },
          { text: 'Voltar', onPress: () => navigation.goBack() }
        ]
      );
    }, 1000);
  };

  const endGame = () => {
    setGameActive(false);
    setGameOver(true);
    
    setTimeout(() => {
      Alert.alert(
        '💔 Fim de Jogo!',
        `Você foi muito bem! 🐵\nPontuação: ${score}\nNível: ${level}`,
        [
          { text: 'Jogar Novamente', onPress: startGame },
          { text: 'Voltar', onPress: () => navigation.goBack() }
        ]
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🐵 Macaco da Memória</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.infoPanel}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>PONTOS</Text>
          <Text style={styles.infoValue}>{score}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>NÍVEL</Text>
          <Text style={styles.infoValue}>{level}/8</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>VIDAS</Text>
          {/* CORREÇÃO: Texto simples sem repetição */}
          <Text style={[styles.infoValue, lives <= 2 && styles.lowLives]}>
            {lives} ❤️
          </Text>
        </View>
      </View>

      <ImageBackground
        source={require('../assets/bgmonk.png')}
        style={styles.gameArea}
        resizeMode="cover"
      >
        <View style={styles.gameOverlay}>
          {!gameActive && !gameOver && (
            <View style={styles.startScreen}>
              <Text style={styles.startTitle}>🐵 Macaco da Memória 🧠</Text>
              <Text style={styles.startDescription}>
                Memorize as frutas e repita a sequência!
              </Text>
              <TouchableOpacity style={styles.startButton} onPress={startGame}>
                <Text style={styles.startButtonText}>COMEÇAR</Text>
              </TouchableOpacity>
            </View>
          )}

          {gameActive && !gameOver && (
            <View style={styles.gameContent}>
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{message}</Text>
              </View>

              <View style={styles.monkey}>
                <Text style={styles.monkeyEmoji}>
                  {isShowingSequence ? '🙈' : '🐵'}
                </Text>
              </View>

              <View style={styles.sequenceInfo}>
                <Text style={styles.sequenceText}>
                  Sequência: {sequence.length} frutas
                </Text>
                {userSequence.length > 0 && !isShowingSequence && (
                  <Text style={styles.progressText}>
                    {userSequence.length}/{sequence.length}
                  </Text>
                )}
              </View>

              <View style={styles.fruitsGrid}>
                {FRUITS.map((fruit, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.fruitButton,
                      activeButton === index && styles.fruitButtonActive,
                      { backgroundColor: fruit.color + '40' },
                      activeButton === index && { backgroundColor: fruit.color },
                    ]}
                    onPress={() => handleFruitPress(index)}
                    disabled={isShowingSequence}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.fruitEmoji}>{fruit.emoji}</Text>
                    <Text style={styles.fruitName}>{fruit.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a4d2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2d5f3f',
  },
  backButton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  infoPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(45, 95, 63, 0.9)',
    margin: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(139, 195, 74, 0.5)',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    color: '#c8e6c9',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  infoValue: {
    color: '#8bc34a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lowLives: {
    color: '#ff6b6b',
  },
  gameArea: {
    height: GAME_AREA_HEIGHT,
    marginHorizontal: 15,
    marginBottom: 10,
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
    padding: 20,
    backgroundColor: 'rgba(45, 95, 63, 0.85)',
    margin: 10,
    borderRadius: 15,
  },
  startTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  startDescription: {
    color: '#c8e6c9',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#8bc34a',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#c8e6c9',
  },
  startButtonText: {
    color: '#1a4d2e',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  gameContent: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    backgroundColor: 'rgba(45, 95, 63, 0.9)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(139, 195, 74, 0.5)',
  },
  messageText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  monkey: {
    alignItems: 'center',
    marginVertical: 5,
  },
  monkeyEmoji: {
    fontSize: 50,
  },
  sequenceInfo: {
    backgroundColor: 'rgba(139, 195, 74, 0.3)',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  sequenceText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressText: {
    color: '#8bc34a',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  fruitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 10,
  },
  fruitButton: {
    width: (width - 80) / 3,
    height: 80,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  fruitButtonActive: {
    transform: [{ scale: 1.1 }],
    borderColor: '#ffffff',
  },
  fruitEmoji: {
    fontSize: 32,
    marginBottom: 3,
  },
  fruitName: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});