import GradientBackground from "@/components/GradientBackground";
import ProfileAvatar from "@/components/ProfileAvatar";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown, Edit04Icon, Logout01Icon, Mail01Icon, UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Accordion, Button, ScrollView, Separator, Spinner, Text, View, XStack, YStack } from "tamagui";


export default function Profile() {
    const { user, logout } = useAuth();


    const [isLoading, setIsLoading] = useState(false)


    const handleLogout = async () => {
        try {

            setIsLoading(true)
            await logout()
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
                <YStack paddingHorizontal={20} paddingTop={40} flex={1}>
                    <YStack alignItems="center" gap={"$3"}>
                        <ProfileAvatar date="12" />
                        <Text fontSize={20} fontWeight={500} color={"white"}>{user?.name}</Text>
                        <Button onPress={() => router.push("/editProfile")} borderRadius={"$10"} paddingHorizontal={30}><HugeiconsIcon icon={Edit04Icon} />Edit Profile</Button>
                        <Separator my={14} borderColor={'#22221ffd'} width={"100%"} borderWidth={.5} />
                    </YStack>
                    <ScrollView showsVerticalScrollIndicator={false} >
                        <Text textTransform="capitalize" fontSize={"$5"} color={colors.primaryWhite}>Account</Text>
                        <YStack width={"100%"}>
                            <Accordion type="single" collapsible backgroundColor="transparent">
                                <Accordion.Item value="personal-information" backgroundColor="transparent">
                                    <Accordion.Header backgroundColor="transparent">
                                        <Accordion.Trigger
                                            backgroundColor="transparent"
                                            // paddingVertical={"$5"}
                                            borderWidth={0}
                                            paddingHorizontal={0}
                                            pressStyle={{ backgroundColor: "transparent" }}
                                            focusStyle={{ backgroundColor: "transparent" }}
                                        >
                                            <XStack width={"100%"} alignItems="center" justifyContent="space-between">
                                                <YStack gap="$1">
                                                    <Text color={colors.primaryWhite} fontSize="$6">
                                                        Personal Information
                                                    </Text>
                                                    <Text color={colors.secondaryWhite} fontSize="$2">
                                                        Name and account details
                                                    </Text>
                                                </YStack>
                                                <View>
                                                    <HugeiconsIcon icon={ChevronDown} size={20} color={colors.primaryWhite} />
                                                </View>
                                            </XStack>
                                        </Accordion.Trigger>
                                    </Accordion.Header>

                                    <Accordion.Content padding={0} backgroundColor="transparent">
                                        <Separator marginBottom={5} borderColor={'#22221ffd'} width={"100%"} borderWidth={.5} />

                                        <YStack paddingBottom="$3" gap="$4">
                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} color={colors.secondaryWhite} icon={UserIcon} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={colors.primaryWhite}>Full name</Text>
                                                    <Text fontSize={"$2"} color={colors.secondaryWhite}>Edit your name</Text>
                                                </YStack>
                                            </XStack>

                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} icon={Mail01Icon} color={colors.secondaryWhite} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={colors.primaryWhite}>Email address</Text>
                                                    <Text fontSize={"$2"} color={colors.secondaryWhite}>Manage your email</Text>
                                                </YStack>
                                            </XStack>


                                        </YStack>
                                    </Accordion.Content>
                                </Accordion.Item>
                            </Accordion>

                            <Accordion type="single" collapsible backgroundColor="transparent">
                                <Accordion.Item value="privacy-security" backgroundColor="transparent">
                                    <Accordion.Header backgroundColor="transparent">
                                        <Accordion.Trigger
                                            backgroundColor="transparent"
                                            // paddingVertical={"$5"}
                                            borderWidth={0}
                                            paddingHorizontal={0}
                                            pressStyle={{ backgroundColor: "transparent" }}
                                            focusStyle={{ backgroundColor: "transparent" }}
                                        >
                                            <XStack width={"100%"} alignItems="center" justifyContent="space-between">
                                                <YStack gap="$1">
                                                    <Text color={colors.primaryWhite} fontSize="$6">
                                                        Privacy & Security
                                                    </Text>
                                                    <Text color={colors.secondaryWhite} fontSize="$2">
                                                        Understand how your data is handled
                                                    </Text>
                                                </YStack>
                                                <View>
                                                    <HugeiconsIcon icon={ChevronDown} size={20} color={colors.primaryWhite} />
                                                </View>
                                            </XStack>
                                        </Accordion.Trigger>
                                    </Accordion.Header>

                                    <Accordion.Content padding={0} backgroundColor="transparent">
                                        <Separator marginBottom={5} borderColor={'#22221ffd'} width={"100%"} borderWidth={.5} />

                                        <YStack paddingBottom="$3" gap="$4">
                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} color={colors.secondaryWhite} icon={UserIcon} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={colors.primaryWhite}>Location & GPS</Text>
                                                    <Text fontSize={"$2"} color={colors.secondaryWhite}>Learn how StrideFlow uses your location</Text>
                                                </YStack>
                                            </XStack>

                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} icon={Mail01Icon} color={colors.secondaryWhite} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={colors.primaryWhite}>Your activity data</Text>
                                                    <Text fontSize={"$2"} color={colors.secondaryWhite}>Understand how routes and activity history are stored</Text>
                                                </YStack>
                                            </XStack>
                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} icon={Mail01Icon} color={colors.secondaryWhite} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={colors.primaryWhite}>Privacy Policy</Text>
                                                    <Text fontSize={"$2"} color={colors.secondaryWhite}>Read how your information is handled</Text>
                                                </YStack>
                                            </XStack>
                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} icon={Mail01Icon} color={colors.secondaryWhite} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={colors.primaryWhite}>Terms of Service</Text>
                                                    <Text fontSize={"$2"} color={colors.secondaryWhite}>Review the terms for using StrideFlow</Text>
                                                </YStack>
                                            </XStack>
                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} icon={Mail01Icon} color={colors.secondaryWhite} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={colors.primaryWhite}>App Permissions</Text>
                                                    <Text fontSize={"$2"} color={colors.secondaryWhite}>Manage location and other permissions in device settings</Text>
                                                </YStack>
                                            </XStack>


                                        </YStack>
                                    </Accordion.Content>
                                </Accordion.Item>
                            </Accordion>
                            <Separator my={14} borderColor={'#22221ffd'} width={"100%"} borderWidth={.5} />
                            <Text textTransform="capitalize" fontSize={"$5"} color={colors.primaryWhite}>Preferences</Text>
                        </YStack>
                    </ScrollView>

                    <Separator my={14} borderColor={'#22221ffd'} width={"100%"} borderWidth={.5} />
                    <XStack onPress={handleLogout} alignItems="center" gap={"$4"}>

                        {
                            isLoading ? (<Spinner
                                size="small"
                                color="#ec3c019a"
                            />) : (
                                <>
                                    <HugeiconsIcon icon={Logout01Icon} size={20} color={"#ec3c019a"} />
                                    <Text fontSize={"$6"} color={"#ec3c019a"}>Logout</Text>
                                </>
                            )
                        }

                    </XStack>
                </YStack>
            </SafeAreaView>
        </GradientBackground>
    )
}