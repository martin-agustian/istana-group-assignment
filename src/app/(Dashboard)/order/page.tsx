"use client";
import dayjs from "dayjs";

import { ChangeEvent, MouseEvent, useEffect, useState } from "react";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/card/DashboardCard";
import TableState from "@/components/table/TableState";
import TableRowData from "@/components/table/TableRowData";

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";

import { ProductModel } from "@/types/model/Product";
import { showError } from "@/commons/error";

const Order = () => {
  const [orders, setOrders] = useState<ProductModel[]>([]);
  const [orderTotal, setOrderTotal] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        page: (page + 1).toString(),
        pageSize: rowsPerPage.toString(),
      });
  
      const response = await fetch(`/api/order?${query.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
        setOrderTotal(data.total);
      }
      else {
        throw data.error;
      }

      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      showError(error);
    }
  };

	useEffect(() => {
		fetchOrder();
	}, [page]);

  const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <PageContainer 
      title={"Order History"} 
      description={"This is order page"}
    >
      <DashboardCard
        title="Order History"
      >
        <TableContainer component={Paper} elevation={9}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Code</TableCell>
                <TableCell>Total Item</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableState colSpan={5}>Loading...</TableState>
              ) : (
                orders.length === 0 ? (
                  <TableState colSpan={5}>Data not found</TableState>
                ) : (
                  orders.map((order: any) => (
                    <TableRowData 
                      key={order.id} 
                      onClick={() => {
                        
                      }}
                    >
                      <TableCell>
                        {order.code}
                      </TableCell>
                      <TableCell>
                        {order.items.length}
                      </TableCell>
                      <TableCell>
                        {dayjs(order.createdAt).format("MMM DD, YYYY - HH:ss")}
                      </TableCell>
                    </TableRowData>
                  ))
                )
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orderTotal}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>        
      </DashboardCard>
    </PageContainer>
  );
};

export default Order;