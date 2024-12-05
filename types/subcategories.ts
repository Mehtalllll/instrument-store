export interface Isubcategories {
  _id: string;
  category: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  slugname: string;
}

export interface IRessubcategories {
  status: string;
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: {
    subcategories: Isubcategories[];
  };
}
