import BackButton from "@/components/buttons/BackButton";
import GradientBackground from "@/components/GradientBackground";
import InputComponent from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Avatar, Button, Spinner, XStack, YStack } from "tamagui";

export default function editProfile() {
    const {theme} = useTheme()
    const { user, updateProfile } = useAuth()
    const [username, setUsername] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [isLoading, setIsLoading] = useState(false)

    const handleProfileUpdate = async () => {
        if (!username) {
            // AlertDialog({ title: "Error", description: "Name Field is required", type: "error" })
            return
        }
        try {
            setIsLoading(true)
            await updateProfile(username)
        }
        catch (error) {
            // AlertDialog({
            //     title: "Something went wrong",
            //     description: "Please try again later!",
            //     type: "error"
            // })
            Toast.show({
                type: "error",

            })
        }
        finally {
            setIsLoading(false)
        }
    }


    return (
        <GradientBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <BackButton top={60}/>
                <YStack padding={20} paddingVertical={40}>
                    <YStack gap={"$5"}>
                        <XStack justifyContent="center">

                            <Avatar circular size="$10">
                                <Avatar.Image
                                    aria-label="Cam"
                                    src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
                                />
                                <Avatar.Fallback bg="$blue10" />
                            </Avatar>
                        </XStack>
                        <InputComponent name="Name" value={username} setValue={setUsername} />

                        <InputComponent name="Email" value={email} setValue={setEmail} isDisabled={true}  />
                        <Button disabled={isLoading} onPress={handleProfileUpdate} borderRadius={"$5"}>
                            {isLoading ? <Spinner size="small" color={theme.spinner} /> : "Update"}
                        </Button>
                    </YStack>
                </YStack>
            </SafeAreaView>
        </GradientBackground>
    )
}