import {exec} from "child_process"
import { stderr } from "process"
export function execute_bash(query:string){
    return new Promise((resolve,reject)=>{
        exec(query,(error,stdout,stderr)=>{
            if(error)
                return reject(new Error(`error ${stderr}`));
            resolve({ stdout });
        })
    })
}