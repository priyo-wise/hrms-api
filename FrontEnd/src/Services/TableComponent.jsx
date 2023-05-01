import { DateTime } from "luxon";
import React, { isValidElement, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { useDispatch } from "react-redux";
import _, {
  extend,
  filter,
  find,
  map,
  mapObject,
  omit,
  where,
} from "underscore";
import { InputDropdown } from "../Component/Form";
import { ExcelExport } from "./Export";

import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  IconButton,
} from "@mui/material";
import AppbarComponent from "./AppbarComponent";
import {
  Edit,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { contentSearch } from "./UtilityService";

const TableComponent = ({
  data,
  columns,
  excelExportFileName,
  allowSerialNo,
  noRecordCss,
  onAddEvent,
  IsAddButtonVisible,
  isSearchRequired,
  title,
  toExpend,
  children,
}) => {
  const roundOf = (num, position) => {
    return (
      Math.round((num + Number.EPSILON) * Math.pow(10, position)) /
      Math.pow(10, 2)
    );
  };
  toExpend ??= (_) => {};
  const isExpendable = isValidElement(children);
  allowSerialNo ??= false;
  noRecordCss ??= "";
  IsAddButtonVisible ??= true;
  onAddEvent ??= () => {};
  title ??= "";
  const groupByInitOpt = { value: "", text: "None" };
  const dispatch = useDispatch();
  const [dataSet, setDataSet] = useState([]);
  const [expeandableItem, setExpeandableItem] = useState({});
  const [groupByOpt, setGroupByOpt] = useState([groupByInitOpt]);
  const [searchContent, setSearchContent] = useState("");
  const [currentGroupByValue, setCurrentGroupByValue] =
    useState(groupByInitOpt);
  const renderAfterCalled = useRef(false);
  useEffect(() => {
    if (!renderAfterCalled.current) {
      GroupbyOptionBinding();
    }
    renderAfterCalled.current = true;
  }, []);
  useEffect(() => {
    InitDataBinding();
  }, [data, searchContent]);
  const ExportToExcel = () => {
    var c1 = _.filter(columns, (f) => (f.NotUseInExport ?? false) === false);
    var c2 = _.map(dataSet, (m) => {
      var object = {};
      _.each(c1, (e) => {
        object[e.Text] = m[e.Value ?? e.Text];
      });
      return object;
    });
    ExcelExport(c2, excelExportFileName, dispatch);
  };
  const GroupbyOptionBinding = () => {
    var x1 = _.filter(
      columns,
      (f) =>
        (f.IsGroupByFeature ?? false) === true &&
        (f.isVisiable ?? true) === true
    );
    x1 = _.map(x1, (m) => {
      return {
        value: m.Value ?? m.Text,
        text: m.Text,
      };
    });
    setGroupByOpt(groupByOpt.concat(x1));
  };
  const InitDataBinding = () => {
    var ds = map(data ?? [], (m1, index) => {
      return mapObject(extend(m1, { vartualId: index + 1 }), (val, key) => {
        var result = find(
          columns,
          (f) => (f.Value ?? f.Text) === key && (f.DateFormat ?? "") !== ""
        );
        if (result && val != null)
          val = DateTime.fromISO(val).toFormat(result.DateFormat);
        return val;
      });
    });

    if ((searchContent ?? "") != "") {
      var searchableColumns =
        filter(columns ?? [], (f) => (f?.Searchable ?? true) == true) ?? [];
      searchableColumns =
        map(searchableColumns, (obj) => obj.Value ?? obj.Text) ?? [];
      ds = filter(ds ?? [], (obj) => {
        var a1 = filter(
          searchableColumns,
          (col) => contentSearch(obj[col], searchContent)
          // (obj[col] ?? "")
          //   .toString()
          //   .toLowerCase()
          //   .indexOf((searchContent ?? "").toLowerCase()) > -1
        );
        return a1.length > 0;
      });
    }
    setDataSet(ds);
  };
  const GroupBySumation = (ds, col) => {
    switch (col.GroupByResult) {
      case "Summation": {
        return (
          <>
            {_.reduce(
              ds,
              (memo, cur) => roundOf(memo + cur[col.Value ?? col.Text], 2),
              0
            )}
          </>
        );
      }
      default:
        return <></>;
    }
  };
  const itemExpendedStatus = (dr) =>
    expeandableItem?.vartualId == dr?.vartualId;
  return (
    <>
      <AppbarComponent
        title={title}
        isSearchRequired={isSearchRequired}
        isAddButtonRequired={IsAddButtonVisible}
        setSearchContent={(v) => setSearchContent(v ?? "")}
        onAddEvent={onAddEvent}
      />
      <Row className="d-flex bg-light mx-1">
        {_.filter(
          columns,
          (f) =>
            (f.IsGroupByFeature ?? false) === true &&
            (f.isVisiable ?? true) === true
        ).length > 0 && (
          <Col className="col-md-4 my-3 float-start">
            <div className="d-flex align-items-start">
              <InputDropdown
                ddOpt={groupByOpt}
                value={currentGroupByValue.value}
                setValue={(v) =>
                  setCurrentGroupByValue(_.findWhere(groupByOpt, { value: v }))
                }
                label="Group By"
                name="GroupBy"
              />
            </div>
          </Col>
        )}
        {(excelExportFileName ?? "") !== "" && (
          <Col className="col-md-8 py-3">
            <div className="d-flex justify-content-md-end justify-content-sm-end">
              <Button variant="outline-success" onClick={ExportToExcel}>
                <i className="fa fa-file-excel-o" aria-hidden="true"></i> Export
                Excel
              </Button>
            </div>
          </Col>
        )}
      </Row>

      <div style={{ overflow: "none" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {isExpendable && <TableCell></TableCell>}
              {allowSerialNo && <TableCell sx={{ width: "50px" }}>Sr No.</TableCell>}
              {_.map(
                _.filter(
                  columns,
                  (f) =>
                    f.Text !== currentGroupByValue.text &&
                    (f.isVisiable ?? true)
                ),
                (m) => (
                  <TableCell sx={m?.style ?? {}} className={m?.cssClass ?? ""}>
                    {m.Text}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {_.map(
              _.groupBy(dataSet, currentGroupByValue.value),
              (value, key) => {
                return (
                  <>
                    {key !== "undefined" && (
                      <TableRow>
                        <TableCell
                          colSpan={
                            _.filter(
                              columns,
                              (f) =>
                                f.Text !== currentGroupByValue.text &&
                                (f.isVisiable ?? true)
                            ).length +
                            (allowSerialNo ? 1 : 0) +
                            (isExpendable ? 1 : 0)
                          }
                        >
                          <div className="d-flex justify-content-between fw-bold">
                            <div>
                              <span>{currentGroupByValue.text} : </span>
                              <span>{key}</span>
                            </div>
                            {_.map(
                              _.filter(
                                columns,
                                (f) => (f.GroupByResult ?? "") !== ""
                              ),
                              (m) => {
                                return (
                                  <div>
                                    <span>{m.Text} : </span>
                                    <span>{GroupBySumation(value, m)}</span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {_.map(value, (dr, index) => (
                      <>
                        <TableRow key={index}>
                          {isExpendable && (
                            <TableCell sx={{ width: "20px" }}>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => {
                                  if (!itemExpendedStatus(dr)) {
                                    setExpeandableItem(dr);
                                    toExpend(omit(dr, "vartualId"));
                                  } else setExpeandableItem({});
                                }}
                              >
                                {!itemExpendedStatus(dr) && (
                                  <KeyboardArrowRight fontSize="small" />
                                )}
                                {itemExpendedStatus(dr) && (
                                  <KeyboardArrowDown fontSize="small" />
                                )}
                              </IconButton>
                            </TableCell>
                          )}
                          {allowSerialNo && <TableCell>{index + 1}</TableCell>}
                          {_.map(
                            _.filter(
                              columns,
                              (f) =>
                                f.Text !== currentGroupByValue.text &&
                                (f.isVisiable ?? true)
                            ),
                            (col) => {
                              if ((col.Template || "") !== "") {
                                return (
                                  <TableCell
                                    data-key={dr[col.key]}
                                    className={col.cssClass ?? ""}
                                    sx={col?.style ?? {}}
                                  >
                                    {col.Template}
                                  </TableCell>
                                );
                              } else if (col.render != undefined) {
                                return (
                                  <TableCell
                                    sx={col?.style ?? {}}
                                    className={col.cssClass ?? ""}
                                  >
                                    {col.render(dr)}
                                  </TableCell>
                                );
                              }
                              return (
                                <TableCell
                                  sx={col?.style ?? {}}
                                  className={col.cssClass ?? ""}
                                >
                                  {dr[col.Value ?? col.Text]}{" "}
                                </TableCell>
                              );
                            }
                          )}
                        </TableRow>
                        {itemExpendedStatus(dr) && (
                          <>
                            <TableRow key={index + 0.1}>
                              <TableCell
                                colSpan={
                                  _.filter(
                                    columns,
                                    (f) =>
                                      f.Text !== currentGroupByValue.text &&
                                      (f.isVisiable ?? true)
                                  ).length +
                                  (allowSerialNo ? 1 : 0) +
                                  (isExpendable ? 1 : 0)
                                }
                              >
                                {children}
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </>
                    ))}
                  </>
                );
              }
            )}

            {(dataSet ?? []).length < 1 && (
              <TableRow>
                <TableCell
                  className={noRecordCss}
                  colSpan={
                    _.filter(
                      columns,
                      (f) =>
                        f.Text !== currentGroupByValue.text &&
                        (f.isVisiable ?? true)
                    ).length + (allowSerialNo ? 1 : 0)
                  }
                >
                  Record not found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TableComponent;
