import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Dimensions,
  StatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');

const LoadingScreen = ({ navigation }) => {
  // Múltiplas animações
  const spinValue = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const slideUpAnim = new Animated.Value(50);
  const pulseAnim = new Animated.Value(1);
  const progressAnim = new Animated.Value(0); // Nova animação para a barra de progresso

  useEffect(() => {
    // Animação do spinner
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animação de fade-in sequencial
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // IMPORTANTE: false para animações de width
      })
    ]).start();

    // Animação de pulso contínuo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ])
    ).start();

    // Navegação após 3 segundos
    const timer = setTimeout(() => {
      navigation.replace('BemVindo');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, spinValue, fadeAnim, scaleAnim, slideUpAnim, pulseAnim, progressAnim]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg']
  });

  // Interpolação para a barra de progresso (sem useNativeDriver)
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2d004d" barStyle="light-content" />
      
      {/* Fundo com gradiente fixo */}
      <View style={styles.background} />
      
      {/* Partículas flutuantes */}
      <View style={styles.particles}>
        {[...Array(15)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: Math.random() * 0.6 + 0.2,
                transform: [
                  { 
                    scale: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [1, Math.random() * 0.5 + 0.8]
                    }) 
                  }
                ]
              }
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        {/* Logo com múltiplas animações */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideUpAnim }
              ]
            }
          ]}
        >
          <Animated.View style={[styles.logoGlow, { transform: [{ scale: pulseAnim }] }]} />
          <Image
            source={require('../assets/logotmp.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        
        {/* Texto com animação */}
        <Animated.View 
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim }
              ]
            }
          ]}
        >
          <Text style={styles.title}>Carregando</Text>
          <Animated.Text 
            style={[
              styles.animatedDots,
              { opacity: pulseAnim }
            ]}
          >
            ...
          </Animated.Text>
        </Animated.View>
        
        {/* Spinner personalizado */}
        <Animated.View style={[styles.spinnerContainer, { transform: [{ rotate: spin }] }]}>
          <View style={styles.spinnerOuter}>
            <View style={styles.spinnerInner} />
          </View>
        </Animated.View>

        {/* Barra de progresso - SEM useNativeDriver */}
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              { width: progressWidth } // Agora funciona porque useNativeDriver é false
            ]} 
          />
        </View>
        
        {/* Texto subtítulo */}
        <Animated.Text 
          style={[
            styles.subtitle,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim }
              ]
            }
          ]}
        >
          Preparando uma experiência incrível
        </Animated.Text>
      </View>
      
      {/* Footer premium */}
      <Animated.View 
        style={[
          styles.footer,
          {
            opacity: fadeAnim
          }
        ]}
      >
        <Text style={styles.footerText}>✨ Premium Experience ✨</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d004d',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2d004d',
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d8b4fe',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  logoGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    backgroundColor: '#8b5cf6',
    borderRadius: 100,
    opacity: 0.3,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
    shadowColor: '#c4b5fd',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  animatedDots: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d8b4fe',
    marginLeft: 5,
  },
  spinnerContainer: {
    marginBottom: 30,
  },
  spinnerOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(216, 180, 254, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderLeftColor: '#d8b4fe',
    borderTopColor: '#a78bfa',
    borderRightColor: '#8b5cf6',
    borderBottomColor: '#7c3aed',
    transform: [{ rotate: '45deg' }],
  },
  progressContainer: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 30,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#d8b4fe',
    borderRadius: 2,
    shadowColor: '#d8b4fe',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    padding: 25,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default LoadingScreen;