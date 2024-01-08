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
  Modal,
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
  CategoryDetail,
  DataTypeCategory,
  ICategory,
  IProduct,
  ProductDetail,
} from "@/lib/interfaceBase";
import Paragraph from "antd/es/typography/Paragraph";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { text } from "stream/consumers";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import TableProduct from "../../ProductCRUD/components/TableCRUD";
import {
  addProduct,
  deleteProduct,
  findAll,
  updateProduct,
} from "@/app/services/productService";
import TableCategory from "../../CategoryCRUD/components/TableCRUD";
import {
  addCategory,
  deleteCategory,
  findAllCategory,
  updateCategory,
} from "@/app/services/categoryService";

interface IProps {
  onEdit: (product: IProduct) => void;
  onDelete: (productId: number) => void;
  data: IProduct[];
  loading: boolean;
}

const ProductController: React.FC<IProps> = ({
  onEdit,
  onDelete,
  data,
  loading,
}) => {
  const handleEdit = (record: IProduct) => {
    onEdit(record);
    setEditing(true);
    setIsModalVisible(true);
    setEditProduct(record);
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

  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== "number") {
      return "N/A";
    }
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  type DataIndex = keyof IProduct;

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [editProduct, setEditProduct] = useState<IProduct>();
  const [dataProduct, setDataProduct] = useState<IProduct[]>([]);
  const [editing, setEditing] = useState(false);
  const [isModalVisibleCategory, setIsModalVisibleCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    ICategory | undefined
  >(undefined);
  const [dataCategory, setDataCategory] = useState<DataTypeCategory[]>([]);
  const showModalCategory = (category?: ICategory) => {
    setSelectedCategory(category);
    setIsModalVisibleCategory(true);
  };

  const handleCancelCategory = () => {
    setIsModalVisibleCategory(false);
  };
  console.log(dataProduct);
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
  ): ColumnType<IProduct> => ({
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
  const columns: ColumnsType<IProduct> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.id - b.id,
      ...getColumnSearchProps("id"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (_, record) => (
        //@ts-ignore
        <Image width={50} src={record.imageUrl} alt="imageUrl" />
      ),
    },
    // {
    //   title: "Image",
    //   dataIndex: "image",
    //   key: "image",
    //   render: (_, record) => (
    //     <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: "more" }}>
    //       {record.image}
    //     </Paragraph>
    //   ),
    // },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      ...getColumnSearchProps("price"),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      //@ts-ignore
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      //@ts-ignore
      ...getColumnSearchProps("categoryName"),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      //@ts-ignore
      sorter: (a, b) => a.unit.localeCompare(b.unit),
      //@ts-ignore
      ...getColumnSearchProps("unit"),
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
            <a onClick={() => onDeleteProduct(record.id)}>
              <DeleteOutlined />
              Xoá
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
    const initialValues: IProduct = {
      name: "",
      image: "",
      price: 0,
      hourly: false,
      //@ts-ignore
      active: false,
      categoryId: "1",
      unit: "",
      type: "Product",
    };
    setEditing(false);
    setEditProduct(initialValues);
    setIsModalVisible(false);
  };

  const onSubmmit = async (
    product: ProductDetail,
    resetFormData: () => void
  ) => {
    try {
      console.log(product);
      const res = await addProduct(product);
      if (res) {
        message.success("Thêm sản phẩm thành công!");
        resetFormData();
        fetchData();
        setIsModalVisible(false)
      }
    } catch (error) {
      console.log(error);
      message.error("Thêm sản phẩm thất bại!");
    }
  };

  const onUpdate = async (productId: number, product: ProductDetail) => {
    try {
      const res = await updateProduct(productId, product);
      if (res) {
        message.success("Cập nhật sản phẩm thành công!");
        setIsModalVisible(false);
        handleCancel();
        fetchData();
      }
    } catch (error) {
      console.log(error);
      message.error("Cập nhật sản phẩm thất bại!");
    }
  };

  const onDeleteProduct = async (productId: number) => {
    try {
      const res = await deleteProduct(productId);
      if (res) {
        message.success("Xóa thành công!");
        fetchData();
      }
    } catch (error) {
      console.log(error);
      message.error("Xóa thất bại!");
    }
  };
  const fetchDataCategory = async () => {
    const response = await findAllCategory();
    //@ts-ignore
    setDataCategory(response);
  };
  useEffect(() => {
    fetchDataCategory();
  }, []);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await findAll();
      //@ts-ignore
      setDataProduct(response);
      setLoadingProduct(false);
    } catch (error) {}
  };
  const [defaultCategoryId, setDefaultCategoryId] = useState(
    dataCategory?.[0]?.id || 0
  );
  useEffect(() => {
    //@ts-ignore
    setDefaultCategoryId(dataCategory?.[0]?.id || 0);
  }, [dataCategory]);
  const onSubmmitCategory = async (
    category: CategoryDetail,
    resetFormData: () => void
  ) => {
    try {
      const res = await addCategory(category);
      if (res) {
        message.success("Thêm danh mục thành công!");
        resetFormData();
        fetchDataCategory();
        setIsModalVisibleCategory(false);
      }
    } catch (error) {
      message.error("Thêm danh mục thất bại!");
    }
  };

  const onUpdateCategory = async (
    categoryId: number,
    category: CategoryDetail
  ) => {
    try {
      const res = await updateCategory(categoryId, category);
      if (res) {
        message.success("Cập nhật danh mục thành công!");
        fetchDataCategory();
      }
    } catch (error) {}
  };

  const onDeleteCategory = async (categoryId: number) => {
    try {
      const res = await deleteCategory(categoryId);
      // console.log(res?.data)
      if (res) {
        message.success("Xóa thành công!");
        fetchDataCategory();
      }
    } catch (error) {
      console.log(error);
      message.error("Xóa thất bại!");
    }
  };
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
                Danh mục
              </Typography>

              <Col>
                <PlusCircleOutlined onClick={() => showModalCategory()} />
              </Col>
            </Row>
            <Modal
              visible={isModalVisibleCategory}
              onCancel={handleCancelCategory}
              footer={null}
            >
              <TableCategory
                category={selectedCategory}
                onSubmit={onSubmmitCategory}
                onDelete={onDeleteCategory}
                onUpdate={onUpdateCategory}
              />
            </Modal>
            <Form.Item
              name="categoryId"
              // label="danh mục"
              // rules={[
              //   {
              //     required: true,
              //     message: "Vui lòng chọn danh mục",
              //   },
              // ]}
            >
              {" "}
              <Select
                bordered={false}
                value={defaultCategoryId}
                onChange={(value) => setDefaultCategoryId(value)}
              >
                {
                  //@ts-ignore
                  dataCategory.map((category) => (
                    <>
                      <Select.Option key={category.id} value={category.id}>
                        <Row justify={"space-between"}>
                          {category.name}
                          <Space>
                            <a>Sửa</a>
                            <a onClick={() => onDeleteCategory(category.id)}>
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
            <Spin spinning={loading} tip="Loading..." size="large">
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
                  Hàng hóa
                </Typography>
                <Col>
                  <Button type="primary" onClick={showModal}>
                    <PlusOutlined />
                    Thêm mới
                  </Button>
                </Col>
              </Row>
              <Modal
                width={1000}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
              >
                <TableProduct
                  product={editProduct}
                  onSubmit={onSubmmit}
                  onDelete={onDeleteProduct}
                  onUpdate={onUpdate}
                  editing={editing}
                />
              </Modal>
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
                dataSource={dataProduct?.map((product) => ({
                  ...product,
                  key: product.id,
                }))}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductController;
