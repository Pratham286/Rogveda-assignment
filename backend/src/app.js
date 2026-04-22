import express from 'express';
import cors from 'cors'


const app = express();

const corsURL = process.env.CORS_URL

app.use(cors(
    {
        origin : corsURL,
        credentials : true
    }
));

app.use(express.json({limit : '16kb'}));

app.use(express.urlencoded({extended : true, limit : '16kb'}));

app.use(express.static("public"))

export default app;