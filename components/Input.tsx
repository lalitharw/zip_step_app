import { Input, Text, View } from "tamagui";

type Props = {
    name?: string;
    placeholder?: string;
    value?: string;
    setValue?: (text: string) => void;
    error?: string;
    extraOptions?: any
}

export default function InputComponent({ name, placeholder, error, value, setValue, extraOptions }: Props) {
    return (
        <View width={"100%"}>
            {name && <Text marginBottom={5} color={"white"}>{name}</Text>}
            <Input value={value} color={"white"} borderWidth={1} borderColor={error ? "$red10" : "rgb(197, 176, 176)"} onChangeText={setValue} width={"100%"} backgroundColor={"transparent"} placeholderTextColor="#edede918" placeholder={placeholder} size={"$5"}  {...extraOptions} />
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