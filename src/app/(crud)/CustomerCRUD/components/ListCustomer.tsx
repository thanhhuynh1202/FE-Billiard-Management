"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  InputRef,
  Modal,
  Pagination,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import { CustomerDetail, ICustomer } from "@/lib/interfaceBase";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import TableCustomer from "./TableCRUD";
import {
  addCustomer,
  deleteCustomer,
  findAllCustomer,
  updateCustomer,
} from "@/app/services/customerService";

const CustomerController = () => {
  const [editCustomer, setEditCustomer] = useState<ICustomer>();
  const [data, setData] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    currentPage: 0,
    pageSize: 5, // adjust based on your API response
    totalElements: 0,
  });

  type DataIndex = keyof ICustomer;

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page: number = 0) => {
    try {
      const response = await findAllCustomer(page, pageInfo.pageSize);
      //@ts-ignore
      setData(response);
      setLoading(false);
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
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (record: ICustomer) => {
    setEditCustomer(record);
    setEditing(true);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Bạn có muốn xóa ?",
      okText: "Yes",
      okType: "danger",
      width: "600px",
      onOk: () => {
        onDeleteCustomer(id);
      },
    });
  };

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

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<ICustomer> => ({
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

  const columns: ColumnsType<ICustomer> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.id - b.id,
      ...getColumnSearchProps("id"),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      ...getColumnSearchProps("email"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      filters: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
        { text: "Other", value: "Other" },
      ],
      onFilter: (value, record) => record.gender === value
    },
    {
      title: "Ghi nợ",
      dataIndex: "balance",
      key: "balance",
      //@ts-ignore
      sorter: (a, b) => a.balance - b.balance,
      //@ts-ignore
      ...getColumnSearchProps("balance"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tag color="#2db7f5">
            <a onClick={() => handleEdit(record)}>
              <EditOutlined />
              Sửa
            </a>
          </Tag>
          <Tag color="#f50">
            <a onClick={() => handleDelete(record.id)}>
              <DeleteOutlined />
              Xoá
            </a>
          </Tag>
        </Space>
      ),
    },
  ];
  const pageSizeOptions = ["5", "10", "20"];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setIsModalVisible(false);
  };
  const onSubmmit = async (
    customer: CustomerDetail,
    resetFormData: () => void
  ) => {
    try {
      const res = await addCustomer(customer);
      if (res) {
        message.success("Thêm khách hàng thành công!");
        resetFormData();
        fetchData();
        setIsModalVisible(false)
      } else {
        message.error(res);
      }
    } catch (error) {
      message.error("Thêm thất bại");
    }
  };

  const onUpdate = async (customerId: number, customer: CustomerDetail) => {
    try {
      const res = await updateCustomer(customerId, customer);
      if (res) {
        message.success("Cập nhật khách hàng thành công!");
        fetchData();
        setIsModalVisible(false)
      } else {
        message.error(res);
      }
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  const onDeleteCustomer = async (customerId: number) => {
    try {
      const res = await deleteCustomer(customerId);
      if (res) {
        message.success("Xóa thành công!");
        fetchData();
      } else {
        message.error(res);
      }
    } catch (error) {
      message.error("Xoá thất bại");
    }
  };
  return (
    <Card>
      <Row
        style={{
          marginBottom: "15px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography style={{ fontWeight: "500", fontSize: "23px", flex: 1 }}>
          Khách hàng
        </Typography>
        <Col>
          <Button type="primary" onClick={showModal}>
            <PlusOutlined />
            Thêm khách hàng
          </Button>
        </Col>
      </Row>
      <Modal // title="Thêm Bàn"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <TableCustomer
          customer={editCustomer}
          onSubmit={onSubmmit}
          onDelete={onDeleteCustomer}
          onUpdate={onUpdate}
          editing={editing}
        />
      </Modal>
      <Spin spinning={loading} tip="Loading..." size="large">
        <Table
          pagination={false}
          columns={columns}
          scroll={{ x: 600 }}
          //@ts-ignore
          dataSource={data?.content?.map((customer) => ({
            ...customer,
            key: customer.id,
          }))}
        />
        <Pagination
              style={{ textAlign: "center", paddingTop: "20px" }}
              current={pageInfo.currentPage + 1}
              total={pageInfo.totalElements}
              pageSize={pageInfo.pageSize}
              onChange={(page) => fetchData(page - 1)}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
              showLessItems={true}
            />
      </Spin>
    </Card>
  );
};
export default CustomerController;
