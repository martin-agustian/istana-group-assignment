export type AddOrderBody = {
	items: {
		productId: number;
		quantity: number;
	}[];
};
