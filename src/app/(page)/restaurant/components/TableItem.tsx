"use client";
import React, { useEffect, useState } from "react";
import {
  AutoComplete,
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  TimePicker,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  AppstoreOutlined,
  DeleteFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { IRoom, IRoomOrder, RoomOrderDetail } from "@/lib/interfaceBase";
import Input, { SearchProps } from "antd/es/input";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import "@/lib/assets/styles/buttonTableItem.css";
import Search from "antd/es/input/Search";
import TextArea from "antd/es/input/TextArea";
import { addCustomer, deleteHuyTra } from "@/app/services/roomOrderService";
import { customerById, findAllCustomer } from "@/app/services/customerService";

const { Text } = Typography;
interface IProps {
  // roomOrder?: IRoomOrder[];
  room: IRoom | undefined;
  onUpdate: (roomOrderDetail: RoomOrderDetail) => void;
  onDelete: (roomOrderId: number) => void;
  onUpdateTotal: (total: number) => void;
  onHuyTra: (roomOrderDetail: RoomOrderDetail, roomId: any) => void;
}
const TableItem: React.FC<IProps> = ({
  // roomOrder,
  room,
  onUpdate,
  onDelete,
  onUpdateTotal,
  onHuyTra,
}) => {
  dayjs.extend(customParseFormat);
  const [remainingQuantity, setRemainingQuantity] = useState<number | null>(
    null
  );
  const [remainingNewQuantity, setRemainingNewQuantity] = useState<
    number | null
  >(null);
  const [reason, setReason] = useState<string>();
  const [realTime, setRealTime] = useState(dayjs()); // Thời gian thực tế
  const [options, setOptions] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [customerData, setCustomerData] = useState<[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    currentPage: 0,
    pageSize: 100,
    totalElements: 0,
  });
  const handleCustomerSelect = async (customerId: number) => {
    try {
      const productsResponse = await customerById(customerId);
      //@ts-ignore
      setCustomerData(productsResponse);
      setIsModalVisible(true); // Show the modal
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleAddCustomerToTable = async (roomId: any, customerId: any) => {
    if (customerData) {
      const res = await addCustomer(roomId, customerId);
      console.log(res);
    }

    setIsModalVisible(false);
  };
  // console.log(customerData);
  useEffect(() => {
    findProduct();
  }, [searchText]);
  const findProduct = async (page: number = 0) => {
    try {
      const response = await findAllCustomer(page, pageInfo.pageSize);
      //@ts-ignore
      // setCustomerData(response);
      //@ts-ignore
      const filteredCustomers = response.content.filter((customer: any) =>
        customer.email.toLowerCase().includes(searchText.toLowerCase())
      );

      const slicedProducts = filteredCustomers.slice(0, 6);

      const customerOptions = slicedProducts.map((customer: any) => {
        const title = customer.email;
        const lowerCasedTitle = title.toLowerCase();
        const startIndex = lowerCasedTitle.indexOf(searchText.toLowerCase());
        const endIndex = startIndex + searchText.length;

        const highlightedTitle = (
          <span>
            {title.substring(0, startIndex)}
            <span style={{ backgroundColor: "#ffcc00" }}>
              {title.substring(startIndex, endIndex)}
            </span>
            {title.substring(endIndex)}
          </span>
        );

        return {
          //@ts-ignore
          value: title,
          label: (
            <>
              {/* <Link href={`/product/${product.id}`}> */}
              <Card
                // hoverable
                style={{ width: "100%" }}
                bodyStyle={{ padding: 0, overflow: "hidden" }}
                key={customer.id}
              >
                <Flex>
                  <Flex
                    vertical
                    flex={1}
                    justify="space-between"
                    style={{ padding: 10 }}
                  >
                    <Typography.Paragraph
                      style={{ width: "100%" }}
                      ellipsis={{
                        rows: 1,
                        expandable: true,
                        symbol: "more",
                      }}
                    >
                      {highlightedTitle}
                    </Typography.Paragraph>
                    {/* <Typography style={{ color: "#ff2c00" }}>
                        {formatCurrency(product.price)}
                      </Typography> */}
                  </Flex>
                </Flex>
              </Card>
              {/* </Link> */}
            </>
          ),
          customer: customer,
        };
      });

      setOptions(customerOptions);
      setPageInfo({
        //@ts-ignore
        totalPages: response?.totalPages,
        //@ts-ignore
        currentPage: response?.number,
        //@ts-ignore
        pageSize: response?.size,
        //@ts-ignore
        totalElements: response?.totalElements,
      });

      // setVisibleProducts(slicedProducts); // Update the visible products state
    } catch (error) {
      console.log("Can't get");
    }
  };
  const handleSearch = (value: string) => {
    setSearchText(value);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTime(dayjs());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  // console.log(roomOrder);
  const startRoom = () => {};

  const handleDelete = (roomOrderId: number) => () => {
    onDelete(roomOrderId);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      //@ts-ignore
      const updatedOrders = room?.roomOrders?.map((order) => {
        if (order.productHourly) {
          const startTime = dayjs(order.orderTimeStart);
          const currentTime = dayjs();
          const diffInSeconds = currentTime.diff(startTime, 'second');
          const diffInMinutes = diffInSeconds / 60;
  
          // Kiểm tra nếu thời gian sử dụng là bội số của 6 phút
          if (diffInMinutes > 0 && diffInMinutes % 6 === 0) {
            const updatedQuantity = parseFloat(order.quantity) + 0.1;
  
            // Chỉ cập nhật nếu số lượng mới khác số lượng hiện tại
            if (updatedQuantity !== parseFloat(order.quantity)) {
              const serializableQuantity = {
                id: order.id,
                roomId: order.roomId,
                productId: order.productId,
                quantity: updatedQuantity.toFixed(1),
                orderTimeStart: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              };
              return serializableQuantity;
            }
          }
        }
        return order;
      }).filter(Boolean); // Lọc bỏ các đơn hàng không xác định (undefined)
  
      onUpdate(updatedOrders[0]);

    }, 3000); // Chạy mỗi 3 giây
  
    // Dọn dẹp interval khi component unmount
    return () => clearInterval(interval);
    //@ts-ignore
  }, [room?.roomOrders, onUpdate]);
  const handleQuantityChange = (roomOrderId: any, newQuantity: any) => {
    const serializableQuantity = {
      id: roomOrderId?.id,
      roomId: roomOrderId?.roomId,
      productId: roomOrderId?.productId,
      quantity: newQuantity,
      orderTimeStart: dayjs(roomOrderId?.orderTime).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    };
    const jsonString = serializableQuantity;
    //@ts-ignore
    onUpdate(jsonString);
  };
  const handleQuantityDelete = (roomOrderId: any, newQuantity: any) => {
    // const currentQuantity = roomOrderId.quantity || 0;
    const currentQuantity = remainingQuantity;
    const newCurrentQuantity = remainingNewQuantity;
    //@ts-ignore
    const diff = newQuantity - currentQuantity;
    // const newDiff = newQuantity - newCurrentQuantity;
    //@ts-ignore
    const remaining = Math.max(currentQuantity + diff, 0);
    //@ts-ignore
    const newRemaining = Math.max(newCurrentQuantity - diff, 0);
    if (remaining > roomOrderId.quantity) {
      return null;
    } else if (newRemaining > roomOrderId.quantity) {
      setRemainingNewQuantity(0);
      return null;
    } else if (remaining <= 0) {
      return null;
    } else if (newRemaining == roomOrderId.quantity) {
      return null;
    } else {
      setRemainingQuantity(remaining);
      setRemainingNewQuantity(newRemaining);
    }
    console.log(remaining);
    if (isNaN(remaining)) {
      setRemainingQuantity(0);
    }
    console.log("Số lượng hiện tại: " + currentQuantity);
    console.log(diff);
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
  useEffect(() => {
    const sum = //@ts-ignore
      room?.roomOrders?.reduce((acc, record) => {
        //@ts-ignore
        const { quantity, productPrice } = record;
        // const { price } = product || {};
        if (quantity && productPrice) {
          return acc + quantity * productPrice;
        }
        return acc;
      }, 0) || 0;
    if (onUpdateTotal) {
      onUpdateTotal(sum);
    } //@ts-ignore
  }, [room?.roomOrders, onUpdateTotal]);
  const confirm = (record: any) => {
    if (reason) {
      const serializableQuantity = {
        id: record?.id,
        reason: reason, // Get the reason from the state
        productId: record?.productId,
        quantity: remainingQuantity,
        price: record?.productPrice,
      };
      const jsonString = serializableQuantity;
      console.log(record);
      //@ts-ignore

      onHuyTra(jsonString, record?.roomId);
    } else {
      message.error("Bạn phải nhập lý do Đổi/Trả!");
    }
  };

  const columns: ColumnsType<IRoomOrder> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "id",
      key: "id",
      render: (_, record) => (
        <>
          {
            //@ts-ignore
            record.productHourly && (
              <>
                <Tag color="#f50">
                  <FontAwesomeIcon icon={faClock} />
                </Tag>
              </>
            )
          }
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
                disabled
                  bordered={false}
                  // value={dayjs(record.created_at).add(realTime.diff(dayjs()), 'ms')}
                  suffixIcon={false}
                  defaultValue={dayjs(
                    //@ts-ignore
                    record.createdAt
                  )}
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
      dataIndex: "productUnit",
      key: "productUnit",
      width: "10%",
      render: (unit) => <Tag color="#f50">{unit}</Tag>,
    },

    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "10%",
      render(value, record, index) {
        //@ts-ignore
        const hourly = record.productHourly;
        const step = hourly ? 0.1 : 1;
        const min = hourly ? 0.1 : 1;
        return (
          <InputNumber
            min={min}
            step={step}
            defaultValue={value}
            value={record.quantity}
            disabled={hourly ? index === 0 : false}
            onPressEnter={(e) => {
              //@ts-ignore
              e.target.value <= 0
                ? "" //@ts-ignore
                : handleQuantityChange(record, e.target.value);
            }}
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
    {
      title: "",
      key: "key",
      width: "5%",
      render: (_, record) => (
        <Popconfirm
          title="Hủy/Trả đồ "
          description={
            <>
              <div className="wrapper">
                <span
                  className="minus"
                  onClick={() =>
                    //@ts-ignore
                    handleQuantityDelete(record, remainingQuantity - 1)
                  }
                >
                  -
                </span>
                <span className="num">{remainingQuantity}</span>
                <span
                  className="plus"
                  onClick={() =>
                    //@ts-ignore
                    handleQuantityDelete(record, remainingQuantity + 1)
                  }
                >
                  +
                </span>
              </div>
              <Row
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  alignItems: "center",
                  paddingTop: "15px",
                }}
              >
                {" "}
                <Col flex={1}>
                  {" "}
                  <Typography>Số lượng còn lại: </Typography>
                </Col>
                <Col>
                  {" "}
                  <Tag color="#f50" style={{ fontSize: "20px" }}>
                    {/* {remainingQuantity !== null ? remainingQuantity : "..."} */}
                    {remainingNewQuantity}
                  </Tag>
                </Col>
                <TextArea
                  showCount
                  maxLength={100}
                  placeholder="Lý do đổi trả"
                  style={{ height: 120, resize: "none", marginTop: "15px" }}
                  onChange={(e) => setReason(e.target.value)}
                />
              </Row>
            </>
          }
          onConfirm={() => confirm(record)}
          onOpenChange={() => console.log("open change")}
        >
          <Button
            type="text"
            danger
            icon={<DeleteFilled />}
            onClick={() => {
              setRemainingQuantity(record.quantity);
              setRemainingNewQuantity(record.quantity);
            }}
          />{" "}
        </Popconfirm>
      ),
    },
  ];
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);
  return (
    <div
      style={{
        minHeight: "75vh",
        maxHeight: "83vh",
        overflowY: "scroll",
        backgroundColor: "#fff",
        borderTopLeftRadius: "24px",
        borderTopRightRadius: "24px",
        // padding: "10px"
      }}
    >
      <Space style={{ margin: "10px" }}>
        <Tag color="blue" style={{ borderRadius: "24px", padding: "5px" }}>
          {room?.name} -{" "}
          {
            //@ts-ignore
            room?.areaName
          }
        </Tag>
        <AutoComplete
          style={{ width: 200, margin: "auto" }}
          popupClassName="certain-category-search-dropdown"
          popupMatchSelectWidth={300}
          options={options}
          onSelect={(value, option) => {
            const customerId = option?.customer?.id;
            if (customerId) {
              handleCustomerSelect(customerId);
            }
          }}
          onSearch={handleSearch}
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        >
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm khách hàng"
          />
        </AutoComplete>
        <Modal
          title="Thêm khách hàng vào bàn"
          visible={isModalVisible} //@ts-ignore
          onOk={() => handleAddCustomerToTable(room?.id, customerData.id)}
          onCancel={() => setIsModalVisible(false)}
        >
          {customerData && (
            <>
              <p>
                Name:{" "}
                {
                  //@ts-ignore
                  customerData.name
                }
              </p>
              <p>
                Email:{" "}
                {
                  //@ts-ignore
                  customerData.email
                }
              </p>
            </>
          )}
        </Modal>
      </Space>

      <Table
        size="small"
        pagination={false}
        columns={columns}
        //@ts-ignore
        dataSource={room?.roomOrders}
        //        dataSource={data.map((room) => ({ ...room, key: room.id }))}
        style={{ padding: "0 auto " }}
      />
    </div>
  );
};

export default TableItem;
