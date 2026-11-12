import express from 'express';
import router from './src/router.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with {type: 'json'};
const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Server is running' });
});

app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  console.error('Unexpected error:', error.message);
  return res.status(500).json({ message: 'Internal server error' });
});

export default app;