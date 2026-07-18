import GradientBackground from "@/components/GradientBackground";
import { useAuth } from "@/context/AuthContext";
import { Edit04Icon, Logout01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Separator, Spinner, Text, YStack } from "tamagui";


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
        // <SafeAreaView>
        //     <View>
        //         <Text>Profile {user?.name}</Text>
        //         <Button disabled={isLoading} onPress={handleLogout}>
        //             {
        //                 isLoading ? "Logging Out" : "Logout"
        //             }
        //         </Button>
        //     </View>
        // </SafeAreaView>
        <GradientBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <YStack padding={20} paddingVertical={40} flex={1}>
                    <YStack alignItems="center" gap={"$3"}>
                        <Avatar circular size="$10">
                            <Avatar.Image
                                aria-label="Cam"
                                src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
                            />
                            <Avatar.Fallback bg="$blue10" />
                        </Avatar>
                        <Text fontSize={20} fontWeight={500} color={"white"}>{user?.name}</Text>
                        <Button onPress={() => router.push("/editProfile")} borderRadius={"$10"} paddingHorizontal={30}><HugeiconsIcon icon={Edit04Icon} />Edit Profile</Button>
                        <Separator my={14} borderColor={'#22221ffd'} width={"100%"} borderWidth={.5} />
                        <Button onPress={handleLogout} borderRadius={"$10"} width={"100%"} paddingHorizontal={30}><HugeiconsIcon icon={Logout01Icon} />
                            {isLoading ? <Spinner size="small" color="$green10" /> : "Sign Out"}
                        </Button>
                    </YStack>
                </YStack>
            </SafeAreaView>
        </GradientBackground>
    )
}