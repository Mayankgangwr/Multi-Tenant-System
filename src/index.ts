import app from './app';
import connectDB from './config/db.config';
import configENV from './config/env.config';
import ngrok from '@ngrok/ngrok';

connectDB()
    .then(async () => {
        const port = configENV.PORT;

        app.on("error", (err) => {
            console.error("Error", err);
            throw err;
        });

        app.listen(port, async () => {
            console.log(`✅ Server running at http://localhost:${port}`);

            // 🌟 Start ngrok after the server is ready
            try {
                const listener = await ngrok.connect({
                    addr: port,
                    authtoken: '2yxLgjU8ctWYZQaavB6u7Rymixh_4GKJriJ3EQDX3WnHdmJYG'
                });

                console.log(`🌐 ngrok tunnel established at: ${listener.url()}`);
            } catch (ngrokErr) {
                console.error("❌ Failed to start ngrok:", ngrokErr);
            }
        });
    })
    .catch((err) => {
        console.error("MONGODB connection failed !! ", err);
    });
