import { colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Delete01FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { View } from 'tamagui';

type deleteButtonProps = {

    onPressDelete: () => void
}

export default function DeleteButton({onPressDelete} : deleteButtonProps) {
    const {theme} = useTheme()

    return (

        <View
            onPress={onPressDelete}
           
            borderWidth={0.1}
          
           
        
            alignItems="center"
            justifyContent="center"
        >
            {
                <HugeiconsIcon
                    icon={Delete01FreeIcons}
                    size={25}
                    color={theme.buttonDanger}
                    strokeWidth={1.5}
                />
            }

        </View>


    )
}