import { Text, View } from "tamagui";

export const toastConfig = {
    error: ({
        text1 = "Something went wrong! Please try again later",
        text2 = ""
    }: {
        text1?: string,
        text2?: string
    }) => (
        <View
            borderRadius="$4"
            padding="$3"
            minHeight={60}
            zIndex={9999}
            width="90%"
            backgroundColor="tomato"
            justifyContent="center"
        >
            <Text color="white" fontWeight="bold">
                {text1}
            </Text>
            <Text color="white" fontWeight="bold">
                {text2}
            </Text>

        </View>
    ),

    success: ({
        text1,
    }: {
        text1?: string;

    }) => (
        <View
            borderRadius="$4"
            padding="$3"
            minHeight={60}
            width="90%"
            backgroundColor="#22c55e"
            justifyContent="center"
        >
            <Text color="white" fontWeight="bold">
                {text1}
            </Text>
        </View>
    ),
};