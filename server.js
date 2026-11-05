import app from "./app.js";

const PORT = process.env.PORT || 3000;

if(!PORT) {
    throw new Error('PORT is not defined. Make sure your local npm scripts reference the .env file with --env-file=.env, or define PORT in your hosted environment settings.');
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});