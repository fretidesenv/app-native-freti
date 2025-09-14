import { useEffect, useState } from "react";
import {
  Modal,
  VStack,
  Text,
  Button,
  ScrollView,
  Box,
  HStack,
} from "native-base";
import { Dimensions, Linking } from "react-native";
import YouTubeVideo from "../YouTubeVideo";
import { TouchableOpacity } from "react-native";
import { useApplicationStore } from "../../store/application";

const PermissionModal = () => {
  const [showVideo, setShowVideo] = useState(false);
  const { height } = Dimensions.get("window");
  const { showModalPermsission, setShowModalPermsission, blockedPermissions } = useApplicationStore();

  const handleOnClose = () => {
    setShowModalPermsission(false);
  }

  const handleRedirectConfig = () => {
    Linking.openSettings();
  }

  return (
    <>
      <Modal isOpen={showModalPermsission} onClose={handleOnClose} size="lg">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Permissões Necessárias</Modal.Header>
          <Modal.Body>
            <ScrollView>
              <VStack space={3}>
                <Text>
                  Para um funcionamento adequado do aplicativo, precisamos das
                  seguintes permissões:
                </Text>

                {blockedPermissions.map((perm, index) => (
                  <Text key={index} fontWeight="bold">
                    - {perm}
                  </Text>
                ))}


                <TouchableOpacity
                  bg="transparent"
                  padding={0}
                  width="100%"
                  onPress={() => setShowVideo(true)}>
                  <Text color="rgb(1,36,67)" fontSize="xs" >
                    Para dúvidas sobre permissões, <Text style={{ textDecorationLine: "underline", textDecorationColor: "rgb(1,36,67)" }}>clique aqui</Text>.
                  </Text>
                </TouchableOpacity>
              </VStack>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer bg={"transparent"}>
            <VStack space={2} width="100%">
              {/* Botão de Conceder Permissões */}
              <Button
                colorScheme="rgb(1,36,67)"
                onPress={handleRedirectConfig}
                width="100%"
              >
                <HStack space={2} alignItems="center" justifyContent="center">
                  <Text color="white" fontSize="md" >
                    Continuar
                  </Text>
                </HStack>
              </Button>

              <TouchableOpacity
                bg="transparent"
                padding={0}
                width="100%"
                onPress={handleOnClose}>
                <HStack space={2} alignItems="center" justifyContent="center">
                  <Text color="rgb(1,36,67)" fontSize="md" style={{ textDecorationLine: "underline", textDecorationColor: "rgb(1,36,67)" }}>
                    Fechar
                  </Text>
                </HStack>
              </TouchableOpacity>
            </VStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Modal em tela cheia para exibir o vídeo */}
      <Modal isOpen={showVideo} onClose={() => setShowVideo(false)} size="full">
        <Modal.Content width="100%" height={height / 2}>
          <Modal.CloseButton />
          <Modal.Body p={0}>
            <Box flex={1}>
              {showVideo && <YouTubeVideo videoId="9gfjPUVnlE0" />}
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default PermissionModal;
