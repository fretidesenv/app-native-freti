
// import React, { useState, useEffect } from "react";
// import { View, Text, ScrollView, TouchableOpacity } from "react-native";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import { launchCamera, launchImageLibrary } from "react-native-image-picker";
// import firestore from "@react-native-firebase/firestore";

// import Ionicons from "react-native-vector-icons/Ionicons";
// import storage from "@react-native-firebase/storage";
// import {
//   BtnSaveRegisterEvent,
//   Container,
//   Input,
//   Label,
//   Line,
//   TextBtnSaveRegister,
//   UploadButton,
//   Image,
//   InputSearch,
//   ButtonSelectEvent,
// } from "./styles";
// import { Content, Select, Item, Modal, VStack } from "native-base";
// import Header from "../../components/Header";
// import Feather from "react-native-vector-icons/Feather";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// export default function FreightInformEvent({ route }) {
//   const navigation = useNavigation();
//   const [eventRegister, setEventRegister] = useState(null);
//   const [descEventRegister, setDescEventRegister] = useState("");
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [urlImage, setUrlImage] = useState("");
//   const [showModalBank, setShowModalBank] = useState(false);

  // const type_events = [
  //   { cod: 1, desc: "Entrega Realizada Normalmente" },
  //   { cod: 2, desc: "Entrega Fora da Data Programada" },
  //   { cod: 3, desc: "Recusa por Falta de Pedido de Compra" },
  //   { cod: 4, desc: "Recusa por Pedido de Compra Cancelado" },
  //   { cod: 5, desc: "Falta de Espaço Físico no Depósito do Cliente Destino" },
  //   { cod: 6, desc: "Endereço do Cliente Destino não Localizado" },
  //   { cod: 7, desc: "Devolução não Autorizada pelo Cliente" },
  //   { cod: 8, desc: "Preço Mercadoria em Desacordo com o Pedido Compra" },
  //   { cod: 9, desc: "Mercadoria em Desacordo com o Pedido Compra" },
  //   {
  //     cod: 10,
  //     desc: "Cliente Destino somente Recebe Mercadoria com Frete Pago",
  //   },
  //   { cod: 11, desc: "Recusa por Deficiência Embalagem Mercadoria" },
  //   { cod: 12, desc: "Redespacho não Indicado" },
  //   { cod: 13, desc: "Transportadora não Atende a Cidade do Cliente Destino" },
  //   { cod: 14, desc: "Mercadoria Sinistrada" },
  //   { cod: 15, desc: "Embalagem Sinistrada" },
  //   { cod: 16, desc: "Pedido de Compras em Duplicidade" },
  //   { cod: 17, desc: "Mercadoria fora da Embalagem de Atacadista" },
  //   { cod: 18, desc: "Mercadorias Trocadas" },
  //   { cod: 19, desc: "Reentrega Solicitada pelo Cliente" },
  //   { cod: 20, desc: "Entrega Prejudicada por Horário/Falta de Tempo Hábil" },
  //   { cod: 21, desc: "Estabelecimento Fechado" },
  //   { cod: 22, desc: "Reentrega sem Cobrança do Cliente" },
  //   { cod: 23, desc: "Extravio de Mercadoria em Trânsito" },
  //   { cod: 24, desc: "Mercadoria Reentregue ao Cliente Destino" },
  //   { cod: 25, desc: "Mercadoria Devolvida ao cliente Origem de Origem" },
  //   { cod: 26, desc: "Nota Fiscal Retida pela Fiscalização" },
  //   { cod: 27, desc: "Roubo de Carga" },
  //   { cod: 28, desc: "Mercadoria Retida até Segunda Ordem" },
  //   { cod: 29, desc: "Cliente Retira Mercadoria na Transportadora" },
  //   { cod: 30, desc: "Problema com a Documentação (Nota Fiscal / CTRC)" },
  //   { cod: 31, desc: "Entrega com Indenização Efetuada" },
  //   { cod: 32, desc: "Falta com Solicitação de Reposição" },
  //   { cod: 33, desc: "Falta com Busca/Reconferência" },
  //   { cod: 34, desc: "Cliente Fechado para Balanço" },
  //   {
  //     cod: 35,
  //     desc: "Quantidade de Produto em Desacordo (Nota Fiscal e/ou Pedido)",
  //   },
  //   { cod: 41, desc: "Pedido de Compra Incompleto" },
  //   { cod: 42, desc: "Nota Fiscal com Produtos de Setores Diferentes" },
  //   { cod: 43, desc: "Feriado Local/Nacional" },
  //   { cod: 44, desc: "Excesso de Veículos" },
  //   { cod: 45, desc: "Cliente Destino Encerrou Atividades" },
  //   { cod: 46, desc: "Responsável de Recebimento Ausente" },
  //   { cod: 47, desc: "Cliente Destino em Greve" },
  //   { cod: 50, desc: "Greve nacional (greve geral)" },
  //   { cod: 65, desc: "Entrar em Contato com o Comprador" },
  //   { cod: 66, desc: "Troca não Disponível" },
  //   { cod: 67, desc: "Fins Estatísticos" },
  //   { cod: 68, desc: "Data de Entrega Diferente do Pedido" },
  //   { cod: 69, desc: "Substituição Tributária" },
  //   { cod: 70, desc: "Sistema Fora do Ar" },
  //   { cod: 71, desc: "Cliente Destino não Recebe Pedido Parcial" },
  //   { cod: 72, desc: "Cliente Destino só Recebe Pedido Parcial" },
  //   { cod: 73, desc: "Redespacho somente com Frete Pago" },
  //   { cod: 74, desc: "Funcionário não autorizado a Receber Mercadorias" },
  //   { cod: 75, desc: "Mercadoria Embarcada para Rota Indevida" },
  //   { cod: 76, desc: "Estrada/Entrada de Acesso Interditada" },
  //   { cod: 77, desc: "Cliente Destino Mudou de Endereço" },
  //   { cod: 78, desc: "Avaria Total" },
  //   { cod: 79, desc: "Avaria Parcial" },
  //   { cod: 80, desc: "Extravio Total" },
  //   { cod: 81, desc: "Extravio Parcial" },
  //   { cod: 82, desc: "Sobra de Mercadoria sem Nota Fiscal" },
  //   { cod: 83, desc: "Mercadoria em poder da SUFRAMA para Internação" },
  //   { cod: 84, desc: "Mercadoria Retirada para Conferência" },
  //   { cod: 85, desc: "Apreensão Fiscal da Mercadoria" },
  //   { cod: 86, desc: "Excesso de Carga/Peso" },
  //   { cod: 91, desc: "Entrega Programada" },
  //   { cod: 92, desc: "Problemas Fiscais" },
  //   { cod: 99, desc: "Outros tipos de ocorrências não especificados acima" },
  // ];
