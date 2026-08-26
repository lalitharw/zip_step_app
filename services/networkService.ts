import NetInfo from '@react-native-community/netinfo';
import { syncData } from './syncService';

export const networkStatus = () => {

    return NetInfo.addEventListener(async (state) => {
        console.log(state)
        if (state.isInternetReachable !== true) return
        try {
            await syncData();
        }
        catch (e) {
            console.log('Sync failed, will retry on next network change', e)
        }
    })
}
