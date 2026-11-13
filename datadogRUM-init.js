import {
    DatadogProviderConfiguration,
    SdkVerbosity,
    TrackingConsent
} from "@datadog/mobile-react-native";

export const dataDogConfig = new DatadogProviderConfiguration(
    "pub604ef2da12cd1340a68c5162796a032b",
    "dev",
    TrackingConsent.GRANTED,
    {
        site: "US1",
        rumConfiguration: {
            applicationId: "ede87bce-61d0-4c0b-a52e-4e2d1be5776c",
            trackInteractions: true, // Track user interactions (use the 'accessibilityLabel' prop to give tap actions a custom name)
            trackResources: true, // Track XHR Resources
            trackErrors: true, // Track Errors
            nativeCrashReportEnabled: true, // Optional: Enable Native Crash Reporting
            resourceTraceSampleRate: 100, // Optional: Percentage of traced network requests. Default is 100.
            sessionSampleRate: 100, // Optional: Percentage of sampled RUM sessions. Default is 100.
        },
        logsConfiguration: {}, // Enable Logs
        traceConfiguration: {} // Enable Trace
    }
)

dataDogConfig.verbosity = SdkVerbosity.DEBUG

