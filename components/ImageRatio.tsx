import * as FileSystem from "expo-file-system";
import { Image, ImageLoadEventData } from "expo-image";
import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
const ImageRatio = ({ uri }: { uri: string }) => {
  const [aspectRatio, setAspectRatio] = useState(2 / 3);
  const [imagePath, setImagePath] = useState<string>("");
  const { height, width } = useWindowDimensions();
  const handleImageLoad = (event: ImageLoadEventData) => {
    const { width, height } = event.source;
    const imageAspectRatio = width / height;
    setAspectRatio(imageAspectRatio);
  };
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  const imageSource = { uri };
  console.log(imageSource);
  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetch(uri);
      const base64String = await response.text();
      // console.log({ base64String });

      let ext = uri.split(".").pop();
      let path = FileSystem.documentDirectory + `image-${Date.now()}.${ext}`;
      await FileSystem.writeAsStringAsync(path, base64String, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setImagePath(path);
      console.log("Write SUCCEFELY2");
    };

    // fetchImage();
  }, []);
  // if (imageSource.uri)
  return (
    <>
      {imageSource.uri && (
        <Image
          contentFit="cover"
          source={imageSource}
          style={{
            width: "100%",
            maxHeight: height / 2,
            aspectRatio: aspectRatio !== null ? aspectRatio : 2 / 3,
          }}
          onLoad={handleImageLoad}
        />
      )}
    </>
  );
};
export default ImageRatio;
