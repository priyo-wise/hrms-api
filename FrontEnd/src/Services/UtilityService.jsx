import React from "react";

export const dataClone = (data) => JSON.parse(JSON.stringify(data));
export const contentSearch = (data, search) =>
  (data ?? "")
    .toString()
    .toLowerCase()
    .indexOf((search ?? "").toString().toLowerCase()) > -1;
