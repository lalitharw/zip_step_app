
import { useLocationStore } from "@/store/locationStore";
import { useEffect } from "react";
import CompassHeading from "react-native-compass-heading";

export const useCompassDirection = () => {

    useEffect(() => {
        const degreeUpdateRate = 1;

        CompassHeading.start(
            degreeUpdateRate,
            ({ heading, accuracy }: {
                heading: number;
                accuracy: number;
            }) => {
                useLocationStore.getState().setCompassHeading(heading)
            }
        );

        return () => {
            CompassHeading.stop();
        };
    }, []);

};
