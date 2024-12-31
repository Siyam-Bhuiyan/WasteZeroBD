"use client";
import React, { useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProducts } from "../../redux/apiCalls";

interface Product {
  _id: string;
  title: string;
  img: string;
  inStock: boolean;
  price: number;
}

interface RootState {
  product: {
    products: Product[];
  };
}

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.product.products);

  useEffect(() => {
    getProducts(dispatch);
  }, [dispatch]);

  const handleDelete = (id: string) => {
    deleteProduct(id, dispatch);
  };

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "product",
      headerName: "Product",
      width: 200,
      renderCell: (params) => (
        <div className="productListItem">
          <img className="productListImg" src={params.row.img} alt="" />
          {params.row.title}
        </div>
      ),
    },
    { field: "inStock", headerName: "Stock", width: 150 },
    { field: "price", headerName: "Price", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <Link href={`/product/${params.row._id}`}>
            <button className="productListEdit">Edit</button>
          </Link>
          <DeleteOutline
            className="productListDelete"
            onClick={() => handleDelete(params.row._id)}
          />
        </>
      ),
    },
  ];

  return (
    <div className="productList">
      <DataGrid
        rows={products}
        getRowId={(row) => row._id}
        columns={columns}
        pageSize={8}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default ProductList;
