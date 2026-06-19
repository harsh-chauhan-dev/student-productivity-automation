// Auth Module Index
export { default as authRouter } from './routes/auth.routes.js';
export { auth } from './middleware/auth.middleware.js';
export { registerUser, loginUser } from './controllers/auth.controller.js';
