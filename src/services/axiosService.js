import axios from "axios";
import { environment } from "../utils/environment";

const API = { API_URL: environment.API_URL };

const axiosService = (method, url, payload) => {
    url = API.API_URL + url;
    const token = localStorage.getItem("_token") || "";

    const config = {
        timeout: 1000 * 60, // 1-minute timeout
        headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: token ? `Bearer ${token}` : "",
        },
    };

    return new Promise((resolve, reject) => {
        switch (method) {
            case "POST":
                axios.post(url, payload, config).then((res) => resolve(res.data)).catch(reject);
                break;
            case "GET":
                axios.get(url, config).then((res) => resolve(res.data)).catch(reject);
                break;
            case "PUT":
                axios.put(url, payload, config).then((res) => resolve(res.data)).catch(reject);
                break;
            case "PATCH":
                axios.patch(url, payload, config).then((res) => resolve(res.data)).catch(reject);
                break;
            case "DELETE":
                axios.delete(url, config).then((res) => resolve(res.data)).catch(reject);
                break;
            default:
                reject("Invalid method");
        }
    });
};

export default {
    apis: axiosService,
};
