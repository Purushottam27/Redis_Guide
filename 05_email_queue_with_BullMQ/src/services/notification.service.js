import twilio from 'twilio' // it is a platform which sends the sms to the mobile phone 

// creating the twilio client 
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export async function sendOtp(phone,otp){
    await client.messages.create({
        body: `Your verification OTP is ${otp}. It expires in 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
    })
    // Now when user fill out the otp we check the otp with the redis otp that we have stored if both matches then we allow user to move forward. 
}


export async function sendOtp(phone){
    await client.messages.create({
        body: `Hello user your premium plan will expire soon. Make sure to renew it.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
    })
    
}

