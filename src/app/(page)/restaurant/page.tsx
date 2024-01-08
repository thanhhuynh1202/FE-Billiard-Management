"use client";
import React, { useEffect, useState } from "react";
import { Col, Flex, Layout, Row, Tag, message } from "antd";
import TableItem from "./components/TableItem";
import TabList from "./components/TabList";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import { IRoom, IRoomOrder, RoomOrderDetail } from "@/lib/interfaceBase";
import {
  addRoomOrder,
  changeRoomOrder,
  checkoutRoomOrder,
  deleteHuyTra,
  deleteRoomOrder,
  startRoomProduct,
  updateRoomOrder,
} from "@/app/services/roomOrderService";
import { findAll, roomById } from "@/app/services/roomService";

const footer: React.CSSProperties = {
  padding: "15px 0",
  borderTop: "2px solid #e8e8e8",
  width: "100%",
  backgroundColor: "#f0f0f0",
  borderBottomLeftRadius: "30px",
  borderBottomRightRadius: "30px",
};

const App: React.FC = () => {
  const [editRoom, setEditRoom] = useState<IRoom>();
  const [editRoomList, setEditRoomList] = useState<IRoom[]>([]);
  const [editRoomOrder, setEditRoomOrder] = useState<IRoomOrder[]>();
  const [total, setTotal] = useState<number>(0);

  const handleUpdateTotal = (total: number) => {
    setTotal(total);
  };
  const onCurrentRoomOrder = (roomOrder: IRoomOrder[]) => {
    setEditRoomOrder(roomOrder);
  };
  useEffect(() => {
    fetchData();
    //Debug -> Thêm [] tránh loops
  }, []);
  useEffect(() => {
    fetchRoomList();
  }, []);
  const fetchData = async () => {
    if (editRoom) {
      try {
        const response = await roomById(editRoom.id);
        //@ts-ignore
        setEditRoomOrder(response);
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  const fetchRoomList = async () => {
    try {
      const response = await findAll();
      //@ts-ignore
      setEditRoomList(response);
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  const onStartRoom = async (roomId: any) => {
    const response = await startRoomProduct(roomId);
    if (response) {
      //@ts-ignores
      setEditRoomOrder(response);
      fetchData();
      fetchRoomList();
      const dataRoom = await roomById(roomId);
      //@ts-ignore
      setEditRoom(dataRoom);
      console.log(editRoom);
      console.log(editRoomOrder);
    }
  };
  const onSubmmit = async (roomOrder: RoomOrderDetail) => {
    console.log(roomOrder);

    try {
      const res = await addRoomOrder(roomOrder);
      if (res) {
        message.success("Order thành công!");
        //@ts-ignore
        const dataRoom = await roomById(editRoom.id);
        //@ts-ignore
        setEditRoom(dataRoom);
        fetchData();
        fetchRoomList();
      }
    } catch (error) {
      message.config({
        maxCount: 1,
      });
      message.error("Không thể Order lớn hơn 1 sản phẩm tính giờ!");
    }
  };
  const onDelete = async (roomOrderId: number) => {
    const res = await deleteRoomOrder(roomOrderId);
    if (res) {
      message.success("Xóa Order thành công!");
      //@ts-ignore
      const dataRoom = await roomById(editRoom.id);
      //@ts-ignore
      setEditRoom(dataRoom);
      fetchData();
      fetchRoomList();
    }
  };
  const handleQuantityChange = async (
    // roomOrderId: number,
    roomOrder: RoomOrderDetail
  ) => {
    //@ts-ignore
    const res = await updateRoomOrder(roomOrder);
    if (res) {
      //@ts-ignore

      const dataRoom = await roomById(res.roomId);
      //@ts-ignore

      setEditRoom(dataRoom);
      fetchData();
    }
  };
  const onChangeRoomOrder = async (roomId: any, newRoomId: any) => {
    const res = await changeRoomOrder(roomId, newRoomId);
    console.log(res);
    if (res) {
      message.success("Đổi bàn thành công!");
      const dataRoom = await roomById(roomId);
      //@ts-ignore
      setEditRoom(dataRoom);
      fetchData();
      fetchRoomList();
    }
  };
  const onCheckoutRoomOrder = async (roomId: any) => {
    const res = await checkoutRoomOrder(roomId);
    if (res) {
      message.success("Thanh toán thành công!");
      const dataRoom = await roomById(roomId);
      //@ts-ignore
      setEditRoom(dataRoom);
      fetchData();
      fetchRoomList();
    }
  };
  const onCurrentRoom = (room: IRoom) => {
    setEditRoom(room);
    console.log(room);
  };
  const onHuyTra = async (room: any, roomId: any) => {
    const res = await deleteHuyTra(room);
    if (res) {
      message.success("Đổi trả thành công!");
      const dataRoom = await roomById(roomId);
      //@ts-ignore
      setEditRoom(dataRoom);
      fetchData();
      fetchRoomList();
    }
  };
  return (
    <>
      <Nav />
      <Row
        justify={"space-between"}
        style={{ backgroundColor: "#003a8c", padding: "30px" }}
      >
        <Col span={11}>
          <Flex vertical>
            <TableItem
              room={editRoom}
              onUpdate={handleQuantityChange}
              onDelete={onDelete}
              // roomOrder={editRoomOrder}
              onHuyTra={onHuyTra}
              onUpdateTotal={handleUpdateTotal}
            />
            <Flex vertical style={footer}>
              <Footer
                checkoutRoomOrder={onCheckoutRoomOrder}
                onStartRoom={onStartRoom}
                room={editRoom}
                changeRoom={onChangeRoomOrder}
                totalPrice={total}
              />
            </Flex>
          </Flex>
        </Col>
        <Col span={12}>
          <TabList
            onSubmit={onSubmmit}
            roomList={editRoomList}
            room={editRoom}
            onEditRoom={onCurrentRoom}
            onEdit={onCurrentRoomOrder}
          />
        </Col>
      </Row>
    </>
  );
};

export default App;
