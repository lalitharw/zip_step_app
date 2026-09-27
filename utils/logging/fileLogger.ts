import {Paths, File} from "expo-file-system"

const logFile = new File(Paths.document,"gps_debug.txt")
export async function fileLog(message:string, data?: any){
    try{
        const timestamp = new Date().toISOString()
        const line = `[${timestamp}] ${message} ${data ? JSON.stringify(data) : ''}\n`;
        if(!logFile.exists){
            await logFile.create()
            await logFile.write(line)
        }
        else{
            const existing = await logFile.text()
            await logFile.write(existing + line)
        }
    }
    catch(e){

    }
}


export async function clearLog(){
    try{
        if(logFile.exists){
            await logFile.delete()
        }
    }
    catch(e){

    }
}


export async function readLog(){
    try{
        if(!logFile.exists) return "No log file yet"
        return await logFile.text()
    }
    catch(e){

    }
}

export {logFile}