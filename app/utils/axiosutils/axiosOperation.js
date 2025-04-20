import axios from "axios";
import { getError } from "../catchError/getError";

// GET method
export function axiosGet(url, tkn) {
  try {
    const auth = {
      headers: { authorization: `Bearer ${tkn}` },
    };
    return axios.get(url, auth);
  } catch (error) {
    throw error;
  }
}

// POST method
export function axiosPost(url, data, tkn) {
  try {
    const auth = {
      headers: { authorization: `Bearer ${tkn}` },
    };
    return axios.post(url, data, auth);
  } catch (error) {
    getError(error);
  }
}

// PUT method
export function axiosPut(url, data, tkn) {
  try {
    const auth = {
      headers: { authorization: `Bearer ${tkn}` },
    };
    return axios.put(url, data, auth);
  } catch (error) {
    getError(error);
  }
}

export function axiosPatch(url, data, tkn) {
  try {
    const auth = {
      headers: { authorization: `Bearer ${tkn}` },
    };
    return axios.patch(url, data, auth);
  } catch (error) {
    getError(error);
  }
}

// DELETE method
export function axiosDelete(url, tkn) {
  try {
    const auth = {
      headers: { authorization: `Bearer ${tkn}` },
    };
    return axios.delete(url, auth);
  } catch (error) {
    getError(error);
  }
}
