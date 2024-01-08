"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  InputRef,
  List,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import {
  AreaDetail,
  DataTypeArea,
  IArea,
  IRoom,
  RoomDetail,
} from "@/lib/interfaceBase";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import TableCRUD from "./TableCRUD";
import {
  addRoom,
  deleteRoom,
  findAll,
  findAllInPage,
  updateRoom,
} from "@/app/services/roomService";
import {
  addArea,
  deleteArea,
  findAllArea,
  updateArea,
} from "@/app/services/areaService";
import TableArea from "../../AreaCRUD/components/TableCRUD";
const { Text } = Typography;
const RoomController = () => {
  // const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState<IRoom | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [dataRoom, setDataRoom] = useState<IRoom[]>([]);
  const [dataArea, setDataArea] = useState<DataTypeArea[]>([]);
  const [editingArea, setEditingArea] = useState<IArea | undefined>(undefined);
  const [editing1, setEditing1] = useState(false);
  const [isModalVisibleArea, setIsModalVisibleArea] = useState(false);
  const [selectedArea, setSelectedArea] = useState<IArea | undefined>(
    undefined
  );
  const [showCheckbox, setShowCheckbox] = useState(false);
  // const [newRoomId, setNewRoomId] = useState(Number);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const handleConfirmationCancel = () => {
    setIsConfirmationModalVisible(false);
  };
  const handleConfirmationOk = () => {
    setIsConfirmationModalVisible(false);
    setIsModalVisible(true);
    setEditing(true);
    setShowCheckbox(true);
  };

  const showModalArea = (area?: IArea) => {
    setSelectedArea(area);
    setIsModalVisibleArea(true);
  };

  const handleCancelArea = () => {
    setIsModalVisibleArea(false);
  };
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    currentPage: 0,
    pageSize: 5, // adjust based on your API response
    totalElements: 0,
  });
  // console.log(dataRoom);
  const fetchData = async (page: number = 0) => {
    const response = await findAllInPage(page, pageInfo.pageSize);
    //@ts-ignore
    setDataRoom(response);
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
  };
  const fetchDataArea = async () => {
    const response = await findAllArea();
    //@ts-ignore
    setDataArea(response);
  };
  useEffect(() => {
    fetchDataArea();
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  const handleEdit = (record: IRoom) => {
    setEditingRoom(record);
    setEditing(true);
    setShowCheckbox(true);
    setIsModalVisible(true);
  };
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Bạn có muốn xóa ?",
      okText: "Yes",
      okType: "danger",
      width: "600px",
      onOk: () => {
        // onDelete(id);
        onDeleteRoom(id);
      },
    });
  };

  type DataIndex = keyof IRoom;

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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IRoom> => ({
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

  const columns: ColumnsType<IRoom> = [
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
            dataRoom.pageable?.offset + index + 1
            //@ts-ignore
          }
        </span>
      ),
    },
    {
      title: "Tên bàn",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Khu vực",
      dataIndex: "areaName",
      key: "areaName",
      //@ts-ignore
      sorter: (a, b) => a.areaName.localeCompare(b.areaName),
      //@ts-ignore
      ...getColumnSearchProps("areaName"),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>{active ? "Mở" : "Đóng"}</Tag>
      ),
      sorter: (a, b) => Number(a.active) - Number(b.active),
      filters: [
        { text: "Mở", value: true },
        { text: "Đóng", value: false },
      ],
      onFilter: (value, record) => record.active === value,
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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    const initialValues: IRoom = {
      name: "",
      //@ts-ignore
      areaId: defaultAreaId,

      active: false,
    };
    setIsModalVisible(false);
    setShowCheckbox(false);
    setEditing(false);
    setEditingRoom(initialValues);
  };
  const onSubmmitArea = async (area: AreaDetail, resetFormData: () => void) => {
    try {
      const res = await addArea(area);
      if (res) {
        message.success("Thêm khu vực thành công!");
        resetFormData();
        fetchDataArea();
        setIsModalVisibleArea(false);
      }
    } catch (error) {
      message.error("Thêm khu vực thất bại!");
    }
  };

  const onUpdateArea = async (areaId: number, area: AreaDetail) => {
    try {
      const res = await updateArea(areaId, area);
      if (res) {
        message.success("Cập nhật khu vực thành công!");
        fetchDataArea();
      }
    } catch (error) {
      message.success("Cập nhật khu vực thất bại!");
    }
  };

  const handleEditArea = (record: IArea) => {
    console.log(record);
  };

  const onDeleteArea = async (areaId: number) => {
    try {
      const res = await deleteArea(areaId);
      // console.log(res?.data)
      if (res) {
        message.success("Xóa thành công!");
        fetchDataArea();
      }
    } catch (error) {
      message.error("Xóa thất bại!");
      console.log(error);
    }
  };
  //
  const onSubmmit = async (room: RoomDetail, resetFormData: () => void) => {
    try {
      const res = await addRoom(room);

      if (res) {
        message.success("Thêm bàn thành công!");
        console.log(res);
        //@ts-ignore
        setEditingRoom(res);
        // handleCancel();
        setIsConfirmationModalVisible(true);
        setIsModalVisible(false);
        // setEditing(true);
        // const newRoomId = res.id;
        // setNewRoomId(newRoomId);
        // resetFormData();
        setShowCheckbox(true);
        fetchData();
      }
    } catch (error) {
      message.error("Thêm bàn thất bại!");
      console.log(error);
    }
  };

  const onUpdate = async (roomId: number, room: RoomDetail) => {
    try {
      const res = await updateRoom(roomId, room);
      if (res) {
        message.success("Cập nhật bàn thành công!");
        //@ts-ignore
        setEditingRoom(res);
        fetchData();
        // handleCancel();
      }
    } catch (error) {
      message.error("Cập nhật bàn thất bại!");
      console.log(error);
    }
  };

  const onDeleteRoom = async (roomId: number) => {
    try {
      const res = await deleteRoom(roomId);
      if (res) {
        message.success("Xóa thành công!");
        setIsModalVisible(false);
        fetchData();
      }
    } catch (error) {
      message.success("Xóa thất bại!");
      console.log(error);
    }
  };
  const [defaultAreaId, setDefaultAreaId] = useState(
    //@ts-ignore
    dataArea?.content?.[0]?.id || 0
  );
  useEffect(() => {
    //@ts-ignore
    setDefaultAreaId(dataArea?.content?.[0]?.id || 0);
  }, [dataArea]);

  return (
    <>
      <Row>
        <Col span={4} style={{ marginRight: "20px" }}>
          <Card>
            <Row
              style={{
                marginBottom: "15px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography style={{ fontWeight: "500", flex: 1 }}>
                Khu vực
              </Typography>

              <Col>
                <PlusCircleOutlined onClick={() => showModalArea()} />
              </Col>
            </Row>
            <Modal
              visible={isModalVisibleArea}
              onCancel={handleCancelArea}
              footer={null}
            >
              <TableArea
                area={selectedArea}
                onSubmit={onSubmmitArea}
                onDelete={onDeleteArea}
                onUpdate={onUpdateArea}
              />
            </Modal>
            <Form.Item
              name="areaId"
              // label="Khu vực"
              // rules={[
              //   {
              //     required: true,
              //     message: "Vui lòng chọn khu vực",
              //   },
              // ]}
            >
              {" "}
              <Select
                bordered={false}
                value={defaultAreaId}
                onChange={(value) => setDefaultAreaId(value)}
              >
                {
                  //@ts-ignore
                  dataArea?.content?.map((roomArea) => (
                    <>
                      <Select.Option key={roomArea.id} value={roomArea.id}>
                        <Row justify={"space-between"}>
                          {roomArea.name}
                          <Space>
                            <a onClick={() => handleEditArea(roomArea)}>Sửa</a>
                            <a onClick={() => onDeleteArea(roomArea.id)}>
                              Xoá
                            </a>
                          </Space>
                        </Row>
                      </Select.Option>
                    </>
                  ))
                }
              </Select>
              <hr />
            </Form.Item>
          </Card>
        </Col>
        <Col span={19}>
          <Card>
            <Row
              style={{
                marginBottom: "15px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                style={{ fontWeight: "500", fontSize: "23px", flex: 1 }}
              >
                Phòng/Bàn
              </Typography>
              <Col>
                <Button type="primary" onClick={showModal}>
                  <PlusOutlined />
                  Thêm Phòng/Bàn
                </Button>
              </Col>
            </Row>
            <Modal
              // title="Thêm Bàn"
              width={1000}
              visible={isModalVisible}
              onCancel={() => {
                handleCancel();
              }}
              footer={null}
            >
              <TableCRUD
                onSubmit={onSubmmit}
                onDelete={onDeleteRoom}
                onUpdate={onUpdate}
                editing={editing}
                room={editingRoom}
                defaultAreaId={defaultAreaId}
                onShowCheckbox={showCheckbox}
                // RoomNewId={newRoomId}
              />
            </Modal>
            <Modal
              title="Thêm bàn thành công"
              visible={isConfirmationModalVisible}
              onCancel={handleConfirmationCancel}
              onOk={handleConfirmationOk}
            >
              <p>Bạn có muốn thêm sản phẩm mặc định hay không?</p>
            </Modal>
            <Table
              pagination={false}
              columns={columns}
              scroll={{ x: 600 }}
              //@ts-ignore
              dataSource={dataRoom?.content?.map((room) => ({
                ...room,
                key: room.id,
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
          </Card>
        </Col>
      </Row>

      {/* <Card style={{ marginTop: "20px" }}>
          <Text>Danh sách BÀN có sản phẩm mặc định</Text>
          <List
            style={{ marginTop: "20px" }}
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 6 }} // Adjust the grid settings
            dataSource={roomsWithProducts.map((room) => ({
              ...room,
              key: room.id,
            }))}
            renderItem={(item) => {
              //@ts-ignore
              const { name, id, roomOrders } = item;
              // const active = roomOrders.length > 0;
              const isUsed = roomOrders && roomOrders.length;
              return (
                <List.Item>
                  <a>
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
                        // border:
                        //   selectedRoom === id
                        //     ? "1px solid red"
                        //     : "1px solid #e8e8e8",
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
                        {isUsed ? "Đang sử dụng" : "Trống"}
                      </Text>
                    </Card>
                  </a>
                </List.Item>
              );
            }}
          />
        </Card>
        <Card style={{ marginTop: "20px" }}>
          <Text>Danh sách BÀN không có sản phẩm mặc định</Text>
          <List
            style={{ marginTop: "20px" }}
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 6 }}
            dataSource={roomsWithoutProducts.map((room) => ({
              ...room,
              key: room.id,
            }))}
            renderItem={(item) => {
              //@ts-ignore
              const { name, id, roomOrders } = item;
              // const active = roomOrders.length > 0;
              const isUsed = roomOrders && roomOrders.length;
              return (
                <List.Item>
                  <a>
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
                        // border:
                        //   selectedRoom === id
                        //     ? "1px solid red"
                        //     : "1px solid #e8e8e8",
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
                        {isUsed ? "Đang sử dụng" : "Trống"}
                      </Text>
                    </Card>
                  </a>
                </List.Item>
              );          }}
          />
        </Card>
        <Button >Thêm sản phẩm mặc định</Button> */}
    </>
  );
};
export default RoomController;
