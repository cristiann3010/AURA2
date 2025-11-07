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
  ImageBackground
} from 'react-native';

const { width, height } = Dimensions.get('window');
const PLAYER_SIZE = 70;
const ITEM_SIZE = 50;
const GAME_AREA_HEIGHT = height * 0.55;
const PLAYER_SPEED = 60;

export default function Jogo2({ navigation }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [items, setItems] = useState([]);
  const [timeLeft, setTimeLeft] = useState(40);
  const [playerX, setPlayerX] = useState(width / 2 - PLAYER_SIZE / 2);
  const [collectedItems, setCollectedItems] = useState(new Set());
  
  const spawnTimer = useRef(null);
  const gameTimer = useRef(null);
  const itemsRef = useRef([]);
  const playerXRef = useRef(width / 2 - PLAYER_SIZE / 2);

  // Manter referências atualizadas
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    playerXRef.current = playerX;
  }, [playerX]);

  // Timer do jogo (40 segundos)
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

  // Iniciar o jogo
  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setTimeLeft(40);
    setGameActive(true);
    setGameOver(false);
    setItems([]);
    setCollectedItems(new Set());
    setPlayerX(width / 2 - PLAYER_SIZE / 2);
    playerXRef.current = width / 2 - PLAYER_SIZE / 2;
    itemsRef.current = [];
  };

  // Spawnar itens caindo
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

  // Criar novo item caindo
  const spawnItem = () => {
    const isGood = Math.random() > 0.30; // 70% bananas boas, 30% ruins
    const itemTypes = isGood 
      ? ['🍌', '🍌', '🍌', '🍌', '🍌'] // Mais bananas
      : ['🦂', '🕷️', '💩']; // Obstáculos perigosos pro macaco
    
    const itemId = Date.now() + Math.random();
    
    const newItem = {
      id: itemId,
      x: Math.random() * (width - ITEM_SIZE - 40) + 20,
      y: new Animated.Value(-ITEM_SIZE),
      emoji: itemTypes[Math.floor(Math.random() * itemTypes.length)],
      isGood: isGood,
      points: isGood ? (Math.floor(Math.random() * 3) + 1) * 10 : 0,
      collected: false,
    };

    setItems(prev => [...prev, newItem]);

    // Animação de queda
    Animated.timing(newItem.y, {
      toValue: GAME_AREA_HEIGHT + ITEM_SIZE,
      duration: 3800 - (level * 150),
      useNativeDriver: false,
    }).start(() => {
      removeItem(itemId);
    });

    // Sistema de detecção de colisão melhorado
    let collisionChecked = false;
    const collisionInterval = setInterval(() => {
      const currentY = newItem.y._value;
      
      // Calcular a posição Y do jogador (bottom: 15 + tamanho do player)
      const playerTop = GAME_AREA_HEIGHT - 15 - PLAYER_SIZE;
      const playerBottom = GAME_AREA_HEIGHT - 15;
      
      // Só verificar quando o item está na altura do jogador
      // Item bottom = currentY + ITEM_SIZE
      const itemBottom = currentY + ITEM_SIZE;
      
      if (itemBottom >= playerTop && currentY <= playerBottom && !collisionChecked) {
        // Verificar se ainda não foi coletado
        const item = itemsRef.current.find(i => i.id === itemId);
        if (!item || item.collected) {
          clearInterval(collisionInterval);
          return;
        }

        const itemCenterX = newItem.x + ITEM_SIZE / 2;
        const playerCenterX = playerXRef.current + PLAYER_SIZE / 2;
        const distanceX = Math.abs(itemCenterX - playerCenterX);
        
        // Hitbox melhorada - colisão mais precisa
        if (distanceX < 50) {
          collisionChecked = true; // Prevenir múltiplas verificações
          clearInterval(collisionInterval);
          handleCollision(itemId, newItem);
        }
      } else if (currentY > playerBottom) {
        // Item passou completamente do jogador
        clearInterval(collisionInterval);
      }
    }, 30);
  };

  // Lidar com colisão - IMEDIATO
  const handleCollision = (itemId, item) => {
    // Prevenir múltiplas colisões no mesmo item
    if (collectedItems.has(itemId)) return;
    
    setCollectedItems(prev => new Set([...prev, itemId]));
    
    // Marcar como coletado IMEDIATAMENTE
    setItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, collected: true } : i
    ));

    // Remover visualmente
    removeItem(itemId);
    
    if (item.isGood) {
      // Pontos IMEDIATOS
      setScore(prev => {
        const newScore = prev + item.points;
        if (newScore >= level * 100 && level < 10) {
          setLevel(l => l + 1);
        }
        return newScore;
      });
    } else {
      // Perda de vida IMEDIATA
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setTimeout(() => endGame('lives'), 100);
        }
        return newLives;
      });
    }
  };

  // Remover item
  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Mover jogador para ESQUERDA
  const moveLeft = () => {
    if (!gameActive || gameOver) return;
    setPlayerX(prev => {
      const newPos = Math.max(10, prev - PLAYER_SPEED);
      playerXRef.current = newPos;
      return newPos;
    });
  };

  // Mover jogador para DIREITA
  const moveRight = () => {
    if (!gameActive || gameOver) return;
    setPlayerX(prev => {
      const newPos = Math.min(width - PLAYER_SIZE - 10, prev + PLAYER_SPEED);
      playerXRef.current = newPos;
      return newPos;
    });
  };

  // Fim do jogo
  const endGame = (reason) => {
    setGameActive(false);
    setGameOver(true);
    if (spawnTimer.current) clearInterval(spawnTimer.current);
    if (gameTimer.current) clearTimeout(gameTimer.current);
    setItems([]);

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

  // Limpar ao sair
  useEffect(() => {
    return () => {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
      if (gameTimer.current) clearTimeout(gameTimer.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🐵 Macaco das Bananas</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Painel de Informações */}
      <View style={styles.infoPanel}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>TEMPO</Text>
          <Text style={[styles.infoValue, timeLeft <= 10 && styles.timeWarning]}>
            {timeLeft}s
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>BANANAS</Text>
          <Text style={styles.infoValue}>{Math.floor(score / 10)}🍌</Text>
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

      {/* Área do Jogo com FUNDO */}
      <ImageBackground
        source={require('../assets/background3.png')}
        style={styles.gameArea}
        resizeMode="cover"
      >
        <View style={styles.gameOverlay}>
          {!gameActive && !gameOver && (
            <View style={styles.startScreen}>
              <Text style={styles.startTitle}>🐵 Macaco das Bananas 🍌</Text>
              <Text style={styles.startDescription}>
                Ajude o macaquinho a pegar{'\n'}
                todas as bananas!
              </Text>
              <View style={styles.legendContainer}>
                <Text style={styles.legendTitle}>Como jogar:</Text>
                <Text style={styles.legendItem}>🍌 Bananas = Pontos (+10/+20/+30)</Text>
                <Text style={styles.legendItem}>🦂 🕷️ 💩 = Perder vida (-1❤️)</Text>
                <Text style={styles.legendItem}>⏰ Você tem 40 segundos!</Text>
              </View>
              <TouchableOpacity style={styles.startButton} onPress={startGame}>
                <Text style={styles.startButtonText}>COMEÇAR</Text>
              </TouchableOpacity>
            </View>
          )}

          {gameActive && !gameOver && (
            <>
              {/* Itens caindo */}
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
                    <Text style={styles.itemEmoji}>{item.emoji}</Text>
                  </Animated.View>
                )
              ))}

              {/* Jogador - MACACO */}
              <View
                style={[
                  styles.player,
                  {
                    left: playerX,
                    bottom: 15,
                  },
                ]}
              >
                <Text style={styles.playerEmoji}>🐵</Text>
              </View>
            </>
          )}
        </View>
      </ImageBackground>

      {/* Controles - BOTÕES GRANDES */}
      {gameActive && !gameOver && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.leftButton]}
            onPress={moveLeft}
            activeOpacity={0.6}
          >
            <Text style={styles.controlText}>⬅️</Text>
            <Text style={styles.controlLabel}>ESQUERDA</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.rightButton]}
            onPress={moveRight}
            activeOpacity={0.6}
          >
            <Text style={styles.controlText}>➡️</Text>
            <Text style={styles.controlLabel}>DIREITA</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Instruções */}
      {!gameActive && !gameOver && (
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Dicas:</Text>
          <Text style={styles.instructionsText}>
            • Mova o macaquinho para pegar bananas{'\n'}
            • Cuidado com os perigos da floresta!{'\n'}
            • Quanto mais bananas, mais rápido fica!
          </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.15)', // Overlay suave para melhor visibilidade
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
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  startDescription: {
    color: '#c8e6c9',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  legendContainer: {
    backgroundColor: 'rgba(139, 195, 74, 0.3)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: 'rgba(139, 195, 74, 0.5)',
  },
  legendTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  legendItem: {
    color: '#c8e6c9',
    fontSize: 13,
    marginVertical: 3,
    textAlign: 'center',
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
  item: {
    position: 'absolute',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmoji: {
    fontSize: 45,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 195, 74, 0.3)',
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#c8e6c9',
  },
  playerEmoji: {
    fontSize: 50,
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
  controlText: {
    fontSize: 36,
    marginBottom: 5,
  },
  controlLabel: {
    color: '#1a4d2e',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  instructions: {
    padding: 15,
    backgroundColor: 'rgba(45, 95, 63, 0.8)',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8bc34a',
  },
  instructionsTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionsText: {
    color: '#c8e6c9',
    fontSize: 13,
    lineHeight: 20,
  },
});