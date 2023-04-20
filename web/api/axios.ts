// donfigured axios client not to throw error even status code indicates failures
import axios from "axios";

const client = axios.create(
    {
        validateStatus: (status: number) => true,
        withCredentials: true,
        timeout: Number(process.env.TIMEOUT),
    }
);

client.interceptors.request.use(config => config);

client.interceptors.response.use(
    response => response,
    err => err.response
);

export default client