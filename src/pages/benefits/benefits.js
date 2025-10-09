import React from 'react';
import { View, FlatList, StyleSheet, Image, Linking } from 'react-native';
import { Card, Text, Title, Paragraph, IconButton } from 'react-native-paper';
import Header from "../../components/Header";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PLATAFORM_IS_IOS } from '../../handler/permissions';

const urlApp = PLATAFORM_IS_IOS ? "https://apps.apple.com/br/app/carboflix/id6670285908" 
  : "https://play.google.com/store/apps/details?id=com.jvm.carboflix&hl=pt_BR";

// Dados de exemplo para os benefícios
const benefitsData = [
    {
        id: '1',
        title: 'Seguro de Vida Bradesco',
        description: 'Seguro de Vida Bradesco para toda familia.',
        image: 'https://uploads-ssl.webflow.com/5cf15975c98bab43ef938175/5cf1a7856e00f52f153348c9_Bradesco%20logo%20round-p-1080.png',
        url: urlApp,
      },
      {
        id: '2',
        title: 'Assistência na Estrada',
        description: 'Suporte em emergências na estrada.',
        image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c0/29/0c/c0290c07-72c2-fbf1-8128-85f9a50b26e8/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/230x0w.webp',
        url: urlApp,
      },
      {
        id: '3',
        title: 'Descarbonização de Motor',
        description: 'Descarbonização de Motor em vários lugares do pais.',
        image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c0/29/0c/c0290c07-72c2-fbf1-8128-85f9a50b26e8/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/230x0w.webp',
        url: urlApp,
      },
      {
        id: '4',
        title: 'Telemedicina',
        description: 'Cuide da sua saúde em qualquer lugar e a qualquer hora .',
        image: 'https://play-lh.googleusercontent.com/PL7U1vrrkg383qh1fu1-UoL5745sm2z4UT4UF6nB5GBAFqceSGUmaXhYLol7SGUbhVdn',
        url: urlApp,
      },
      {
        id: '5',
        title: 'Suporte Psicológico',
        description: 'Suporte piscológico de qualquer lugar que você esteja.',
        image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c0/29/0c/c0290c07-72c2-fbf1-8128-85f9a50b26e8/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/230x0w.webp',
        url: urlApp,
      },
      {
        id: '6',
        title: 'Suporte Contábil',
        description: 'Tive e gerencie sua dúvida contábil a qualquer momento.',
        image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c0/29/0c/c0290c07-72c2-fbf1-8128-85f9a50b26e8/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/230x0w.webp',
        url: urlApp,
      },
      {
        id: '7',
        title: 'Vídeo Aulas',
        description: 'Encontre várias vídeos aulas para aumentar seu conhecimento.',
        image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c0/29/0c/c0290c07-72c2-fbf1-8128-85f9a50b26e8/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/230x0w.webp',
        url: urlApp,
      },
];



// Função para abrir a Play Store
const openPlayStore = (url) => {
    Linking.openURL(url).catch(err => console.error('Erro ao abrir o link:', err));
  };

const BenefitsScreen = () => {

    const insets = useSafeAreaInsets();
  // Função para renderizar cada item da lista
        const renderItem = ({ item }) => (
          <Card style={styles.card} onPress={() => openPlayStore(item.url)}>
            <View style={styles.cardContent}>
              <Image source={{ uri: item.image }} style={styles.image} />
        
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Paragraph style={styles.cardDescription}>{item.description}</Paragraph>
              </View>
        
              <IconButton
                icon="open-in-new"
                color="#4a148c"
                size={20}
                onPress={() => openPlayStore(item.url)}
              />
            </View>
          </Card>
        );

        return (
            <>
              <Header namePage="Benefícios" />

                <View
                  style={{
                    flex: 1,
                    padding: 16,
                    paddingTop: insets.top + 16,
                    paddingBottom: insets.bottom + 100,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    {/* Publicidade */}
                    <View style={styles.cardHeader}>
                      <Text style={styles.adLabel}>Publicidade</Text>
                    </View>

                    {/* Cabeçalho */}
                    <Title style={styles.sectionTitle}>Benefícios disponíveis</Title>
                    <Paragraph style={styles.sectionSubtitle}>
                      Desbloqueie os benefícios 
                    </Paragraph>

                    {/* Lista */}
                    <FlatList
                      data={benefitsData}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id}
                      contentContainerStyle={{ paddingVertical: 8, paddingBottom: 100 }}
                    />
                  </View>
                </View>

            </>
        );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  card: {
    marginBottom: 14,
    borderRadius: 12,
    elevation: 3, // sombra no Android
    backgroundColor: "#fff",
    shadowColor: "#000", // sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 13,
    color: "#666",
  },
  cardHeader: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 6,
    marginBottom: 16,
    alignItems: "center",
  },
  adLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});


export default BenefitsScreen;
