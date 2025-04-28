export const validatePasswordCreation = (password:string):boolean=>{

    

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


    if(typeof password !== 'string' || password.trim() === '' || !passwordRegex.test(password)){  
       return false;
    }

    return true;
}


export const valitdatePasswordLogin = (password: string):boolean =>{

    if(typeof password !== 'string' || password.trim() === ''){
        return false;
    }
    return true;
}