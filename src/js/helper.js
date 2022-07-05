// // //throw error if fetching takes long time
import { TIMEOUT_SEC } from "./config.js";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(
      () =>
        reject(new Error(`Request took too long! Timeout after ${s} seconds`)),
      s * 1000
    );
  });
};
export const getJSON = async function (url) {
  try {
    // const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const res = await fetch(url);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}`);
    return data;
  } catch (err) {
    throw err; //rethrowing of error to catch failed promises in asyn await to catch it in async function calling it(modal)
  }
};
