import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/build/Feather";
import FontAwesome5 from "@expo/vector-icons/build/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { Audio } from "expo-av";
import { RecordingStatus } from "expo-av/build/Audio";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView as ScrollViewTypes,
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
import { MonoText } from "../components/StyledText";
import { View } from "../components/Themed";
import Colors from "../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
const LAST_ELEMENT_SCROLL = verticalScale(35);
// let recording = new Audio.Recording();
// let recording = new Audio.Recording();
// let statusRecord: RecordingStatus;
const TRESHOLD_SLIDE = 200;

const discussion = () => {
  const inputRef = useRef<TextInput>(null);
  const colorSheme = useColorScheme();
  const { width } = useWindowDimensions();
  const height = useSharedValue(40);
  const [text, setText] = useState("");
  const [duration, setDuration] = useState(0);
  const [pathVoiceNote, setPathVoiceNote] = useState<string>("");
  const [scrollAmount, setScrollAmount] = useState(0);
  const route = useRouter();
  const [statusRecord, setStatusRecord] = useState<RecordingStatus>({
    canRecord: false,
    durationMillis: 0,
    isRecording: false,
    metering: 0,
    isDoneRecording: false,
  });
  const [recording, setRecording] = useState<Audio.Recording>();
  const [sound, setSound] = useState<Audio.Sound>();
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
      setStatusRecord(status);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  console.log(recording, "BAD STRIP");

  async function stopRecording() {
    const status = await recording?.getStatusAsync();
    if (status) setStatusRecord(status);
    console.log("Stopping recording..", status);

    console.log(statusRecord);

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
      console.log("je ne fait aps expres");
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
    const status2 = await recording?.getStatusAsync();
    if (status2) setStatusRecord(status2);
    const uri = recording?.getURI();
    console.log("Recording stopped and stored at", uri);
    if (uri) {
      setPathVoiceNote(uri);
    }
  }

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const maxScroll = contentSize.height - layoutMeasurement.height;
    const invertedScroll = maxScroll - contentOffset.y;
    setScrollAmount(invertedScroll);
  };
  const handleContentSizeChange = useCallback((event: any) => {
    const newHeight = event.nativeEvent.contentSize.height;
    height.value = withTiming(newHeight, { duration: 100 });
  }, []);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: height.value,
      maxHeight: 80,
    };
  });
  const scrollViewRef = useRef<ScrollViewTypes>(null);

  useLayoutEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  const x = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = x.value;
      console.log("client", ctx.startX, x.value);
    },
    onActive: (event, ctx) => {
      if (x.value > TRESHOLD_SLIDE) {
        runOnJS(resetAudio)();
      }
      x.value = withSpring(
        Math.min(ctx.startX + event.translationX, TRESHOLD_SLIDE),
        { velocity: 0, stiffness: 300 }
      );
      console.log("client", ctx.startX, x.value, width);
    },
    onEnd: (_) => {
      x.value = withSpring(0, { velocity: 0, stiffness: 300 });
    },
  });

  useEffect(() => {
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

  async function playSound() {
    console.log("Loading Sound");
    if (!!pathVoiceNote) {
      const { sound } = await Audio.Sound.createAsync({ uri: pathVoiceNote });
      if (sound) {
        setSound(sound);
      }
      console.log("Playing Sound");
      await sound.playAsync();
    }
  }
  async function pauseSound() {
    try {
      console.log("Pausing Sound");
      await sound?.pauseAsync();
    } catch (err) {
      console.error("Failed to pause sound", err);
    }
  }
  async function resetAudio() {
    if (recording) {
      // await recording.stopAndUnloadAsync();
      await recording._cleanupForUnloadedRecorder({
        canRecord: false,
        durationMillis: 0,
        isRecording: false,
        isDoneRecording: false,
      });
      setPathVoiceNote("");
      setRecording(undefined);
    }
    if (sound) {
      await sound.unloadAsync();
      setSound(undefined);
    }
  }
  function formatDuration(durationMillis: number) {
    const totalSeconds = Math.floor(durationMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  console.log(statusRecord?.durationMillis > 0, statusRecord?.durationMillis);

  return (
    <ImageBackground
      source={require("../assets/images/splash.png")}
      style={{ flex: 1, marginTop: StatusBar.currentHeight }}
    >
      <StatusBar
        backgroundColor={Colors[colorSheme ?? "light"].primaryColour}
        barStyle={"light-content"}
      />
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
            marginRight: horizontalScale(10),
          }}
        >
          <FontAwesome
            name="video-camera"
            size={25}
            color={Colors[colorSheme ?? "light"].textOverlay}
          />
          <FontAwesome
            name="phone"
            size={25}
            color={Colors[colorSheme ?? "light"].textOverlay}
          />
          <FontAwesome5
            name="ellipsis-v"
            size={25}
            color={Colors[colorSheme ?? "light"].textOverlay}
          />
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled={true}
        keyboardVerticalOffset={verticalScale(30)}
        style={{
          flex: 1,
        }}
      >
        <ScrollViewTypes
          onScroll={handleScroll}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
            marginBottom: verticalScale(25),
          }}
          ref={scrollViewRef}
          onContentSizeChange={(contentWidth, contentHeight) => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {/* {showMessages.map((item, index) => (
            <MessageItem
              key={index.toString()}
              item={item}
              i={index}
              setLastHeightComment={setLastHeightComment}
              vectors={vectors}
            />
          ))} */}
          <View
            style={{
              height: LAST_ELEMENT_SCROLL,
              backgroundColor: Colors[colorSheme ?? "light"].primaryColour,
            }}
          />
        </ScrollViewTypes>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            position: "absolute",
            paddingHorizontal: horizontalScale(7),
            paddingBottom: verticalScale(10),
            bottom: 0,
            flex: 1,
            backgroundColor: Colors[colorSheme ?? "light"].primaryColour,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1.5,
              backgroundColor: Colors[colorSheme ?? "light"].primaryColour,
            }}
            onPress={() => {}}
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
          </TouchableOpacity>
          <Animated.View
            style={[
              animatedStyles,
              { alignSelf: "center", alignItems: "flex-start", flex: 10 },
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
                  Slide to cancel
                </MonoText>
              </View>
            ) : (
              // <View
              //   style={{
              //     width: width - horizontalScale(140),
              //     backgroundColor: Colors[colorSheme ?? "light"].primaryColour,
              //   }}
              // />
              <TextInput
                ref={inputRef}
                onChangeText={setText}
                placeholder={"Write something..."}
                placeholderTextColor="#fefefefe"
                value={text}
                multiline={true}
                // autoFocus={true}
                scrollEnabled={true}
                onContentSizeChange={handleContentSizeChange}
                style={{
                  fontSize: moderateScale(17),
                  color: Colors[colorSheme ?? "light"].textOverlay,
                  marginLeft: horizontalScale(5),
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
            }}
          >
            {!(duration > 0) && (
              <TouchableOpacity
                onPress={() => {
                  if (!text) {
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
              {text ? (
                <TouchableOpacity style={{}} onPress={() => {}}>
                  <Feather
                    name="send"
                    size={27}
                    color={Colors[colorSheme ?? "light"].textOverlay}
                  />
                </TouchableOpacity>
              ) : (
                <PanGestureHandler onGestureEvent={gestureHandler}>
                  <Animated.View
                    // lightColor={Colors[colorSheme ?? "light"].primaryColour}
                    // darkColor={Colors[colorSheme ?? "light"].primaryColour}
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
                      // onPress={() => {}}
                      // onPress={recording ? stopRecording : startRecording}
                      style={[
                        { justifyContent: "center", alignItems: "center" },
                      ]}
                      onLongPress={startRecording}
                      onPressOut={stopRecording}
                    >
                      <MaterialIcons
                        name="keyboard-voice"
                        size={duration > 0 ? 47 : 30}
                        color={
                          recording
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

export default discussion;
