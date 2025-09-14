import React from "react";
import { WebView } from "react-native-webview";
import { Dimensions } from "react-native";


// const YouTubeVideo = ({ videoId }) => {
//   const videoUrl = `https://www.youtube.com/embed/${videoId}`;

//   return (
//     <WebView
//       source={{ uri: videoUrl }}
//       style={{ height: 300, width: "100%" }}
//       allowsFullscreenVideo
//     />
//   );
// };


const { width, height } = Dimensions.get("window");

const YouTubeVideo = ({ videoId }) => {
  const videoUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&showinfo=0&autoplay=1&controls=1`;

  return (
    <WebView
      source={{ uri: videoUrl }}
      style={{ width, height: height/2 }}
      allowsFullscreenVideo
      javaScriptEnabled
    />
  );
};

export default YouTubeVideo;
