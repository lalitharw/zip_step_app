import { colors } from '@/constants/theme';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { View } from 'tamagui';

type backButtonProps = {
    top?: null | number,
    left?: null | number
}

export default function BackButton({ top = 80, left = 15 }: backButtonProps) {

    const handleGoBack = () => {
        if (router.canGoBack()) {
            router.back()
        }
        else {
            router.replace("/")
        }

    }

    return (

        <View
            onPress={handleGoBack}
            position="absolute"
            top={top}
            left={left}
            height={48}
            zIndex={1000}
            width={48}
            backgroundColor="#3a343494"
            borderRadius={"50%"}
            alignItems="center"
            justifyContent="center"
        >
            <HugeiconsIcon
                icon={ArrowLeft02Icon}
                size={25}
                color={colors.primaryWhite}
                strokeWidth={1.5}
            />
        </View>


    )
}