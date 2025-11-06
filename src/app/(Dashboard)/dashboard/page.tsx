"use client";
// import dayjs from "dayjs";
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
import StatusChip from "@/components/chip/StatusChip";
// import DashboardCardTitleNode, { FilterSchema } from "./components/DashboardCardTitleNode";

import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";

// import { CaseModel } from "@/types/model/Case";
// import { getCaseCategoryLabel } from "@/commons/helper";
import { showError } from "@/commons/error";
import { ProductModel } from "@/types/model/Product";
import dayjs from "dayjs";
// import { UserRole } from "@/commons/type";
// import { UserRoleEnum } from "@/commons/enum";

const Dashboard = () => {
  const { data: session } = useSession();
  // const userRole = session?.user.role as UserRole;

	const [products, setProducts] = useState<ProductModel[]>([]);
  const [productTotal, setProductTotal] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);

  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  // const [filter, setFilter] = useState<FilterSchema>();
  
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
    try {
      setLoading(true);

      const query = new URLSearchParams({
        page: (page + 1).toString(),
        pageSize: rowsPerPage.toString(),
      });
  
      const response = await fetch(`/api/product?${query.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
        setProductTotal(data.total);
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
		fetchProduct();
	}, [page]);
  // }, [filter, page]);

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

	return (
		<PageContainer 
      title={"All Product"} 
      description={"This is all product"}
    >
			<DashboardCard 
        // titleNode={
        //   <DashboardCardTitleNode 
        //     title={userRole !== UserRoleEnum.ADMIN ? "My Cases" : "All Cases"}
        //     openFilter={openFilter}
        //     setOpenFilter={setOpenFilter}
        //     handleCloseFilter={() => setOpenFilter(false)}
        //     registerFilter={registerFilter}
        //     controlFilter={controlFilter}
        //     onSubmitFilter={onSubmitFilter}
        //     handleSubmitFilter={handleSubmitFilter}
        //   />
        // }
        action={
          <Button 
            variant="contained" 
            component={Link} 
            href="/product/add"
            sx={{ fontWeight: "bold" }}
          >
            Add Product
          </Button>
        }
      >
				<TableContainer component={Paper} elevation={9}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell rowSpan={2}>Title</TableCell>
								<TableCell>Price</TableCell>
								<TableCell>Stock</TableCell>
								<TableCell>Created</TableCell>
							</TableRow>
						</TableHead>
            <TableBody>
              {loading ? (
                <TableState colSpan={5}>Loading...</TableState>
              ) : (
                products.length === 0 ? (
                  <TableState colSpan={5}>Data not found</TableState>
                ) : (
                  products.map((p) => (
                    <TableRowData 
                      key={p.id} 
                      onClick={() => {router.push(`/buy/${p.id}`)}}
                    >
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {p.name}
                      </TableCell>
                      <TableCell>
                        {p.price}
                      </TableCell>
                      <TableCell>
                        {p.stock}
                      </TableCell>
                      <TableCell>
                        {dayjs(p.createdAt).format("MMM DD, YYYY")}
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
            count={productTotal}
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

export default Dashboard;