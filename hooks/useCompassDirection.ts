
import { useEffect, useState } from "react";
import CompassHeading from "react-native-compass-heading";

export const useCompassDirection = () => {
    const [heading, setHeading] = useState(0);

    useEffect(() => {
        const degreeUpdateRate = 1;

        CompassHeading.start(
            degreeUpdateRate,
            ({ heading, accuracy }: {
                heading: number;
                accuracy: number;
            }) => {
                setHeading(heading);
            }
        );

        return () => {
            CompassHeading.stop();
        };
    }, []);

    return heading;
};
