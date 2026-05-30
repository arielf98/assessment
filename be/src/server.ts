import express, { type Request, type Response } from 'express';

const app = express();
const port: number = 3001;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Express dengan TypeScript!');
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
