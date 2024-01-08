"use client";
import { findAll } from "@/app/services/productService";
import { IRoom, IRoomOrder, RoomOrderDetail } from "@/lib/interfaceBase";
import { Card, Image, List, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";

const { Text } = Typography;
const { Meta } = Card;

const formatCurrency = (value: number) => {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
interface IProps {
  room: IRoom | undefined;
  onSubmit: (roomOrderDetail: RoomOrderDetail) => void;
}
const ListProduct: React.FC<IProps> = (props) => {
  // console.log(room)
  const [data, setData] = useState<[]>([]);
  const listData = async () => {
    const response = await findAll();
    //@ts-ignore
    setData(response);
  };
  useEffect(() => {
    listData();
  }, []);
  console.log(data)
  // const getCurrentTime = () => {
  //   const currentTime = new Date().toLocaleTimeString('en-US', {
  //     hour12: false,
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     second: '2-digit'
  //   });
  
  //   return currentTime;
  // };
  const handleAddToRoomOrder = async (roomId: any, item: any) => {
    try {
      //@ts-ignore
      const roomOrderDetail: RoomOrderDetail = {
        //@ts-ignore
        roomId: roomId,
        productId: item.id
        // room: { id: roomId },
        // product: { id: item.id }, 
        // orderTime: getCurrentTime(),
        // quantity: 1,
      };
      props.onSubmit(roomOrderDetail);
    } catch (error) {
      console.error("Error adding to RoomOrder:", error);
    }
  };
  return (
    <List
    grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 5 }}  // Adjust the grid settings
    style={{ padding: "10px", minHeight: "80vh" }}
      dataSource={data}
      renderItem={(item) => {
        const { name, id} = item;
        //@ts-ignore
        const price = item.price;
        //@ts-ignore
        const image = item.imageUrl;

        return (
          <List.Item key={id}>
            <a onClick={() => {handleAddToRoomOrder(props.room?.id , item)}}>
            <Card
              size="small"
              hoverable
              cover={<Image src={image} alt="product" preview={false} height={150} />}
            >
              <Tag
                color="#f50"
                style={{
                  position: "absolute",
                  right: "-5px",
                  top: "2px",
                }}
              >
                {formatCurrency(price)}
              </Tag>
              <Text
                style={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </Text>
            </Card>
            </a>
          </List.Item>
        );
      }}
    />
  );
};

export default ListProduct;
