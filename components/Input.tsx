import { Input, Label } from "tamagui";

type Props = {
    name?: string;
    placeholder?: string;
    value?: string;
    setValue?: (text: string) => void;
    extraOptions?: any
}

export default function InputComponent({ name, placeholder, value, setValue, extraOptions }: Props) {
    return (
        <>
            {name && <Label color={"#edede9"}>{name}</Label>}
            <Input value={value} color={"#edede967"} onChangeText={setValue} width={"100%"} backgroundColor={"transparent"} placeholderTextColor="#edede967" placeholder={placeholder} size={"$4"} borderWidth={0.10} {...extraOptions} />
        </>
    )
}