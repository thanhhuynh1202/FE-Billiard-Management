"use client";
import { findAllCategory } from "@/app/services/categoryService";
import { findAllUnit } from "@/app/services/unitService";
import {
  Button,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Space,
  Card,
  Popover,
  Upload,
  InputNumber,
  Progress,
  Modal,
  Spin,
  Image,
  Checkbox,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  IProduct,
  DataTypeCategory,
  DataTypeUnit,
  ProductDetail,
} from "@/lib/interfaceBase";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebaseConfig";
import styled from "styled-components";
const FormInputLabel = styled.div`
  .ant-form-item-label {
    width: 120px; /* Set the width you want for the labels */
    text-align: left; /* Adjust text alignment if needed */
  }
`;
interface IProps {
  product?: IProduct;
  onSubmit: (product: ProductDetail, resetFormData: () => void) => void;
  onDelete: (productId: number) => void;
  onUpdate: (productId: number, product: ProductDetail) => void;
  editing: boolean;
}

const initialValues: ProductDetail = {
  name: "",
  image: "",
  price: 0,
  hourly: false,
  active: false,
  //@ts-ignore
  categoryId: "1",
  unit: "",
  type: "Product",
};

const fullwidth: React.CSSProperties = {
  width: "100%",
};
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const TableCRUD: React.FC<IProps> = (props) => {
  const [editing, setEditing] = useState(props.editing);
  const [dataCategory, setDataCategory] = useState<DataTypeCategory[]>([]);
  const [dataUnit, setDataUnit] = useState<DataTypeUnit[]>([]);
  const [imageFile, setImageFile] = useState<File>();
  const [downloadURL, setDownloadURL] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [form] = Form.useForm<ProductDetail>();
  console.log(props.product);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };
  const handleSelectedFile = (files: RcFile) => {
    setImageFile(files);
    console.log(files);
  };
  const handleRemoveFile = () => setImageFile(undefined);
  const fetchDataCategory = async () => {
    const response = await findAllCategory();
    //@ts-ignore
    setDataCategory(response);
  };

  const fetchDataUnit = async () => {
    const response = await findAllUnit();
    //@ts-ignore
    setDataUnit(response);
  };
  console.log(dataCategory);
  useEffect(() => {
    fetchDataCategory();
    fetchDataUnit();
  }, []);

  useEffect(() => {
    if (props.product) {
      // setEditing(false);
      form.setFieldsValue(props.product);
    }
  }, [form, props.product]);

  const handleSubmit = (data: ProductDetail) => {
    if (imageFile) {
      const name = imageFile.name;
      const storageRef = ref(storage, `image/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgressUpload(progress);

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          message.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setDownloadURL(url);
            //@ts-ignore
            data.imageUrl = url;
            props.onSubmit(data, () => {
              form.resetFields();
              setImageFile(undefined);
              setProgressUpload(0);
              setIsUploading(false);
            });
          });
        }
      );
    } else {
      message.error("File not found");
    }
  };

  const handleUpdate = async (productId: any, product: any) => {
    const updatedProduct: ProductDetail = {
      ...form.getFieldsValue(),
      //@ts-ignore
      imageId: product.imageId,
      imageUrl: product.imageUrl,
    };
    console.log(updatedProduct);
    props.onUpdate(productId, updatedProduct);
  };

  const handleDelete = async (productId: any) => {
    Modal.confirm({
      title: "Bạn có muốn xóa ?",
      okText: "Yes",
      okType: "danger",
      width: "600px",
      onOk: () => {
        props.onDelete(productId);
      },
    });
  };
  const RemovePOP = (
    <div>
      <p>Nhấp vào Edit để xóa Product với Id!</p>
    </div>
  );
  useEffect(() => {
    if (props.product) {
      // setRoomProduct(props.room);
      form.setFieldsValue({
        ...props.product,
      });
      // setEditing(props.editing);
    }
  }, [form, props.product]);
  const handleClick = async (event: any) => {};
  return (
    <Spin spinning={isUploading}>
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
            {props.editing ? (
              <h1>Cập nhật hàng hóa</h1>
            ) : (
              <h1>Tạo thêm hàng hóa</h1>
            )}
          </Form.Item>
          <Row gutter={16}>
            <Col span={14}>
              <FormInputLabel>
                <Form.Item
                  name="name"
                  label="Tên hàng hóa"
                  rules={[
                    {
                      required: true,
                      message: "Tên hàng hóa không được để trống!",
                    },
                  ]}
                >
                  <Input
                    name="name"
                    type="text"
                    placeholder="Nhập tên hàng hóa"
                  />
                </Form.Item>
                <Form.Item
                  name="type"
                  label="Loại"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn loại sản phẩm",
                    },
                  ]}
                >
                  <Select size="large">
                    <Select.Option value="Product">Sản phẩm</Select.Option>
                    <Select.Option value="Service">Dịch vụ</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="categoryId"
                  label="Danh mục"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn danh mục sản phẩm",
                    },
                  ]}
                >
                  <Select size="large">
                    {
                      //@ts-ignore
                      dataCategory?.map((productCategory) => (
                        <Select.Option
                          key={productCategory.id}
                          value={productCategory.id}
                        >
                          {productCategory.name}
                        </Select.Option>
                      ))
                    }
                    ;
                  </Select>
                </Form.Item>
                <Form.Item
                  name="unit"
                  label="Đơn vị"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn đơn vị sản phẩm",
                    },
                  ]}
                >
                  <Input
                    name="unit"
                    type="text"
                    placeholder="Nhập đơn vị hàng hóa"
                  />
                </Form.Item>
              </FormInputLabel>
              <FormInputLabel>
                <Form.Item label="Ảnh sản phẩm">
                  <Upload
                    name="imageUrl"
                    accept="image/png, image/jpg"
                    action={"localhost:3000"}
                    listType="picture-card"
                    showUploadList={{
                      showRemoveIcon: true,
                    }}
                    onPreview={handlePreview}
                    beforeUpload={(file) => {
                      handleSelectedFile(file);
                      return false;
                    }}
                    maxCount={1}
                  >
                    {uploadButton}
                  </Upload>
                  {imageFile && (
                    <>
                      {" "}
                      <Progress percent={progressUpload} />
                    </>
                  )}
                  <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <Image
                      alt="viewPicture"
                      style={{ width: "100%" }}
                      src={previewImage}
                    />
                  </Modal>
                </Form.Item>
              </FormInputLabel>
            </Col>
            <Col span={10}>
              {/* <Form.Item
                name="hourly"
                label="Hourly"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select>
                  <Select.Option value={true}>Yes</Select.Option>
                  <Select.Option value={false}>No</Select.Option>
                </Select>
              </Form.Item> */}
              <FormInputLabel>
                <Form.Item
                  name="hourly"
                  // label="Hourly"
                  valuePropName="checked"
                >
                  <Checkbox>Số lượng tính theo thời gian GIỜ sử dụng</Checkbox>
                </Form.Item>
              </FormInputLabel>
              <FormInputLabel>
                <Form.Item name="active" label="Active">
                  <Select>
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                </Form.Item>
              </FormInputLabel>
              <FormInputLabel>
                <Form.Item name="price" label="Giá sản phẩm">
                  <InputNumber addonAfter="VNĐ" name="price" min={0} />
                </Form.Item>
              </FormInputLabel>
            </Col>
          </Row>

          <Row gutter={32} justify={"center"}>
            <Col span={16}>
              <Space direction="vertical" style={fullwidth}>
                <Space direction="vertical" style={fullwidth}>
                  <Row gutter={16}>
                    <Col span={12}>
                      {props.editing ? (
                        <Button
                          htmlType="button"
                          onClick={(e) => {
                            setEditing(false);
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
                          onClick={() => {
                            setIsUploading(true);
                          }}
                        >
                          Thêm
                        </Button>
                      )}
                    </Col>
                    <Col span={12}>
                      {props.editing ? (
                        <Button
                          type="primary"
                          size="large"
                          block
                          onClick={() => {
                            handleUpdate(props.product?.id, props.product);
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
                {!props.editing ? (
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
                      handleDelete(props.product?.id);
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
    </Spin>
  );
};
export default TableCRUD;
