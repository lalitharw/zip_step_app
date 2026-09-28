export const validatePlausibleDistance = (current_accuracy:number,previous_accuracy:number,distance:number,timeDifference:number) => {
    const MAX_SPEED_MPS = 5
    const allowedSlack = current_accuracy + previous_accuracy
    const maxPlausibleDistance = (timeDifference * MAX_SPEED_MPS) + allowedSlack
    if(distance > maxPlausibleDistance){
        return false
    }
    return true
}