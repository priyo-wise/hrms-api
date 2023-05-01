import React, { forwardRef, useImperativeHandle, useState } from "react";
import Swal from "sweetalert2";

const AlertComponent = forwardRef(({ confirmEvent }, ref) => {
  confirmEvent ??= () => {};
  const [data, setData] = useState();

  useImperativeHandle(ref, () => ({
    confirmAlert: (confirmButtonText, title, text, data) => {
      confirmButtonText ??= "Ok";
      title ??= "Are you sure?";
      text ??= "Want to delete";
      Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: confirmButtonText,
      }).then((result) => {
        if (result.isConfirmed) {
          confirmEvent(data);
        }
      });
      setData(data);
    },
  }));

  return <></>;
});

export default AlertComponent;
