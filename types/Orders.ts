export interface IOrders {
  _id: string;
  user: string;
  products: [
    {
      product: string;
      count: number;
      _id: string;
    },
  ];
  totalPrice: number;
  deliveryDate: string;
  deliveryStatus: true;
  createdAt: string;
  updatedAt: string;
}

export interface IResOrders {
  status: string;
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: {
    orders: IOrders[];
  };
}
