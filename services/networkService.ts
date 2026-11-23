import NetInfo from '@react-native-community/netinfo';
import { syncData, syncFromServer } from './syncService';


let isSyncing = false;
export const networkStatus = () => {


    return NetInfo.addEventListener(async (state) => {
        if (state.isInternetReachable !== true || isSyncing) return

        isSyncing = true
        try {
            await syncData();
            await syncFromServer()
        }
        catch (e) {
            console.log('Sync failed, will retry on next network change', e)
        }
        finally {
            isSyncing = false
        }
    })
}
