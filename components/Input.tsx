import { useTheme } from "@/context/ThemeContext";
import { Keyboard } from "react-native";
import { Input, Text, View } from "tamagui";

type Props = {
    name?: string;
    placeholder?: string;
    value?: string;
    setValue?: (text: string) => void;
    error?: string;
    isDisabled?: boolean
    extraOptions?: any
}

export default function InputComponent({ name, placeholder, isDisabled = false, error, value, setValue, extraOptions }: Props) {
    const { theme } = useTheme()
    return (
        <View width={"100%"}>
            {name && <Text marginBottom={5} color={theme.text}>{name}</Text>}
            <Input disabled={isDisabled} value={value} onFocus={() => ((isDisabled: boolean) => { isDisabled && Keyboard.dismiss() })} focusStyle={{
                borderColor: error ? "$red10" : theme.inputBorder,
                borderWidth: 1,
            }} color={theme.text} caretHidden={isDisabled} selectTextOnFocus={isDisabled} borderWidth={1} borderColor={error ? "$red10" : theme.inputBorder} onChangeText={setValue} width={"100%"} backgroundColor={"transparent"} placeholderTextColor="#edede918" placeholder={placeholder} size={"$5"}  {...extraOptions} />
            {error && (
                <Text
                    color="$red10"
                    fontSize="$2"
                    marginTop={2}
                >
                    {error}
                </Text>
            )}
        </View>
    )
}