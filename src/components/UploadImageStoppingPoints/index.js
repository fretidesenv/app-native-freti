import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Component,
} from "react";
import {
  View,
  //Text, Modal,
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../../contexts/auth";
import { VerificationContext } from "../../contexts/registrationVerification";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { UploadButton, Image, ImageModal } from "./styles";
import {
  Button,
  Modal,
  VStack,
  Text,
} from "native-base";

import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BackgroundService from "react-native-background-actions";
import { PermissionsHandler } from "../../handler/permissions";

export const UploadImageStoppingPoints = (props) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [url, setUrl] = useState(null);
  const [urlPreview, setUrlPreview] = useState(null);
  const [responsePreview, setResponsePreview] = useState(null);

  const [showModal2, setShowModal2] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadImage() {
      try {
        if (isActive) {
          let response = await storage()
            .ref(
              `freight/${props.idFreight}/stoppingPoints/${props.idStoppingPoint}`
            )
            .child("deliveryReceipt")
            .getDownloadURL();
          setUrl(response);
        }
      } catch (err) {
        console.log(
          "Nenhuma foto encontrada `freight/${props.idFreight}/stoppingPoints/${props.idStoppingPoint}`).child('deliveryReceipt')",
          props.idStoppingPoint
        );
      }
    }

    if (props.idStoppingPoint) loadImage();

    return () => (isActive = false);
  }, [props.idStoppingPoint]);

  const openCamera = () => {
    PermissionsHandler.activeCamera((response) => {
      setLoading(true);
      if (response.didCancel) {
        setLoading(false);
        console.log("Cancelou!");
      } else if (response.error) {
        setLoading(false);
        console.log("Ops parece que deu algum erro");
      } else {
        console.log(response);
        setShowModal2(true);
        setUrlPreview(response.assets[0].uri);
        setResponsePreview(response);
        setLoading(false);
      }
    });    
  };  

  const uploadImage = (response) => {
    setLoading(true);
    uploadFileFirebase(response).then(() => {
      console.log("foto enviada, proximo passo alterar salvar a url.");
      setUrlVariables(); //alterar as urls nas variaveis
    });
    setUrl(response.assets[0].uri);
  };

  const openGallery = () => {
    PermissionsHandler.activeLibrary((response) => {
      if (response.didCancel) {
        console.log("Cancelou!");
      } else if (response.error) {
        console.log("Ops parece que deu algum erro");
      } else {
        uploadFileFirebase(response).then(() => {
          console.log("sucesso");
          setUrlVariables();
          // props.setValue("vehicleImg", url)
        });

        console.log("URI DA FOTO ", response.assets[0].uri);
        setUrl(response.assets[0].uri);
      }
    });    
  };

  const getFileLocalPath = (response) => {
    // extrair e retornar a url da foto.
    return response.assets[0].uri;
  };

  const uploadFileFirebase = async (response) => {
    const fileSource = getFileLocalPath(response);
    const storageRef = storage()
      .ref(`freight/${props.idFreight}/stoppingPoints/${props.idStoppingPoint}`)
      .child("deliveryReceipt");

    return await storageRef.putFile(fileSource);
  };

  const setUrlVariables = async () => {
    const storageRef = storage()
      .ref(`freight/${props.idFreight}/stoppingPoints/${props.idStoppingPoint}`)
      .child("deliveryReceipt");
    await storageRef
      .getDownloadURL()
      .then(async (image) => {
        firestore()
          .collection(`freight`)
          .doc(props.idFreight)
          .collection("stopping_points")
          .doc(props.idStoppingPoint)
          .update({
            canhoto: image,
            dateConcluded: new Date(),
            concluded: true,
            verify: false, //visando motoristas internos definidos dessa forma, caso abra para motoristas externos pensar em alteração disso
          })
          .then(async () => {
            props.getStoppingPoints();
            props.toggleConcluded(props.index);
            props.toggleModalCardVisibility(props.index);

          });

        if (props.isLastDelivery) {
          console.log(" é a ultima");
          firestore()
            .collection(`freight/${props.idFreight}/queue`)
            .doc(user.uid)
            .update({ status: "delivered" });

          await firestore()
            .collection(`drivers_users/${user.uid}/myFreightsList`)
            .doc(props.idFreight)
            .update({ status: "delivered", delivered: new Date() });

          await firestore().collection("freight")
          .doc(props.idFreight)
          .update({
            "status.code": "06",
            "status.describe": "Entregue",
            "history.dateFinished": new Date(),
            "history.dateDelivery": new Date(),
            "history.userDelivery": user.uid
          });

          // await firestore()
          //   .collection(`drivers_users/${user.uid}/myFreightsList`)
          //   .doc(props.idFreight)
          //   .delete()
          //   .catch((error) => console.log(error));

          await BackgroundService.stop();
        } else {
          console.log("não é a ultima");
        }
      })
      .catch((error) => {
        alert(
          "ERRO AO ENCAMINHAR A FOTO, POR GENTILEZA ENCAMINHE NOVAMENTE",
          error
        );
        setShowModal2(true);
      })
      .then(() => {
        setLoading(false);
      });
  };

  async function nextStatus() {
    setFreightInitialized(true);
    //-aqui
    firestore()
      .collection(`freight/${idFreight}/queue`)
      .doc(user.uid)
      .update({ status: "delivered", freightInitialized: true })
      .catch((error) => console.log(error) && nextStatus(statusForFreight));

    firestore()
      .collection(`drivers_users/${user.uid}/myFreightsList`)
      .doc(idFreight)
      .update({ status: "delivered", freightInitialized: true })
      .catch((error) => console.log(error) && nextStatus(statusForFreight));

    await firestore()
      .collection(`freight`)
      .doc(idFreight)
      .update({ status: "delivered" });
  }

  return (
    <>
      {url ? (
        <>
          <View style={{ flexDirection: "row" }}>
            <Image source={{ uri: url }} />

            {loading ? (
              <>
                <View
                  style={{
                    width: "20%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator size={50} color="rgb(4,52,203)" />
                </View>
              </>
            ) : (
              <>
                <View>
                  <UploadButton
                    style={{ marginBottom: 2.5 }}
                    onPress={
                      () => openCamera()
                      //setShowModal(true)
                    }
                  >
                    <Feather name="camera" size={22} color="#121212" />
                  </UploadButton>
                  <UploadButton
                    style={{ marginTop: 2.5 }}
                    onPress={() => openGallery()}
                  >
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
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <UploadButton onPress={() => openCamera()}>
            <Feather name="camera" size={22} color="#121212" />
          </UploadButton>
          <UploadButton onPress={() => openGallery()}>
            <MaterialIcons name="photo-library" size={22} color="#121212" />
          </UploadButton>
        </View>
      )}

      <Modal isOpen={showModal2} onClose={() => setShowModal2(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>A qualidade da foto ficou boa?</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <ImageModal source={{ uri: urlPreview }} />
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent="space-between">
            <Button
              bg="#f53211"
              width="45%"
              onPress={() => {
                setShowModal2(false) & openCamera();
              }}
            >
              <Text color="#fff" fontWeight={"bold"}>
                Não
              </Text>
            </Button>
            <Button
              bg="#0f5700"
              width="45%"
              onPress={() => {
                setShowModal2(false) & uploadImage(responsePreview);
              }}
            >
              <Text color="#fff" fontWeight={"bold"}>
                Sim
              </Text>
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    width: "80%",
    padding: 4,
    paddingLeft: 10,
    color: "#121212",
  },
});
