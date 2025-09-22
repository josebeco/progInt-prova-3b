import fs from "fs";
import path from "path";

const filePath = path.resolve("./db.json");

export const readData = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

export const saveData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
