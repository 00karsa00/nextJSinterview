import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as sgMail from '@sendgrid/mail';
import * as elasticemail from '@elasticemail/elasticemail-client';
// 37A86D218193CA139CAC605F82BD12C84D7C567808211455634CA5F7FA4C16EC6E0E79F18CCA5CC74E97E09889D5F084
sgMail.setApiKey('37A86D218193CA139CAC605F82BD12C84D7C567808211455634CA5F7FA4C16EC6E0E79F18CCA5CC74E97E09889D5F084');
// 7A50329F4D351F7918E250FFCF64062A77386DFC54196B2A198BFF6051A5006F63A6229D7C2734C010A9D8FB39B675D9
const secretKey = '123456789';
const client = elasticemail.createClient({ apiKey: '37A86D218193CA139CAC605F82BD12C84D7C567808211455634CA5F7FA4C16EC6E0E79F18CCA5CC74E97E09889D5F084' });


export const encryptPassword = (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) throw err;
                console.log('Hashed Password:', hash);
                resolve(hash);
            });
        } catch (e) {
            console.log("Util error => ", e);
            reject(e);
        }
    });
};

export const checkPassword = (password: string, checkPassword: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        try {
            bcrypt.compare(password, checkPassword, (err, result) => {
                if (err) throw err;
                console.log('Password Match:', result);
                resolve(result);
            });
        } catch (e) {
            console.log("Util error => ", e);
            reject(e);
        }
    });
};

export const createAccessToken = (data: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const options: jwt.SignOptions = {
                expiresIn: '1h', // Token expiration time
            };
            const token = jwt.sign(data, secretKey, options);
            console.log('Generated JWT:', token);
            resolve(token);
        } catch (e) {
            console.log("Util error => ", e);
            reject(e);
        }
    });
};

export const validateAccessToken = (token: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        try {
            const decoded: any = jwt.verify(token, secretKey);
            resolve(decoded);
        } catch (e) {
            console.log("Util error => ", e);
            reject(e);
        }
    });
};


// Function to send OTP email
export const sendOTPEmail = async (recipientEmail: string, otp: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        try {
            console.log("opt dtai => ", otp, recipientEmail)

            const msg = {
                to: recipientEmail,
                from: 'sendtest042@gmail.com',
                subject: 'Your OTP',
                text: `Your OTP is: ${otp}`, // Plain text body of the email
                html: `<p>Your OTP is: <strong>${otp}</strong></p>`, // HTML body of the ema
            };

            // Send the email
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent successfully');
                    resolve(true)
                })
                .catch((error) => {
                    console.error('Error sending email:', error);
                    resolve(true)
                });
        } catch (error) {
            console.error('Error sending email: ', error);
            resolve(true)
        }
    });
};
