import bcrypt from 'bcryptjs';
import { saveData, readData } from '../utils/db.js';
import {generateToken}  from '../middleware/auth.js';

export const login = (req, res) => {
    const { nome, senha } = req.body;
    const data = readData();
    const user = data.find(u => u.nome === nome);
  
    if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });
  

    if (!bcrypt.compareSync(senha, user.senha)) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }
  
    const token = generateToken(user);
    res.json({ token });
  };

  export const register = (req, res) => {
    const data = readData();
    const { nome, email, senha } = req.body;
  
    if (!senha) return res.status(400).json({ message: 'Senha é obrigatória' });
  
    const hashedPassword = bcrypt.hashSync(senha, 8);
  
    const newUser = {
      id: data.length ? data[data.length - 1].id + 1 : 1,
      nome,
      email,
      senha: hashedPassword
    };
  
    data.push(newUser);
    saveData(data);
    res.status(201).json({ id: newUser.id, nome: newUser.nome, email: newUser.email });
  };