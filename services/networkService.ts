import NetInfo from '@react-native-community/netinfo';
import { syncActivities } from './syncService';

export const networkStatus = () => {

    return NetInfo.addEventListener((state) => {
        if (state.isConnected ) {
            syncActivities()
        }
    })
}
