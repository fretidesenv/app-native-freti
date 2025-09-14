
import React, { useState, useEffect, useContext, useRef, Component } from 'react';
import {
  View,
  //Text, Modal, 
  Platform, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet, Linking, WebView
} from 'react-native';
import { AuthContext } from '../../contexts/auth'
import { VerificationContext } from '../../contexts/registrationVerification'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage'


import {

  UploadButton,
  Image,
  ImageModal
} from './styles'
import { Button, Modal, VStack, HStack, Text, Radio, Center, NativeBaseProvider } from "native-base";
import DocumentPicker from 'react-native-document-picker';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


export const UploadPdf = (props) => {

  const { user } = useContext(AuthContext);
  const { imgdocumentCnhFront, setImgdocumentCnhFront,
    imgdocumentCnhVerse, setImgdocumentCnhVerse, imgVehicle, setImgVehicle, loadingForm, setLoadingForm } = useContext(VerificationContext);
  const [url, setUrl] = useState(null);
  const [urlFirebase, setUrlFirebase] = useState(null);
  const [urlPreview, setUrlPreview] = useState(null);
  const [responsePreview, setResponsePreview] = useState(null)
  const [modalQualityAlert, setModalQualityAlert] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const [namePdf, setNamePdf] = useState('')
  const [edit, setEdit] = useState(true)
  const [loading, setLoading] = useState(false)

  const reference = storage().ref('test.pdf');

  const [document, setDocument] = useState(null)

  useEffect(() => {
    let isActive = true;

    async function loadPdf() {
      try {
        if (isActive) {

          let response = await storage().ref(`drivers_users/${user?.uid}`).child(props.idPdf).getDownloadURL();
          setUrl(response);
          setUrlFirebase(response)
        }
      } catch (err) {
        console.log("Nenhum arquivo encontrado para o id: " + props.idPdf, err);
      }
    }

    loadPdf();


    return () => isActive = false;
  }, [])



  const openDocument = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        copyTo: 'documentDirectory',
      });
      setUrl(decodeURI(file.fileCopyUri.replace('file:/', 'file:///')));
      // file:///rota/nomedoarquivo.pdf
      setNamePdf(file.name)
      uploadPdf(decodeURI(file.fileCopyUri.replace('file:/', 'file:///')))
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // The user canceled the document picker.
      } else {
        throw error;
      }
    }
  }

  const clickLinkPdf = () => {
    if (urlFirebase) {
      Linking.openURL(urlFirebase)
    }
  }



  const uploadPdf = async (response) => {
    setLoading(true);
    uploadFileFirebase(response)
      .then(async () => {
        console.log('Upload success')
        let url = await storage().ref(`drivers_users/${user?.uid}`).child(props.idPdf).getDownloadURL();
        setUrl(url);
        setUrlFirebase(url)
      })
    setLoading(false);

  }

  const uploadFileFirebase = async (response) => {
    const fileSource = response //getFileLocalPath(response);
    const storageRef = storage().ref(`drivers_users/${user?.uid}`).child(props.idPdf);
    return await storageRef.putFile(fileSource);
  }


  if (edit === true) {
    return (
      <>

        {url ? (<>

          <View style={{ flexDirection: 'row' }}>

            {loadingForm ? (
              <>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator size={50} color='rgb(4,52,203)' />
                </View>
              </>) : (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <UploadButton style={{ marginTop: 2.5 }} onPress={() => openDocument()}>
                    <MaterialIcons
                      name="picture-as-pdf"
                      size={22}
                      color="#121212"
                    />
                  </UploadButton>
                  <TouchableOpacity onPress={() => clickLinkPdf()}>
                    <Text>{urlFirebase ? `${props.idPdf}.pdf` : namePdf}</Text>
                  </TouchableOpacity>

                  {loading &&
                    <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                      <ActivityIndicator size={50} color='rgb(4,52,203)' />
                    </View>
                  }
                </View>
              </>
            )}
          </View>
        </>
        ) : (
          <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
            <UploadButton onPress={() => openDocument()}>
              <MaterialIcons
                name="picture-as-pdf"
                size={22}
                color="#121212"
              />
            </UploadButton>
            <TouchableOpacity onPress={() => clickLinkPdf()}>
              <Text>{urlFirebase ? `${props.idPdf}.pdf` : namePdf}</Text>
            </TouchableOpacity>

            {loading &&
              <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size={50} color='rgb(4,52,203)' />
              </View>
            }

          </View>

        )}
      </>

    )
  } else {
    //se não tiver permissão para editar, apresenta apenas a imagem
    return (
      <View style={{ flexDirection: 'row', backgroundColor: 'rgba(0,0,0,.4)' }}>
        <TouchableOpacity onPress={() => clickLinkPdf()}>
          <Text>{urlFirebase ? `${props.idPdf}.pdf` : namePdf}</Text>
        </TouchableOpacity>

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