import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context"; // <- mais seguro que o do RN puro
import config from "../../config/variables.json";

export const Container = styled(SafeAreaView).attrs({
  edges: ["top", "left", "right"], // garante que respeite o relógio / notch
})`
  flex: 1;
  background-color: ${config?.cor_neutra};
`;

export const Header = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  justify-content: space-between;
`;

export const Name = styled.Text`
  color: #353840;
  font-size: 18px;
  font-weight: bold;
  padding-left: 2%;
  padding-right: 10%;
`;

export const Avatar = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 6px;
  background-color: #f4bc0b;
`;

export const AvatarImg = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 6px;
`;

export const ContentView = styled.View``;

export const Content = styled.Text`
  color: #353840;
  margin: 4px 0;
`;

export const Actions = styled.View`
  margin-top: 5px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ButtonMore = styled.TouchableOpacity`
  background-color: rgba(4, 52, 203, 0.9);
  width: 30%;
  height: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`;

export const TextMore = styled.Text`
  color: #fff;
  font-weight: bold;
`;

export const TimePost = styled.Text`
  color: #121212;
`;

export const ModalViewDetails = styled.View`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5% 5% 0 5%;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 1);
`;

export const ButtonCloseModal = styled.TouchableOpacity`
  height: 10%;
  justify-content: center;
  align-items: center;
`;

export const TextCloseModal = styled.Text`
  color: ${config?.cor_texto_secundaria};
  font-weight: bold;
  border: 1px solid rgba(4, 52, 203, 0.8);
  background-color: rgba(4, 52, 203, 0.8);
  padding: 10px;
  border-radius: 10px;
`;

export const CompanyLogo = styled.Image`
  height: 80px;
  width: 160px;
`;

export const StatusFreightDriver = styled.View`
  width: 60%;
  border-color: ${config?.cor_texto_primaria};
  border-width: 1px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4px;
`;

export const TextStatusFreightDriver = styled.Text`
  font-size: 14px;
  color: ${config?.cor_texto_primaria};
  text-align: center;
`;

export const TextButton = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
`;

export const BtnInit = styled.TouchableOpacity`
  background-color: ${config?.cor_secundaria};
  border-color: ${config?.cor_secundaria};
  border-radius: 5px;
  border-width: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 2%;
  right: 1%;
  margin-bottom: 2%;
  padding: 1%;
  width: 40%;
  height: 62px;
`;

export const ModalPermissions = styled.Modal`
  width: 60%;
  border-color: ${config?.cor_texto_primaria};
  border-width: 1px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4px;
`;

export const Line = styled.View`
  width: 100%;
  height: 1px;
  background-color: #eaeaea;
  margin: 8px 0;
`;

export const LineModal = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  margin-vertical: 4px;
`;

export const TitleDetails = styled.Text`
  font-family: "Inter-SemiBold";
  font-size: 16px;
  font-weight: bold;
  color: #111;
  margin-top: 16px;
  margin-bottom: 8px;
`;

export const Text = styled.Text`
  font-size: 15px;
  color: ${(props) => props.color || "#4a4a4a"};
  font-weight: ${(props) => props.fontWeight || "normal"};
  text-align: ${(props) => props.textAlign || "left"};
`;

export const TextSubTitile = styled.Text`
  font-family: "Inter-Medium";
  font-size: 15px;
  color: ${(props) => props.color || "#2f2f2f"};
  font-weight: ${(props) => props.fontWeight || "500"};
  text-align: ${(props) => props.textAlign || "left"};
  line-height: 20px;
  letter-spacing: 0.2px;
`;

export const TextCompany = styled.Text`
  font-size: 17px;
  color: ${(props) => props.color || "#2f2f2f"};
  font-weight: ${(props) => props.fontWeight || "500"};
  text-align: ${(props) => props.textAlign || "left"};
  line-height: 20px;
  letter-spacing: 0.2px;
`;

export const TextFrete = styled.Text`
  font-size: 15px;
  color: ${(props) => props.color || "#2f2f2f"};
  font-weight: ${(props) => props.fontWeight || "500"};
  text-align: ${(props) => props.textAlign || "left"};
  line-height: 20px;
  letter-spacing: 0.2px;
`;

export const BtnErrorPermission = styled.TouchableOpacity`
  width: 100%;
  background-color: #ffecec;
  border: 1px solid #ff5a5f;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
`;

