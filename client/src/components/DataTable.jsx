import React from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";

const DataTable = ({ rows, deleteRow, editRow, tablehead }) => {
  return (
    <table className="table-fixed table">
      <thead>
        <tr>
          {tablehead?.map((item) => (
            <th key={item.id}>{item.feild}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows?.map((row, idx) => {
          return (
            <tr key={idx}>
              {tablehead.map(
                (item, colidx) =>
                  row.hasOwnProperty(item.feild) && (
                    <td key={colidx}>{row[item.feild]}</td>
                  )
              )}

              <td className="fit">
                <span className="actions">
                  <BsFillTrashFill
                    className="delete-btn"
                    onClick={() => deleteRow(row._id)}
                  />
                  <BsFillPencilFill
                    className="edit-btn"
                    onClick={() => editRow(idx)}
                  />
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default DataTable;
