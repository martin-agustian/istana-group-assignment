"use client";
import { useParams } from "next/navigation";

import { ChangeEvent, MouseEvent, useEffect, useState } from "react";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/card/DashboardCard";
import TableState from "@/components/table/TableState";
import TableRowData from "@/components/table/TableRowData";

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";

import { OrderModel } from "@/types/model/Order";
import { showError } from "@/commons/error";
import { formatNumber } from "@/commons/helper";

const Order = () => {
  const { orderCode } = useParams();

  const [order, setOrder] = useState<OrderModel>();

  const [loading, setLoading] = useState<boolean>(false);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const fetchOrder = async () => {
    try {
      setLoading(true);
  
      const response = await fetch(`/api/order/${orderCode}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data);
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
      title={"Order Detail"} 
      description={"This is order page"}
    >
      <DashboardCard
        title={`Order Detail - ${orderCode}`}
      >
        <TableContainer component={Paper} elevation={9}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price At</TableCell>
                <TableCell>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableState colSpan={5}>Loading...</TableState>
              ) : (
                order?.items.length === 0 ? (
                  <TableState colSpan={5}>Data not found</TableState>
                ) : (
                  order?.items.map((item: any) => (
                    <TableRowData 
                      key={item.id} 
                      onClick={() => {
                        
                      }}
                    >
                      <TableCell>
                        {item.product.name}
                      </TableCell>
                      <TableCell>
                        {item.quantity}
                      </TableCell>
                      <TableCell>
                        Rp. {formatNumber(item.priceAt)}
                      </TableCell>
                      <TableCell>
                        Rp. {formatNumber(item.priceAt * item.quantity)}
                      </TableCell>
                    </TableRowData>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>        
      </DashboardCard>
    </PageContainer>
  );
};

export default Order;