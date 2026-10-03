export const validatePlausibleDistance = (current_accuracy:number,previous_accuracy:number,distance:number,timeDifference:number,maxSpeed: number) => {
    const allowedSlack = current_accuracy + previous_accuracy
    const maxPlausibleDistance = (timeDifference * maxSpeed) + allowedSlack
    if(distance > maxPlausibleDistance){
        return false
    }
    return true
}