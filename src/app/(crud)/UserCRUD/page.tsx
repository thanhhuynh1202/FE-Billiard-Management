"use client";
import React, { useEffect, useState } from "react";
import { Col, Flex, Row, message } from "antd";
import UserController from "./components/ListUser";
import TableUser from "./components/TableCRUD";
import { UserDetail, IUser } from "@/lib/interfaceBase";
import {
  addUser,
  deleteUser,
  findAllUser,
  updateUser,
} from "@/app/services/userService";

const AppUserCTRL: React.FC = () => {
  return (
    <>
      {/* <Row justify={"space-between"}>
        <Col span={10}>
          <Flex vertical>
            <TableUser
              user={editUser}
              onSubmit={onSubmmit}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
           
          </Flex>
        </Col>
        <Col span={13}> */}
          <UserController
            // onEdit={onCurrentUser}
            // data={data}
            // onDelete={onDelete}
            // loading={loading}
          />
        {/* </Col>
      </Row> */}
    </>
  );
};

export default AppUserCTRL;
