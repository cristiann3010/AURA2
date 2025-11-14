// Jogo6.js - Macaco Saltador (Plataformas)
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
const PLAYER_SIZE = 60;
const PLATFORM_WIDTH = 100;
const PLATFORM_HEIGHT = 20;
const GAME_AREA_HEIGHT = height * 0.55;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;

export default function Jogo6({ navigation }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [platforms, setPlatforms] = useState([]);
  const [playerX, setPlayerX] = useState(width / 2 - PLAYER_SIZE / 2);
  const [playerY, setPlayerY] = useState(GAME_AREA_HEIGHT - 150);
  const [velocityY, setVelocityY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [bananas, setBananas] = useState([]);
  const [collectedIds, setCollectedIds] = useState(new Set());
  const [platformsPassed, setPlatformsPassed] = useState(0);
  
  const gameLoop = useRef(null);
  const platformTimer = useRef(null);
  const playerYRef = useRef(GAME_AREA_HEIGHT - 150);
  const velocityYRef = useRef(0);
  const playerXRef = useRef(width / 2 - PLAYER_SIZE / 2);
  const platformsRef = useRef([]);
  const bananasRef = useRef([]);

  useEffect(() => {
    playerYRef.current = playerY;
  }, [playerY]);

  useEffect(() => {
    velocityYRef.current = velocityY;
  }, [velocityY]);

  useEffect(() => {
    playerXRef.current = playerX;
  }, [playerX]);

  useEffect(() => {
    platformsRef.current = platforms;
  }, [platforms]);

  useEffect(() => {
    bananasRef.current = bananas;
  }, [bananas]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameActive(true);
    setGameOver(false);
    setPlatforms([]);
    setBananas([]);
    setCollectedIds(new Set());
    setPlatformsPassed(0);
    setPlayerX(width / 2 - PLAYER_SIZE / 2);
    setPlayerY(GAME_AREA_HEIGHT - 150);
    setVelocityY(0);
    setIsJumping(false);
    
    playerXRef.current = width / 2 - PLAYER_SIZE / 2;
    playerYRef.current = GAME_AREA_HEIGHT - 150;
    velocityYRef.current = 0;
    platformsRef.current = [];
    bananasRef.current = [];

    // Criar plataforma inicial
    const initialPlatform = {
      id: Date.now(),
      x: width / 2 - PLATFORM_WIDTH / 2,
      y: GAME_AREA_HEIGHT - 100,
      hasBanana: false,
    };
    setPlatforms([initialPlatform]);
    platformsRef.current = [initialPlatform];
  };

  // Game loop - física do jogo
  useEffect(() => {
    if (gameActive && !gameOver) {
      gameLoop.current = setInterval(() => {
        // Aplicar gravidade
        let newVelocityY = velocityYRef.current + GRAVITY;
        let newPlayerY = playerYRef.current + newVelocityY;

        // Verificar colisão com plataformas
        let onPlatform = false;
        platformsRef.current.forEach(platform => {
          const playerBottom = newPlayerY + PLAYER_SIZE;
          const playerCenterX = playerXRef.current + PLAYER_SIZE / 2;
          
          // Verifica se está caindo (velocidade positiva)
          if (newVelocityY > 0) {
            // Verifica colisão Y
            if (playerBottom >= platform.y && 
                playerBottom <= platform.y + PLATFORM_HEIGHT + 10) {
              // Verifica colisão X
              if (playerCenterX >= platform.x && 
                  playerCenterX <= platform.x + PLATFORM_WIDTH) {
                onPlatform = true;
                newPlayerY = platform.y - PLAYER_SIZE;
                newVelocityY = 0;
                setIsJumping(false);
              }
            }
          }
        });

        // Coletar bananas
        bananasRef.current.forEach(banana => {
          if (!banana.collected && !collectedIds.has(banana.id)) {
            const distX = Math.abs(
              (playerXRef.current + PLAYER_SIZE / 2) - (banana.x + 20)
            );
            const distY = Math.abs(
              (newPlayerY + PLAYER_SIZE / 2) - (banana.y + 20)
            );
            
            if (distX < 40 && distY < 40) {
              collectBanana(banana.id);
            }
          }
        });

        // Verificar se caiu
        if (newPlayerY > GAME_AREA_HEIGHT) {
          loseLife();
          return;
        }

        setPlayerY(newPlayerY);
        setVelocityY(newVelocityY);
        playerYRef.current = newPlayerY;
        velocityYRef.current = newVelocityY;

        // Mover plataformas para baixo (scroll)
        if (newPlayerY < GAME_AREA_HEIGHT * 0.4) {
          const scrollAmount = (GAME_AREA_HEIGHT * 0.4) - newPlayerY;
          
          setPlatforms(prev => {
            const updated = prev.map(p => ({
              ...p,
              y: p.y + scrollAmount
            })).filter(p => p.y < GAME_AREA_HEIGHT + 50);
            
            platformsRef.current = updated;
            return updated;
          });

          setBananas(prev => {
            const updated = prev.map(b => ({
              ...b,
              y: b.y + scrollAmount
            })).filter(b => b.y < GAME_AREA_HEIGHT + 50);
            
            bananasRef.current = updated;
            return updated;
          });

          setPlayerY(GAME_AREA_HEIGHT * 0.4);
          playerYRef.current = GAME_AREA_HEIGHT * 0.4;

          setPlatformsPassed(prev => {
            const newPassed = prev + 1;
            if (newPassed % 5 === 0) {
              setScore(s => s + 50);
            }
            return newPassed;
          });
        }
      }, 1000 / 60); // 60 FPS
    }

    return () => {
      if (gameLoop.current) clearInterval(gameLoop.current);
    };
  }, [gameActive, gameOver]);

  // Gerar plataformas
  useEffect(() => {
    if (gameActive && !gameOver) {
      platformTimer.current = setInterval(() => {
        generatePlatform();
      }, 1200 - (level * 50));
    }

    return () => {
      if (platformTimer.current) clearInterval(platformTimer.current);
    };
  }, [gameActive, gameOver, level]);

  const generatePlatform = () => {
    const platforms = platformsRef.current;
    
    if (platforms.length < 6) {
      const lastPlatform = platforms[platforms.length - 1];
      const minY = lastPlatform ? lastPlatform.y - 120 : -100;
      
      const hasBanana = Math.random() > 0.5;
      
      const newPlatform = {
        id: Date.now() + Math.random(),
        x: Math.random() * (width - PLATFORM_WIDTH - 40) + 20,
        y: minY,
        hasBanana: hasBanana,
      };

      setPlatforms(prev => [...prev, newPlatform]);
      platformsRef.current = [...platformsRef.current, newPlatform];

      // Adicionar banana se tiver
      if (hasBanana) {
        const newBanana = {
          id: 'banana_' + newPlatform.id,
          x: newPlatform.x + PLATFORM_WIDTH / 2 - 20,
          y: newPlatform.y - 40,
          collected: false,
        };
        setBananas(prev => [...prev, newBanana]);
        bananasRef.current = [...bananasRef.current, newBanana];
      }
    }
  };

  const collectBanana = (bananaId) => {
    setCollectedIds(prev => new Set([...prev, bananaId]));
    
    setBananas(prev => prev.map(b => 
      b.id === bananaId ? { ...b, collected: true } : b
    ));

    setScore(prev => {
      const newScore = prev + 20;
      if (newScore >= level * 150 && level < 10) {
        setLevel(l => l + 1);
      }
      return newScore;
    });
  };

  const jump = () => {
    if (!gameActive || gameOver || isJumping) return;
    
    setVelocityY(JUMP_FORCE);
    velocityYRef.current = JUMP_FORCE;
    setIsJumping(true);
  };

  const moveLeft = () => {
    if (!gameActive || gameOver) return;
    setPlayerX(prev => {
      const newX = Math.max(10, prev - 50);
      playerXRef.current = newX;
      return newX;
    });
  };

  const moveRight = () => {
    if (!gameActive || gameOver) return;
    setPlayerX(prev => {
      const newX = Math.min(width - PLAYER_SIZE - 10, prev + 50);
      playerXRef.current = newX;
      return newX;
    });
  };

  const loseLife = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        endGame();
      } else {
        // Resetar posição
        setPlayerY(GAME_AREA_HEIGHT - 150);
        setPlayerX(width / 2 - PLAYER_SIZE / 2);
        setVelocityY(0);
        playerYRef.current = GAME_AREA_HEIGHT - 150;
        playerXRef.current = width / 2 - PLAYER_SIZE / 2;
        velocityYRef.current = 0;
      }
      return newLives;
    });
  };

  const endGame = () => {
    setGameActive(false);
    setGameOver(true);
    if (gameLoop.current) clearInterval(gameLoop.current);
    if (platformTimer.current) clearInterval(platformTimer.current);

    setTimeout(() => {
      Alert.alert(
        '🐵 Fim de Jogo!',
        `Plataformas: ${platformsPassed}\nBananas: ${Math.floor(score / 20)}🍌\nPontuação: ${score}\nNível: ${level}\n\n${score >= 300 ? '🏆 Macaco Saltador!' : score >= 150 ? '⭐ Muito ágil!' : '💪 Continue treinando!'}`,
        [
          { text: 'Jogar Novamente', onPress: startGame },
          { text: 'Voltar', onPress: () => navigation.goBack() }
        ]
      );
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (gameLoop.current) clearInterval(gameLoop.current);
      if (platformTimer.current) clearInterval(platformTimer.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🐵 Macaco Saltador</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.infoPanel}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>BANANAS</Text>
          <Text style={styles.infoValue}>{Math.floor(score / 20)}🍌</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>PONTOS</Text>
          <Text style={styles.infoValue}>{score}</Text>
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
              <Text style={styles.startTitle}>🐵 Macaco Saltador 🌴</Text>
              <Text style={styles.startDescription}>
                Pule de plataforma em plataforma{'\n'}
                e colete todas as bananas!
              </Text>
              <View style={styles.legendContainer}>
                <Text style={styles.legendTitle}>Como jogar:</Text>
                <Text style={styles.legendItem}>🦘 Toque para PULAR</Text>
                <Text style={styles.legendItem}>↔️ Mova para os lados</Text>
                <Text style={styles.legendItem}>🍌 Colete bananas (+20pts)</Text>
                <Text style={styles.legendItem}>⚠️ Não caia! (-1❤️)</Text>
              </View>
              <TouchableOpacity style={styles.startButton} onPress={startGame}>
                <Text style={styles.startButtonText}>COMEÇAR</Text>
              </TouchableOpacity>
            </View>
          )}

          {gameActive && !gameOver && (
            <View style={styles.gameContent}>
              {/* Plataformas */}
              {platforms.map(platform => (
                <View
                  key={platform.id}
                  style={[
                    styles.platform,
                    {
                      left: platform.x,
                      top: platform.y,
                    },
                  ]}
                >
                  <View style={styles.platformTop} />
                  <View style={styles.platformBody} />
                </View>
              ))}

              {/* Bananas */}
              {bananas.map(banana => (
                !banana.collected && (
                  <View
                    key={banana.id}
                    style={[
                      styles.banana,
                      {
                        left: banana.x,
                        top: banana.y,
                      },
                    ]}
                  >
                    <Text style={styles.bananaEmoji}>🍌</Text>
                  </View>
                )
              ))}

              {/* Jogador */}
              <View
                style={[
                  styles.player,
                  {
                    left: playerX,
                    top: playerY,
                  },
                ]}
              >
                <Text style={styles.playerEmoji}>🐵</Text>
              </View>
            </View>
          )}
        </View>
      </ImageBackground>

      {gameActive && !gameOver && (
        <View style={styles.controls}>
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={[styles.controlButton, styles.moveButton]}
              onPress={moveLeft}
              activeOpacity={0.6}
            >
              <Text style={styles.controlText}>⬅️</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, styles.jumpButton]}
              onPress={jump}
              activeOpacity={0.6}
            >
              <Text style={styles.jumpText}>🦘</Text>
              <Text style={styles.controlLabel}>PULAR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, styles.moveButton]}
              onPress={moveRight}
              activeOpacity={0.6}
            >
              <Text style={styles.controlText}>➡️</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!gameActive && !gameOver && (
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Dicas:</Text>
          <Text style={styles.instructionsText}>
            • Calcule bem seus pulos{'\n'}
            • Mire no centro das plataformas{'\n'}
            • Quanto mais alto, mais pontos!
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
  gameContent: {
    flex: 1,
    position: 'relative',
  },
  platform: {
    position: 'absolute',
    width: PLATFORM_WIDTH,
    height: PLATFORM_HEIGHT,
  },
  platformTop: {
    height: 5,
    backgroundColor: '#8bc34a',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  platformBody: {
    flex: 1,
    backgroundColor: '#5d8a3a',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  banana: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bananaEmoji: {
    fontSize: 35,
  },
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 195, 74, 0.3)',
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#c8e6c9',
  },
  playerEmoji: {
    fontSize: 45,
  },
  controls: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  controlButton: {
    height: 85,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    backgroundColor: '#8bc34a',
    borderColor: '#c8e6c9',
  },
  moveButton: {
    flex: 1,
  },
  jumpButton: {
    flex: 1.5,
  },
  controlText: {
    fontSize: 36,
  },
  jumpText: {
    fontSize: 40,
    marginBottom: 2,
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