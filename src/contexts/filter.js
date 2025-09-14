import React, { useState, createContext, useEffect, useContext } from 'react';

import firestore from '@react-native-firebase/firestore';
import firebase from "@react-native-firebase/app";
import { AuthContext } from './auth';
import { VerificationContext } from './registrationVerification';

export const FilterContext = createContext({});

function FilterProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { } = useContext(VerificationContext);
  const [permissionToEdit, setPermissionToEdit] = useState(false);//permissão para editar as informações do cadastro
  const [loadingForm, setLoadingForm] = useState(false);
  //forma princiapal para salvar dados de verificação do usuario

  const [filterDestinyState, setFilterDestinyState] = useState('');
  const [filterDestinyCity, setFilterDestinyCity] = useState('');
  const [filterOriginState, setFilterOriginState] = useState('');
  const [filterOriginCity, setFilterOriginCity] = useState('');

  const [filterVehicle, setFilterVehicle] = useState('');
  const [filterBodywork, setFilterBodywork] = useState('');

  const [freightsInLine, setFreightsInLine] = useState(0)

  const [citiesOrigin, setCitiesOrigin] = useState([]);
  const [citiesDestiny, setCitiesDestiny] = useState([]);


  const [filteredDataOrigin, setFilteredDataOrigin] = useState([]);
  const [filteredDataDestiny, setFilteredDataDestiny] = useState([]);
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [radiusPosition, setRadiusPosition] = useState(10000);

  function clearFilter() {
    setFilterVehicle('');
    setFilterBodywork('');
    setFilterDestinyState('');
    setFilterOriginState('');
    setFilterOriginCity('');
    setFilterDestinyCity('');
    setRadiusPosition(100000000)
  }

  return (
    <FilterContext.Provider
      value={{
        loadingForm, setLoadingForm,
        filterVehicle, setFilterVehicle,
        filterBodywork, setFilterBodywork,
        filterOriginState, setFilterOriginState,
        filterOriginCity, setFilterOriginCity,
        filterDestinyState, setFilterDestinyState,
        filterDestinyCity, setFilterDestinyCity,
        clearFilter,
        freightsInLine, setFreightsInLine,
        citiesOrigin, setCitiesOrigin,
        citiesDestiny, setCitiesDestiny,
        filteredDataOrigin, setFilteredDataOrigin,
        filteredDataDestiny, setFilteredDataDestiny,
        position, setPosition,
        radiusPosition, setRadiusPosition
      }}>
      {children}
    </FilterContext.Provider>
  )
}

export default FilterProvider;