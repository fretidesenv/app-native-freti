import React, { useState } from 'react';
import { Text } from "react-native";

export const Mask = (props) => {


  if (props.value >= 0 && props.value < 1000) {//999
    return (
      <>
        <Text>{props.value} {props.type === 'km' ? 'KM' : props.type === 'reais' ? '' : 'KG'}</Text>
      </>
    )
  } else if (props.value >= 1000 && props.value < 10000) {//9.999
    return (
      <>
        <Text>{(props.value).toLocaleString().replace(/^(\d{1})(\d{3})/, "$1.$2")} {props.type === 'km' ? 'KM' : props.type === 'reais' ? '' : 'KG'} </Text>
      </>
    )
  }

  else if (props.value >= 10000 && props.value < 100000) {//99.999
    return (
      <>
        <Text>{(props.value).toLocaleString().replace(/^(\d{2})(\d{3})/, "$1.$2")}{props.type === 'km' ? 'KM' : props.type === 'reais' ? '' : 'KG'}</Text>
      </>
    )
  } else if (props.value >= 100000 && props.value < 1000000) {//999.999
    return (
      <>
        <Text>{(props.value).toLocaleString().replace(/^(\d{3})(\d{3})/, "$1.$2")} {props.type === 'km' ? 'KM' : props.type === 'reais' ? '' : 'KG'}</Text>
      </>
    )
  }
  else if (props.value >= 1000000 && props.value < 10000000) {//9.999.999
    return (
      <>
        <Text>{(props.value).toLocaleString().replace(/^(\d{1})(\d{3})(\d{3})/, "$1.$2.$3")} {props.type === 'km' ? 'KM' : props.type === 'reais' ? '' : 'KG'}</Text>
      </>
    )
  }
  
  else if (props.value >= 10000000 && props.value < 100000000) {//99.999.999
    return (
      <>
        <Text>{(props.value).toLocaleString().replace(/^(\d{2})(\d{3})(\d{3})/, "$1.$2.$3")} {props.type === 'km' ? 'KM' : props.type === 'reais' ? '' : 'KG'}</Text>
      </>
    )
  }
  else if (props.value >= 100000000 && props.value < 1000000000) {//999.999.999
    return (
      <>
        <Text>{(props.value).toLocaleString().replace(/^(\d{3})(\d{3})(\d{3})/, "$1.$2.$3")} {props.type === 'km' ? 'KM' : props.type === 'reais' ? '' : 'KG'}</Text>
      </>
    )
  }
  else if (props.value >= 1000000000 && props.value < 10000000000) {//9.999.999.999
    return (
      <>
        <Text>{(props.value).toLocaleString().replace(/^(\d{1})(\d{3})(\d{3})(\d{3})/, "$1.$2.$3.$4")} {props.type === 'km' ? 'KM' : props.type === 'reais' ? '' : 'KG'}</Text>
      </>
    )
  }
  else {
    return (
      <>
        <Text>{props.value}</Text>
      </>
    )
  }


};
