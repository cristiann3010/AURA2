import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  StatusBar
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

export default function Scan() {
  const navigation = useNavigation();
  const [facing, setFacing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [isUrl, setIsUrl] = useState(false);

  useEffect(() => {
    const initializeCamera = async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    };
    initializeCamera();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      setScannedData(data);
      const urlCheck =
        data.toLowerCase().startsWith('http://') ||
        data.toLowerCase().startsWith('https://');
      setIsUrl(urlCheck);
    }

    if (data.toLowerCase().includes("furry1")) {
      navigation.navigate("furry1");
      return;
    }

    if (data.toLowerCase().includes("furry2")) {
      navigation.navigate("furry2");
      return;
    }

    if (data.toLowerCase().includes("furry3")) {
      navigation.navigate("furry3");
      return;
    }

    if (!data.toLowerCase().includes("furry")) {
      processScannedData(data, type, isUrl);
    }
  };

  const processScannedData = (data, type, isUrl) => {
    console.log('QR Code escaneado:', { type, data, isUrl });

    if (isUrl) {
      Alert.alert(
        "🌐 URL Encontrada!",
        `Site: ${data}\n\nDeseja abrir este site?`,
        [
          {
            text: "Escanear Outra",
            onPress: () => resetScanner(),
            style: "cancel"
          },
          {
            text: "Abrir Site",
            onPress: () => openWebsite(data)
          }
        ]
      );
    } else {
      Alert.alert(
        "📄 Conteúdo Escaneado",
        `Conteúdo: ${data}\n\nTipo: ${type}`,
        [
          {
            text: "OK",
            onPress: () => resetScanner()
          }
        ]
      );
    }
  };

  const openWebsite = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Erro", "Não foi possível abrir este link.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o site.");
      console.error('Erro ao abrir URL:', error);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    setCameraReady(false);
  };

  const handleCameraReady = () => {
    setCameraReady(true);
  };

  const resetScanner = () => {
    setScanned(false);
    setScannedData(null);
    setIsUrl(false);
    setCameraReady(false);
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#b366ff" />
        <Text style={styles.text}>Solicitando permissão da câmera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Permissão da Câmera</Text>
        <Text style={styles.text}>
          Precisamos acessar sua câmera para escanear QR Codes
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir Acesso à Câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2d004d" barStyle="light-content" />
      
      {/* HEADER - FIXA NO TOPO */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Escanear QR Code</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      {/* CONTEÚDO PRINCIPAL */}
      <View style={styles.content}>
        {/* CAMERA */}
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={facing}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417", "datamatrix", "code128"],
            }}
            onCameraReady={handleCameraReady}
          />
          
          {/* OVERLAYS (fora da câmera) */}
          {!cameraReady && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#b366ff" />
              <Text style={styles.loadingText}>Inicializando câmera...</Text>
            </View>
          )}

          <View style={styles.overlay}>
            <View style={styles.unfocusedContainer} />

            <View style={styles.middleContainer}>
              <View style={styles.unfocusedContainer} />
              <View style={styles.scanFrame}>
                <View style={styles.cornerTopLeft} />
                <View style={styles.cornerTopRight} />
                <View style={styles.cornerBottomLeft} />
                <View style={styles.cornerBottomRight} />

                {cameraReady && !scanned && (
                  <View style={styles.scanLine} />
                )}
              </View>
              <View style={styles.unfocusedContainer} />
            </View>

            <View style={styles.unfocusedContainer} />
          </View>

          {scanned && (
            <View style={styles.scanStatus}>
              <Text style={styles.scanStatusText}>
                {isUrl ? '🌐 URL Encontrada' : '✓ QR Code Escaneado'}
              </Text>
            </View>
          )}
        </View>

        {/* RESULTADO */}
        <View style={styles.scannedDataContainer}>
          <Text style={styles.scannedDataLabel}>
            {scanned ? "Conteúdo escaneado:" : "Aponte para um QR Code"}
          </Text>
          {scanned && (
            <Text style={styles.scannedDataText} numberOfLines={2}>
              {scannedData}
            </Text>
          )}
        </View>

        {/* BOTÃO SITE */}
        {scanned && isUrl && (
          <View style={styles.websiteButtonContainer}>
            <TouchableOpacity
              style={styles.websiteButton}
              onPress={() => openWebsite(scannedData)}
            >
              <Text style={styles.websiteButtonIcon}>🌐</Text>
              <Text style={styles.websiteButtonText}>Abrir Site no Navegador</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CONTROLES */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, scanned && styles.disabledButton]}
            onPress={toggleCameraFacing}
            disabled={scanned}
          >
            <Text
              style={[
                styles.controlButtonText,
                scanned && styles.disabledText
              ]}
            >
              {facing === 'back' ? ' Frente' : ' Trás'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={resetScanner}>
            <Text style={styles.controlButtonText}>
              {scanned ? '🔄 Escanear Novamente' : ' Escanear'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0033',
  },
  safeArea: {
    backgroundColor: '#2d004d',
  },
  // HEADER FIXA NO TOPO - SEM MARGEM
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
    // ✅ REMOVIDA A MARGEM QUE CAUSAVA PROBLEMAS
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
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a0033',
    padding: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 0, 51, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#e6ccff',
    marginTop: 10,
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(45, 0, 77, 0.7)',
  },
  middleContainer: {
    flexDirection: 'row',
    flex: 1.5,
  },
  scanFrame: {
    flex: 6,
    borderWidth: 2,
    borderColor: 'rgba(230, 204, 255, 0.3)',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#b366ff',
  },
  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#b366ff',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#b366ff',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#b366ff',
  },
  scanLine: {
    height: 2,
    backgroundColor: '#b366ff',
    width: '100%',
    position: 'absolute',
    top: '50%',
    shadowColor: '#b366ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  scanStatus: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(179, 102, 255, 0.9)',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    zIndex: 20,
  },
  scanStatusText: {
    color: '#1a0033',
    fontWeight: 'bold',
    fontSize: 18,
  },
  scannedDataContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannedDataLabel: {
    color: '#e6ccff',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 60,
  },
  scannedDataText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(179, 102, 255, 0.2)',
    padding: 15,
    borderRadius: 15,
    width: '90%',
  },
  websiteButtonContainer: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    alignItems: 'center',
  },
  websiteButton: {
    backgroundColor: '#b366ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e6ccff',
    shadowColor: '#b366ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    minWidth: width * 0.7,
  },
  websiteButtonIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  websiteButtonText: {
    color: '#1a0033',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 20,
    marginBottom: 80,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#b366ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#b366ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 60,
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: '#4d0099',
    opacity: 0.7,
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledText: {
    color: '#e6ccff',
  },
  text: {
    color: '#e6ccff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#b366ff',
    padding: 20,
    borderRadius: 15,
    marginVertical: 15,
    minWidth: width * 0.6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#c966ff',
    shadowColor: '#b366ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  buttonText: {
    color: '#1a0033',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});