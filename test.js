// const redis = require('redis');
import { createClient } from 'redis';

async function get_redis_client() {
  const client = createClient();
  
  client.on('error', err => console.log('Redis Client Error', err));
  
  // return client;
  await client.connect((ctx) => {
    console.log('Redis connected');
    console.log(ctx);
  });

  console.log("testing");

  client.HSET('name', 'test', '123', 'bae', '2323');
  const res = await client.HGETALL('name') 
  console.log(res)
}

get_redis_client();