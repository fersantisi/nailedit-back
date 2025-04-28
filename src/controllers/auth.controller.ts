import { Request, Response } from 'express';
import { setAuthCookie, setRefreshCookie } from '../utils/cookie';
import { logIn } from '../services/login.service';
import {
  createNewUser,
  verifyEmail,
} from '../services/users.service';
import { generateRecoveryLink } from '../utils/generateRecoveryLink';


export const getLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  //verify data
  try {
    const tokens = await logIn(username, password);
    if (tokens === null) {
      res.status(409).json({ message: 'invalid credentials.' });
    } else if (tokens) {
      const { authToken, refreshToken } = tokens;

      setAuthCookie(res, authToken);
      setRefreshCookie(res, refreshToken);

      res.json({ message: 'Login successful' });
    } else {
      res.status(409).json({ message: 'invalid credentials.' });
    }

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
      res.status(500).json({ message: "Server error, check server console for more info." });
    }
  }
};


export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    //add data validation
    if (await createNewUser(name, email, password)) {
      res.status(201).json({ message: 'user Created' });
    } else {
      res.status(409).json({ message: 'Email or Username alredy in use' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(500).json({
        message:
          'internal server error, check server console for more information',
      });
    }
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const email = req.body.email;
  
  if(!email){res.status(500).json({message: "Missing mail."})}

  let link:string;

  if(await verifyEmail(email)){
    link = generateRecoveryLink(email)
  }else{
    link = "Bad email"
  }

  
  res.status(200).json({message: `Mail enviado. Por conveniencia de la materia, este es el link: ${link}`})

};

export const recoverPassword = async(req: Request,res: Response): Promise<void>=>{
  const recoveryJwt = req.params.jwt
}