"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/card/DashboardCard";
import TableState from "@/components/table/TableState";
import TableRowData from "@/components/table/TableRowData";

import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { OrderModel } from "@/types/model/Order";
import { showError } from "@/commons/error";
import { formatNumber } from "@/commons/helper";
import { IconChevronLeft } from "@tabler/icons-react";

const Order = () => {
  const router = useRouter();

  const { orderCode } = useParams();

  const [order, setOrder] = useState<OrderModel>();
  const [loading, setLoading] = useState<boolean>(false);

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
  }, []);

  return (
    <PageContainer 
      title={"Order Detail"} 
      description={"This is order page"}
    >
      <Button
        color="primary"
        variant="text"
        size="medium"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          marginBottom: 2,
        }}
        onClick={() => { router.replace('/order') }}
      >
        <IconChevronLeft size="18" /> Back
      </Button>

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
                (!order || order?.items.length === 0) ? (
                  <TableState colSpan={5}>Data not found</TableState>
                ) : (
                  order?.items.map((item: any) => (
                    <TableRowData key={item.id} sx={{ ":hover": "none", cursor: "default" }}>
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