"use client";
import React, { useEffect, useState } from "react";
import { Col, Flex, Row, message } from "antd";
import ProductController from "./components/ListProduct";
import ProductMain from "./components/TableCRUD";
import { IProduct, ProductDetail } from "@/lib/interfaceBase";
import {
  addProduct,
  deleteProduct,
  findAll,
  updateProduct,
} from "@/app/services/productService";

const AppProductCTRL: React.FC = () => {
  const [editProduct, setEditProduct] = useState<IProduct>();
  const [data, setData] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await findAll();
      //@ts-ignore
      setData(response);
      setLoading(false);
    } catch (error) {}
  };

  const onCurrentProduct = (product: IProduct) => {
    setEditProduct(product);
  };

  const onSubmmit = async (
    product: ProductDetail,
    resetFormData: () => void
  ) => {
    try {
      console.log(product)
      const res = await addProduct(product);
      if (res) {
        message.success("Thêm sản phẩm thành công!");
        resetFormData();
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdate = async (productId: number, product: ProductDetail) => {
    try {
      const res = await updateProduct(productId, product);
      if (res) {
        message.success("Cập nhật sản phẩm thành công!");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (productId: number) => {
    try {
      const res = await deleteProduct(productId);
      if (res) {
        message.success("Xóa thành công!");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* <Row justify={"space-between"}>
        <Col span={10}>
          <Flex vertical>
            <ProductMain
              product={editProduct}
              onSubmit={onSubmmit}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </Flex>
        </Col>
        <Col span={13} style={{ padding: 0, background: "" }}> */}
          <ProductController
            onEdit={onCurrentProduct}
            data={data}
            onDelete={onDelete}
            loading={loading}
          />
        {/* </Col>
      </Row> */}
    </>
  );
};

export default AppProductCTRL;
