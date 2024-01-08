"use client";
import React, { useEffect, useState } from "react";
import { Col, Flex, Row, message } from "antd";
import AreaController from "./components/ListArea";
import TableArea from "./components/TableCRUD";
import { IArea, AreaDetail } from "@/lib/interfaceBase";
import {
  addArea,
  deleteArea,
  findAllArea,
  updateArea,
} from "@/app/services/areaService";

const AppAreaCTRL: React.FC = () => {
  const [editArea, setEditArea] = useState<IArea>();
  const [data, setData] = useState<IArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await findAllArea();
      //@ts-ignore
      setData(response);
      setLoading(false);
    } catch (error) {}
  };
  const onCurrentArea = (area: IArea) => {
    setEditArea(area);
  };
  const onSubmmit = async (area: AreaDetail, resetFormData: () => void) => {
    try {
      const res = await addArea(area);
      if (res) {
        message.success("Thêm khu vực thành công!");
        resetFormData();
        fetchData();
      }
    } catch (error) {
      message.error("Thêm khu vực thất bại!");
    }
  };

  const onUpdate = async (areaId: number, area: AreaDetail) => {
    try {
      const res = await updateArea(areaId, area);
      if (res) {
        message.success("Cập nhật khu vực thành công!");
        fetchData();
      }
    } catch (error) {}
  };

  const onDelete = async (areaId: number) => {
    try {
      const res = await deleteArea(areaId);
      // console.log(res?.data)
      if (res) {
        message.success("Xóa thành công!");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Row justify={"space-between"}>
        <Col span={10}>
          <Flex vertical>
            <TableArea
              area={editArea}
              onSubmit={onSubmmit}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
            {/* <Flex vertical style={footer}>
            <Footer />
          </Flex> */}
          </Flex>
        </Col>
        <Col span={13}>
          <AreaController
            onEdit={onCurrentArea}
            data={data}
            onDelete={onDelete}
            loading={loading}
          />
        </Col>
      </Row>
    </>
  );
};

export default AppAreaCTRL;