//   const [eventsListFiltered, setEventsListFiltered] = useState(type_events); //lista apos o filtro
//   const [searchEvents, setSearchEvents] = useState("");

//   const handleRegisterEvent = async () => {
//     let imageURL_ = null;
//     if (selectedImage) {
//       console.log("oi");
//       imageURL_ = await uploadFileFirebase();
//     }

//     console.log("imageURL_", imageURL_);
//     const eventDetails = {
//       event: eventRegister,
//       description: descEventRegister,
//       imageURL: imageURL_ ? imageURL_ : null,
//       created_at: new Date(),
//     };

//     await firestore()
//       .collection("freight")
//       .doc(route?.params?.idFreight)
//       .collection("stopping_points")
//       .doc(route?.params?.stoppgingPoint.id)
//       .update({
//         events: firestore.FieldValue.arrayUnion(eventDetails),
//       })
//       .then(() => {
//         navigation.goBack();
//         console.log("ok");
//       })
//       .catch((error) => console.log("err", error));
//   };

//   const openCamera = () => {
//     const options = {
//       mediaType: "photo",
//     };
//     launchCamera(options, (response) => {
//       if (!response.didCancel && !response.error) {
//         setSelectedImage(response);
//       }
//     });
//   };

//   const openGallery = () => {
//     const options = {
//       mediaType: "photo",
//     };
//     launchImageLibrary(options, (response) => {
//       if (!response.didCancel && !response.error) {
//         setSelectedImage(response);
//       }
//     });
//   };

//   const getFileLocalPath = (response) => {
//     // extrair e retornar a url da foto.
//     return response.assets[0].uri;
//   };

