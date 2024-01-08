"use client";
import React, { useEffect, useState } from "react";
import { Card, Col, Flex, Pagination, Row, message } from "antd";
import RoomMain from "./components/TableCRUD";
import { IRoom, RoomDetail, RoomProduct } from "@/lib/interfaceBase";
import {
  addRoom,
  deleteRoom,
  findAll,
  findAllInPage,
  updateRoom,
} from "@/app/services/roomService";
import RoomController from "./components/ListRoom";
// import ListRoomProduct from "./components/ListRoomProduct";
import {
  addRoomProduct,
  deleteRoomProduct,
} from "@/app/services/roomProductService";

const AppRoomCTRL: React.FC = () => {
  // const [editRoom, setEditRoom] = useState<IRoom>();
  // const [data, setData] = useState<IRoom[]>([]);
  const [dataInPage, setDataInPage] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    currentPage: 0,
    pageSize: 5, // adjust based on your API response
    totalElements: 0,
  });
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async (page: number = 0) => {
    try {
      const responseInPage = await findAllInPage(page, pageInfo.pageSize);
      const response = await findAll();
      //@ts-ignore
      setData(response);
      //@ts-ignore
      setDataInPage(responseInPage);
      setLoading(false);
      setPageInfo({
        //@ts-ignore
        totalPages: responseInPage?.totalPages,
        //@ts-ignore
        currentPage: responseInPage?.number,
        //@ts-ignore
        pageSize: responseInPage?.size,
        //@ts-ignore
        totalElements: responseInPage?.totalElements,
      });
    } catch (error) {}
  };

  // const onCurrentRoom = (room: IRoom) => {
  //   setEditRoom(room);
  // };
  // const onEditRoomProduct = async () => {

  // }
  // const onDeleteRoomProduct = async () => {

  // }
  const onDeleteProductId = async (id: number) => {
    const res = await deleteRoomProduct(id);
    if (res) {
      message.success("Xóa thành công!");
      fetchData();
    } else {
      message.success("Xóa thất bại!");
    }
  };
  const onAddRoomProduct = async (roomProduct: any) => {
    try {
      const res = await addRoomProduct(roomProduct);
      if (res) {
        message.success("Thêm sản phẩm mặc định thành công!");
        fetchData();
      }
    } catch (error) {
      message.success("Thêm sản phẩm mặc định thất bại!");
      console.log(error);
    }
  };
  // const onSubmmit = async (room: RoomDetail, resetFormData: () => void) => {
  //   try {
  //     const res = await addRoom(room);
  //     if (res) {
  //       message.success("Thêm bàn thành công!");
  //       resetFormData();
  //       fetchData();
  //     }
  //   } catch (error) {
  //     message.success("Thêm bàn thất bại!");
  //     console.log(error);
  //   }
  // };

  // const onUpdate = async (roomId: number, room: RoomDetail) => {
  //   try {
  //     const res = await updateRoom(roomId, room);
  //     if (res) {
  //       message.success("Cập nhật bàn thành công!");
  //       fetchData();
  //     }
  //   } catch (error) {
  //     message.error("Cập nhật bàn thất bại!");
  //     console.log(error);
  //   }
  // };

  // const onDelete = async (roomId: number) => {
  //   try {
  //     const res = await deleteRoom(roomId);
  //     if (res) {
  //       message.success("Xóa thành công!");
  //       fetchData();
  //     }
  //   } catch (error) {
  //     message.success("Xóa thất bại!");
  //     console.log(error);
  //   }
  // };
  return (
    <>
      <RoomController
      />
      {/* <Pagination
              style={{ textAlign: "center", paddingTop: "20px" }}
              current={pageInfo.currentPage + 1}
              total={pageInfo.totalElements}
              pageSize={pageInfo.pageSize}
              onChange={(page) => fetchData(page - 1)}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
              showLessItems={true}
            /> */}
      {/* <ListRoomProduct
        onDeleteProductId={onDeleteProductId}
        onAddRoomProduct={onAddRoomProduct}
        data={data}
      /> */}
    </>
  );
};

export default AppRoomCTRL;