export const TextBtnError = styled.Text`
  color: #ff5a5f;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
`;

// estilo ifood
export const TitleIfood = styled.Text`
  font-family: "Inter-SemiBold"; /* ou NunitoSans-SemiBold */
  font-size: 16px;
  color: #2c2c2c;
  margin-top: 12px;
  margin-bottom: 6px;
  letter-spacing: 0.3px;
`;

export const SubTitleIfood = styled.Text`
  font-family: "Inter-Medium"; /* ou NunitoSans-Medium */
  font-size: 14px;
  color: #3d3d3d;
`;

export const TextIfood = styled.Text`
  font-family: "Inter-Regular"; /* ou NunitoSans-Regular */
  font-size: 13px;
  color: #4a4a4a;
`;






// import { SafeAreaView } from "react-native";
// import styled from "styled-components/native";
// import config from '../../config/variables.json'

// export const Container = styled(SafeAreaView)`
//   flex:1;
//   background-color: ${config?.cor_texto_secundaria};
// `;

// export const Header = styled.TouchableOpacity`
//   width: 100%;
//   flex-direction: row;
//   align-items: center;
//   margin-bottom: 5px;
//   justify-content: space-between;
// `;

// export const Name = styled.Text`
//   color: #353840;
//   font-size: 18px;
//   font-weight: bold;
//   padding-left: 2%;
//   padding-right: 10%;
// `;


// export const Avatar = styled.View`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 40px;
//   height: 40px;
//   border-radius: 20px;
//   margin-right: 6px;
//   background-color: #f4bc0b;
// `;
// export const AvatarImg = styled.Image`
//   width: 40px;
//   height: 40px;
//   border-radius: 20px;
//   margin-right: 6px;
// `;


// export const ContentView = styled.View``;


// export const Content = styled.Text`
// color: #353840;
// margin: 4px 0;
// `;

// export const Actions = styled.View`
// margin-top: 5px;
// flex-direction: row;
// justify-content: space-between;
// align-items: center;
// `;

// // export const ButtonMore = styled.TouchableOpacity`
// //   height: 40px;
// //   background-color:  ${config?.cor_texto_primaria};
// // `;

// export const ButtonMore = styled.TouchableOpacity`
// background-color: rgba(4,52,203,.9);
// width: 30%;
// height: 30px;
// flex-direction: row;
// align-items: center;
// justify-content: center;
// border-radius: 10px;
// `;

// export const TextMore = styled.Text`
//   color: #FFF;
//   font-weight: bold;
// `;

// export const TimePost = styled.Text`
// color: #121212;
// `;

// export const ModalViewDetails = styled.View`
//   flex: 1;
//   display: flex;
//   align-items: center;
//   justify-content:center;
//   margin: 5% 5% 0 5%;
//   border-radius: 10px;
//   background-color: rgba(255,255,255, 1);
// `;

// export const ButtonCloseModal = styled.TouchableOpacity`
//   height: 10%;
//   justify-content: center;
//   align-items: center;
// `;

// export const TextCloseModal = styled.Text`
//   color: ${config?.cor_texto_secundaria};
//   font-weight: bold;
//   border: 1px solid rgba(4,52,203,.8);
//   background-color: rgba(4,52,203,.8);
//   padding: 10px;
//   border-radius: 10px;

// `;

// // export const LineModal = styled.View`
// //   flex-direction: row;
// //   width: 70%;
// // `;

// // export const Line = styled.View`
// //   flex-direction: row;
// //   height:1px;
// //   background-color:  ${config?.cor_texto_primaria};
// //   width: 100%;
// //   margin-top:2% ;
// //   margin-bottom: 2px;
// // `;

// // export const TitleDetails = styled.Text`
// //   font-weight: bold;
// //   font-size: 15px;
// //   color:  ${config?.cor_texto_primaria};
// //   margin-top: 3%;
// // `;

// export const CompanyLogo = styled.Image`
//   height: 80px;
//   width: 160px;
// `;

// export const StatusFreightDriver = styled.View`
//   width: 60%;
//   border-color:  ${config?.cor_texto_primaria};
//   border-width: 1px;
//   border-radius: 5px;
//   align-items: center;
//   justify-content: center;
//   text-align: center;
//   padding:4px ;
// `;

// export const TextStatusFreightDriver = styled.Text`
//   font-size: 14px;
//   color:  ${config?.cor_texto_primaria};
//   text-align: center;
// `;

