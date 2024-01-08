"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  InputRef,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import { IUser, UserDetail } from "@/lib/interfaceBase";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import TableUser from "./TableCRUD";
import {
  addUser,
  deleteUser,
  findAllUser,
  updateUser,
} from "@/app/services/userService";

// interface IProps {
//   // onEdit: (user: IUser) => void;
//   // onDelete: (userId: number) => void;
//   // data: IUser[];
//   // loading: boolean;
// }

const UserController = () => {
  const [editUser, setEditUser] = useState<IUser>();
  const [dataUser, setDataUser] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const handleEdit = (record: IUser) => {
    setEditUser(record);
    setEditing(true);
    setIsModalVisible(true);
  };

  const handleDelete = (username: any) => {
    console.log(username);
    Modal.confirm({
      title: "Bạn có muốn xóa ?",
      okText: "Yes",
      okType: "danger",
      width: "600px",
      onOk: () => {
        onDeleteUser(username);
      },
    });
  };

  type DataIndex = keyof IUser;

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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IUser> => ({
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

  const columns: ColumnsType<IUser> = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (text) => <a>{text}</a>,
    //   sorter: (a, b) => a.id - b.id,
    //   ...getColumnSearchProps("id"),
    // },
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (
        <span>
          {
            //@ts-ignore
            dataUser.pageable?.offset + index + 1
          }
        </span>
      ),
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      ...getColumnSearchProps("username"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => {
        if (a.email === null || b.email === null) {
          return a.email === null ? 1 : -1;
        }
        return a.email.localeCompare(b.email);
      },
      ...getColumnSearchProps("email"),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
      ...getColumnSearchProps("fullname"),
    },
    {
      title: "Role",
      dataIndex: "roles",
      key: "roles",
      render: (roles) => (
        <div style={{ width: "90px" }}>
          {
            //@ts-ignore
            roles?.map((role) => (
              <p key={role.name}>{role.name}</p>
            ))
          }
        </div>
      ),
      sorter: (a, b) => a.roles.length - b.roles.length,
      filters: [
        { text: "ROLE_MANAGER", value: "ROLE_MANAGER" },
        { text: "ROLE_CASHIER", value: "ROLE_CASHIER" },
        { text: "ROLE_ORDER", value: "ROLE_ORDER" },
      ],
      onFilter: (value, record) =>
        record.roles.some((role) => role.name === value),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tag color="#2db7f5">
            <a onClick={() => handleEdit(record)}>
              <EditOutlined />
              Edit
            </a>
          </Tag>
          <Tag color="#f50">
            <a onClick={() => handleDelete(record.username)}>
              <DeleteOutlined />
              Delete
            </a>
          </Tag>
        </Space>
      ),
    },
  ];
  const pageSizeOptions = ["5", "10", "20"];
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onSubmmit = async (user: UserDetail, resetFormData: () => void) => {
    try {
      const res = await addUser(user);
      if (res) {
        message.success("Thêm tài khoản thành công!");
        resetFormData();
        fetchData();
        setIsModalVisible(false)
      } else {
        message.error(res);
      }
    } catch (error) {
      message.error("Thêm thất bại");
      console.log(error);
    }
  };

  const onUpdate = async (username: string, user: UserDetail) => {
    try {
      const res = await updateUser(username, user);
      if (res) {
        message.success("Cập nhật tài khoản thành công!");
        fetchData();
        setIsModalVisible(false)
      } else {
        message.error(res);
      }
    } catch (error) {}
  };

  const onDeleteUser = async (username: string) => {
    try {
      const res = await deleteUser(username);
      if (res) {
        message.success("Xóa thành công!");
        fetchData();
        setIsModalVisible(false)
      } else {
        message.error(res);
      }
    } catch (error) {}
  };
  // const onCurrentUser = (user: IUser) => {
  //   setEditUser(user);
  // };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await findAllUser();
      //@ts-ignore
      setDataUser(response);
      setLoading(false);
    } catch (error) {}
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
          Người dùng
        </Typography>
        <Col>
          <Button type="primary" onClick={showModal}>
            <PlusOutlined />
            Tạo tài khoản
          </Button>
        </Col>
      </Row>{" "}
      <Modal // title="Thêm Bàn"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <TableUser
          user={editUser}
          onSubmit={onSubmmit}
          onDelete={onDeleteUser}
          onUpdate={onUpdate}
          editing={editing}
        />
      </Modal>
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
          scroll={{ x: 600 }}
          //@ts-ignore
          dataSource={dataUser?.content?.map((user) => ({
            ...user,
            key: user?.id,
          }))}
        />
      </Spin>
    </Card>
  );
};
export default UserController;
