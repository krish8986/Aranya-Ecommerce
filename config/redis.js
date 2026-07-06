// import Redis from "ioredis";
// import colors from "colors";

// const redis = new Redis({
//     host: "127.0.0.1",
//     port: 6379,
// });

// redis.on("connect", () => {
//     console.log("Redis Connected!".bgGreen.white);
// });

// redis.on("error", (err) => {
//     console.log(`Redis Error: ${err}`.bgRed.white);
// });

// export default redis;


import dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";
import colors from "colors";

const redis = process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL)
    : new Redis({
        host: "127.0.0.1",
        port: 6379,
    });

redis.on("connect", () => {
    console.log("Redis Connected!".bgGreen.white);
});

redis.on("error", (err) => {
    console.log(`Redis Error: ${err.message}`.bgRed.white);
});

export default redis;