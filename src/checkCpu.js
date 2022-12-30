import { threadId, isMainThread } from "node:worker_threads"


const cuy =  new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(isMainThread)
            resolve("Asu")    
        }, 2000);
    })

const asingkronus = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(threadId)
            resolve("Asu")    
            reject("Usa")
        }, 2000);
    })
}

const punk = async () => {
    console.log(isMainThread)
    const a = await asingkronus
}

punk()
