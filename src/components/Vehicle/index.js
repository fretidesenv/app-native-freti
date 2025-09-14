import React from 'react';
import { Select, CheckIcon } from "native-base";



export const SelectVehicle = () => {

  const vehicleType = [
    { key: 1, type: 'TRUCK' },
    { key: 2, type: 'BI-TRUCK' },
    { key: 3, type: 'CARRETA S' },
    { key: 4, type: 'CARRETA LS' },
    { key: 5, type: 'TOCO' },
    { key: 6, type: '3/4' },
    { key: 7, type: 'VUC' },
    { key: 8, type: 'RODOTREM' },
    { key: 9, type: 'MUNK' },
    { key: 10, type: 'VANDERLEIA' },
  ]

  let vehiclesItem = vehicleType.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.type} />
  })

  return <Select
    selectedValue={null}
    minWidth='90%'
    width='90%'
    accessibilityLabel="Qual o tipo do seu veículo?"
    placeholder="Qual o tipo do seu veículo?"
    _selectedItem={{
      bg: "yellow.500",
      endIcon: <CheckIcon size="5" />,
    }}

    onValueChange={(itemValue) => console.log(itemValue)}
  >
    {vehiclesItem}
  </Select>
  

};

