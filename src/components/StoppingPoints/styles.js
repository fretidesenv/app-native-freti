import styled from "styled-components/native";
import config from '../../config/variables.json'
export const Container = styled.SafeAreaView`
  width: 100%;

  flex-direction: column;
  display: flex;
  justify-content: space-between;
  padding-top: 5px;
  color: #000000;
`;

export const CardStoppingPoint = styled.View`
  width: 100%;
  margin-bottom: 12px;
  padding: 12px 16px;
  border-radius: 10px;

  /* Cor de fundo mais suave */
  background-color: #ffffff;

  /* Borda sutil em tom cinza claro */
  border: 1px solid #e0e0e0;

  /* Sombras para dar profundidade (Android usa elevation) */
  elevation: 3;

  /* Para iOS */
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;
export const HeaderCard = styled.View`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-direction: row;
`;

export const BodyCard = styled.View`
  padding-top: 10px;
`;

// export const FooterCard = styled.View``;

export const Legend = styled.Text`
  font-weight: 600;
  color: #000000;
  font-size: 15px;
`;

export const LineContent = styled.View`
  display: flex;
  flex-direction: row;
  padding-top: 5px;
`;

export const LineModal = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px; 
  margin-vertical: 4px;
  margin-top: 10px;
`;

export const BodyCardDescription = styled.Text`
 font-size: 14px;
  color: #333;
  flex-shrink: 1;
  flex-wrap: wrap;

  /* Cor padrão suave (quando não sobrescrita no inline) */
  color: #4a4a4a;
`;

// export const BodyCardDescription = styled.Text`
//   font-size: 14px;
//   padding-left: 5px;
//   color: #000000;
// `;

// export const ButtonActionStoppingPoint = styled.TouchableOpacity`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   border: 0px solid rgba(4, 52, 203, 1);
//   border-radius: 4px;
//   margin: 4px;
//   padding: 5px;
// `;
// export const ButtonActionStoppingPointLink = styled.TouchableOpacity`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   border: 0px solid rgba(4, 52, 203, 1);
//   background-color: rgba(4, 52, 203, 1);
//   border-radius: 4px;
//   margin: 4px;
//   padding: 5px;
// `;

// export const LegendButtonAction = styled.Text`
//   color: ${config?.cor_texto_secundaria};
//   font-weight: bold;
// `;

// export const TextButtonLink = styled.Text`
//   color: ${config?.cor_texto_secundaria};
//   font-weight: bold;
//   padding: 5px;
// `;

export const ViewOpenCloseButton = styled.TouchableOpacity`
  width: 100%;
  display: flex;
  align-items: center;
`;
export const LegendOpenClose = styled.Text`
  color: rgb(50, 50, 50);
`;

// export const IconCargaDescagarga = styled.Image`
//   width: ${(props) => props.width};
//   height: ${(props) => props.height};
//   border-radius: 0px;
//   margin-left: 2px;
//   margin-right: 2px; 
// `;
export const Text = styled.Text`
  font-size: 15px;
  color: ${(props) => props.color || "#4a4a4a"};
  font-weight: ${(props) => props.fontWeight || "normal"};
  text-align: ${(props) => props.textAlign || "left"};
`;

export const IconCargaDescagarga = styled.Image.attrs((props) => ({
  width: Number(props.width),
  height: Number(props.height),
}))`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;

  margin-left: 8px;
  margin-right: 4px;

  /* Cantos levemente arredondados para seguir o estilo */
  border-radius: 6px;
  background-color: #fafafa;
  padding: 4px;
`;

// export const IconCargaDescagarga = styled.Image.attrs((props) => ({
//   width: Number(props.width),
//   height: Number(props.height),
// }))`
//   width: ${(props) => props.width}px;
//   height: ${(props) => props.height}px;
//   border-radius: 0px;
//   margin-left: 2px;
//   margin-right: 2px;
// `;


export const ViewHeader = styled.View`
  width: 50%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  /* Espaçamento interno para não grudar nas bordas */
  padding: 6px 0;

  /* Linha divisória sutil (opcional) */
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

// export const ViewHeader = styled.View`
//   width: 50%;
//   display: flex;
//   flex-direction: row;
//   align-items: flex-end;
// `;


export const Image = styled.Image`
  width: 105px;
  height: 105px;
  border-radius: 5px;

`;


export const ButtonActionStoppingPointLink = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgba(4, 52, 203, 1);
  border-radius: 10px;
  margin: 6px 4px;
  padding: 10px 12px;
  elevation: 2;
`;

export const TextButtonLink = styled.Text`
  color: ${config?.cor_texto_secundaria};
  font-weight: 600;
  font-size: 14px;
  margin-right: 8px;
`;

export const FooterCard = styled.View`
  margin-top: 8px;
  flex-direction: row;
  justify-content: space-between;
`;

export const LegendButtonAction = styled.Text`
  color: ${config?.cor_texto_secundaria};
  font-weight: 600;
  font-size: 14px;
  text-align: center;
`;

export const ButtonActionStoppingPoint = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  flex: 1;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin: 4px;
  padding: 12px 16px;
  elevation: 2;
`;