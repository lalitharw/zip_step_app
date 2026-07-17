import GradientBackground from "@/components/GradientBackground";
import InputComponent from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Spinner, XStack, YStack } from "tamagui";

export default function editProfile() {
    const { user, updateProfile } = useAuth()
    const [username, setUsername] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [isLoading, setIsLoading] = useState(false)

    const handleProfileUpdate = async () => {
        if (!username) {
            Alert.alert("Empty Field", "Name field cannot be empty!")
            return
        }
        try {
            setIsLoading(true)
            await updateProfile(username)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    }


    return (
        <GradientBackground>
            <SafeAreaView style={{ flex: 1 }}>
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

                        <InputComponent name="Email" value={email} setValue={setEmail} />
                        <Button disabled={isLoading} onPress={handleProfileUpdate} borderRadius={"$10"}>
                            {isLoading ? <Spinner size="small" color="$green10" /> : "Update"}
                        </Button>
                    </YStack>
                </YStack>
            </SafeAreaView>
        </GradientBackground>
    )
}