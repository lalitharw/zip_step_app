
const VARIANT = process.env.EXPO_PUBLIC_APP_VARIANT || "development"

const ENV = {
    development: {
        name: "Zipstep Dev",
        id: "in.zipstep.app.development",
        scheme: "zipstep-dev",
        firebaseDir: "dev",
        cleartext: true
    },

    staging: {
        name: "Zipstep Staging",
        id: "in.zipstep.app.staging",
        scheme: "zipstep-staging",
        firebaseDir: "staging",
        cleartext: true
    }
}[VARIANT]


export default {
    expo: {
        name: ENV.name,
        slug: "stride_flow_app",
        version: "1.0.0",_
        orientation: "portrait",
        icon: "./assets/images/android-icon-foreground.png",
        scheme: ENV.schema,
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            bundleIdentifier: ENV.id
        },
        android: {
            package: ENV.id,
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? `./firebase/${ENV.firebaseDir}/google-services.json`,
            adaptiveIcon: {
                backgroundColor: "#E6F4FE",
                foregroundImage: "./assets/images/android-icon-foreground.png"
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            permissions: [
                'android.permission.ACCESS_COARSE_LOCATION',
                'android.permission.ACCESS_FINE_LOCATION',
                'android.permission.ACCESS_BACKGROUND_LOCATION',
                'android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
                'android.permission.READ_EXTERNAL_STORAGE',
                'android.permission.WRITE_EXTERNAL_STORAGE',
                'android.permission.INTERNET',
                'android.permission.FOREGROUND_SERVICE',
                'android.permission.FOREGROUND_SERVICE_LOCATION',
            ]
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },

        "plugins": [
            "expo-notifications",
            "expo-router",
            "@react-native-google-signin/google-signin",
            "@react-native-firebase/app",
            "@react-native-firebase/auth",
            [
                "@rnmapbox/maps",
                {
                    "RNMapboxMapsVersion": "11.23.1"
                }
            ],
            "@rnmapbox/navigation",
            [
                "expo-file-system",
                {
                    "supportsOpeningDocumentsInPlace": true,
                    "enableFileSharing": true
                }
            ],
            [
                "expo-splash-screen",
                {
                    "image": "./assets/images/strideFlow_logo.png",
                    "imageWidth": 180,
                    "resizeMode": "contain",
                    "backgroundColor": "#101820",
                    "dark": {
                        "backgroundColor": "#101820"
                    }
                }
            ],
            "expo-secure-store",
            [
                "expo-location",
                {
                    "isAndroidBackgroundLocationEnabled": true,
                    "isAndroidForegroundServiceEnabled": true,
                    "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
                }
            ],
            "expo-sqlite",
            "@react-native-firebase/app",
            "@react-native-firebase/auth",
            "expo-build-properties",
            [
                "expo-build-properties",
                {
                    "android": {
                        "usesCleartextTraffic": ENV.cleartext
                    }
                }
            ]
        ],

        expirements: {
            typedRoutes: true,
            reactCompiler: false
        },

        extra: {
            variant: VARIANT,
            router: {},
            eas: {
                projectId: "9d4f1146-f458-4f42-a823-1935ef106b4f"
            }
        },

        owner: "lalitharwate_x"

    }
}