"use client";
import { findAllArea } from "@/app/services/areaService";
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Space,
  Card,
  Popover,
  Radio,
  Modal,
  List,
  Image,
  Typography,
  Checkbox,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  IRoom,
  DataTypeArea,
  RoomDetail,
  ProductDetail,
} from "@/lib/interfaceBase";
import { findAll } from "@/app/services/productService";
import { addRoomProduct } from "@/app/services/roomProductService";
const { Text } = Typography;

interface IProps {
  room?: IRoom;
  onSubmit: (room: RoomDetail, resetFormData: () => void) => void;
  onDelete: (roomId: number) => void;
  onUpdate: (roomId: number, room: RoomDetail) => void;
  editing: boolean;
  defaultAreaId: number;
  onShowCheckbox: boolean;
  // RoomNewId: number;
}

const TableCRUD: React.FC<IProps> = (props) => {
  const [editing, setEditing] = useState(props.editing);
  const [showCheckBox, setShowCheckbox] = useState(props.onShowCheckbox);
  const [dataArea, setDataArea] = useState<DataTypeArea[]>([]);
  const [dataProduct, setDataProduct] = useState<ProductDetail[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(
    null
  );

  const [form] = Form.useForm<RoomDetail>();
  // const [roomProduct, setRoomProduct] = useState<RoomDetail>();
  const [showProductList, setShowProductList] = useState(false); // State for checkbox
  // ...
  // console.log(props.RoomNewId);
  console.log(dataProduct);
  const initialValues: RoomDetail = {
    name: "",
    //@ts-ignore
    areaId: props.defaultAreaId,

    active: false,
  };
  console.log(props.room);
  const fullwidth: React.CSSProperties = {
    width: "100%",
  };
  const fetchDataProduct = async () => {
    const response = await findAll();
    //@ts-ignore
    setDataProduct(response);
  };
  const fetchDataArea = async () => {
    const response = await findAllArea();
    //@ts-ignore
    setDataArea(response);
  };
  useEffect(() => {
    fetchDataArea();
    fetchDataProduct();
  }, []);
  useEffect(() => {
    if (props.room) {
      // setRoomProduct(props.room);
      form.setFieldsValue({
        ...props.room,
        //@ts-ignore
        areaId: props.defaultAreaId,
      });
      setEditing(props.editing);
    }
  }, [form, props.room]);
  // useEffect(() => {
  //   form.setFieldsValue({
  //     ...initialValues,
  //     //@ts-ignore
  //     areaId: props.defaultAreaId,
  //   });
  // }, [form, props.defaultAreaId]);

  useEffect(() => {
    {
      props.onShowCheckbox ? "" : form.resetFields(), setShowProductList(false);
    }
  }, [props.onShowCheckbox]);
  const handleSubmit = (data: RoomDetail) => {
    props.onSubmit(data, () => {});
  };
  const handleUpdate = async (roomId: any) => {
    if (selectedProduct) {
      const initialValues: RoomDetail = {
        name: form.getFieldValue("name"),
        //@ts-ignore
        areaId: props.defaultAreaId,
        active: form.getFieldValue("active"),
        roomProducts: [
          {
            roomId: roomId,
            //@ts-ignore
            productId: selectedProduct ? selectedProduct.id : undefined,
          },
        ],
      };
      console.log(initialValues);
      setSelectedProduct(null);
      props.onUpdate(roomId, initialValues);
    } else {
      props.onUpdate(roomId, form.getFieldsValue());
    }
  };
  const handleClickSelect = (product: ProductDetail) => {
    
    setSelectedProduct(product);
    console.log(selectedProduct);
  };

  const handleDelete = async (roomId: any) => {
    Modal.confirm({
      title: "Bạn có muốn xóa ?",
      okText: "Yes",
      okType: "danger",
      width: "600px",
      onOk: () => {
        props.onDelete(roomId);
      },
    });
  };
  const RemovePOP = (
    <div>
      <p>Nhấp vào Edit để xóa Bàn với ID!</p>
    </div>
  );
  const handleClick = async (event: any) => {};
  // const onAddRoomProduct = async (roomProduct: any) => {
  //   try {
  //     const res = await addRoomProduct(roomProduct);
  //     if (res) {
  //       message.success("Thêm sản phẩm mặc định thành công!");
  //       // props.room();
  //     }
  //   } catch (error) {
  //     message.error("Thêm sản phẩm mặc định thất bại!");
  //     console.log(error);
  //   }
  // };
  // const handleAddRoomProduct = async (roomProduct: any) => {
  //   const initialValues = {
  //     roomId: props.RoomNewId,
  //     productId: roomProduct.id,
  //   };
  //   onAddRoomProduct(initialValues);
  //   // handleOk();
  // };

  return (
    <>
      <Card>
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleSubmit}
          onSubmitCapture={(e) => {
            e.preventDefault;
          }}
          initialValues={initialValues}
        >
          <Form.Item style={{ textAlign: "center" }}>
            {editing ? <h1>Cập nhật bàn</h1> : <h1>Tạo thêm bàn</h1>}
          </Form.Item>
          <Row gutter={16}>
            <Col span={editing ? 14 : 24}>
              <Form.Item
                name="name"
                label="Tên bàn"
                rules={[
                  {
                    required: true,
                    message: "Tên bàn không được để trống!",
                  },
                ]}
              >
                <Input name="name" type="text" placeholder="Nhập tên bàn" />
              </Form.Item>
              <Form.Item
                name="areaId"
                label="Khu vực"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn khu vực",
                  },
                ]}
              >
                <Select>
                  {
                    //@ts-ignore
                    dataArea?.content?.map((roomArea) => (
                      <Select.Option key={roomArea.id} value={roomArea.id}>
                        {roomArea.name}
                      </Select.Option>
                    ))
                  }
                  ;
                </Select>
              </Form.Item>
              <Form.Item
                name="active"
                label="Trạng thái"
                rules={[
                  {
                    required: true,
                    message: "Please select the status",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={true}>Mở</Radio>
                  <Radio value={false}>Đóng</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                {editing && (
                  <Checkbox
                    onChange={(e) => setShowProductList(e.target.checked)}
                  >
                    Bạn có muốn thêm sản phẩm mặc định?
                  </Checkbox>
                )}
              </Form.Item>
            </Col>
            {editing && (
              <Col span={10}>
                <Card>
                  <Typography>Sản phẩm mặc định hiện có:</Typography>
                  {/* {props.room?.roomProducts &&
                  props.room.roomProducts.length > 0 ? (
                    <ul>
                      {props.room.roomProducts.map((product) => (
                        <li key={product.id}>{product.productName}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Không có sản phẩm nào!.</p>
                  )} */}
                  <List
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 2,
                      md: 3,
                      lg: 4,
                      xl: 5,
                      xxl: 5,
                    }} // Adjust the grid settings
                    style={{ padding: "10px" }}
                    //@ts-ignore
                    dataSource={props.room?.roomProducts}
                    renderItem={(item) => {
                      console.log(item);
                      //@ts-ignore
                      const { productName, id } = item;
                      //@ts-ignore
                      const image = item.productImageUrl;

                      return (
                        <List.Item key={id}>
                          <Card
                            size="small"
                            hoverable
                            cover={
                              <Image
                                src={image}
                                alt="product"
                                preview={false}
                              />
                            }
                          >
                            <Text
                              style={{
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {productName}
                            </Text>
                          </Card>
                        </List.Item>
                      );
                    }}
                  />
                </Card>
              </Col>
            )}

            {showProductList && (
              <Col span={24}>
                <Card>
                  <List
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 2,
                      md: 3,
                      lg: 4,
                      xl: 5,
                      xxl: 5,
                    }} // Adjust the grid settings
                    style={{ padding: "10px" }}
                    //@ts-ignore
                    dataSource={dataProduct}
                    renderItem={(item) => {
                      //@ts-ignore
                      const { name, id } = item;
                      //@ts-ignore
                      const price = item.price;
                      //@ts-ignore
                      const image = item.imageUrl;
                      //@ts-ignore
                      const isSelected = selectedProduct?.id === id;

                      return (
                        <List.Item key={id}>
                          <a
                            onClick={
                              //@ts-ignore
                              () => handleClickSelect(item)
                            }
                          >
                            <Card
                              size="small"
                              hoverable
                              cover={
                                <Image
                                  src={image}
                                  alt="product"
                                  preview={false}
                                  height={150}
                                />
                              }
                              style={{ border: isSelected ? "2px solid red" : "2px solid transparent" }}

                            >
                              <Text
                                style={{
                                  display: "block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {name}
                              </Text>
                            </Card>
                          </a>
                        </List.Item>
                      );
                    }}
                  />
                </Card>
              </Col>
            )}
          </Row>

          <Row gutter={32} justify={"center"}>
            <Col span={16}>
              <Space direction="vertical" style={fullwidth}>
                <Space direction="vertical" style={fullwidth}>
                  <Row gutter={16}>
                    <Col span={12}>
                      {editing ? (
                        <Button
                          htmlType="button"
                          onClick={(e) => {
                            setEditing(false);
                            setShowProductList(false);
                            setShowCheckbox(false);
                            handleClick(e.preventDefault());
                            form.resetFields();
                          }}
                          size="large"
                          block
                        >
                          Hủy
                        </Button>
                      ) : (
                        <Button
                          htmlType="submit"
                          type="primary"
                          size="large"
                          block
                        >
                          Thêm
                        </Button>
                      )}
                    </Col>
                    <Col span={12}>
                      {editing ? (
                        <Button
                          type="primary"
                          size="large"
                          block
                          onClick={() => {
                            handleUpdate(props.room?.id);
                          }}
                        >
                          Sửa
                        </Button>
                      ) : (
                        <Button type="primary" size="large" block disabled>
                          Sửa
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Space>
              </Space>
            </Col>
            <Col className="gutter-row" span={6}>
              <Space direction="vertical" style={fullwidth}>
                {!editing ? (
                  <Popover content={RemovePOP} title="Lưu ý!">
                    <Button type="primary" size="large" danger block disabled>
                      Xóa
                    </Button>
                  </Popover>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    danger
                    block
                    onClick={() => {
                      handleDelete(props.room?.id);
                    }}
                  >
                    Xóa
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
};
export default TableCRUD;
