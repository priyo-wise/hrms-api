import { StandardConst } from "./StandardConst";
export const WebService = async (props) => {
  const getResponse = new Promise((resolve, reject) => {
    let opt = {
      method:
        props?.method ?? ((props?.body || null) === null ? "GET" : "POST"),
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
      },
    };
    if (props.body !== undefined) {
      opt.body = JSON.stringify(props.body);
    }
    fetch(`${StandardConst.apiBaseUrl}/${props.endPoint}`, opt)
      .then((res) => res.json())
      .then((result) => {
        console.log("success", result);
        resolve(result);
      })
      .catch((err) => {
        console.log("error", err);
        reject(err);
      });
  });
  return getResponse;
};