// export const TextButton = styled.Text`
//   font-size: 14px;
//   font-weight: bold;
//   color: #FFFFFF;
//   text-align: center;
// `;


// export const BtnInit = styled.TouchableOpacity`
//   background-color: rgba(4,52,203,1);
//   border-color: rgba(4,52,203,1);
//   border-radius: 5px;
//   border-width: 2px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   position: absolute;
//   bottom: 2%;
//   right: 1%;
//   margin-bottom: 2%;
//   padding: 1%;
//   width: 40%;
//   height: 62px;
// `;


// export const ModalPermissions = styled.Modal`
//   width: 60%;
//   border-color:  ${config?.cor_texto_primaria};
//   border-width: 1px;
//   border-radius: 5px;
//   align-items: center;
//   justify-content: center;
//   text-align: center;
//   padding:4px ;
// `;


// // export const BtnErrorPermission = styled.TouchableOpacity`
// //   background-color: #f00;
// //   border-color: rgba(4,52,203,1);
// //   width: 100%;

// // `;

// // export const TextBtnError = styled.Text`
// //   font-size: 14px;
// //   color: ${config?.cor_texto_secundaria};
// //   text-align: center;
// //   font-weight: bold;
// //   padding: 1%;
// // `;


// export const Line = styled.View`
//   width: 100%;
//   height: 1px;
//   background-color: #eaeaea;
//   margin: 8px 0;
// `;

// export const LineModal = styled.View`
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 8px;
//   margin-vertical: 4px;
// `;

// export const TitleDetails = styled.Text`
//   font-family: "Inter-SemiBold";
//   font-size: 16px;
//   font-weight: bold;
//   color: #111;
//   margin-top: 16px;
//   margin-bottom: 8px;
// `;

// export const Text = styled.Text`
//   font-size: 15px;
//   color: ${(props) => props.color || "#4a4a4a"};
//   font-weight: ${(props) => props.fontWeight || "normal"};
//   text-align: ${(props) => props.textAlign || "left"};
// `;

// export const TextSubTitile = styled.Text`
//   font-family: "Inter-Medium";
//   font-size: 15px;
//   color: ${(props) => props.color || "#2f2f2f"};
//   font-weight: ${(props) => props.fontWeight || "500"};
//   text-align: ${(props) => props.textAlign || "left"};
//   line-height: 20px;
//   letter-spacing: 0.2px;
// `;

// export const TextCompany = styled.Text`
//   font-size: 17px;
//   color: ${(props) => props.color || "#2f2f2f"};
//   font-weight: ${(props) => props.fontWeight || "500"};
//   text-align: ${(props) => props.textAlign || "left"};
//   line-height: 20px;
//   letter-spacing: 0.2px;
// `;


// export const TextFrete = styled.Text`
//   font-size: 15px;
//   color: ${(props) => props.color || "#2f2f2f"};
//   font-weight: ${(props) => props.fontWeight || "500"};
//   text-align: ${(props) => props.textAlign || "left"};
//   line-height: 20px;
//   letter-spacing: 0.2px;
// `;


// export const BtnErrorPermission = styled.TouchableOpacity`
//   width: 100%;
//   background-color: #ffecec;
//   border: 1px solid #ff5a5f;
//   border-radius: 8px;
//   padding: 12px;
//   margin-bottom: 12px;
// `;

// export const TextBtnError = styled.Text`
//   color: #ff5a5f;
//   font-size: 14px;
//   font-weight: 600;
//   text-align: center;
// `;



// // estilo ifood 

// export const TitleIfood = styled.Text`
//   font-family: "Inter-SemiBold"; /* ou NunitoSans-SemiBold */
//   font-size: 16px;
//   color: #2c2c2c;
//   margin-top: 12px;
//   margin-bottom: 6px;
//   letter-spacing: 0.3px;
// `;

// // Subtítulo (para descrições importantes)
// export const SubTitleIfood = styled.Text`
//   font-family: "Inter-Medium"; /* ou NunitoSans-Medium */
//   font-size: 14px;
//   color: #3d3d3d;
// `;

// // Texto comum (parágrafos ou valores)
// export const TextIfood = styled.Text`
//   font-family: "Inter-Regular"; /* ou NunitoSans-Regular */
//   font-size: 13px;
//   color: #4a4a4a;
// `;