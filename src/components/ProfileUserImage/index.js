import React, { useState, useEffect, useContext, useRef, Component } from 'react';
import { View, Text, Modal, Platform, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../contexts/auth'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage'
import {

  UploadButton,
  UploadText,
  Avatar,

} from './styles'
import { PermissionsHandler } from '../../handler/permissions';

export const ProfileUserImage = () => {

  const { signOut, user, setUser, storageUser } = useContext(AuthContext);

  const [url, setUrl] = useState(null);

  useEffect(()=>{
    let isActive = true;

    async function loadAvatar(){
      try{
        if(isActive){;
          let response = await storage().ref(`drivers_users/${user?.uid}`).child('userImgProfile').getDownloadURL();
          setUrl(response);
        }
      }catch(err){
        
        console.log("Nenhuma foto encontrada para o perfil do ususario.")
      }
    }

    loadAvatar();


    return () => isActive = false;
  }, [])

  const uploadFile = () => {

    PermissionsHandler.activeLibrary((response) => {
      if (response.didCancel) {
        console.log("Cancelouu!");
      } else if (response.error) {
        console.log("Ops parece que deu algum erro")
      } 
      else {
         uploadFileFirebase(response)
           .then(() => {
             //uploadAvatarPosts();
             console.log('sucesso')
           })

         console.log("URI DA FOTO ", response.assets[0].uri)
         setUrl(response.assets[0].uri)

      }
    })

    const options = {
      noData: true,
      mediaType: 'photo'
    };    
  }

  const activeLibraryCamera = () => {
    
  }

  const getFileLocalPath = (response) => {
    // extrair e retornar a url da foto.
    return response.assets[0].uri;
   }

  const uploadFileFirebase = async (response) => {
    const fileSource = getFileLocalPath(response);
    
    const storageRef = storage().ref(`drivers_users/${user?.uid}`).child('userImgProfile');

    return await storageRef.putFile(fileSource)

  }



  return (
    <>
      {url ? (
        <UploadButton onPress={() => uploadFile()}>
          <Avatar
            source={{ uri: url }}
          />
        </UploadButton>
      ) : (
        <UploadButton onPress={() => uploadFile()}>
          <UploadText>+</UploadText>
        </UploadButton>
      )}
    </>

  )

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