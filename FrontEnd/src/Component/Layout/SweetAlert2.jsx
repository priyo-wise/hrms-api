import React from "react";
import { withSwal } from "react-sweetalert2";

export default withSwal(({ swal }, ref) => (
  <button
    onClick={(e) => {
      swal
        .fire({
          title: "Example",
          text: "Hello World",
          didOpen: () => {
            // run when swal is opened...
          },
          didClose: () => {
            // run when swal is closed...
          },
        })
        .then((result) => {
          // when confirmed and promise resolved...
        })
        .catch((error) => {
          // when promise rejected...
        });
    }}
  >
    Show Alert
  </button>
));
