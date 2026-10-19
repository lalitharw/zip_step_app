
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    StyleSheet,
    View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
    heading: number;
};

export default function LocationPointer({ heading }: Props) {
    const pulse = useRef(new Animated.Value(0)).current;
    const rotation = useRef(new Animated.Value(heading)).current;
    const previousHeading = useRef(heading);

    // Pulsing animation
    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 1200,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => animation.stop();
    }, [pulse]);

    // Smooth heading rotation
    useEffect(() => {
        const previous = previousHeading.current;
        const delta = ((heading - previous + 540) % 360) - 180;
        const next = previous + delta;

        rotation.stopAnimation();

        Animated.timing(rotation, {
            toValue: next,
            duration: 180,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        previousHeading.current = next;
    }, [heading, rotation]);

    const rotate = rotation.interpolate({
        inputRange: [-720, 720],
        outputRange: ["-720deg", "720deg"],
        extrapolate: "extend",
    });

    const pulseScale = pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.7, 1.5],
    });

    const pulseOpacity = pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 0],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.direction,
                    { transform: [{ rotate }] },
                ]}
            >
                <Svg
                    width={60}
                    height={60}
                    viewBox="0 0 100 100"
                >
                    <Path
                        d="M50 50 L25 4 Q50 -4 75 4 Z"
                        fill="#168BFF"
                        fillOpacity={0.2}
                    />

                    <Path
                        d="M50 13 L65 47 L50 41 L35 47 Z"
                        fill="#168BFF"
                        stroke="#FFFFFF"
                        strokeWidth={2.5}
                        strokeLinejoin="round"
                    />
                </Svg>
            </Animated.View>

            {/* Pulse */}
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.pulse,
                    {
                        opacity: pulseOpacity,
                        transform: [{ scale: pulseScale }],
                    },
                ]}
            />

            {/* Location dot */}
            <View style={styles.dotOuter}>
                <View style={styles.dotInner} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
    },
    direction: {
        position: "absolute",
        width: 60,
        height: 60,
    },
    pulse: {
        position: "absolute",
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#168BFF",
    },
    dotOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
    },
    dotInner: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        backgroundColor: "#168BFF",
    },
});
