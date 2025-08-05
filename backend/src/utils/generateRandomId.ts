export default function generateRanddomId(){
    const seed=process.env.seed||""
    let result=""
    for(let i=0;i<seed?.length;i++){
     const idx=Math.random()*seed.length
     result=result+seed.charAt(idx)
    }
    return result
}