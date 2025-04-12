import { RequestHandler } from "express";

export const login: RequestHandler = (req, res) => {
  const { email, password } = req.body;
  res.status(200).json({ message: "User logged in", email });
}

export const register: RequestHandler = (req, res) => {
  const { name, email, password } = req.body;
  res.status(201).json({ message: "User registered", name, email });
}