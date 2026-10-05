import Svg, {
  Defs,
  Path,
  Text as SvgText,
  TextPath,
} from "react-native-svg";
import { Avatar, YStack } from "tamagui";

export default function ProfileAvatar() {
  return (
    <YStack
      width={190}
      height={190}
      alignItems="center"
      justifyContent="center"
    >
      <Svg
        width={190}
        height={190}
        viewBox="0 0 190 190"
        style={{
          position: "absolute",
        }}
      >
        <Defs>
          <Path
            id="memberCircle"
            d="
              M 95 15
              A 80 80 0 1 1 95 175
              A 80 80 0 1 1 95 15
            "
            fill="none"
          />
        </Defs>

        <SvgText
          fill="#888"
          fontSize="10"
          fontWeight="600"
          letterSpacing="2"
        >
          <TextPath
            href="#memberCircle"
            startOffset="-8%"
          >
            MEMBER SINCE • 4 OCT 2026 •
          </TextPath>
        </SvgText>
      </Svg>

      <Avatar circular size="$10">
        <Avatar.Image
          accessibilityLabel="Profile picture"
          source={{
            uri: "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
          }}
        />

        <Avatar.Fallback bg="$blue10" />
      </Avatar>
    </YStack>
  );
}