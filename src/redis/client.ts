import { createClient } from "redis";

let redis_client: any = null;

export default function get_redis_client() {
  if (redis_client) {
    return redis_client;
  } else {
    redis_client = createClient();
    redis_client.on("error", (err: any) =>
      console.log("Redis Client Error", err)
    );
  }

  return redis_client;
}
