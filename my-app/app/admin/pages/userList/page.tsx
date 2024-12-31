"use client";
import React, { useState } from "react";
import "./userList.css";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import Link from "next/link";

interface User {
  id: number;
  username: string;
  avatar: string;
  email: string;
  status: string;
  transaction: string;
}

const UserList: React.FC = () => {
  const [data, setData] = useState<User[]>([
    {
      id: 1,
      username: "Jon Snow",
      avatar:
        "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      email: "jon@gmail.com",
      status: "active",
      transaction: "$120.00",
    },
    // Add more users here...
  ]);

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "user",
      headerName: "User",
      width: 200,
      renderCell: (params) => (
        <div className="userListUser">
          <img className="userListImg" src={params.row.avatar} alt="" />
          {params.row.username}
        </div>
      ),
    },
    { field: "email", headerName: "Email", width: 200 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "transaction", headerName: "Transaction Volume", width: 160 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <Link href={`/user/${params.row.id}`}>
            <button className="userListEdit">Edit</button>
          </Link>
          <DeleteOutline
            className="userListDelete"
            onClick={() => handleDelete(params.row.id)}
          />
        </>
      ),
    },
  ];

  return (
    <div className="userList">
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={8}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default UserList;
