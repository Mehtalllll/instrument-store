export interface Icategories {
  _id: string;
  name: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
  slugname?: string;
}

export interface IRescategories {
  status: string;
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: {
    categories: Icategories[];
  };
}
