import { colors } from '@/constants/theme';
import { Delete01FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { View } from 'tamagui';

type deleteButtonProps = {
    top?: null | number,
    right?: null | number,
    onPressDelete: () => void
}

export default function DeleteButton({ top = 80, right = 15, onPressDelete }: deleteButtonProps) {


    return (

        <View
            onPress={onPressDelete}
            position="absolute"
            borderColor={"#d91313"}
            borderWidth={0.1}
            top={top}
            right={right}

            height={48}
            zIndex={1000}
            width={48}
            backgroundColor="#460f0f94"
            borderRadius={"50%"}
            alignItems="center"
            justifyContent="center"
        >
            {
                <HugeiconsIcon
                    icon={Delete01FreeIcons}
                    size={25}
                    color={colors.primaryWhite}
                    strokeWidth={1.5}
                />
            }

        </View>


    )
}