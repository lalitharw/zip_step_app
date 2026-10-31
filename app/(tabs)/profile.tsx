import GradientBackground from "@/components/GradientBackground";
import ProfileAvatar from "@/components/ProfileAvatar";
import SeparatorVertical from "@/components/separators/SeparatorVertical";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ChevronDown, Edit04Icon, Logout01Icon, Mail01Icon, Moon02FreeIcons, Sun01FreeIcons, UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Accordion, Button, ScrollView, Separator, Spinner, Switch, Text, View, XStack, YStack } from "tamagui";

export default function Profile() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme()


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
                        <Text fontSize={20} fontWeight={500} color={theme.text}>{user?.name}</Text>
                        <Button backgroundColor={theme.buttonPrimary} color={theme.buttonPrimaryText} onPress={() => router.push("/editProfile")} borderRadius={"$10"} paddingHorizontal={30}><HugeiconsIcon icon={Edit04Icon} />Edit Profile</Button>
                        <Separator my={14} borderColor={theme.separator} width={"100%"} borderWidth={.5} />
                    </YStack>
                    <ScrollView showsVerticalScrollIndicator={false} >
                        <Text textTransform="capitalize" fontSize={"$5"} color={theme.text}>Account</Text>
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
                                                    <Text color={theme.text} fontSize="$6">
                                                        Personal Information
                                                    </Text>
                                                    <Text color={theme.secondaryText} fontSize="$2">
                                                        Name and account details
                                                    </Text>
                                                </YStack>
                                                <View>
                                                    <HugeiconsIcon icon={ChevronDown} size={20} color={theme.text} />
                                                </View>
                                            </XStack>
                                        </Accordion.Trigger>
                                    </Accordion.Header>

                                    <Accordion.Content padding={0} backgroundColor="transparent">
                                        <Separator marginBottom={5} borderColor={theme.separator} width={"100%"} borderWidth={.5} />

                                        <YStack paddingBottom="$3" gap="$4">
                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} color={theme.secondaryText} icon={UserIcon} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={theme.text}>Full name</Text>
                                                    <Text fontSize={"$2"} color={theme.secondaryText}>Edit your name</Text>
                                                </YStack>
                                            </XStack>

                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} icon={Mail01Icon} color={theme.secondaryText} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={theme.text}>Email address</Text>
                                                    <Text fontSize={"$2"} color={theme.secondaryText}>Manage your email</Text>
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
                                                    <Text color={theme.text} fontSize="$6">
                                                        Privacy & Security
                                                    </Text>
                                                    <Text color={theme.secondaryText} fontSize="$2">
                                                        Understand how your data is handled
                                                    </Text>
                                                </YStack>
                                                <View>
                                                    <HugeiconsIcon icon={ChevronDown} size={20} color={theme.text} />
                                                </View>
                                            </XStack>
                                        </Accordion.Trigger>
                                    </Accordion.Header>

                                    <Accordion.Content padding={0} backgroundColor="transparent">
                                        <Separator marginBottom={5} borderColor={theme.separator} width={"100%"} borderWidth={.5} />

                                        <YStack paddingBottom="$3" gap="$4">
                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} color={theme.secondaryText} icon={UserIcon} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={theme.text}>Location & GPS</Text>
                                                    <Text fontSize={"$2"} color={theme.secondaryText}>Learn how StrideFlow uses your location</Text>
                                                </YStack>
                                            </XStack>

                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} icon={Mail01Icon} color={theme.secondaryText} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={theme.text}>Your activity data</Text>
                                                    <Text fontSize={"$2"} color={theme.secondaryText}>Understand how routes and activity history are stored</Text>
                                                </YStack>
                                            </XStack>
                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} icon={Mail01Icon} color={theme.secondaryText} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={theme.text}>Privacy Policy</Text>
                                                    <Text fontSize={"$2"} color={theme.secondaryText}>Read how your information is handled</Text>
                                                </YStack>
                                            </XStack>
                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} icon={Mail01Icon} color={theme.secondaryText} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={theme.text}>Terms of Service</Text>
                                                    <Text fontSize={"$2"} color={theme.secondaryText}>Review the terms for using StrideFlow</Text>
                                                </YStack>
                                            </XStack>
                                            <XStack alignItems="center" gap={"$3"}>
                                                <HugeiconsIcon size={20} icon={Mail01Icon} color={theme.secondaryText} />
                                                <YStack>
                                                    <Text fontSize={"$5"} color={theme.text}>App Permissions</Text>
                                                    <Text fontSize={"$2"} color={theme.secondaryText}>Manage location and other permissions in device settings</Text>
                                                </YStack>
                                            </XStack>


                                        </YStack>
                                    </Accordion.Content>
                                </Accordion.Item>
                            </Accordion>
                            <Separator my={14} borderColor={theme.separator} width={"100%"} borderWidth={.5} />
                            <Text textTransform="capitalize" fontSize={"$5"} color={theme.text}>Preferences</Text>
                            <XStack
                                alignItems="center"
                                justifyContent="space-between"
                                paddingVertical="$3"
                            >
                                <XStack alignItems="center" gap="$3" flex={1}>
                                    <HugeiconsIcon
                                        icon={Moon02FreeIcons}
                                        size={22}
                                        color={theme.secondaryText}
                                    />
                                    <YStack gap="$1" flex={1}>
                                        <Text color={theme.text} fontSize="$5">
                                            Appearance
                                        </Text>
                                        <Text color={theme.secondaryText} fontSize="$2">
                                            Choose your preferred theme
                                        </Text>
                                    </YStack>
                                </XStack>

                                <XStack alignItems="center" height="100%">
                                    <View>
                                        {
                                           <HugeiconsIcon size={20} icon={isDark ? Moon02FreeIcons: Sun01FreeIcons} color={theme.secondaryText} />
                                        }
                                    </View>



                                    <SeparatorVertical />

                                    <Switch
                                        size="$4"
                                        checked={isDark}
                                        onCheckedChange={toggleTheme}
                                        backgroundColor={isDark ? "#1C2736" : "#DCE3EA"}
                                        
                                        borderWidth={0}
                                        focusStyle={{
                                            backgroundColor: isDark ? "#1C2736" : "#DCE3EA",
                                        }}
                                        hoverStyle={{
                                            backgroundColor: isDark ? "#1C2736" : "#DCE3EA",
                                        }}
                                    >
                                        <Switch.Thumb
                                            transition="quicker"
                                            backgroundColor={isDark ? "#B6F500" : "#FFFFFF"}
                                        />
                                    </Switch>
                                </XStack>

                            </XStack>
                        </YStack>
                    </ScrollView>

                    <Separator my={14} borderColor={theme.separator} width={"100%"} borderWidth={.5} />
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