
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from "react-native";

type Props = {
  accuracy?: number | null;
  heading?: number | null;
  mapBearing?: number;
};

const BLUE = "#1397c3";

export default function PulsingLocationPuck({
  accuracy,
  heading,
  mapBearing = 0,
}: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
      pulse.stopAnimation();
    };
  }, [pulse]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.8],
  });

  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0],
  });

  const hasAccuracy =
    accuracy != null &&
    Number.isFinite(accuracy) &&
    accuracy > 0;

  const hasHeading =
    heading != null &&
    Number.isFinite(heading) &&
    heading >= 0;

  // Visual approximation in screen pixels, not geographic meters.
  const accuracyRadius = hasAccuracy
    ? Math.max(12, Math.min(accuracy!, 50))
    : 0;

  // Compass heading is relative to north.
  // Subtract map bearing so the arrow remains geographically aligned.
  const arrowRotation = hasHeading
    ? ((heading! - mapBearing) % 360 + 360) % 360
    : 0;

  return (
    <View
      accessible={false}
      pointerEvents="none"
      style={styles.container}
    >
      {/* Approximate GPS accuracy circle */}
      {hasAccuracy && (
        <View
          style={[
            styles.accuracyCircle,
            {
              width: accuracyRadius * 2,
              height: accuracyRadius * 2,
              borderRadius: accuracyRadius,
            },
          ]}
        />
      )}

      {/* Pulse animation */}
      <Animated.View
        style={[
          styles.pulse,
          {
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          },
        ]}
      />

      {/* Heading arrow */}
      {hasHeading && (
        <View
          style={[
            styles.headingContainer,
            {
              transform: [{ rotate: `${arrowRotation}deg` }],
            },
          ]}
        >
          <View style={styles.headingArrow} />
        </View>
      )}

      {/* Center location dot */}
      <View style={styles.dot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },

  accuracyCircle: {
    position: "absolute",
    backgroundColor: "rgba(19, 151, 195, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(19, 151, 195, 0.4)",
  },

  pulse: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: BLUE,
    backgroundColor: "rgba(19, 151, 195, 0.15)",
  },

  headingContainer: {
    position: "absolute",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  headingArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 17,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: BLUE,
  },

  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: BLUE,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
});
