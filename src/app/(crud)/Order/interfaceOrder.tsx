export interface IRole {
  id: number;
  name: string;
}
export interface IUser {
  id: number;
  username: string;
  fullname: string;
  email: string;
  roles: IRole[];
}

export interface IArea extends IRole {}

export interface IRoom extends IRole {
  area: IArea;
  status: boolean;
}

export interface IUnit extends IRole {}

export interface ICategory extends IRole {}

export interface IProduct extends IRole {
  image: string;
  price: number;
  hourly: boolean;
  active: boolean;
  category: ICategory;
  unit: IUnit;
}
export interface ICustomer extends IRole {
  email: string
  phone: string
  discount: number
}

export interface IOrderDetail {
  id: number;
  productName: string;
  productPrice: number;
  quantity: number;
  // createdAt: string;
  // updatedAt: string;
  // endTime: string;
}

export interface IOrder {
  id: number;
  canceled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  user: IUser;
  room: IRoom;
  customer: ICustomer;
  orderDetails: IOrderDetail[];
}