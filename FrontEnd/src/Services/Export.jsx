import * as FileServer from "file-saver";
import XLSX from "sheetjs-style";

export const ExcelExport = (excelData, fileName, dispatch) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = "xlsx";

  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileServer.saveAs(data, `${fileName}.${fileExtension}`);
};