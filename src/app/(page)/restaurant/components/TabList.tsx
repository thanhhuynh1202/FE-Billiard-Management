"use client";
import {

  Space,
  Tabs,

} from "antd";
import React from "react";
import ListRoom from "./ListRoom";
import ListProduct from "./ListProduct";
import { IRoom, IRoomOrder, RoomOrderDetail } from "@/lib/interfaceBase";
const { TabPane } = Tabs;
import { AppstoreOutlined } from "@ant-design/icons";

const onChange = (key: string) => {
  console.log(key);
};

interface IProps {
  onEdit: (roomOrder: IRoomOrder[]) => void;
  onEditRoom: (room: IRoom) => void;
  onSubmit: (roomOrderDetail: RoomOrderDetail) => void;
  room: IRoom | undefined;
  roomList: IRoom[] | undefined;
  
}
const TabList: React.FC<IProps> = ({
  onEdit,
  onEditRoom,
  onSubmit,
  room,
  roomList,
}) => {
  const onCurrentRoomOrder = (roomOrder: IRoomOrder[]) => {
    console.log(roomOrder);
    onEdit(roomOrder);
  };
  const onCurrentRoom = (room: IRoom) => {
    console.log(room);
    onEditRoom(room);
  };

  const onSubmmit = async (roomOrder: RoomOrderDetail) => {
    console.log(roomOrder)
    onSubmit(roomOrder);
  };
  
  // const items: TabsProps["items"] = [
  //   {
  //     key: "1",
  //     label: "Phòng Bàn",
  //     children: (
  //       <ListRoom
  //         data={roomList}
  //         onEditRoom={onCurrentRoom}
  //         onEdit={onCurrentRoomOrder}
  //       />
  //     ),
  //   },
  //   {
  //     key: "2",
  //     label: "Sản Phẩm",
  //     children: <ListProduct onSubmit={onSubmmit} room={room} />,
  //   },
  // ];
  return (
    <Tabs
    defaultActiveKey="1"
    style={{
      margin: "0 auto",
      backgroundColor: "#f5f5f5",
      borderRadius: "24px",
      
    }}
    type="card"
    // tabBarStyle={{backgroundColor: "#003a8c"}}
    centered
  >
    <TabPane 
      tab={
        <Space >
          <AppstoreOutlined style={{margin: "0 auto"}}/>
          Phòng Bàn
        </Space>
      }
      key="1"
    >
      <ListRoom data={roomList} onEditRoom={onCurrentRoom} onEdit={onCurrentRoomOrder} />
    </TabPane>
    <TabPane tab="Sản Phẩm" key="2">
      <ListProduct onSubmit={onSubmmit} room={room} />
    </TabPane>
  </Tabs>
  );
};

export default TabList;
