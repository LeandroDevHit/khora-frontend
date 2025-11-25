

import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function AnaliseEmocional() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<any>(null);

    // Mapeamento das emoções para português
    const emotionMap: Record<string, string> = {
      happiness: 'Felicidade',
      sadness: 'Tristeza',
      neutral: 'Neutro',
      disgust: 'Nojo',
      fear: 'Medo',
      anger: 'Raiva',
      surprise: 'Surpresa'
    };

    // Função para registrar humor manual (emoji)
    const handleRegisterEmojiMood = async (emoji: string) => {
      setLoading(true);
      try {
        await fetch('http://192.168.15.8:3000/api/mood', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mood: emoji,
            origin: 'manual',
          }),
        });
        setEmotion(`Humor registrado: ${emoji}`);
      } catch (err) {
        let errorMsg = '';
        if (err instanceof Error) {
          errorMsg = err.message;
        } else if (typeof err === 'object') {
          errorMsg = JSON.stringify(err);
        } else {
          errorMsg = String(err);
        }
        setEmotion('Erro ao registrar humor manual: ' + errorMsg);
      }
      setLoading(false);
    };
  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
    if (status === "granted") setShowCamera(true);
    else Alert.alert("Permissão negada", "A câmera é necessária para análise facial.");
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.3 });
        // Upload para imgbb
        const imgbbKey = '14297fccfed107c09da9fb3d7a4dc609';
        let base64Clean = photo.base64;
        if (base64Clean.startsWith('data:image')) {
          base64Clean = base64Clean.substring(base64Clean.indexOf(',') + 1);
        }
        const imgbbBody = `key=${imgbbKey}&image=${encodeURIComponent(base64Clean)}`;
        const imgbbRes = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: imgbbBody,
        });
        const imgbbJson = await imgbbRes.json();
        console.log('imgbb response:', imgbbJson);
        if (!imgbbJson.success || !imgbbJson.data || !imgbbJson.data.url) {
          setEmotion('Erro ao fazer upload da imagem: ' + JSON.stringify(imgbbJson));
          setLoading(false);
          setShowCamera(false);
          return;
        }
        const imageUrl = imgbbJson.data.url;
        // Exibir URL para depuração
        setEmotion('URL da imagem: ' + imageUrl);
        // Chamada Face++
        const apiUrl = 'https://api-us.faceplusplus.com/facepp/v3/detect';
        const apiKey = 'u30rAPj4DBfptz8YCaYqy4v6CnvxVqOk';
        const apiSecret = 'i1R9sngj2vKc2TbLLBL4CbYeIFd1UMhd';
        const formData = new FormData();
        formData.append('api_key', apiKey);
        formData.append('api_secret', apiSecret);
        formData.append('image_url', imageUrl);
        formData.append('return_attributes', 'emotion');
        const response = await fetch(apiUrl, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setEmotion('Face++ response: ' + JSON.stringify(data, null, 2));
        if (data.faces && data.faces.length > 0 && data.faces[0].attributes && data.faces[0].attributes.emotion) {
          const emotions = data.faces[0].attributes.emotion as Record<string, number>;
          const sorted = Object.entries(emotions).sort((a, b) => b[1] - a[1]);
          const [emotionName, emotionScore] = sorted[0];
            const emotionPt = Object.prototype.hasOwnProperty.call(emotionMap, emotionName.toLowerCase())
              ? emotionMap[emotionName.toLowerCase()]
              : emotionName;
          setEmotion(`${emotionPt} (${emotionScore.toFixed(1)}%)`);
        } else {
          setEmotion('Não foi possível identificar emoção. Face++: ' + JSON.stringify(data, null, 2));
        }
      }
    } catch (err) {
      let errorMsg = '';
      if (err && typeof err === 'object' && 'message' in err) {
        errorMsg = (err as any).message + ((err as any).stack ? '\n' + (err as any).stack : '');
      } else if (typeof err === 'object') {
        errorMsg = JSON.stringify(err, null, 2);
      } else {
        errorMsg = String(err);
      }
      setEmotion('Erro na análise: ' + errorMsg);
    }
    setLoading(false);
    setShowCamera(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Análise Facial de Emoções</Text>
        <Text style={styles.subtitle}>Utilize a câmera para identificar sua emoção atual</Text>

        <View style={styles.warningBox}>
          <Ionicons name="information-circle-outline" size={22} color="#F59E0B" style={{marginRight: 8}} />
          <Text style={styles.warningText}>
            Nenhuma imagem é salva. O reconhecimento é feito apenas no seu dispositivo.
          </Text>
        </View>

        <View style={styles.warningBox}>
          <Ionicons name="alert-circle-outline" size={22} color="#EF4444" style={{marginRight: 8}} />
          <Text style={styles.warningText}>
            Mantenha o rosto centralizado e bem iluminado para melhores resultados.
          </Text>
        </View>

        {showCamera && hasPermission ? (
          <View style={styles.cameraWrapperModern}>
            <View style={styles.cameraContainerModern}>
              <CameraView
                ref={cameraRef}
                style={styles.cameraModern}
                facing="front"
                ratio="1:1"
              />
            </View>
            <TouchableOpacity
              style={styles.captureButtonModern}
              onPress={handleAnalyze}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#3B82F6" />
              ) : (
                <Ionicons name="camera" size={36} color="#FFF" />
              )}
            </TouchableOpacity>
            <Text style={styles.captureLabelModern}>Capturar e Analisar Emoção</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.openCameraButton} onPress={requestPermission}>
            <Ionicons name="camera-outline" size={22} color="#3B82F6" style={{marginRight: 8}} />
            <Text style={styles.openCameraText}>Abrir Câmera</Text>
          </TouchableOpacity>
        )}

        {emotion && !showCamera && (
          <View style={styles.resultBox}>
            <Ionicons name="sparkles-outline" size={28} color="#10B981" style={{marginBottom: 6}} />
            <Text style={styles.resultText}>Emoção detectada / Log:</Text>
            <ScrollView style={{ maxHeight: 200, width: '100%' }}>
              <Text style={styles.resultEmotion}>{emotion}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.tryAgainButton} onPress={() => { setEmotion(null); setShowCamera(false); }}>
              <Ionicons name="refresh" size={18} color="#3B82F6" style={{marginRight: 4}} />
              <Text style={styles.tryAgainText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 18,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  warningText: {
    color: "#92400E",
    fontSize: 13,
    flex: 1,
  },
  // Novo design da câmera
  cameraWrapperModern: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  cameraContainerModern: {
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  cameraModern: {
    width: 280,
    height: 280,
  },
  captureButtonModern: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  captureLabelModern: {
    marginTop: 12,
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '600',
    textAlign: 'center',
  },
  openCameraButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E7FF",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 36,
    marginBottom: 16,
  },
  openCameraText: {
    color: "#3B82F6",
    fontWeight: "700",
    fontSize: 16,
  },
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 18,
  },
  analyzeButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  resultBox: {
    marginTop: 32,
    backgroundColor: "#ECFDF5",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  resultText: {
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  resultEmotion: {
    fontSize: 28,
    fontWeight: "700",
    color: "#10B981",
    marginBottom: 10,
    textAlign: "center",
  },
  tryAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#E0E7FF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  tryAgainText: {
    color: "#3B82F6",
    fontWeight: "700",
    fontSize: 15,
  },
});
