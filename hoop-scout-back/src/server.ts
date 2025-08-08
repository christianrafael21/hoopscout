import dotenv from 'dotenv';
import app from './index';
dotenv.config();

const PORT: number = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log(`\nServer is running on http://localhost:${PORT}`);
});