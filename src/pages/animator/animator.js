// SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();
 
  useEffect(() => {
    // ENTRADA: logo + texto
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Aguarda 1.2s e começa saída do texto
      setTimeout(() => {
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start(() => {
          // 👇 ZOOM IN na logo
          Animated.spring(scaleAnim, {
            toValue: 1.2,
            useNativeDriver: true,
          }).start();

          // Espera 2s com logo em destaque
          setTimeout(() => {
            // 👇 ZOOM OUT + fade out + subida
            Animated.parallel([
              Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.timing(translateYAnim, {
                toValue: -20,
                duration: 500,
                useNativeDriver: true,
              }),
            ]).start(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            });
          }, 2000); // tempo com logo maior
        });
      }, 1200);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/Fortio_V3.png')}
        style={[
          styles.logo,
          {
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            opacity: opacityAnim,
          },
        ]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.text, { opacity: textOpacity }]}>
        Sua logistica do futuro
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(1,36,67)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default SplashScreen;




// SplashScreen.tsx
// import React, { useEffect, useRef } from 'react';
// import { View, StyleSheet, Animated, Image, Dimensions } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const SplashScreen = () => {
//   const scaleAnim = useRef(new Animated.Value(0.5)).current;
//   const opacityAnim = useRef(new Animated.Value(0)).current;
//   const navigation = useNavigation();

//   useEffect(() => {
//     // Executa as animações em paralelo
//     Animated.parallel([
//       Animated.timing(opacityAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         useNativeDriver: true,
//         friction: 4,
//       }),
//     ]).start(() => {
//       // Espera 1.5 segundos e navega para Login
//       setTimeout(() => {
//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'Login' }],
//         });
//       }, 1500);
//     });
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Animated.Image
//         source={require('../../assets/Fortio_V3.png')} // substitua com o caminho da sua logo
//         style={[
//           styles.logo,
//           {
//             transform: [{ scale: scaleAnim }],
//             opacity: opacityAnim,
//           },
//         ]}
//         resizeMode="contain"
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#121212',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logo: {
//     width: 200,
//     height: 200,
//   },
// });

// export default SplashScreen;
