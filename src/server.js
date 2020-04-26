import 'dotenv/config';
import app from './app';

const { PORT, NODE_ENV } = process.env;

app.listen(PORT, () => {
  console.log(`Up and running at port ${PORT} in ${NODE_ENV} mode`);
});
