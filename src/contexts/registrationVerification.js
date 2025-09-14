import React, { useState, createContext, useEffect, useContext } from 'react';

import firestore from '@react-native-firebase/firestore';
import firebase from "@react-native-firebase/app";
import { AuthContext } from './auth';
import { set, getDate } from 'date-fns';

export const VerificationContext = createContext({});

function VerificationProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [permissionToEdit, setPermissionToEdit] = useState(false);//permissão para editar as informações do cadastro
  const [loadingForm, setLoadingForm] = useState(false);

  const [modalSendSuccess, setModalSendSuccess] = useState(false);
  const [dataRegister, setDataRegister] = useState({});

  //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
  //função responsavel por buscar dados                                              
  //ja preenchidos na tela de dados                                                   
  //para verificação da conta                                                 
  async function loadDataProfile() {
    const db = await firestore()
      .collection('drivers_users')
      .doc(user?.uid)
      .collection('documents')
      .doc('allData').get();

    setDataRegister(db.data())
    console.log(db.data())
    //console.log(new Date(db.data().birthDate.seconds * 1000).getFullYear(), new Date(db.data().birthDate.seconds * 1000).getMonth() +1, new Date(db.data().birthDate.seconds * 1000).getDate() )
    // console.log(new Date(db.data().birthDate.seconds * 1000).getFullYear()  )
    // if (db.data().p) {

    // } else {
    //   // setFullName(db.data().personalData.fullName);
    //   // setContact(db.data().personalData.contact);
    //   // setDocumentRg(db.data().personalData.documentRg);
    //   // setDocumentCpf(db.data().personalData.documentCpf);
    //   // setBirthDate(db.data().personalData.birthDate);
    //   // console.log(db.data().personalData.birthDate);
    //   // setSexGender(db.data().personalData.sexGender);
    //   // setDocumentCnh(db.data().personalData.documentCnh);
    //   // setDocumentCnhExpiration(db.data().personalData.documentCnhExpiration);
    //   // setImgdocumentCnhFront(db.data().personalData.imgdocumentCnhFront);
    //   // setImgdocumentCnhVerse(db.data().personalData.imgdocumentCnhVerse);
    //   // setDocumentCrlv(db.data().personalData.documentCrlv);
    //   // setDocumentAntt(db.data().personalData.documentAntt);
    //   // setAddress(db.data().address);
    //   // setKin1(db.data().kinships[0]);
    //   // setKin2(db.data().kinships[1]);
    //   // setProfessionalReference1(db.data().professionalReference[0]);
    //   // setProfessionalReference1(db.data().professionalReference[1]);
    //   // setVehicle(db.data().vehicle);
    //   // setDataBank(db.data().dataBank);
    //   //setPermissionToEdit(db.data().permissionToEdit);//permissão para editar as informações do cadastro
    //   return () => { };
    // }
  }
  //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>

  //forma alternativa para salvar os dados de verificação
  // async function _upload() {

  //   let isActive = true;
  //   async function loadUpdates() {
  //     try {
  //       if (isActive) {

  //         //envio de dados pessoais
  //         await firestore()
  //           .collection('drivers_users')
  //           .doc(user.uid)
  //           .collection('documents')
  //           .doc('personalData')
  //           .set({
  //             fullName: fullName,
  //             contact: contact,
  //             documentRg: documentRg,
  //             documentCpf: documentCpf,
  //             birthDate: birthDate,
  //             sexGender: sexGender,
  //             documentCnh: documentCnh,
  //             documentCnhExpiration: documentCnhExpiration,
  //             documentCrlv: documentCrlv,
  //             documentAntt: documentAntt,
  //             imgdocumentCnhFront: imgdocumentCnhFront,
  //             imgdocumentCnhVerse: imgdocumentCnhVerse,
  //           }).catch((error) => {
  //             console.log('Erro na etapa: [1/6] => ' + error)
  //           })
  //           .then(() => {
  //             console.log('success! [1/6]');
  //           });

  //         //envio de dados do endereço
  //         await firestore()
  //           .collection('drivers_users')
  //           .doc(user.uid)
  //           .collection('documents')
  //           .doc('address').set({
  //             cep: address.cep,
  //             state: address.state,
  //             city: address.city,
  //             district: address.district,
  //             street: address.street,
  //             number: address.number,
  //           }).catch((error) => {
  //             console.log('Erro na etapa: [2/6] => ' + error)
  //           })
  //           .then(() => {
  //             console.log('success! [2/6]');
  //           });

  //         //envio de contato de referencias profissionais
  //         await firestore()
  //           .collection('drivers_users')
  //           .doc(user.uid)
  //           .collection('documents')
  //           .doc('professionalReference')
  //           .set({

  //             professionalReference: [
  //               { name: professionalReference1.name, contact: professionalReference1.contact },
  //               { name: professionalReference2.name, contact: professionalReference2.contact }
  //             ],
  //           }).catch((error) => {
  //             console.log('Erro na etapa: [3/6] - ' + error)
  //           })
  //           .then(() => {
  //             console.log('success! [3/6]');
  //           });

  //         //envio de contatos de parentes 
  //         await firestore()
  //           .collection('drivers_users')
  //           .doc(user.uid)
  //           .collection('documents')
  //           .doc('kinship')
  //           .set({

  //             kinships: [
  //               { name: kin1.name, contact: kin1.contact, degree: kin1.degree },
  //               { name: kin2.name, contact: kin2.contact, degree: kin2.degree },
  //             ],
  //           }).catch((error) => {
  //             console.log('Erro na etapa: [4/6] - ' + error)
  //           })
  //           .then(() => {
  //             console.log('success! [4/6]');
  //           });

  //         //envio de dados do veiculo
  //         await firestore()
  //           .collection('drivers_users')
  //           .doc(user.uid)
  //           .collection('documents')
  //           .doc('vehicle')
  //           .set({
  //             type: vehicle.type,
  //             bodywork: vehicle.bodywork,
  //             plateVehicle: vehicle.plateVehicle,
  //             plateBodywork: vehicle.plateBodywork,
  //             img: imgVehicle

  //           }).catch((error) => {
  //             console.log('Erro na etapa: [5/6] - ' + error)
  //           })
  //           .then(() => {
  //             console.log('success! [5/6]');
  //           });

  //         //envio de dados bancarios
  //         await firestore()
  //           .collection('drivers_users')
  //           .doc(user.uid)
  //           .collection('documents')
  //           .doc('dataBank')
  //           .set({
  //             code: dataBank.code,
  //             ispb: dataBank.ispb,
  //             agency: dataBank.agency,
  //             accountNumber: dataBank.accountNumber,
  //             accountDigit: dataBank.accountDigit,
  //             pix: dataBank.pix,
  //             holderAccount: dataBank.holderAccount,
  //             bankName: dataBank.bankName,
  //             bankFullName: dataBank.bankFullName
  //           }).catch((error) => {
  //             console.log('Erro na etapa: [6/6] => ' + error)
  //           })
  //           .then(() => {
  //             console.log('success! [6/6]');
  //           });

  //       }
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }

  //   loadUpdates()
  //   return () => isActive = false;

  // }

  //forma princiapal para salvar dados de verificação do usuario
  async function _upload(data) {
    console.log('oi')
    setLoadingForm(true);
    let isActive = true;
    async function loadUpdates() {
      try {
        if (isActive) {

          //envio de dados pessoais
          await firestore()
            .collection('drivers_users')
            .doc(user.uid)
            .collection('documents')
            .doc('allData')
            .update(data)
            // .update({
            //   personalData: {
            //     fullName: fullName,
            //     contact: contact,
            //     documentRg: documentRg,
            //     documentCpf: documentCpf,
            //     birthDate: birthDate,
            //     sexGender: sexGender,
            //     documentCnh: documentCnh,
            //     documentCnhExpiration: documentCnhExpiration,
            //     documentCrlv: documentCrlv,
            //     documentAntt: documentAntt,
            //     imgdocumentCnhFront: imgdocumentCnhFront,
            //     imgdocumentCnhVerse: imgdocumentCnhVerse,
            //   },

            //   address: {
            //     cep: address.cep,
            //     state: address.state,
            //     city: address.city,
            //     district: address.district,
            //     street: address.street,
            //     number: address.number,
            //   },

            //   professionalReference: [
            //     { name: professionalReference1.name, contact: professionalReference1.contact },
            //     { name: professionalReference2.name, contact: professionalReference2.contact }
            //   ],

            //   kinships: [
            //     { name: kin1.name, contact: kin1.contact, degree: kin1.degree },
            //     { name: kin2.name, contact: kin2.contact, degree: kin2.degree },
            //   ],

            //   vehicle: {
            //     type: vehicle.type,
            //     bodywork: vehicle.bodywork,
            //     plateVehicle: vehicle.plateVehicle,
            //     plateBodywork: vehicle.plateBodywork,
            //     img: imgVehicle
            //   },

            //   dataBank: {
            //     code: dataBank.code,
            //     ispb: dataBank.ispb,
            //     agency: dataBank.agency,
            //     accountNumber: dataBank.accountNumber,
            //     accountDigit: dataBank.accountDigit,
            //     pix: dataBank.pix,
            //     holderAccount: dataBank.holderAccount,
            //     bankName: dataBank.bankName,
            //     bankFullName: dataBank.bankFullName
            //   },
            //   lastUpdated: new Date()
            // })

            .catch((error) => {
              console.log('Erro  => ' + error)
              loadingForm(false);
            })
            .then(async () => {

              await firestore()
                .collection('drivers_users')
                .doc(user.uid)
                // .collection('documents')
                // .doc('allData')
                .update({
                  permissionToEdit: false,
                })
                .then(() => {
                  setLoadingForm(false);
                  console.log('dados de verificação do usuario salvos com successo!');
                });
            });


        }
      } catch (err) {
        console.log('try or catch: ' + err)
      }
    }

    loadUpdates()
    return () => isActive = false;

  }
  async function upload(data) {
    // console.log('oi')
    setLoadingForm(true);
    let isActive = true;
    async function loadUpdates() {
      try {
        if (isActive) {

          //envio de dados pessoais
          await firestore()
            .collection('drivers_users')
            .doc(user.uid)
            .collection('documents')
            .doc('allData')
            .update({
              personalData: {
                fullName: data?.fullName,
                contact: data?.contact,
                // documentRg: documentRg,
                documentCpf: data?.documentCpf,
                // birthDate: birthDate,
                sexGender: data?.sexGender,
                // documentCnh: documentCnh,
                // documentCnhExpiration: documentCnhExpiration,
                // documentCrlv: documentCrlv,
                // documentAntt: documentAntt,
                documentAnttFrontImg: data?.documentAnttFrontImg,
                documentAnttVerseImg: data?.documentAnttVerseImg,
                documentCnhFrontImg: data?.documentCnhFrontImg,
                documentCnhVerseImg: data?.documentCnhVerseImg,

              },

              address: {
                cep: data?.cep,
                state: data?.state,
                city: data?.city,
                district: data?.district,
                street: data?.street,
                number: data?.number,
              },

              professionalReference: [
                { name: data?.professionalReferenceName1, contact: data?.professionalReferenceContact1 },
                { name: data?.professionalReferenceName2, contact: data?.professionalReferenceContact2 }
              ],

              kinships: [
                { name: data?.kinshipName1, contact: data?.kinshipContact1, degree: data?.kinshipDegree1 },
                { name: data?.kinshipName2, contact: data?.kinshipContact2, degree: data?.kinshipDegree2 },
              ],

              vehicle: {
                vehicleType: data?.vehicleType,
                bodyworkType: data?.bodyworkType,
                vehiclePlate: data?.vehiclePlate,
                bodyworkPlate: data?.bodyworkPlate,
                vehicleImg: data?.vehicleImg
              },

              dataBank: {
                code: data?.bankCode,
                ispb: data?.bankIspb,
                agency: data?.bankAgency,
                accountNumber: data?.bankAccountNumber,
                accountDigit: data?.bankAccountDigit,
                pix: data?.bankPix,
                holderAccount: data?.bankHolderAccount,
                bankName: data?.bankName,
                bankFullName: data?.bankFullName
              },
              lastUpdated: new Date()
            }).catch((error) => {
              console.log('Erro  => ' + error)
              loadingForm(false);
            })
            .then(async () => {

              await firestore()
                .collection('drivers_users')
                .doc(user.uid)
                .update({
                  statusDriver: 'informed'
                })
                .then(() => {
                  setLoadingForm(false);
                  setModalSendSuccess(true);
                });
            });


        }
      } catch (err) {
        console.log('try or catch: ' + err)
      }
    }

    loadUpdates()
    return () => isActive = false;

  }
  return (
    <VerificationContext.Provider
      value={{
        loadingForm, setLoadingForm,
        upload, loadDataProfile,
        permissionToEdit, setPermissionToEdit,
        dataRegister, loadDataProfile,
        modalSendSuccess, setModalSendSuccess
      }}>
      {children}
    </VerificationContext.Provider>
  )
}

export default VerificationProvider;