//   const uploadFileFirebase = async () => {
//     let name = new Date().toString();
//     const fileSource = getFileLocalPath(selectedImage);
//     const storageRef = storage()
//       .ref(
//         `freight/${route?.params?.idFreight}/stoppingPoints/${route?.params?.stoppgingPoint.id}`
//       )
//       .child(name);
//     await storageRef.putFile(fileSource);

//     let image = await storageRef.getDownloadURL();
//     setUrlImage(image);
//     return image;
//   };

//   const searchFilterEvents = (text) => {
//     if (text) {
//       const newData = eventsListFiltered?.filter(function (item) {
//         let content = `${item.cod} - ${item?.desc}`;
//         if (content) {
//           const itemData = content?.toUpperCase();
//           const textData = text?.toUpperCase();
//           return itemData?.indexOf(textData) > -1;
//         }
//       });
//       setEventsListFiltered(newData);
//       setSearchEvents(text);
//     } else {
//       setEventsListFiltered(type_events);
//       setSearchEvents(text);
//     }
//   };

//   return (
//     <Container>
//       <Header namePage="Detalhes do frete / Informar evento" />
//       <ScrollView style={{ padding: 10 }}>
//         {/* Select para o evento */}
//         {/* <Select
//           selectedValue={eventRegister}
//           minWidth="200"
//           accessibilityLabel="Selecione o evento"
//           placeholder="Selecione o evento"
//           _selectedItem={{
//             bg: "muted.300",
//           }}
//           mt={1}
//           onValueChange={(itemValue) => setEventRegister(itemValue)}
//         >
//           <Select.Item label="Avaria" value="avaria" />
//           <Select.Item label="Cliente Recusou" value="cliente_recusou" />
//           <Select.Item
//             label="Endereço não localizado"
//             value="endereco_nao_localizado"
//           />
//           <Select.Item
//             label="Entrega prejudicada por ausência de recebedor"
//             value="entrega_prejudicada_por_ausencia"
//           />
//           <Select.Item label="Entrega Cancelada" value="entrega_cancelada" />
//           <Select.Item label="Extravio" value="extravio" />
//           <Select.Item label="Local fechado" value="local_fechado" />
//         </Select> */}

//         <TouchableOpacity
//           style={{
//             marginTop: 5,
//             padding: 0,
            
//           }}
//           onPress={() => setShowModalBank(true)}
//         >
//           <Text style={{color: 'rgb(50,50,50)'}}> 
//             <Label>Selecione o evento:</Label>{" "}
//             {eventRegister !== null ? (
//               `${eventRegister?.cod} - ${eventRegister?.desc}`
//             ) : (
//               <>
//                 Listar eventos
//                 <Ionicons
//                   name="chevron-down"
//                   color={"rgb(50,50,50)"}
//                   size={15}
//                 />
//               </>
//             )}
//           </Text>
//         </TouchableOpacity>

//         <Modal
//           isOpen={showModalBank}
//           onClose={() => setShowModalBank(false)}
//           size="lg"
//         >
//           <Modal.Content maxHeight="450">
//             <Modal.CloseButton />
//             <Modal.Header>
//               Busque o evento pelo nome
//               <InputSearch
//                 style={{ textTransform: "uppercase" }}
//                 onChangeText={(text) => searchFilterEvents(text)}
//                 value={null}
//                 placeholderTextColor="#94A3B8"
//                 underlineColorAndroid="transparent"
//                 placeholder="Procure aqui"
//               />
//             </Modal.Header>
//             <Modal.Body>
//               <VStack space={3}>
//                 {eventsListFiltered?.map((item, index) => (
//                   <ButtonSelectEvent
//                     key={index}
//                     onPress={() => {
//                       setEventRegister(item);
//                       setShowModalBank(false);
//                     }}
//                   >
//                     <Text style={{ color: "rgb(50,50,50)" }}>
//                       {item?.cod} - {item?.desc}
//                     </Text>
//                     <Line />
//                   </ButtonSelectEvent>
//                 ))}
//               </VStack>
//             </Modal.Body>
//           </Modal.Content>
//         </Modal>

