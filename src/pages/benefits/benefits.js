import React from 'react';
import { View, FlatList, StyleSheet, Image, Linking } from 'react-native';
import { Card, Text, Title, Paragraph, IconButton } from 'react-native-paper';
import Header from "../../components/Header";
import { ScrollView } from 'native-base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PLATAFORM_IS_IOS } from '../../handler/permissions';

const urlApp = PLATAFORM_IS_IOS ? "https://apps.apple.com/br/app/carboflix/id6670285908" 
  : "https://play.google.com/store/search?q=carboflix&c=apps";

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
        image: 'https://media.licdn.com/dms/image/v2/D4D0BAQGljb0zwWhNaw/company-logo_200_200/company-logo_200_200/0/1721219018333/carboflix_logo?e=1750291200&v=beta&t=b8v4DxFBtbwZDEZWCzSEKFduHeDHw5iJ0fhnQlvwyWQ',
        url: urlApp,
      },
      {
        id: '3',
        title: 'Descarbonização de Motor',
        description: 'Descarbonização de Motor em vários lugares do pais.',
        image: 'https://media.licdn.com/dms/image/v2/D4D0BAQGljb0zwWhNaw/company-logo_200_200/company-logo_200_200/0/1721219018333/carboflix_logo?e=1750291200&v=beta&t=b8v4DxFBtbwZDEZWCzSEKFduHeDHw5iJ0fhnQlvwyWQ',
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
        image: 'https://media.licdn.com/dms/image/v2/D4D0BAQGljb0zwWhNaw/company-logo_200_200/company-logo_200_200/0/1721219018333/carboflix_logo?e=1750291200&v=beta&t=b8v4DxFBtbwZDEZWCzSEKFduHeDHw5iJ0fhnQlvwyWQ',
        url: urlApp,
      },
      {
        id: '6',
        title: 'Suporte Contábil',
        description: 'Tive e gerencie sua dúvida contábil a qualquer momento.',
        image: 'https://media.licdn.com/dms/image/v2/D4D0BAQGljb0zwWhNaw/company-logo_200_200/company-logo_200_200/0/1721219018333/carboflix_logo?e=1750291200&v=beta&t=b8v4DxFBtbwZDEZWCzSEKFduHeDHw5iJ0fhnQlvwyWQ',
        url: urlApp,
      },
      {
        id: '7',
        title: 'Vídeo Aulas',
        description: 'Encontre várias vídeos aulas para aumentar seu conhecimento.',
        image: 'https://media.licdn.com/dms/image/v2/D4D0BAQGljb0zwWhNaw/company-logo_200_200/company-logo_200_200/0/1721219018333/carboflix_logo?e=1750291200&v=beta&t=b8v4DxFBtbwZDEZWCzSEKFduHeDHw5iJ0fhnQlvwyWQ',
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
            <>

                <Card style={styles.card} onPress={() => openPlayStore(item.url)}>
                    <View style={styles.cardContent}>
                        {/* Ícone pequeno ao lado do texto */}
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.textContainer}>
                          <Title style={styles.title}>{item.title}</Title>
                          <Paragraph>{item.description}</Paragraph>
                        </View>
                        {/* Botão para abrir a Play Store */}
                        <IconButton icon="open-in-new" color="#6200ea" size={20} onPress={() => openPlayStore(item.url)} />
                    </View>
                </Card>
                           
            </>
        );

            return (
                <>
                    <Header namePage="Benefícios" />
                    <View style={{flex: 1, padding: 15, paddingBottom: insets.bottom, justifyContent: 'center' }}>

                        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                        <Title style={styles.sectionTitle}>Benefícios disponíveis</Title>
                          <FlatList data={benefitsData} 
                                renderItem={renderItem} 
                                keyExtractor={(item) => item.id} />
                        </ScrollView>
                    </View>  
                </>
            );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f5f5f5',
    },
    card: {
      marginBottom: 12,
      padding: 10,
    },
    cardContent: {
      flexDirection: 'row', // Deixa a imagem, texto e botão lado a lado
      alignItems: 'center',
    },
    image: {
      width: 50, // Pequena e quadrada
      height: 50,
      borderRadius: 25,
      marginRight: 25,
    },
    textContainer: {
      flex: 1, // Para ocupar o espaço disponível
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default BenefitsScreen;
