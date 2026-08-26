import NetInfo from '@react-native-community/netinfo';
import { syncData } from './syncService';

export const networkStatus = () => {

    return NetInfo.addEventListener(async(state) => {
        if (state.isConnected) {
           await syncData()
        }
    })
}
