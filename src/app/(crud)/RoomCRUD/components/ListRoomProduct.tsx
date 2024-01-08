// import { findAll, productById } from "@/app/services/productService";
// import {
//   deleteAllByRoom,
//   deleteRoomProduct,
//   findAllRoomProduct,
// } from "@/app/services/roomProductService";
// import { roomById } from "@/app/services/roomService";
// import { IRoom, RoomDetail, RoomProduct } from "@/lib/interfaceBase";
// import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
// import {
//   Badge,
//   Button,
//   Card,
//   Col,
//   Image,
//   List,
//   Modal,
//   Row,
//   Space,
//   Spin,
//   Tag,
//   Typography,
// } from "antd";
// import Table, { ColumnsType } from "antd/es/table";
// import { useEffect, useState } from "react";
// const { Text } = Typography;

// interface IProps {
//   // onEditRoomProduct: (room: IRoom) => void;
//   onDeleteProductId: (id: number) => void;
//   data: IRoom[];
//   onAddRoomProduct: (roomProduct: IRoom) => void;
//   // loading: boolean;
// }

// const ListRoomProduct: React.FC<IProps> = ({
//   // onEditRoomProduct,
//   onDeleteProductId,
//   data,
//   onAddRoomProduct,
//   // loading,
// }) => {
//   const [roomData, setRoomData] = useState<RoomDetail[]>();
//   const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
//   const [selectedRoomName, setSelectedRoomName] = useState<string>("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isModalOpenWithProduct, setIsModalOpenWithProduct] = useState(false);

//   const [isButtonDisabled, setIsButtonDisabled] = useState(true);
//   const [productData, setProductData] = useState<[]>([]);
//   const [roomProductData, setRoomProductData] = useState<[]>([]);
//   console.log(roomProductData);
//   const roomProductByRoomId = async () => {
//     const response = await findAllRoomProduct(selectedRoom);
//     //@ts-ignore
//     setRoomProductData(response);
//   };
//   const listData = async () => {
//     const response = await findAll();
//     //@ts-ignore
//     setProductData(response.content);
//   };
//   useEffect(() => {
//     roomProductByRoomId();
//   }, [selectedRoom]);
//   useEffect(() => {
//     listData();
//   }, []);
  
//   const onDeleteAllByRoomId = async (id:number) => {
//     await deleteAllByRoom(id);
//   };
//   const roomsWithProducts =
//     //@ts-ignore
//     data?.content?.filter((room) => room.roomProducts?.length > 0) || [];
//   const roomsWithoutProducts =
//     //@ts-ignore
//     data?.content?.filter(
//       //@ts-ignore
//       (room) => !room.roomProducts || room.roomProducts.length === 0
//     ) || [];
//   const showModalIsProduct = () => {
//     if (roomsWithProducts) {
//       setIsModalOpenWithProduct(true);
//     }
//   };
//   const showModal = () => {
//     if (selectedRoom !== null) {
//       setIsModalOpen(true);
//     }
//   };

//   const handleOkWithProduct = () => {
//     setIsModalOpenWithProduct(false);
//   };

