


import React, { useState, useEffect, useContext, useRef, Component } from 'react';
import {
  View,
  //Text, Modal, 
  Platform, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet
} from 'react-native';
import { AuthContext } from '../../contexts/auth'
import { VerificationContext } from '../../contexts/registrationVerification'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage'
import {

  UploadButton,
  Image,
  ImageModal,
  ImageModalDocument
} from './styles'
import { Button, Modal, VStack, HStack, Text, Radio, Center, NativeBaseProvider } from "native-base";

import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { set } from 'date-fns/esm';
import { PermissionsHandler } from '../../handler/permissions';


export const UploadImage = (props) => {

  const { user } = useContext(AuthContext);
  const { imgdocumentCnhFront, setImgdocumentCnhFront,
    imgdocumentCnhVerse, setImgdocumentCnhVerse, imgVehicle, setImgVehicle, loadingForm, setLoadingForm } = useContext(VerificationContext);
  const [url, setUrl] = useState(null);
  const [urlPreview, setUrlPreview] = useState(null);
  const [responsePreview, setResponsePreview] = useState(null)
  const [modalQualityAlert, setModalQualityAlert] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);



  useEffect(() => {
    let isActive = true;

    async function loadImage() {
      try {
        if (isActive) {
          ;
          let response = await storage().ref(`drivers_users/${user?.uid}`).child(props.idImage).getDownloadURL();
          setUrl(response);
        }
      } catch (err) {
        console.log("Nenhuma foto encontrada para a imagem com id: " + props.idImage)
      }
    }

    loadImage();


    return () => isActive = false;
  }, [])



  const openCamera = () => {
    PermissionsHandler.activeCamera((response) => {
      setLoadingForm(true);
      if (response.didCancel) {
        setLoadingForm(false);
        console.log("Cancelouu!");
      } else if (response.error) {
        setLoadingForm(false);
        console.log("Ops parece que deu algum erro")
      }
      else {
        setShowModal2(true);
        setUrlPreview(response.assets[0].uri);
        setResponsePreview(response);
        setLoadingForm(false);
        //   uploadFileFirebase(response)
        //   .then(() => {
        //     console.log('sucesso')
        //   })

        // console.log("URI DA FOTO ", response.assets[0].uri)
        // setUrl(response.assets[0].uri)

      }
    });
  }

  const uploadImage = (response) => {
    setLoadingForm(true);
    uploadFileFirebase(response)
      .then(() => {
        console.log('agora: setUrlVariables();')
        setUrlVariables();//alterar as urls nas variaveis

      })

    console.log("URI DA FOTO ", response.assets[0].uri)
    setUrl(response.assets[0].uri)
  }

  const openGallery = () => {
    PermissionsHandler.activeLibrary((response) => {
      if (response.didCancel) {
        console.log("Cancelou!");
      } else if (response.error) {
        console.log("Ops parece que deu algum erro")
      }
      else {
        uploadFileFirebase(response)
          .then(() => {
            //uploadAvatarPosts();
            console.log('sucesso')
            setUrlVariables();
            // props.setValue("vehicleImg", url)
          })

        console.log("URI DA FOTO ", response.assets[0].uri)
        setUrl(response.assets[0].uri)

      }
    });    
  }

  const getFileLocalPath = (response) => {
    // extrair e retornar a url da foto.
    return response.assets[0].uri;
  }

  const uploadFileFirebase = async (response) => {
    const fileSource = getFileLocalPath(response);

    const storageRef = storage().ref(`drivers_users/${user?.uid}`).child(props.idImage);

    return await storageRef.putFile(fileSource).then(() => {
      console.log('agora: return await storageRef.putFile(fileSource).then(() => { ')

    })

  }




  const setUrlVariables = async () => {
    const storageRef = storage().ref(`drivers_users/${user?.uid}`).child(props.idImage);
    const url = await storageRef.getDownloadURL()
      .then(async (image) => {
        if (props.idImage === 'imgVehicle') {
          await props.setValue("vehicleImg", image)
        } else if (props.idImage === 'imgdocumentCnhFront') {
          await props.setValue("documentCnhFrontImg", image);
        } else if (props.idImage === 'imgdocumentCnhVerse') {
          await props.setValue("documentCnhVerseImg", image);
        } else if (props.idImage === "imgdocumentCrlv") {
          await props.setValue("documentCrlvImg", image);
        } else if (props.idImage === "imgdocumentAnttFront") {
          await props.setValue("documentAnttFrontImg", image);
        } else if (props.idImage === "imgdocumentAnttVerse") {
          await props.setValue("documentAnttVerseImg", image);
        }

        else {
          console.log("não foi possivel identificar qual variavel a ser editada.")
          return;
        }

      })
      .catch((error) => {
        console.log("ERROR AO ATUALIZAR FOTO DOS POSTS ", error)
      }).then(() => { setLoadingForm(false) })
  }




  if (props.edit === true) {
    return (
      <>

        {url ? (
          <>

            <View style={{ flexDirection: 'row' }}>
              <Image
                source={{ uri: url }}
              />



              {loadingForm ? (
                <>
                  <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size={50} color='rgb(4,52,203)' />
                  </View>
                </>
              ) : (
                <>
                  <View>
                    <UploadButton style={{ marginBottom: 2.5 }} onPress={() =>
                      //openCamera()
                      setShowModal(true)
                    }>
                      <Feather
                        name="camera"
                        size={22}
                        color="#121212"
                      />
                    </UploadButton>
                    <UploadButton style={{ marginTop: 2.5 }} onPress={() => openGallery()}>
                      <MaterialIcons
                        name="photo-library"
                        size={22}
                        color="#121212"
                      />
                    </UploadButton>


                  </View>
                </>
              )}
            </View>
          </>
        ) : (
          <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
            <UploadButton onPress={() =>
              //openCamera()
              setShowModal(true)
            }>
              <Feather
                name="camera"
                size={22}
                color="#121212"
              />
            </UploadButton>
            <UploadButton onPress={() => openGallery()}>
              <MaterialIcons
                name="photo-library"
                size={22}
                color="#121212"
              />
            </UploadButton>



          </View>

        )}

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Atenção</Modal.Header>
            <Modal.Body>
              <VStack space={3}>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">{props.idImage === 'imgVehicle'
                    ? 'Agora nos encaminhe uma foto bem bacana de seu veículo.'
                    : 'Por gentileza, certifique-se de que a foto deste documento fique nítida.'}</Text>
                </HStack>
                {props.idImage === 'imgdocumentCnhFront' ? (
                  <View style={{ alignItems: 'center' }} >
                    <Text>Frente da CNH</Text>
                    <ImageModalDocument
                      width="250px"
                      height="180px"
                      source={require('../../assets/documentCnhFront.png')}
                    />
                  </View>
                ) : props.idImage === 'imgdocumentCnhVerse' ? (
                  <View style={{ alignItems: 'center' }}>
                    <Text>Verso da CNH</Text>
                    <ImageModalDocument
                      width="250px"
                      height="180px"
                      source={require('../../assets/documentCnhVerse.png')}
                    />
                  </View>
                ) : props.idImage === 'imgdocumentCrlv' ? (
                  <View style={{ alignItems: 'center' }}>
                    <Text>CRLV</Text>
                    <ImageModalDocument
                      width="236px"
                      height="328px"
                      source={require('../../assets/documentCrlv.png')}
                    />
                  </View>
                )
                  :
                  (null)


                }



              </VStack>
            </Modal.Body>
            <Modal.Footer>
              <Button flex="1" onPress={() => {
                setShowModal(false) & openCamera();

              }}>
                Continue
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>


        <Modal isOpen={showModal2} onClose={() => setShowModal2(false)} size="lg">
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>A qualidade da foto ficou boa?</Modal.Header>
            <Modal.Body>
              <VStack space={3}>
                <ImageModal
                  source={{ uri: urlPreview }}
                />
              </VStack>

            </Modal.Body>
            <Modal.Footer justifyContent="space-between">
              <Button width="45%" onPress={() => {
                setShowModal2(false) & openCamera();
              }}>
                Não
              </Button>
              <Button width="45%" onPress={() => {
                setShowModal2(false) & uploadImage(responsePreview)
              }}>
                Sim
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

      </>

    )
  } else {
    //se não tiver permissão para editar, apresenta apenas a imagem
    return (
      <View style={{ flexDirection: 'row' }}>
        {/* <Image
          source={{ uri: url }}
        /> */}
      </View>
    )
  }

};



const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    width: '80%',
    padding: 4,
    paddingLeft: 10,
    color: '#121212',
  },
});