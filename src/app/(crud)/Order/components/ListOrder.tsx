"use client";
import React, { useRef, useState } from "react";
import {
  Card,
  Space,
  Table,
  Modal,
  Button,
  Form,
  Row,
  Col,
  Input,
  Spin,
  Descriptions,
  DatePicker,
  InputRef,
  Tag,
  Typography,
} from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import { IOrder, IOrderDetail } from "../interfaceOrder";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import { findAllByOrderId } from "@/app/services/invoiceDetailService";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { findAllOrder } from "@/app/services/invoiceService";
import { useForm } from "antd/es/form/Form";

interface IProps {
  onDelete: (orderId: number) => void;
  data: IOrder[];
  loading: boolean;
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
const OrderController: React.FC<IProps> = ({ onDelete, data, loading }) => {
  const [order, setOrder] = useState<IOrder>();
  const [orderDetails, setOrderDetails] = useState<IOrderDetail>();
  //  const [form] = Form.useForm<CustomerDetail>();
  console.log(data);
  const [form] = Form.useForm();
  const handleEdit = async (record: IOrder) => {
    // const response = await findAllByOrderId(record.id);
    //@ts-ignore
    // setOrderDetails(response?.content);
    setOrder({ ...record });
    // onEdit(record);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Bạn có muốn xóa ?",
      okText: "Yes",
      okType: "danger",
      width: "600px",
      onOk: () => {
        onDelete(id);
      },
    });
  };

  type DataIndex = keyof IOrder;

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IOrder> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<IOrder> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      render: (text) => <a>{text}</a>,
      ...getColumnSearchProps("id"),
    },
    {
      title: "Tên Bàn",
      dataIndex: "roomName",
      key: "roomName",
      //@ts-ignore
      sorter: (a, b) => a.roomName.localeCompare(b.roomName),
      //@ts-ignore
      ...getColumnSearchProps("roomName"),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (customer) => (
        <Typography>{customer ? customer : <span style={{color:"red"}}>Trống</span>}</Typography>
      ),
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <>{dayjs(date).format("YYYY-MM-DD HH:mm:ss")}</>
      ),
      sorter: (a, b) =>
        dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
      ...getColumnSearchProps("createdAt"),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => (
        <>{dayjs(date).format("YYYY-MM-DD HH:mm:ss")}</>
      ),
      sorter: (a, b) =>
        dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf(),
      ...getColumnSearchProps("updatedAt"),
    },
    // {
    //   title: "Người tạo",
    //   dataIndex: "createdBy",
    //   key: "createdBy",
    //   sorter: (a, b) => a.createdBy.length - b.createdBy.length,
    //   ...getColumnSearchProps("createdBy"),
    // },
    {
      title: "Người tạo",
      dataIndex: "updatedBy",
      key: "updatedBy",
      sorter: (a, b) => a.updatedBy.localeCompare(b.updatedBy),
      ...getColumnSearchProps("updatedBy"),
    },
    {
      title: "Trạng thái",
      dataIndex: "canceled",
      key: "canceled",
      sorter: (a, b) => Number(a.canceled) - Number(b.canceled),
      filters: [
        { text: "Đã hủy", value: true },
        { text: "Đã thanh toán", value: false },
      ],
      //@ts-ignore
      onFilter: (value: boolean, record) => record.canceled === value,
      render: (canceled: boolean) => (
        <Tag color={canceled ? "red" : "green"}>
          {canceled ? "Đã hủy" : "Đã thanh toán"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tag color="#2db7f5">
            <a
              onClick={() => {
                handleEdit(record), console.log(record);
              }}
            >
              <EyeOutlined />
              Xem chi tiết
            </a>
          </Tag>
          <Tag color="#f50">
            <a onClick={() => handleDelete(record.id)}>
              <DeleteOutlined />
              Huỷ hoá đơn
            </a>
          </Tag>
        </Space>
      ),
    },
  ];

  const pageSizeOptions = ["5", "10", "20"];

  const footer = () => {
    //@ts-ignore
    const totalCost = order?.invoiceDetails?.reduce((acc, detail) => {
      return acc + detail.price * detail.quantity;
    }, 0);

    return (
      <div>
        <strong>Thành tiền:</strong> {formatCurrency(totalCost)}
      </div>
    );
  };

  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setFromDate(dateStrings[0]);
    setToDate(dateStrings[1]);
  };

  const SearchFromToDate = async () => {
    if (!fromDate || !toDate) {
      setFilteredOrders([]);
      return;
    }
    try {
      const ordersInRange = await findAllOrder(fromDate, toDate);
      console.log(ordersInRange);
      //@ts-ignore
      setFilteredOrders(ordersInRange);
    } catch (error) {
      console.error("lỗi", error);
    }
  };

  const handleResetDate = () => {
    setFromDate(null);
    setToDate(null);
    setFilteredOrders(data);
    form.resetFields();
  };
  const { RangePicker } = DatePicker;

  return (
    <Card>
      <h2>Danh sách hóa đơn</h2>
      <Space>
        <Form form={form} layout="inline">
          <Form.Item name="searchDate" label={"Tìm kiếm"}>
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              onChange={handleDateChange}
            />
          </Form.Item>
        </Form>
        <Button type="primary" onClick={SearchFromToDate}>
          Search
        </Button>
        <Button onClick={handleResetDate}>Reset</Button>
      </Space>
      <Spin spinning={loading} tip="Loading..." size="large">
        <Table
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            defaultPageSize: Number(pageSizeOptions[0]),
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            showLessItems: true, // Ẩn bớt nút trang khi có nhiều trang
          }}
          columns={columns}
          scroll={{ x: 1000 }}
          dataSource={(filteredOrders.length > 0 ? filteredOrders : data).map(
            (order) => ({
              ...order,
              key: order.id,
            })
          )}
        />
      </Spin>
      <Modal
        title="Chi tiết hóa đơn"
        open={!!order}
        width={1000}
        onCancel={() => {
          setOrder(undefined);
        }}
        onOk={() => {
          setOrder(undefined);
        }}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => setOrder(undefined)}
          >
            OK
          </Button>,
        ]}
      >
        <Row>
          <Descriptions
            labelStyle={{ fontWeight: "bolder" }}
            contentStyle={{ fontWeight: "bolder" }}
          >
            <Descriptions.Item label="ID">{order?.id}</Descriptions.Item>
            {/* <Descriptions.Item label="Khu vực">
              {order?.room.area.name}
            </Descriptions.Item> */}

            <Descriptions.Item label="Bàn">
              {
                //@ts-ignore
                order?.roomName
              }
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {order?.canceled ? "Đã hủy" : "Đã thanh toán"}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian bắt đầu">
              {dayjs(order?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian kết thúc">
              {dayjs(order?.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Người tạo">
              {order?.createdBy}
            </Descriptions.Item> */}
            <Descriptions.Item label="Người tạo">
              {order?.updatedBy}
            </Descriptions.Item>
          </Descriptions>
        </Row>
        <Row justify={"space-between"}>
          <Table
            //@ts-ignore
            dataSource={order?.invoiceDetails?.map((product) => ({
              ...product,
              key: product.id,
            }))}
            style={{ width: "100%" }}
            footer={footer}
            pagination={false}
          >
            <Table.Column
              title="Sản phẩm"
              dataIndex={"productName"}
              key={"productName"}
            />
            <Table.Column
              title="Giá"
              dataIndex={"price"}
              key={"price"}
              render={(text: any) => {
                return `${formatCurrency(text)}`;
              }}
            />
            <Table.Column
              title="Số lượng"
              dataIndex={"quantity"}
              key={"quantity"}
            />
            {/* <Table.Column
              title="Danh mục"
              dataIndex={["product", "category", "name"]}
              key={"product.category.name"}
            /> */}
            {/* <Table.Column
              title="Đơn vị"
              dataIndex={["product", "unit", "name"]}
              key={"product.unit.name"}
            /> */}
            {/* <Table.Column
              title="Bắt đầu"
              dataIndex={"createdAt"}
              key={"createdAt"}
              render={(date: string) => (
                <>{dayjs(date).format("YYYY-MM-DD HH:mm:ss")}</>
              )}
            /> */}
            {/* <Table.Column
              title="Kết thúc"
              dataIndex={"updatedAt"}
              key={"updatedAt"}
              render={(date: string) => (
                <>{dayjs(date).format("YYYY-MM-DD HH:mm:ss")}</>
              )}
            /> */}
            <Table.Column
              title="Tổng tiền"
              dataIndex={"Total"}
              key={"total"}
              render={(text: any, record: IOrderDetail) => {
                //@ts-ignore
                const total = record.quantity * record.price;
                return `${formatCurrency(total)}`;
              }}
            />
          </Table>
        </Row>
      </Modal>
    </Card>
  );
};
export default OrderController;
