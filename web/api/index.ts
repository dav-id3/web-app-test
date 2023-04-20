import { TestApi } from "./generated/api";
import axios from "./axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASEPATH;

const TestApiClient = new TestApi(undefined, API_BASE_URL, axios);

export {
    TestApiClient,
};
