"use client";
// import dayjs from "dayjs";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Link from "next/link";
import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/card/DashboardCard";
import TableState from "@/components/table/TableState";
import TableRowData from "@/components/table/TableRowData";
// import DashboardCardTitleNode, { FilterSchema } from "./components/DashboardCardTitleNode";

import { Box, Button, Dialog, DialogContent, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";

import { ProductModel } from "@/types/model/Product";
// import { getCaseCategoryLabel } from "@/commons/helper";
import { showError } from "@/commons/error";
import InputNumber from "@/components/form/InputNumber";
// import { UserRole } from "@/commons/type";
// import { UserRoleEnum } from "@/commons/enum";

const Dashboard = () => {
  const { data: session } = useSession();

  const [products, setProducts] = useState<ProductModel[]>([]);
  const [productTotal, setProductTotal] = useState<number>(0);

  const [productSelected, setProductSelected] = useState<ProductModel>();
  
  const [orderOpen, setOrderOpen] = useState<boolean>(false);
  const [orderQuantity, setOrderQuantity] = useState<number | null>(1);
  const [orderSubtotal, setOrderSubtotal] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  // const [filter, setFilter] = useState<FilterSchema>();

  const [carts, setCarts] = useState<any[]>([]);
  
  const router = useRouter();

  // const {
  //   watch: watchFilter,
  //   getValues: getValueFilter,
  //   setValue: setValueFilter,
  //   control: controlFilter,
  //   register: registerFilter,
  //   handleSubmit: onSubmitFilter,
  // } = useForm<FilterSchema>({
  //   defaultValues: {
  //     title: "",
  //     category: "",
  //     status: [],
  //     sortBy: "",
  //   },
  // });

  const fetchProduct = async () => {
    const localCarts = JSON.parse(localStorage.getItem("cart") || "[]");
    setCarts(localCarts);

    // try {
    //   setLoading(true);

    //   const query = new URLSearchParams({
    //     page: (page + 1).toString(),
    //     pageSize: rowsPerPage.toString(),
    //   });
  
    //   const response = await fetch(`/api/product?${query.toString()}`);
    //   const data = await response.json();

    //   if (response.ok) {
    //     setProducts(data.products || []);
    //     setProductTotal(data.total);
    //   }
    //   else {
    //     throw data.error;
    //   }

    //   setLoading(false);
    // }
    // catch (error) {
    //   setLoading(false);
    //   showError(error);
    // }
  };

  useEffect(() => {
    fetchProduct();
  }, [page]);
  // }, [filter, page]);

  useEffect(() => {
    if (orderOpen && productSelected) {
      const qty = (!orderQuantity || orderQuantity < 1 ? 1 : orderQuantity); 
      setOrderSubtotal(productSelected.price * qty);
    }
  }, [orderOpen, orderQuantity]);

  const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleSubmitFilter = (data: FilterSchema) => {
  //   setOpenFilter(false);
  //   setFilter(data);
  //   setPage(0);
  // }

  const handleAddToCart = async () => {
    setLoadingSubmit(true); 

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const stock = productSelected?.stock ?? 0;

    const existingItem = cart.find((item: any) => item.id === productSelected?.id);
    if (existingItem) {
      existingItem.quantity += orderQuantity;
      if (existingItem.quantity > stock) existingItem.quantity = orderQuantity;
    } else {
      cart.push({ ...productSelected, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setOrderOpen(false);
    setLoadingSubmit(false); 

    await Swal.fire({
      timer: 3000,
      title: "Success!",
      text: "Success add to cart",
      icon: "success",
      showConfirmButton: false,
    });
  };

  return (
    <PageContainer 
      title={"Checkout"} 
      description={"This is checkout page"}
    >
      <DashboardCard
        title="Checkout" 
        // titleNode={
        //   <DashboardCardTitleNode 
        //     title={"All Product"}
        //     openFilter={openFilter}
        //     setOpenFilter={setOpenFilter}
        //     handleCloseFilter={() => setOpenFilter(false)}
        //     registerFilter={registerFilter}
        //     controlFilter={controlFilter}
        //     onSubmitFilter={onSubmitFilter}
        //     handleSubmitFilter={handleSubmitFilter}
        //   />
        // }
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
                        {cart.price * cart.quantity}
                      </TableCell>
                    </TableRowData>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
                {orderSubtotal}
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
            onClick={handleAddToCart}
            disabled={!orderQuantity}
          >
            Add to Cart
          </Button>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Dashboard;