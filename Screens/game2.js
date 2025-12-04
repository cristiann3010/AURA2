// Jogo2.js - Macaquinho Coletor de Bananas
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
  ImageBackground,
  StatusBar,
  Image
} from 'react-native';

const { width, height } = Dimensions.get('window');
const PLAYER_SIZE = 90;
const ITEM_SIZE = 50;
const GAME_AREA_HEIGHT = height * 0.55;
const PLAYER_SPEED = 10;

export default function Jogo2({ navigation }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [items, setItems] = useState([]);
  const [timeLeft, setTimeLeft] = useState(40);
  const [collectedItems, setCollectedItems] = useState(new Set());
  const [facingDirection, setFacingDirection] = useState('right');
  
  const playerX = useRef(new Animated.Value(width / 2 - PLAYER_SIZE / 2)).current;
  
  const spawnTimer = useRef(null);
  const gameTimer = useRef(null);
  const itemsRef = useRef([]);
  const playerXRef = useRef(width / 2 - PLAYER_SIZE / 2);
  
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);
  const movementAnimation = useRef(null);
  const lastUpdateTime = useRef(Date.now());

  const ARROW_IMAGES = {
    left: require('../assets/sim.png'),
    right: require('../assets/nao.png'),
  };

  const GAME_IMAGES = {
    player: require('../assets/macaco.png'),
    banana: require('../assets/banana.png.png'),
    obstacle1: require('../assets/banana5.png'),
    obstacle2: require('../assets/spider.png'),
    obstacle3: require('../assets/scorpion.png'),
  };

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    playerXRef.current = playerX._value;
  }, [playerX._value]);

  useEffect(() => {
    if (!gameActive || gameOver) return;

    let animationFrameId;
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTime.current;
      lastUpdateTime.current = now;

      if (isMovingLeft || isMovingRight) {
        const currentX = playerX._value;
        let newX = currentX;
        
        const movement = (PLAYER_SPEED * deltaTime) / 16;
        
        if (isMovingLeft) {
          newX = Math.max(10, currentX - movement);
        } else if (isMovingRight) {
          newX = Math.min(width - PLAYER_SIZE - 10, currentX + movement);
        }
        
        if (newX !== currentX) {
          playerX.setValue(newX);
        }
      }
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    lastUpdateTime.current = Date.now();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isMovingLeft, isMovingRight, gameActive, gameOver]);

  useEffect(() => {
    if (gameActive && timeLeft > 0 && !gameOver) {
      gameTimer.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame('time');
    }

    return () => {
      if (gameTimer.current) clearTimeout(gameTimer.current);
    };
  }, [gameActive, timeLeft, gameOver]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setTimeLeft(40);
    setGameActive(true);
    setGameOver(false);
    setItems([]);
    setCollectedItems(new Set());
    setFacingDirection('right');
    
    const startX = width / 2 - PLAYER_SIZE / 2;
    Animated.spring(playerX, {
      toValue: startX,
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
    
    playerXRef.current = startX;
    itemsRef.current = [];
    setIsMovingLeft(false);
    setIsMovingRight(false);
  };

  useEffect(() => {
    if (gameActive && !gameOver) {
      const spawnInterval = Math.max(900 - (level * 50), 600);
      
      spawnTimer.current = setInterval(() => {
        spawnItem();
      }, spawnInterval);
    }

    return () => {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
    };
  }, [gameActive, gameOver, level]);

  const spawnItem = () => {
    const isGood = Math.random() > 0.30;
    const itemTypes = isGood 
      ? ['banana', 'banana', 'banana', 'banana', 'banana']
      : ['obstacle1', 'obstacle2', 'obstacle3'];
    
    const itemId = Date.now() + Math.random();
    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    
    const newItem = {
      id: itemId,
      x: Math.random() * (width - ITEM_SIZE - 40) + 20,
      y: new Animated.Value(-ITEM_SIZE),
      type: itemType,
      image: GAME_IMAGES[itemType],
      isGood: isGood,
      points: isGood ? (Math.floor(Math.random() * 3) + 1) * 10 : 0,
      collected: false,
    };

    setItems(prev => [...prev, newItem]);

    Animated.timing(newItem.y, {
      toValue: GAME_AREA_HEIGHT + ITEM_SIZE,
      duration: 3800 - (level * 150),
      useNativeDriver: false,
    }).start(() => {
      removeItem(itemId);
    });

    let collisionChecked = false;
    const collisionInterval = setInterval(() => {
      const currentY = newItem.y._value;
      
      const playerTop = GAME_AREA_HEIGHT - 15 - PLAYER_SIZE;
      const playerBottom = GAME_AREA_HEIGHT - 15;
      const itemBottom = currentY + ITEM_SIZE;
      
      if (itemBottom >= playerTop && currentY <= playerBottom && !collisionChecked) {
        const item = itemsRef.current.find(i => i.id === itemId);
        if (!item || item.collected) {
          clearInterval(collisionInterval);
          return;
        }

        const itemCenterX = newItem.x + ITEM_SIZE / 2;
        const playerCenterX = playerXRef.current + PLAYER_SIZE / 2;
        const distanceX = Math.abs(itemCenterX - playerCenterX);
        
        if (distanceX < 50) {
          collisionChecked = true;
          clearInterval(collisionInterval);
          handleCollision(itemId, newItem);
        }
      } else if (currentY > playerBottom) {
        clearInterval(collisionInterval);
      }
    }, 30);
  };

  const handleCollision = (itemId, item) => {
    if (collectedItems.has(itemId)) return;
    
    setCollectedItems(prev => new Set([...prev, itemId]));
    
    setItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, collected: true } : i
    ));

    removeItem(itemId);
    
    if (item.isGood) {
      setScore(prev => {
        const newScore = prev + item.points;
        if (newScore >= level * 100 && level < 10) {
          setLevel(l => l + 1);
        }
        return newScore;
      });
    } else {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setTimeout(() => endGame('lives'), 100);
        }
        return newLives;
      });
    }
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const startMoveLeft = () => {
    if (!gameActive || gameOver) return;
    setIsMovingRight(false);
    setIsMovingLeft(true);
    setFacingDirection('left');
  };

  const startMoveRight = () => {
    if (!gameActive || gameOver) return;
    setIsMovingLeft(false);
    setIsMovingRight(true);
    setFacingDirection('right');
  };

  const stopMove = () => {
    setIsMovingLeft(false);
    setIsMovingRight(false);
  };

  const quickMoveLeft = () => {
    if (!gameActive || gameOver) return;
    setFacingDirection('left');
    const currentX = playerX._value;
    const newX = Math.max(10, currentX - 40);
    
    Animated.spring(playerX, {
      toValue: newX,
      tension: 100,
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  const quickMoveRight = () => {
    if (!gameActive || gameOver) return;
    setFacingDirection('right');
    const currentX = playerX._value;
    const newX = Math.min(width - PLAYER_SIZE - 10, currentX + 40);
    
    Animated.spring(playerX, {
      toValue: newX,
      tension: 100,
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  const endGame = (reason) => {
    setGameActive(false);
    setGameOver(true);
    if (spawnTimer.current) clearInterval(spawnTimer.current);
    if (gameTimer.current) clearTimeout(gameTimer.current);
    setItems([]);
    setIsMovingLeft(false);
    setIsMovingRight(false);

    const message = reason === 'time' 
      ? '⏰ Tempo Esgotado!' 
      : '💔 Você perdeu todas as vidas!';

    setTimeout(() => {
      Alert.alert(
        message,
        `🍌 Bananas coletadas: ${Math.floor(score / 10)}\nPontuação: ${score}\nNível: ${level}\n\n${score >= 300 ? '🏆 Macaco Campeão!' : score >= 150 ? '⭐ Muito bem!' : '💪 Tente novamente!'}`,
        [
          { text: 'Jogar Novamente', onPress: startGame },
          { text: 'Voltar', onPress: () => navigation.goBack() }
        ]
      );
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
      if (gameTimer.current) clearTimeout(gameTimer.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2d004d" barStyle="light-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pega banana</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <View style={styles.infoPanel}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>TEMPO</Text>
          <Text style={[styles.infoValue, timeLeft <= 10 && styles.timeWarning]}>
            {timeLeft}s
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>BANANAS</Text>
          <Text style={styles.infoValue}>{Math.floor(score / 10)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>VIDAS</Text>
          <Text style={[styles.infoValue, lives <= 1 && styles.lowLives]}>
            {'❤️'.repeat(lives)}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>NÍVEL</Text>
          <Text style={styles.infoValue}>{level}</Text>
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
              <Text style={styles.startTitle}>Macaco das Bananas</Text>
              <Text style={styles.startDescription}>
                Pegue as bananas e evite os perigos
              </Text>
              <TouchableOpacity style={styles.startButton} onPress={startGame}>
                <Text style={styles.startButtonText}>COMEÇAR</Text>
              </TouchableOpacity>
            </View>
          )}

          {gameActive && !gameOver && (
            <>
              {items.map(item => (
                !item.collected && (
                  <Animated.View
                    key={item.id}
                    style={[
                      styles.item,
                      {
                        left: item.x,
                        top: item.y,
                      },
                    ]}
                  >
                    <Image 
                      source={item.image} 
                      style={styles.itemImage}
                      resizeMode="contain"
                    />
                  </Animated.View>
                )
              ))}

              <Animated.View
                style={[
                  styles.player,
                  {
                    left: playerX,
                    bottom: 15,
                    transform: [{ scaleX: facingDirection === 'left' ? 1 : -1 }],
                  },
                ]}
              >
                <Image 
                  source={GAME_IMAGES.player} 
                  style={styles.playerImage}
                  resizeMode="contain"
                />
              </Animated.View>
            </>
          )}
        </View>
      </ImageBackground>

      {gameActive && !gameOver && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.leftButton]}
            onPressIn={startMoveLeft}
            onPressOut={stopMove}
            onPress={quickMoveLeft}
            activeOpacity={0.8}
            delayPressIn={0}
          >
            <Image 
              source={ARROW_IMAGES.left}
              style={styles.arrowImage}
              resizeMode="contain"
            />
            <Text style={styles.controlLabel}>ESQUERDA</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.rightButton]}
            onPressIn={startMoveRight}
            onPressOut={stopMove}
            onPress={quickMoveRight}
            activeOpacity={0.8}
            delayPressIn={0}
          >
            <Image 
              source={ARROW_IMAGES.right}
              style={styles.arrowImage}
              resizeMode="contain"
            />
            <Text style={styles.controlLabel}>DIREITA</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
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
  infoPanel: {
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
  timeWarning: {
    color: '#ff6b6b',
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
    padding: 30,
    backgroundColor: 'rgba(45, 95, 63, 0.9)',
  },
  startTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  startDescription: {
    color: '#c8e6c9',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
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
  item: {
    position: 'absolute',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: ITEM_SIZE - 5,
    height: ITEM_SIZE - 5,
  },
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerImage: {
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 15,
  },
  controlButton: {
    flex: 1,
    height: 85,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    backgroundColor: '#8bc34a',
  },
  leftButton: {
    borderColor: '#c8e6c9',
  },
  rightButton: {
    borderColor: '#c8e6c9',
  },
  arrowImage: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  controlLabel: {
    color: '#1a4d2e',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});