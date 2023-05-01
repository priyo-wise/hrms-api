import { StandardConst } from "./StandardConst";
import { logout } from "./authSlice";
import { extend, reduce } from "underscore";
import Swal from "sweetalert2";
import { start, stop } from "./Loader";

export const WebService = async (props) => {
  const getResponse = new Promise((resolve, reject) => {
    props.dispatch(start());
    props.isFile ??= false;
    let opt = {
      method:
        props?.method ?? ((props?.body || null) === null ? "GET" : "POST"),
      credentials: "include",
    };
    if (!props.isFile) {
      opt.headers = {
        "Content-Type": "application/json",
      };
    }
    if (props.body !== undefined) {
      if (props.isFile) {
        const formData = new FormData();
        formData.append("", props.body);
        opt.body = formData;
      } else opt.body = JSON.stringify(props.body);
    }

    fetch(`${StandardConst.apiBaseUrl}/${props.endPoint}`, opt)
      .then((res) => {
        try {
          setTimeout(()=>props.dispatch(stop()),500);
          if (res.status >= 200 && res.status < 300)
            return res
              .json()
              .then((c) => extend({ IsSuccess: true }, { data: c }));
          else {
            if (res.status === 401) {
              props.dispatch(logout());
            } else {
              return res.json().then((c) =>
                extend({
                  IsSuccess: false,
                  statusText: res.statusText,
                  data: c,
                })
              );
            }
          }
        } catch (err) {
          throw err;
        }
      })
      .then((result) => {
        if (result.IsSuccess) resolve(result.data);
        else {
          result.data ??= [{ Error: result.statusText }];
          if (typeof result.data == typeof {}) {
            result.data = [result.data];
          }
          const errorMessage = reduce(
            result.data,
            (m, obj) => `${m}, ${obj.Error ?? obj.error}`,
            ""
          ).substring(2);
          // alert(errorMessage);
          Swal.fire({
            title: "Opps",
            text: errorMessage,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
          });
          reject();
        }
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
  return getResponse;
};
