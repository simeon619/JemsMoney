import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/build/Feather";
import FontAwesome5 from "@expo/vector-icons/build/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useSearchParams } from "expo-router";
import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import ImageRatio from "../components/ImageRatio";
import InstanceAudio from "../components/InstanceAudio";
import { MonoText } from "../components/StyledText";
import { View } from "../components/Themed";
import Colors from "../constants/Colors";
import { HOST } from "../constants/Network";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { AppDispatch, RootState } from "../store";
import {
  MessageSchema,
  addMessage,
  fetchMessages,
} from "../store/message/messageSlice";
const TRESHOLD_SLIDE = 100;

const discussion = () => {
  const inputRef = useRef<TextInput>(null);
  const colorSheme = useColorScheme();
  const { width } = useWindowDimensions();
  const [text, setText] = useState("");

  // const canSend = useRef<boolean>(false);
  // const canSend = useSharedValue<boolean>(true);
  // const [canSend, setCanSend] = useState(false);
  const [duration, setDuration] = useState(0);
  const [args, setArgs] = useState(0);
  const [pathVoiceNote, setPathVoiceNote] = useState<string | null | undefined>(
    ""
  );
  const route = useRouter();

  const params = useSearchParams();
  const [recording, setRecording] = useState<Audio.Recording>();

  const dispatch: AppDispatch = useDispatch();
  const id = params.id as string;

  const Messsages = useSelector((state: RootState) => state.message);

  useEffect(() => {
    if (!(Messsages[id]?.loading || Messsages[id]?.success)) {
      Messsages[id] = {
        messages: [],
        loading: false,
        success: false,
      };
    }
  }, []);

  const regex = new RegExp(/[^\s\r\n]/g);

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording, status } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording.setOnRecordingStatusUpdate((T) => {
        setDuration(T.durationMillis);
      });
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  useEffect(() => {
    if (args !== 0) {
      stopRecording();
    }
  }, [args]);
  const stopRecording = async () => {
    const status = await recording?.getStatusAsync();
    console.log("Stopping recording..", status);

    if (recording && status?.isRecording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch (error: any) {
        if (
          error.message.includes(
            "Stop encountered an error: recording not stopped"
          )
        ) {
          await recording._cleanupForUnloadedRecorder({
            canRecord: false,
            durationMillis: 0,
            isRecording: false,
            isDoneRecording: false,
          });
          console.log(`recorderStop() error : ${error}`);
        } else if (
          error.message.includes(
            "Cannot unload a Recording that has already been unloaded."
          ) ||
          error.message.includes(
            "Error: Cannot unload a Recording that has not been prepared."
          )
        ) {
          console.log(`recorderStop() error : ${error}`);
        } else {
          console.error(`recorderStop(): ${error}`);
        }
      }
      console.log("recorder stopped");
      // await recording.de;
    } else {
      console.log("🚀 ~ file: discussion.tsx:159 ~ stopRecording ~  '':", "");
    }

    setRecording(undefined);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    await recording?._cleanupForUnloadedRecorder({
      canRecord: false,
      durationMillis: 0,
      isRecording: false,
      isDoneRecording: false,
    });
    const uri = recording?.getURI();
    console.log("Recording stopped and stored at", uri);

    sendAudio(uri);
  };
  const sendAudio = async (pathVoiceNote: any) => {
    if (pathVoiceNote) {
      let name = pathVoiceNote.split("/").pop();
      // let base64 = await RNFS.readFile(uri, "base64");
      const fileInfo: any = await FileSystem.getInfoAsync(pathVoiceNote, {
        size: true,
      });
      const base64 = await FileSystem.readAsStringAsync(pathVoiceNote, {
        encoding: FileSystem.EncodingType.Base64,
      });

      dispatch(
        addMessage({
          //@ts-ignore
          discussionId: params.id,
          messageFile: [
            {
              buffer: base64,
              type: "audio/m4a",
              size: fileInfo.size,
              fileName: name,
            },
          ],
        })
      );
      setPathVoiceNote(null);
      console.log("audio send");
    }
    resetAudio();
  };

  const chooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      base64: true,
      selectionLimit: 2,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      let fileImages = result.assets
        .filter((f) => f.base64 !== null)
        .map((asset) => {
          // const fileInfo: any = await FileSystem.getInfoAsync(asset.uri, {
          //   size: true,
          // });
          let fileName = asset.uri?.split("/").pop();
          let ext = fileName?.split(".").pop();
          let type = asset.type === "image" ? `image/${ext}` : "video/" + ext;

          return {
            buffer: asset.base64,
            fileName,
            encoding: "base64",
            type,
            size: 1500,
          };
        });
      dispatch(
        addMessage({
          //@ts-ignore
          discussionId: params.id,
          messageFile: fileImages,
        })
      );
    } else {
      Alert.prompt("You did not select any image.");
    }
  };

  const height = useSharedValue(0);
  const handleContentSizeChange = useCallback((event: any) => {
    const newHeight = Math.min(
      Math.max(event.nativeEvent.contentSize.height, 30),
      verticalScale(70)
    );

    height.value = withTiming(newHeight, { duration: 0 });
  }, []);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: height.value,
      // maxHeight: verticalScale(),
    };
  });
  const scrollViewRef = useRef<FlatList>(null);

  useLayoutEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  const x = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = x.value;
      ctx.uid = Math.floor(Math.random() * 150000) + 1;
    },
    onActive: (event, ctx) => {
      if (Math.abs(x.value) > TRESHOLD_SLIDE) {
        x.value = withSpring(0, { velocity: 0, stiffness: 300 });
      } else {
        const updatedValue = ctx.startX + event.translationX;
        if (Math.abs(updatedValue) > TRESHOLD_SLIDE) {
          // runOnJS(callMyFunction)(ctx.uid);
          runOnJS(setArgs)(ctx.uid);
          // runOnJS(resetPath)();
          x.value = withSpring(0, { velocity: 0, stiffness: 300 });
        } else {
          x.value = withSpring(updatedValue, { velocity: 0, stiffness: 300 });
        }
      }
    },
    onEnd: (_) => {
      x.value = withSpring(0, { velocity: 0, stiffness: 300 });
    },
  });

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchMessages({ discussionId: params.id }));

    return () => {
      resetAudio();
    };
  }, []);
  const voiceNoteMoveX = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });

  async function resetAudio() {
    if (recording && (await recording.getStatusAsync()).isRecording) {
      await recording.stopAndUnloadAsync();
      setRecording(undefined);
      await recording._cleanupForUnloadedRecorder({
        canRecord: false,
        durationMillis: 0,
        isRecording: false,
        isDoneRecording: false,
      });
      console.log("reset audio");
    }

    setPathVoiceNote(null);

    console.log("reset");
  }
  function formatDuration(durationMillis: number) {
    const totalSeconds = Math.floor(durationMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <ImageBackground
      source={require("../assets/images/splash.png")}
      style={{ flex: 1, marginTop: StatusBar.currentHeight }}
    >
      <StatusBar
        backgroundColor={Colors[colorSheme ?? "light"].primaryColour}
        barStyle={"light-content"}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled={true}
        keyboardVerticalOffset={verticalScale(30)}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width,
            // position: 'absolute',
            // top: 0,
            backgroundColor: Colors[colorSheme ?? "light"].primaryColour,
            zIndex: 999,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              backgroundColor: Colors[colorSheme ?? "light"].primaryColour,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingVertical: verticalScale(6),
                gap: 5,
                paddingLeft: horizontalScale(5),
                backgroundColor: Colors[colorSheme ?? "light"].primaryColour,
              }}
            >
              <Pressable
                style={{
                  width: horizontalScale(30),
                  height: verticalScale(30),
                  alignSelf: "center",
                }}
                onPress={() => {
                  route.back();
                }}
              >
                <FontAwesome
                  name="arrow-left"
                  size={25}
                  color={Colors[colorSheme ?? "light"].textOverlay}
                />
              </Pressable>

              <Image
                source={require("../assets/images/user.png")}
                style={{
                  width: width * 0.11,
                  height: width * 0.11,
                  borderRadius: 99,
                  alignSelf: "center",
                }}
              />
            </View>

            <View
              style={{
                justifyContent: "center",
                gap: 2,
                backgroundColor: Colors[colorSheme ?? "light"].primaryColour,
              }}
            >
              <MonoText
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  width: horizontalScale(150),
                  fontSize: moderateScale(20),
                  color: Colors[colorSheme ?? "light"].textOverlay,
                }}
              >
                Agent
              </MonoText>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: Colors[colorSheme ?? "light"].primaryColour,
              alignItems: "center",
              gap: horizontalScale(25),
              marginRight: horizontalScale(15),
            }}
          >
            <FontAwesome5
              name="ellipsis-v"
              size={25}
              color={Colors[colorSheme ?? "light"].textOverlay}
            />
          </View>
        </View>

        <FlatList
          data={Messsages[id]?.messages}
          renderItem={({ item }) => <MessageItem item={item} />}
          keyExtractor={(item) => item.messageId}
          // onScroll={handleScroll}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: "#eee",
            justifyContent: "flex-end",
            marginBottom: verticalScale(150),
          }}
          // style={{
          //   marginBottom: keyboardOffset,
          // }}
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
          ListFooterComponent={() => (
            <View
              style={{
                height: verticalScale(60),
                backgroundColor: "#0000",
              }}
            />
          )}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            position: "absolute",
            paddingHorizontal: horizontalScale(7),
            paddingVertical: horizontalScale(10),
            paddingBottom: verticalScale(10),
            bottom: 0,
            flex: 1,
            backgroundColor: Colors[colorSheme ?? "light"].primaryColour,
          }}
        >
          {duration > 0 ? (
            <MaterialIcons
              name="fiber-manual-record"
              size={27}
              color={Math.floor(duration) % 2 === 0 ? "#f00" : "#f005"}
            />
          ) : (
            <MaterialIcons
              name="emoji-emotions"
              size={27}
              color={Colors[colorSheme ?? "light"].textOverlay}
            />
          )}
          <Animated.View
            style={[
              animatedStyles,
              {
                alignSelf: "center",
                alignItems: "flex-start",
                flex: 10,
                height: 30,
              },
            ]}
          >
            {duration > 0 ? (
              <View
                style={{
                  width: width - horizontalScale(140),
                  flexDirection: "row",
                  alignItems: "baseline",
                  gap: horizontalScale(15),
                  backgroundColor: Colors[colorSheme ?? "light"].primaryColour,
                }}
              >
                <MonoText
                  style={{
                    fontSize: moderateScale(17),
                    color: Colors[colorSheme ?? "light"].textOverlay,
                    backgroundColor:
                      Colors[colorSheme ?? "light"].primaryColour,
                  }}
                >
                  {formatDuration(duration)}
                </MonoText>
                <MonoText
                  style={{
                    fontSize: moderateScale(14),
                    color: Colors[colorSheme ?? "light"].textOverlay,
                    backgroundColor:
                      Colors[colorSheme ?? "light"].primaryColour,
                  }}
                >
                  Slide to send
                </MonoText>
              </View>
            ) : (
              <TextInput
                ref={inputRef}
                onChangeText={setText}
                placeholder={"Write something..."}
                placeholderTextColor="#fefefefe"
                value={text}
                multiline={true}
                scrollEnabled={true}
                onContentSizeChange={handleContentSizeChange}
                style={{
                  fontSize: moderateScale(17),
                  color: Colors[colorSheme ?? "light"].textOverlay,
                  // backgroundColor: "#eee",
                  marginLeft: horizontalScale(5),
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
          </Animated.View>
          <View
            style={{
              flexDirection: "row",
              flex: 3,
              justifyContent: "space-between",
              backgroundColor: Colors[colorSheme ?? "light"].primaryColour,
              marginRight: horizontalScale(5),
            }}
          >
            {!(duration > 0) && (
              <TouchableOpacity
                onPress={() => {
                  if (!text) {
                    chooseImage();
                    console.log("file");
                  }
                }}
                style={{}}
              >
                <MaterialIcons
                  name="file-upload"
                  size={28}
                  color={Colors[colorSheme ?? "light"].textOverlay}
                />
              </TouchableOpacity>
            )}
            <View
              style={{
                backgroundColor: Colors[colorSheme ?? "light"].primaryColour,
              }}
            >
              {text && regex.test(text) ? (
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    if (text && regex.test(text)) {
                      dispatch(
                        addMessage({
                          //@ts-ignore
                          discussionId: params.id,
                          messageText: text,
                        })
                      );
                    }
                  }}
                >
                  <Feather
                    name="send"
                    size={27}
                    color={Colors[colorSheme ?? "light"].textOverlay}
                  />
                </TouchableOpacity>
              ) : (
                <PanGestureHandler onGestureEvent={gestureHandler}>
                  <Animated.View
                    style={[
                      // { flex: 1 },
                      voiceNoteMoveX,
                      duration > 0 && {
                        position: "absolute",
                        top: verticalScale(-70),
                        // left: -horizontalScale(70),
                        width: horizontalScale(90),
                        height: verticalScale(90),
                        backgroundColor: "#000",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 99,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      // delayPressOut={50}
                      style={[
                        { justifyContent: "center", alignItems: "center" },
                      ]}
                      onLongPress={() => {
                        // canSend.value = true;
                        startRecording();
                      }}
                      onPress={() => {
                        resetAudio();
                      }}
                    >
                      <MaterialIcons
                        name={duration > 0 ? "stop" : "keyboard-voice"}
                        size={duration > 0 ? 47 : 27}
                        color={
                          duration > 0
                            ? "red"
                            : Colors[colorSheme ?? "light"].textOverlay
                        }
                      />
                    </TouchableOpacity>
                  </Animated.View>
                </PanGestureHandler>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
const MessageItem = memo(({ item }: { item: MessageSchema }) => {
  console.log({ item });

  return (
    <TouchableOpacity
      onPress={(e) => {}}
      onLongPress={() => {
        console.log("ya koi");
      }}
      style={[
        {
          padding: moderateScale(5),

          margin: 10,
          maxWidth: "80%",
          flexDirection: "row",
          columnGap: 4,
          elevation: 99,
        },
        item.right
          ? {
              alignSelf: "flex-end",
              backgroundColor: "#dff",
              // borderTopLeftRadius: 10,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }
          : {
              alignSelf: "flex-start",
              backgroundColor: "#fff",
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            },
      ]}
    >
      <View
        style={{
          flexDirection: "column",
          // overflow: "hidden",
          backgroundColor: "#0000",
          // gap: 10,
        }}
      >
        {item.text ? (
          <MonoText
            style={{
              fontSize: moderateScale(15),
              fontFamily: "Roboto-Regular",
              color: "#444",
            }}
          >
            {item.text}
          </MonoText>
        ) : (
          item.files.map((file, i) => {
            let ext = file.split(".").pop();
            console.log({ ext });
            let type = "";
            if (ext === "jpeg" || ext === "jpg" || ext === "png") {
              type = "image";
            } else if (ext === "m4a" || ext === "mp3") {
              type = "audio";
            }
            console.log(file);

            if (type === "image")
              return (
                // <View key={i}></View>
                <ImageRatio uri={HOST + file} key={i} />
                // <Image
                //   key={file}
                //   contentFit="contain"
                //   source={{ uri: HOST + file }}
                //   style={{
                //     width: "100%",
                //     height: undefined,
                //     aspectRatio: 3 / 2,
                //   }}
                //   onLoad={handleImageLoad}
                // />
                // <ImageScall
                //   width={Dimensions.get("window").width} // height will be calculated automatically
                //   source={{ uri: HOST + file }}
                // />
              );
            if (type === "audio")
              return <InstanceAudio voiceUrl={file} key={i} />;
          })
        )}
      </View>
    </TouchableOpacity>
  );
});
export default discussion;
