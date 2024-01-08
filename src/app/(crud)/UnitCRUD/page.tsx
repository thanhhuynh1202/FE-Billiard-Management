"use client";
import React, { useEffect, useState } from "react";
import { Col, Flex, Row, message } from "antd";
import UnitController from "./components/ListUnit";
import TableUnit from "./components/TableCRUD";
import { IUnit, UnitDetail } from "@/lib/interfaceBase";
import {
  addUnit,
  findAllUnit,
  deleteUnit,
  updateUnit,
} from "@/app/services/unitService";

const AppUnitCTRL: React.FC = () => {
  const [editUnit, setEditUnit] = useState<IUnit>();
  const [data, setData] = useState<IUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await findAllUnit();
      //@ts-ignore
      setData(response);
      setLoading(false);
    } catch (error) {}
  };
  const onCurrentUnit = (unit: IUnit) => {
    setEditUnit(unit);
  };
  const onSubmmit = async (unit: UnitDetail, resetFormData: () => void) => {
    try {
      const res = await addUnit(unit);
      if (res) {
        message.success("Thêm loại thành công!");
        resetFormData();
        fetchData();
      }
    } catch (error) {}
  };

  const onUpdate = async (unitId: number, unit: UnitDetail) => {
    try {
      const res = await updateUnit(unitId, unit);
      if (res) {
        message.success("Cập nhật loại thành công!");
        fetchData();
      }
    } catch (error) {}
  };

  const onDelete = async (unitId: number) => {
    try {
      const res = await deleteUnit(unitId);
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
            <TableUnit
              unit={editUnit}
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
          <UnitController
            onEdit={onCurrentUnit}
            data={data}
            onDelete={onDelete}
            loading={loading}
          />
        </Col>
      </Row>
    </>
  );
};

export default AppUnitCTRL;