//         <Line />
//         {/* Descrição do evento */}
//         <Label>Descreva o evento ocorrido:</Label>
//         <Input
//           multiline
//           placeholder="Descreva os detalhes do evento ocorrido aqui neste campo..."
//           value={descEventRegister}
//           onChangeText={(text) => setDescEventRegister(text)}
//         />

//         <Line />
//         <Label>Se possível, anexe uma foto:</Label>
//         <View style={{ flexDirection: "row" }}>
//           {/* Botões para abrir a câmera e a galeria */}
//           <UploadButton
//             style={{ marginBottom: 2.5 }}
//             onPress={
//               () => openCamera()
//               //setShowModal(true)
//             }
//           >
//             <Feather name="camera" size={22} color="#121212" />
//           </UploadButton>
//           <UploadButton
//             style={{ marginTop: 2.5 }}
//             onPress={() => openGallery()}
//           >
//             <MaterialIcons name="photo-library" size={22} color="#121212" />
//           </UploadButton>
//         </View>
//         {/* Mostra a imagem selecionada */}
//         {selectedImage && (
//           <View>
//             <Text>Imagem selecionada:</Text>
//             <Image
//               source={{
//                 uri: selectedImage ? getFileLocalPath(selectedImage) : "",
//               }}
//               style={{ width: 200, height: 200 }}
//             />
//           </View>
//         )}

//         {/* Botão para registrar o evento */}
//         <Line />
//         <BtnSaveRegisterEvent
//           onPress={() => {
//             handleRegisterEvent();
//           }}
//         >
//           <TextBtnSaveRegister>Registrar Evento</TextBtnSaveRegister>
//         </BtnSaveRegisterEvent>
//       </ScrollView>
//     </Container>
//   );
// }


  import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  BtnSaveRegisterEvent,
  Container,
  Input,
  Label,
  Line,
  TextBtnSaveRegister,
  UploadButton,
  Image,
  InputSearch,
  ButtonSelectEvent,
} from "./styles";
import { Modal, VStack } from "native-base";
import Header from "../../components/Header";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { PermissionsHandler } from "../../handler/permissions";

