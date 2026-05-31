import express, { type Request, type Response } from 'express';
import routes from './routes/index.js';


const app = express();
const port: number = 3001;

app.use(express.json());
app.use("/api", routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Express dengan TypeScript!');
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
