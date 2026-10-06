import GradientBackground from "@/components/GradientBackground";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useAuth } from "@/context/AuthContext";
import { Edit04Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Separator, Spinner, Text, View, YStack } from "tamagui";


export default function Profile() {
    const { user, logout } = useAuth();


    const [isLoading, setIsLoading] = useState(false)


    const handleLogout = async () => {
        try {

            await logout()
            setIsLoading(true)
        }
        catch (err) {

        }
        finally {
            setIsLoading(false)
        }
    }
    return (
        <GradientBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <YStack padding={20} paddingVertical={40} flex={1}>
                    <YStack alignItems="center" gap={"$"}>
                        <ProfileAvatar date="12"/>
                        <Text fontSize={20} fontWeight={500} color={"white"}>{user?.name}</Text>
                        <Button onPress={() => router.push("/editProfile")} borderRadius={"$10"} paddingHorizontal={30}><HugeiconsIcon icon={Edit04Icon} />Edit Profile</Button>
                        <Separator my={14} borderColor={'#22221ffd'} width={"100%"} borderWidth={.5} />
                    </YStack>

                    <View position="absolute" justifyContent="center" width={"100%"} left={20} bottom={"10"}>
                        <Separator my={14} borderColor={'#22221ffd'} width={"100%"} borderWidth={.5} />
                        <Text fontSize={20} fontWeight={"bold"} color={"#771717"} onPress={handleLogout}>
                            {isLoading ? <Spinner size="small" color="$green10" /> : "Logout"}
                        </Text>
                        {/* <Button onPress={handleLogout} borderRadius={"$10"}  > />

                    </Button> */}
                    </View>
                </YStack>
            </SafeAreaView>
        </GradientBackground>
    )
}