"use client";
import { findAll } from "@/app/services/roomService";
import { IRoom, IRoomOrder } from "@/lib/interfaceBase";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Button,
  Typography,
  Space,
  Card,
  Row,
  Col,
  Modal,
  List,
  ModalFuncProps,
  TimePicker,
  InputNumber,
  Tag,
  Flex,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
const { Text } = Typography;
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
dayjs.extend(customParseFormat);
import Table, { ColumnsType } from "antd/es/table";
// const doc = new jsPDF();

// doc.text("Hello world!", 10, 10);
// doc.save("a4.pdf");
const fullwidth: React.CSSProperties = {
  width: "100%",
};
interface IProps {
  room: IRoom | undefined;
  changeRoom: (roomId: any, newRoomId: any) => void;
  checkoutRoomOrder: (roomId: any) => void;
  totalPrice: number;
  onStartRoom: (roomId: any) => void;
}
const formatCurrency = (value: number | undefined) => {
  if (typeof value !== "number") {
    return "N/A";
  }
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
const Footer: React.FC<IProps> = (props) => {
  const [data, setData] = useState<[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenTamTinh, setIsModalOpenTamTinh] = useState(false);
  const [sumTamTinh, setSumTamTinh] = useState(Number);
  const { confirm } = Modal;
  // console.log(props.room)
  // console.log(props.room);
  // console.log(props.room?.roomOrders?.map((order) => order.productPrice));
  useEffect(() => {
    const sum = //@ts-ignore
      props.room?.roomOrders?.reduce((acc, record) => {
        const { quantity, productPrice } = record;
        // const { price } = product || {};
        if (quantity && productPrice) {
          return acc + quantity * productPrice;
        }
        return acc;
      }, 0) || 0;
    setSumTamTinh(sum);
  });
  const columns: ColumnsType<IRoomOrder> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "id",
      key: "id",
      render: (_, record) => (
        <>
          <Text strong>
            {
              //@ts-ignore
              record.productName
            }{" "}
          </Text>
          {
            //@ts-ignore
            record.productHourly && (
              // <Tag color="blue" style={{ borderRadius: "24px" }}>
              <>
                <Text style={{ marginLeft: "20px" }}>Từ</Text>
                <TimePicker
                  bordered={false}
                  // value={dayjs(record.created_at).add(realTime.diff(dayjs()), 'ms')}
                  suffixIcon={false}
                  disabled
                  defaultValue={
                    //@ts-ignore
                    dayjs(record.createdAt)
                  }
                  format="HH:mm:ss"
                />
              </>
              //  </Tag>
            )
          }
          {/* <TimePicker
              value={dayjs(record.created_at).add(realTime.diff(dayjs()), 'ms')}
              format="HH:mm:ss"
            /> */}
        </>
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "productUnitName",
      key: "productUnitName",
      width: "10%",
      render: (productUnitName) => <Tag color="#f50">{productUnitName}</Tag>,
    },

    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "10%",
      render(value, record, index) {
        // const hourly = record.productHourly;
        //@ts-ignore
        const name = record.productUnitName;
        const step = name === "Tiền giờ" ? 0.1 : 1;
        const min = name === "Tiền giờ" ? 0.1 : 1;
        return (
          <InputNumber
            min={min}
            step={step}
            defaultValue={value}
            value={record.quantity}
            disabled={true}
          />
        );
      },
    },
    {
      title: "Đơn giá",
      dataIndex: "productPrice",
      key: "productPrice",
      width: "10%",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      width: "10%",
      render: (_, record) => {
        //@ts-ignore
        const { quantity, productPrice } = record;
        const total = quantity * productPrice || 0;

        return formatCurrency(total);
      },
    },
  ];
  const PrintableContent: React.FC<{ room: IRoom | undefined }> = ({
    room,
  }) => {
    return (
      <div>
        <Text
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontWeight: "500",
            fontSize: "24px",
          }}
        >
          Billiard Management
        </Text>{" "}
        <br></br>
        <Tag color="blue" style={{ borderRadius: "24px", padding: "5px" }}>
          {room?.name} -{" "}
          {
            //@ts-ignore
            room?.areaName
          }
        </Tag>
        <Typography style={{ paddingTop: "10px", textAlign: "start" }}>
          Giờ vào{" "}
          {
            //@ts-ignore
            dayjs(room?.roomOrders[0]?.createdAt).format(
              "DD/mm/YYYY - HH:mm:ss"
            )
          }
        </Typography>
        <p>
          <Table
            size="small"
            pagination={false}
            columns={columns}
            //@ts-ignore
            // dataSource={props.room}
            dataSource={room?.roomOrders || []}
            style={{ padding: "0 auto " }}
          />
        </p>
        <Flex align="flex-end" justify="space-between">
          <Typography style={{ fontSize: "16px" }}>Tổng tiền hàng:</Typography>
          <Text style={{ fontSize: "16px", fontWeight: "500" }}>
            {formatCurrency(sumTamTinh)}
          </Text>
        </Flex>
        <Flex align="flex-end" justify="space-between">
          <Typography style={{ fontSize: "16px" }}>Chiết khấu:</Typography>
          <Text style={{ fontSize: "16px", fontWeight: "500" }}>0 đ</Text>
        </Flex>
        <Flex align="flex-end" justify="space-between">
          <Typography style={{ fontSize: "16px", fontWeight: "500" }}>
            Tổng cộng:
          </Typography>
          <Text style={{ fontSize: "16px", fontWeight: "500" }}>
            {formatCurrency(sumTamTinh)}
          </Text>
        </Flex>
        <Text
          style={{
            fontStyle: "oblique",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontWeight: "500",
          }}
        >
          Cảm ơn quý khách và hẹn gặp lại!!!
        </Text>
      </div>
    );
  };
  const handlePrint = () => {
    // Hide the button before printing
    const printButton = document.getElementById("printButton");
    if (printButton) {
      printButton.style.display = "none";
    }
    setIsModalOpenTamTinh(false);
    // Perform the print operation
    document.title = "Hóa đơn tạm tính " + props.room?.name;
    window.print();

  };

  const showModalTamTinh = () => {
    setIsModalOpenTamTinh(true);
    const printButton = document.getElementById("printButton");
    if (printButton) {
      printButton.style.display = "block";
    }
  };

  const handleOkTamTinh = () => {
    setIsModalOpenTamTinh(false);
  };

  const handleCancelTamTinh = () => {
    setIsModalOpenTamTinh(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showPromiseConfirm = () => {
    confirm({
      title: "Bạn có chắc chắn muốn thanh toán?",
      icon: <ExclamationCircleFilled />,
      // content: '...',
      onOk() {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            checkoutRoomOrder(props.room?.id);
            resolve();
          }, 1000);
        }).catch(() => console.log("Oops errors!"));
      },
      onCancel() {},
    });
  };
  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== "number") {
      return "N/A";
    }
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const handleChangeRoom = async (roomId: any, newRoomId: any) => {
    try {
      props.changeRoom(roomId, newRoomId);
      handleCancel();
    } catch (error) {
      console.error("Error", error);
    }
  };
  const checkoutRoomOrder = async (roomId: any) => {
    try {
      props.checkoutRoomOrder(roomId);
    } catch (error) {
      console.error("Error", error);
    }
  };
  const startRoom = async () => {
    try {
      //@ts-ignore
      props.onStartRoom(props.room.id);
      // fetchRoomList();

      // console.log(props.room);
    } catch (error) {
      console.error("error", error);
    }
  };
  const listData = async () => {
    const response = await findAll();
    //@ts-ignore
    setData(response);
  };
  useEffect(() => {
    listData();
  }, []);
  return (
    <Row gutter={32} justify={"center"}>
      <Col span={16}>
        <Space direction="vertical" style={fullwidth}>
          <Space direction="vertical" style={fullwidth}>
            <Row gutter={16}>
              <Col span={12}>
                {/* <Button type="primary" block>
                  Tìm khách hàng
                </Button> */}
              </Col>
              <Col span={12}>
                <Button type="primary" block onClick={showModal}>
                  Chuyển bàn
                </Button>
                <Modal
                  title={
                    <span>
                      Chuyển từ
                      <span style={{ fontWeight: 750 }}>
                        {" "}
                        {props.room?.name}{" "}
                      </span>
                      sang
                    </span>
                  }
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  width={1000}
                >
                  <List
                    grid={{
                      gutter: 5,
                      xs: 1,
                      sm: 2,
                      md: 3,
                      lg: 4,
                      xl: 6,
                      xxl: 3,
                    }}
                    style={{ padding: "10px" }}
                    //@ts-ignore
                    dataSource={data.content}
                    renderItem={(item) => {
                      //@ts-ignore
                      const { name, id, roomOrders } = item;
                      // const roomInUse = props.room?.id === id;
                      const roomInUse = roomOrders && roomOrders.length;

                      return (
                        <List.Item>
                          <a
                            onClick={() => handleChangeRoom(props.room?.id, id)}
                            style={{
                              pointerEvents: roomInUse ? "none" : "auto",
                            }}
                          >
                            <Card
                              size="small"
                              hoverable
                              cover
                              style={{
                                textAlign: "center",
                                minHeight: "90px",
                                opacity: roomInUse ? 0.5 : 1,
                                pointerEvents: roomInUse ? "none" : "auto",
                              }}
                            >
                              <Text strong>{name}</Text>
                              <br />
                              <Text type="secondary">
                                {roomInUse ? "Đang sử dụng" : "Trống"}
                              </Text>
                            </Card>
                          </a>
                        </List.Item>
                      );
                    }}
                  />
                </Modal>
              </Col>
            </Row>
          </Space>
          <Space
            direction="vertical"
            style={{
              width: "100%",
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Button type="primary" block onClick={showModalTamTinh}>
                  Tạm tính
                </Button>
                <Modal
                  visible={isModalOpenTamTinh}
                  onOk={handleOkTamTinh}
                  onCancel={handleCancelTamTinh}
                  width={1000}
                  footer={
                    <Button
                      id="printButton"
                      type="primary"
                      onClick={handlePrint}
                    >
                      In hóa đơn
                    </Button>
                  } // Disable the default footer
                >
                  <PrintableContent room={props.room} />
                </Modal>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  danger
                  block
                  onClick={showPromiseConfirm}
                  //@ts-ignore
                  disabled={props.room?.roomOrders?.length > 0 ? false : true}
                >
                  Thanh toán
                </Button>
              </Col>
            </Row>
          </Space>
        </Space>
      </Col>
      <Col className="gutter-row" span={6}>
        <Space direction="vertical" style={fullwidth}>
          <Text strong>
            Tổng cộng:
            <Text type="danger"> {formatCurrency(props.totalPrice)}</Text>
          </Text>
          {/* {props.room?.roomProducts?.length } */}
          <Button
            type="primary"
            danger
            size="large"
            block
            //@ts-ignore
            // disabled={props.room?.roomOrders?.some((order) => order.productName === "Tiền giờ") ? true : false}
            disabled={props.room?.roomOrders?.length > 0 || props.room?.roomProducts?.length <= 0 ? true : false}
            onClick={() =>
              //@ts-ignore
              props.room?.roomOrders?.some(
                //@ts-ignore
                (order) => order.productName === "Tiền giờ"
              )
                ? message.error("Error: Cannot start room with hourly product.")
                : startRoom()
            }
          >
            Mở bàn
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default Footer;