//   const handleCancelWithProduct = () => {
//     setIsModalOpenWithProduct(false);
//   };
//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };
//   const handleEdit = async (id: number) => {
//     // const roomOrder = await findRoomOrderID(id);
//     const room = await roomById(id);
//     //@ts-ignore
//     setRoomData(room);
//     setSelectedRoom(id);
//     //@ts-ignore
//     setSelectedRoomName(room.name);
//     setIsButtonDisabled(false);
//   };
//   const handleAddRoomProduct = async (roomProduct: any) => {
//     const initialValues = {
//       roomId: selectedRoom,
//       productId: roomProduct.id,
//     };
//     //@ts-ignore
//     onAddRoomProduct(initialValues);
//     handleOk();
//   };
//   const handleDeleteProductId = async (id:number) => {
//     onDeleteProductId(id);
//     handleOkWithProduct();
//   }
//   return (
//     <>
//           <Card style={{ marginTop: "20px" }}>
//             <Text>
//               <Row justify="space-between">
//                 Danh sách BÀN không có sản phẩm mặc định <Text></Text>
//                 <Text></Text>
//                 <Text></Text>
//                 <Text></Text>
//                 <Text>
//                   Đang chọn bàn:{" "}
//                   <p
//                     style={{
//                       // width: "100px",
//                       textAlign: "center",
//                       minHeight: "20px",
//                       width: "10px",
//                       border: "1px solid red",
//                     }}
//                   ></p>
//                 </Text>
//                 <Text>
//                   Đang sử dụng:{" "}
//                   <p
//                     style={{
//                       textAlign: "center",
//                       minHeight: "20px",
//                       width: "10px",
//                       backgroundColor: "#307DC7",
//                     }}
//                   ></p>
//                 </Text>
//               </Row>
//             </Text>
//             <List
//               style={{ marginTop: "20px" }}
//               grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 10, xxl:10  }}
//               dataSource={data?.content?.map((room: RoomProduct) => ({
//                 ...room,
//                 key: room.id,
//               }))}
//               renderItem={(item) => {
//                 //@ts-ignore
//                 const { name, id, roomOrders } = item;
//                 // const active = roomOrders.length > 0;
//                 const isUsed = roomOrders && roomOrders.length;
//                 return (
//                   <List.Item>
//                     <a onClick={() => handleEdit(id)}>
//                       <Card
//                         size="small"
//                         hoverable
//                         cover={
//                           <Image
//                             src="https://firebasestorage.googleapis.com/v0/b/leafy-emblem-385311.appspot.com/o/image%2Fdining-room%20(3).png?alt=media&token=116a175e-7315-41ac-ab29-98b477fbc032"
//                             alt="product"
//                             style={{ width: "68px" }}
//                             preview={false}
//                           />
//                         }
//                         style={{
//                           width: "115px",
//                           textAlign: "center",
//                           minHeight: "90px",
//                           border:
//                             selectedRoom === id
//                               ? "1px solid red"
//                               : "1px solid #e8e8e8",
//                           backgroundColor: isUsed ? "#307DC7" : "",
//                         }}
//                       >
//                         <Text strong style={{ color: isUsed ? "white" : "" }}>
//                           {name}
//                         </Text>
//                         <br />
//                         <Text
//                           type="secondary"
//                           style={{ color: isUsed ? "white" : "" }}
//                         >
//                           {isUsed ? "Đang sử dụng" : "Trống"}
//                         </Text>
//                       </Card>
//                     </a>
//                   </List.Item>
//                 );
//               }}
//             />
//             <Text style={{ color: "red" }}>
//               Lưu ý: Hãy chọn bàn trước khi thêm sản phẩm mặc định cho bàn
//             </Text>
//             <Button
//               onClick={showModal}
//               style={{ float: "right" }}
//               disabled={isButtonDisabled}
//             >
//               Thêm sản phẩm mặc định
//             </Button>
//             <Modal
//               title={
//                 <>
//                   Thêm sản phẩm mặc định cho bàn{" "}
//                   <span style={{ color: "red" }}>{selectedRoomName}</span>
//                 </>
//               }
//               open={isModalOpen}
//               onOk={handleOk}
//               onCancel={handleCancel}
//               width={1000}
//             >
//               <List
//                 grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 5 }} // Adjust the grid settings
//                 style={{ padding: "10px" }}
//                 dataSource={productData}
//                 renderItem={(item) => {
//                   const { name, id } = item;
//                   //@ts-ignore
//                   const price = item.price;
//                   //@ts-ignore
//                   const image = item.imageUrl;

//                   return (
//                     <List.Item key={id}>
//                       <a
//                         onClick={() => {
//                           handleAddRoomProduct(item);
//                         }}
//                       >
//                         <Card
//                           size="small"
//                           hoverable
//                           cover={
//                             <Image src={image} alt="product" preview={false} />
//                           }
//                         >
//                           <Text
//                             style={{
//                               display: "block",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {name}
//                           </Text>
//                         </Card>
//                       </a>
//                     </List.Item>
//                   );
//                 }}
//               />
             
//             </Modal>
//           </Card>
//     </>
//   );
// };
// export default ListRoomProduct;
