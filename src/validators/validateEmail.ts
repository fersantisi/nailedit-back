
export const validateEmail = ( email:string):boolean =>{

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email || !emailRegex.test(email)){
        console.log(emailRegex.test(email))
        return false;
    }
    return true;

}