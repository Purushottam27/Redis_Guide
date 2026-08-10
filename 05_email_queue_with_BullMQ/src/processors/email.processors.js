const welcomeEmail = async(job) =>{
    console.log(`${job.name} is processing.....`)

    await new Promise((resolve, reject) => {
        setTimeout(resolve,1500)
    })
}

const passwordReset = async(job) =>{
    console.log(`${job.name} is processing.....`)

    await new Promise((resolve, reject) => {
        setTimeout(resolve,1500)
    })
}

export {
    welcomeEmail,
    passwordReset
}