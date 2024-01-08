"use client";
import { findAllArea } from "@/app/services/areaService";
import { findAll, roomByAreaId, roomById } from "@/app/services/roomService";
import { IRoom, IRoomOrder } from "@/lib/interfaceBase";
import {
  Card,
  Col,
  Image,
  List,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
  Typography,
  theme,
} from "antd";
import React, { useEffect, useState } from "react";

const { Text } = Typography;
interface IProps {
  onEdit: (roomOrder: IRoomOrder[]) => void;
  onEditRoom: (room: IRoom) => void;
  data: IRoom[] | undefined;
}

const ListRoom: React.FC<IProps> = ({ onEdit, onEditRoom, data }) => {
  const [filteredData, setFilteredData] = useState<IRoom[] | undefined>(data);
  const [selectedArea, setSelectedArea] = useState<number | null>(0);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(11);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [valueRadio, setValueRadio] = useState(1);
  const [valueRadioButton, setValueRadioButton] = useState(0);
  const [dataArea, setDataArea] = useState<[]>([]);
  // console.log(data);
  console.log(filteredData);

  const handleEdit = async (id: number) => {
    // const roomOrder = await findRoomOrderID(id);
    const room = await roomById(id);
    //@ts-ignore
    onEdit(room);
    //@ts-ignore
    onEditRoom(room);
    setSelectedRoom(id);
  };
  useEffect(() => {
    const fetchDataArea = async () => {
      const res = await findAllArea();
      if (res) {
        //@ts-ignore
        setDataArea(res);
      }
    };
    fetchDataArea();
  }, []);
  useEffect(() => {
    handleEdit(1);
  }, []);
  const onChangeRoomArea = async (e: RadioChangeEvent) => {
    const areaId = e.target.value as number;
    setSelectedArea(areaId);
    setValueRadioButton(areaId);

    setSelectedStatus(11);
    setValueRadio(11);

    if (areaId === 0) {
      //@ts-ignore
      setFilteredData(data.content);
    } else {
      const responses = await roomByAreaId(areaId);
      //@ts-ignore
      setFilteredData(responses.content);
    }
  };

  const onChangeRoomStatus = async (e: RadioChangeEvent) => {
    const statusId = e.target.value as number;
    setSelectedStatus(statusId);
    setValueRadio(statusId);
  };
  useEffect(() => {
    //@ts-ignore
    const filteredRooms = data?.content?.filter((room) => {
      //@ts-ignore
      const areaCondition = selectedArea === 0 || room.areaId === selectedArea;
      let statusCondition;

      if (selectedStatus === 11) {
        // Show all rooms
        statusCondition = true;
      } else {
        // Check if roomOrders exist for each room
        const hasOrders = room.roomOrders && room.roomOrders.length > 0;

        statusCondition =
          (selectedStatus === 12 && hasOrders) ||
          (selectedStatus === 13 && !hasOrders);
      }

      return areaCondition && statusCondition;
    });

    setFilteredData(filteredRooms);
  }, [data, selectedArea, selectedStatus]);
  return (
    <>
      <div style={{ padding: "10px", minHeight: "80vh" }}>
        <Radio.Group
          onChange={onChangeRoomArea}
          buttonStyle="solid"
          value={valueRadioButton}
        >
          <Radio.Button value={0} style={{ marginRight: "10px" }}>
            Tất cả
          </Radio.Button>
          {//@ts-ignore
          dataArea.content?.map((areaItem) => (
            <Radio.Button
              key={areaItem.id}
              value={areaItem.id}
              style={{ marginRight: "10px" }}
            >
              {areaItem.name}
            </Radio.Button>
          ))}
        </Radio.Group>
        <br />
        <Radio.Group
          onChange={onChangeRoomStatus}
          value={valueRadio}
          style={{ padding: "10px" }}
        >
          <Radio value={11}>Tất cả</Radio>
          <Radio value={12}>{`Sử dụng`}</Radio>
          <Radio value={13}>{`Còn trống`}</Radio>
        </Radio.Group>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 6 }} // Adjust the grid settings
          dataSource={filteredData}
          renderItem={(item) => {
            //@ts-ignore
            const { name, id, roomOrders } = item;
            // const active = roomOrders.length > 0;
            const isUsed = roomOrders && roomOrders.length;
            return (
              <List.Item>
                <a onClick={() => handleEdit(id)}>
                  <Card
                    size="small"
                    hoverable
                    cover={
                      <Image
                        src="https://firebasestorage.googleapis.com/v0/b/leafy-emblem-385311.appspot.com/o/image%2Fdining-room%20(3).png?alt=media&token=116a175e-7315-41ac-ab29-98b477fbc032"
                        alt="product"
                        style={{ width: "68px" }}
                        preview={false}
                      />
                    }
                    style={{
                      // width: "100px",
                      textAlign: "center",
                      minHeight: "90px",
                      border:
                        selectedRoom === id
                          ? "1px solid red"
                          : "1px solid #e8e8e8",
                      backgroundColor: isUsed ? "#307DC7" : "",
                    }}
                  >
                    <Text strong style={{ color: isUsed ? "white" : "" }}>
                      {name}
                    </Text>
                    <br />
                    <Text
                      type="secondary"
                      style={{ color: isUsed ? "white" : "" }}
                    >
                      {isUsed ? "Sử dụng" : "Trống"}
                    </Text>
                  </Card>
                </a>
              </List.Item>
            );
          }}
        />
      </div>
    </>
  );
};

export default ListRoom;
