"use client";
import React, { useEffect, useState } from "react";
import { Col, Flex, Row, message } from "antd";
import OrderController from "./components/ListOrder";
import { deleteOrder, findAllOrder, huyOrder } from "@/app/services/invoiceService";
import { IOrder } from "./interfaceOrder";

const AppOrderCTRL: React.FC = () => {
  const [data, setData] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await findAllOrder(null, null);
      //@ts-ignore
      setData(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (orderId: number) => {
    try {
      const res = await huyOrder(orderId);
      if (res) {
        message.success("Xóa thành công!");
        fetchData();
      }
    } catch (error) {
      console.log(error);
      message.error("Xóa thất bại!");
    }
  };
  return (
    <>
      {/* <Row justify={"center"}> */}
        {/* <Col span={22}> */}
          <OrderController data={data} onDelete={onDelete} loading={loading}/>
        {/* </Col> */}
      {/* </Row> */}
    </>
  );
};

export default AppOrderCTRL;
