import NetInfo from '@react-native-community/netinfo';

export const networkStatus = () => {

    return NetInfo.addEventListener((state) => {
        console.log("Connection Type: ", state.type)
        console.log("Is Connected: ", state.isConnected)
    })
}
