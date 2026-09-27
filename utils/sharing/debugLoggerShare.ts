import * as Sharing from 'expo-sharing';
import { logFile } from '../logging/fileLogger';

export const shareLog = async () => {
    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(logFile.uri);
    }
};