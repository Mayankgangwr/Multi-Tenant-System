import app from './app';
import connectDB from './config/dbConfig';
import configENV from './config/configENV';


connectDB()
    .then(() => {
        const port = configENV.PORT;
        app.on("error", (err) => {
            console.error("Error", err);
            throw err;
        })

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    }).catch((err)=> {
        console.error("MONGODB connection failed !! ", err);
    });