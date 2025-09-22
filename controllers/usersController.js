import { saveData, readData } from "../utils/db.js";

export const getUsers = (req, res) => {
  const data = readData();
  res.json(data);
};

export const getUserById = (req, res) => {
  const data = readData();
  const user = data.find((d) => d.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User não encontrado" });
  }
};

export const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;

  if (req.user.id !== id) {
    return res.status(403).json({ message: "Acesso negado" });
  }

  const data = readData();
  const index = data.findIndex((d) => d.id === id);

  if (index === -1) {
    res.status(404).json({ message: "User não encontrado" });
  }

  let userAtualizado = data[index];

  Object.keys(updates).forEach((key) => {
    if (key != "senha" && userAtualizado[key] !== undefined) {
      userAtualizado[key] = updates[key];
    }
  });

  data[index] = userAtualizado;
  saveData(data)
  res.status(200).json({ id: userAtualizado.id, nome: userAtualizado.nome, email: userAtualizado.email })
};

export const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  if (req.user.id !== id) {
    return res.status(403).json({ message: "Acesso negado" });
  }

  let data = readData();
  const index = data.findIndex((d) => d.id === id);

  if (index === -1) {
    res.status(404).json({ message: "User não encontrado" });
  }

  const removed = data.splice(index, 1);
  saveData(data);
  res.status(200).json(removed[0]);
};
