// components/AlertDialog.tsx
import { Modal } from "react-native";
import { Button, Dialog, YStack } from "tamagui";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
};

export default function AlertBox({ open, onOpenChange, title, description }: Props) {
    return (
        <Modal></Modal>
    );
}