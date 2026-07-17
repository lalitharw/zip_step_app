import Toast from 'react-native-toast-message';

type Props = {
    title?: string;
    description?: string;
    type: "success" | "error"
};



export function AlertDialog({ title, description, type = "success" }: Props) {
    Toast.show({
        type: type,
        text1: title,
        text2: description
    })
}