export default function FreightInformEvent({ route }) {
  const navigation = useNavigation();
  const [eventRegister, setEventRegister] = useState(null);
  const [descEventRegister, setDescEventRegister] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [showModalBank, setShowModalBank] = useState(false);

  const type_events = [
    { cod: 1, desc: "Entrega Realizada Normalmente" },
    { cod: 2, desc: "Entrega Fora da Data Programada" },
    { cod: 3, desc: "Recusa por Falta de Pedido de Compra" },
    { cod: 4, desc: "Recusa por Pedido de Compra Cancelado" },
    { cod: 5, desc: "Falta de Espaço Físico no Depósito do Cliente Destino" },
    { cod: 6, desc: "Endereço do Cliente Destino não Localizado" },
    { cod: 7, desc: "Devolução não Autorizada pelo Cliente" },
    { cod: 8, desc: "Preço Mercadoria em Desacordo com o Pedido Compra" },
    { cod: 9, desc: "Mercadoria em Desacordo com o Pedido Compra" },
    {
      cod: 10,
      desc: "Cliente Destino somente Recebe Mercadoria com Frete Pago",
    },
    { cod: 11, desc: "Recusa por Deficiência Embalagem Mercadoria" },
    { cod: 12, desc: "Redespacho não Indicado" },
    { cod: 13, desc: "Transportadora não Atende a Cidade do Cliente Destino" },
    { cod: 14, desc: "Mercadoria Sinistrada" },
    { cod: 15, desc: "Embalagem Sinistrada" },
    { cod: 16, desc: "Pedido de Compras em Duplicidade" },
    { cod: 17, desc: "Mercadoria fora da Embalagem de Atacadista" },
    { cod: 18, desc: "Mercadorias Trocadas" },
    { cod: 19, desc: "Reentrega Solicitada pelo Cliente" },
    { cod: 20, desc: "Entrega Prejudicada por Horário/Falta de Tempo Hábil" },
    { cod: 21, desc: "Estabelecimento Fechado" },
    { cod: 22, desc: "Reentrega sem Cobrança do Cliente" },
    { cod: 23, desc: "Extravio de Mercadoria em Trânsito" },
    { cod: 24, desc: "Mercadoria Reentregue ao Cliente Destino" },
    { cod: 25, desc: "Mercadoria Devolvida ao cliente Origem de Origem" },
    { cod: 26, desc: "Nota Fiscal Retida pela Fiscalização" },
    { cod: 27, desc: "Roubo de Carga" },
    { cod: 28, desc: "Mercadoria Retida até Segunda Ordem" },
    { cod: 29, desc: "Cliente Retira Mercadoria na Transportadora" },
    { cod: 30, desc: "Problema com a Documentação (Nota Fiscal / CTRC)" },
    { cod: 31, desc: "Entrega com Indenização Efetuada" },
    { cod: 32, desc: "Falta com Solicitação de Reposição" },
    { cod: 33, desc: "Falta com Busca/Reconferência" },
    { cod: 34, desc: "Cliente Fechado para Balanço" },
    {
      cod: 35,
      desc: "Quantidade de Produto em Desacordo (Nota Fiscal e/ou Pedido)",
    },
    { cod: 41, desc: "Pedido de Compra Incompleto" },
    { cod: 42, desc: "Nota Fiscal com Produtos de Setores Diferentes" },
    { cod: 43, desc: "Feriado Local/Nacional" },
    { cod: 44, desc: "Excesso de Veículos" },
    { cod: 45, desc: "Cliente Destino Encerrou Atividades" },
    { cod: 46, desc: "Responsável de Recebimento Ausente" },
    { cod: 47, desc: "Cliente Destino em Greve" },
    { cod: 50, desc: "Greve nacional (greve geral)" },
    { cod: 65, desc: "Entrar em Contato com o Comprador" },
    { cod: 66, desc: "Troca não Disponível" },
    { cod: 67, desc: "Fins Estatísticos" },
    { cod: 68, desc: "Data de Entrega Diferente do Pedido" },
    { cod: 69, desc: "Substituição Tributária" },
    { cod: 70, desc: "Sistema Fora do Ar" },
    { cod: 71, desc: "Cliente Destino não Recebe Pedido Parcial" },
    { cod: 72, desc: "Cliente Destino só Recebe Pedido Parcial" },
    { cod: 73, desc: "Redespacho somente com Frete Pago" },
    { cod: 74, desc: "Funcionário não autorizado a Receber Mercadorias" },
    { cod: 75, desc: "Mercadoria Embarcada para Rota Indevida" },
    { cod: 76, desc: "Estrada/Entrada de Acesso Interditada" },
    { cod: 77, desc: "Cliente Destino Mudou de Endereço" },
    { cod: 78, desc: "Avaria Total" },
    { cod: 79, desc: "Avaria Parcial" },
    { cod: 80, desc: "Extravio Total" },
    { cod: 81, desc: "Extravio Parcial" },
    { cod: 82, desc: "Sobra de Mercadoria sem Nota Fiscal" },
    { cod: 83, desc: "Mercadoria em poder da SUFRAMA para Internação" },
    { cod: 84, desc: "Mercadoria Retirada para Conferência" },
    { cod: 85, desc: "Apreensão Fiscal da Mercadoria" },
    { cod: 86, desc: "Excesso de Carga/Peso" },
    { cod: 91, desc: "Entrega Programada" },
    { cod: 92, desc: "Problemas Fiscais" },
    { cod: 99, desc: "Outros tipos de ocorrências não especificados acima" },
  ];


  const [eventsListFiltered, setEventsListFiltered] = useState(type_events);
  const [searchEvents, setSearchEvents] = useState("");

  const handleRegisterEvent = async () => {
    const imageUrls = await uploadFilesFirebase();

    const eventDetails = {
      event: eventRegister,
      description: descEventRegister,
      images: imageUrls,
      created_at: new Date(),
    };

    await firestore()
      .collection("freight")
      .doc(route?.params?.idFreight)
      .collection("stopping_points")
      .doc(route?.params?.stoppgingPoint.id)
      .update({
        events: firestore.FieldValue.arrayUnion(eventDetails),
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => console.log("err", error));
  };

  const openCamera = () => {
    PermissionsHandler.activeCamera((response) => {
      if (!response.didCancel && !response.error) {
        setSelectedImages([...selectedImages, response]);
      }
    });  
  };

  const openGallery = () => {
    PermissionsHandler.activeLibrary((response) => {
      if (!response.didCancel && !response.error) {
        setSelectedImages([...selectedImages, response]);
      }
    });    
  };

  const getFileLocalPath = (response) => {
    return response.assets[0].uri;
  };

  const uploadFilesFirebase = async () => {
    const uploadPromises = selectedImages.map(async (image) => {
      let name = new Date().toISOString();
      const fileSource = getFileLocalPath(image);
      const storageRef = storage()
        .ref(
          `freight/${route?.params?.idFreight}/stoppingPoints/${route?.params?.stoppgingPoint.id}`
        )
        .child(name);
      await storageRef.putFile(fileSource);
      return await storageRef.getDownloadURL();
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  };

  const searchFilterEvents = (text) => {
    if (text) {
      const newData = type_events.filter((item) => {
        let content = `${item.cod} - ${item?.desc}`;
        const itemData = content?.toUpperCase();
        const textData = text?.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setEventsListFiltered(newData);
      setSearchEvents(text);
    } else {
      setEventsListFiltered(type_events);
      setSearchEvents(text);
    }
  };

  return (
    <Container>
      <Header namePage="Detalhes do frete / Informar evento" />
      <ScrollView style={{ padding: 10 }}>
        <TouchableOpacity
          style={{ marginTop: 5, padding: 0 }}
          onPress={() => setShowModalBank(true)}
        >
          <Text style={{ color: 'rgb(50,50,50)' }}>
            <Label>Selecione o evento:</Label>{" "}
            {eventRegister !== null ? (
              `${eventRegister?.cod} - ${eventRegister?.desc}`
            ) : (
              <>
                Listar eventos
                <Ionicons name="chevron-down" color={"rgb(50,50,50)"} size={15} />
              </>
            )}
          </Text>
        </TouchableOpacity>

        <Modal
          isOpen={showModalBank}
          onClose={() => setShowModalBank(false)}
          size="lg"
        >
          <Modal.Content maxHeight="450">
            <Modal.CloseButton />
            <Modal.Header>
              Busque o evento pelo nome
              <InputSearch
                style={{ textTransform: "uppercase" }}
                onChangeText={(text) => searchFilterEvents(text)}
                value={searchEvents}
                placeholderTextColor="#94A3B8"
                underlineColorAndroid="transparent"
                placeholder="Procure aqui"
              />
            </Modal.Header>
            <Modal.Body>
              <VStack space={3}>
                {eventsListFiltered.map((item, index) => (
                  <ButtonSelectEvent
                    key={index}
                    onPress={() => {
                      setEventRegister(item);
                      setShowModalBank(false);
                    }}
                  >
                    <Text style={{ color: "rgb(50,50,50)" }}>
                      {item.cod} - {item.desc}
                    </Text>
                    <Line />
                  </ButtonSelectEvent>
                ))}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Line />
        <Label>Descreva o evento ocorrido:</Label>
        <Input
          multiline
          placeholder="Descreva os detalhes do evento ocorrido aqui neste campo..."
          value={descEventRegister}
          onChangeText={(text) => setDescEventRegister(text)}
        />

        <Line />
        <Label>Se possível, anexe fotos:</Label>
        <View style={{ flexDirection: "row" }}>
          <UploadButton style={{ marginBottom: 2.5 }} onPress={openCamera}>
            <Feather name="camera" size={22} color="#121212" />
          </UploadButton>
          <UploadButton style={{ marginTop: 2.5 }} onPress={openGallery}>
            <MaterialIcons name="photo-library" size={22} color="#121212" />
          </UploadButton>
        </View>
        {selectedImages.length > 0 && (
          <View>
            <Text>Imagens selecionadas:</Text>
            {selectedImages.map((image, index) => (
              <Image
                key={index}
                source={{ uri: getFileLocalPath(image) }}
                style={{ width: 200, height: 200, marginVertical: 5 }}
              />
            ))}
          </View>
        )}

        <Line />
        <BtnSaveRegisterEvent onPress={handleRegisterEvent}>
          <TextBtnSaveRegister>Registrar Evento</TextBtnSaveRegister>
        </BtnSaveRegisterEvent>
      </ScrollView>
    </Container>
  );
}
