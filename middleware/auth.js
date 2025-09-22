import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "bomdia";

export const generateToken = (user) => {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['auth'];
  const token = authHeader;

  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    req.user = user; 
    next();
  });
};