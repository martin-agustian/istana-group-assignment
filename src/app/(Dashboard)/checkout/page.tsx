"use client";
import Swal from "sweetalert2";

import { useEffect, useState } from "react";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/card/DashboardCard";
import TableState from "@/components/table/TableState";
import TableRowData from "@/components/table/TableRowData";

import { Box, Button, Dialog, DialogContent, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import InputNumber from "@/components/form/InputNumber";

import { ProductModel } from "@/types/model/Product";
import { AddOrderBody } from "@/types/request/Order";
import { showError } from "@/commons/error";
import { formatNumber } from "@/commons/helper";

const Checkout = () => {
  const [productSelected, setProductSelected] = useState<ProductModel>();
  
  const [orderOpen, setOrderOpen] = useState<boolean>(false);
  const [orderQuantity, setOrderQuantity] = useState<number | null>(1);
  const [orderSubtotal, setOrderSubtotal] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const [carts, setCarts] = useState<any[]>([]);

  useEffect(() => {
    const localCarts = JSON.parse(localStorage.getItem("cart") || "[]");
    setCarts(localCarts);
  }, []);

  useEffect(() => {
    if (orderOpen && productSelected) {
      const qty = (!orderQuantity || orderQuantity < 1 ? 1 : orderQuantity); 
      setOrderSubtotal(productSelected.price * qty);
    }
  }, [orderOpen, orderQuantity]);

  const handleUpdateToCart = async () => {
    if (orderQuantity === null) return;

    setLoadingSubmit(true); 

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const stock = productSelected?.stock ?? 0;

    const existingItem = cart.find((item: any) => item.id === productSelected?.id);
    if (!existingItem) {
      setLoadingSubmit(false);
      return; // Item not found, do nothing
    }
    
    // Remove item if quantity is 0
    if (orderQuantity <= 0) {
      const updatedCart = cart.filter((item: any) => item.id !== productSelected?.id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      // Update quantity and respect stock limit
      existingItem.quantity = Math.min(orderQuantity, stock);
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    setOrderOpen(false);
    setLoadingSubmit(false); 

    await Swal.fire({
      timer: 3000,
      title: "Success!",
      text: "Success update shopping cart",
      icon: "success",
      showConfirmButton: false,
    });

    window.location.reload();
  };

  const handleCheckout = async () => {
    try {
			setLoadingSubmit(true);

			const body: AddOrderBody = {
        items: carts.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

			const response = await fetch(`/api/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
			const responseData = await response.json();

      if (response.ok) {
        localStorage.removeItem("cart");
        setCarts([]);

				await Swal.fire({
					title: "Success!",
					icon: "success",
					text: "Success checkout all items",
				});
			} 
			else throw responseData.error;

			setLoadingSubmit(false);
		} catch (error) {
			setLoadingSubmit(false);
			showError(error);
		}
  };

  return (
    <PageContainer 
      title={"Shopping Cart"} 
      description={"This is shopping cart page"}
    >
      <DashboardCard
        title="Shopping Cart"
      >
        <TableContainer component={Paper} elevation={9}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell rowSpan={2}>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableState colSpan={5}>Loading...</TableState>
              ) : (
                carts.length === 0 ? (
                  <TableState colSpan={5}>Data not found</TableState>
                ) : (
                  carts.map((cart: any) => (
                    <TableRowData 
                      key={cart.id} 
                      onClick={() => {
                        setProductSelected(cart);
                        setOrderSubtotal(cart.price);
                        setOrderQuantity(cart.quantity);
                        setOrderOpen(true);
                      }}
                    >
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {cart.name}
                      </TableCell>
                      <TableCell>
                        {cart.price}
                      </TableCell>
                      <TableCell>
                        {cart.quantity}
                      </TableCell>
                      <TableCell>
                        Rp. {formatNumber(cart.price * cart.quantity)}
                      </TableCell>
                    </TableRowData>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: "flex", justifyContent: "end", marginTop: 3 }}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            size="medium"
            loading={loadingSubmit}
            sx={{
              fontWeight: "bold",
            }}
            onClick={handleCheckout}
            disabled={loadingSubmit || carts.length < 1}
          >
            Checkout Items
          </Button>
        </Box>
      </DashboardCard>

      <Dialog fullWidth maxWidth="xs" open={orderOpen} onClose={() => setOrderOpen(false)}>
        <DialogTitle>
          {productSelected?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ marginTop: 1, marginBottom: 2 }}>
            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
              <Box>
                <InputNumber 
                  id="quantity" fullWidth 
                  variant="outlined" size="small" 
                  placeholder="Enter Quantity to Buy" 
                  value={orderQuantity ?? ""}
                  onChange={(el) => {
                    if (el.target.value) {
                      const qty = parseInt(el.target.value);
                      const stck = productSelected?.stock ?? 1;
                      setOrderQuantity(qty > stck ? stck : qty);
                    }
                    else {
                      setOrderQuantity(null);
                    }
                  }} 
                />
              </Box>

              <Stack
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 0.5
                }}
              >
                <Typography
                  htmlFor="email"
                  component="label"
                  variant="subtitle1"
                  sx={{ fontWeight: 600 }}
                >
                  Stock: 
                </Typography>
                
                <Typography>
                  {productSelected?.stock}
                </Typography>            
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >              
              <Typography
                htmlFor="email"
                component="label"
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  marginBottom: "5px",
                }}
              >
                Subtotal
              </Typography>
              
              <Typography>
                Rp. {formatNumber(orderSubtotal)}
              </Typography>
            </Stack>
          </Box>

          <Button
            fullWidth
            type="submit"
            color="primary"
            variant="contained"
            size="medium"
            loading={loadingSubmit}
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase"
            }}
            onClick={handleUpdateToCart}
            disabled={orderQuantity == null}
          >
            Update Quantity
          </Button>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Checkout;