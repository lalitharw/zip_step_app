import { colors } from '@/constants/theme';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { View } from 'tamagui';

export default function BackButton() {

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
            top={80}
            left={20}
            height={48}
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