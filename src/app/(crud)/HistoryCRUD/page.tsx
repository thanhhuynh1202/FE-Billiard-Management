"use client";
import { onGetHistory } from "@/app/services/HistoryService";
import { Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const History = () => {
  const [historyData, setHistoryData] = useState<[]>();
  useEffect(() => {
    const fetchData = async () => {
      const res = await onGetHistory();
      //@ts-ignore
      setHistoryData(res);
    };
    fetchData();
  }, []);
  console.log(historyData);
  const columns: ColumnsType<[]> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      //@ts-ignore
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Khởi tạo vào lúc",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <>{dayjs(date).format("YYYY-MM-DD HH:mm:ss")}</>
      ),
      sorter: (a, b) =>
      //@ts-ignore
        dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
    },

    {
      title: "Tạo bởi",
      dataIndex: "createdBy",
      key: "createdBy",
      //@ts-ignore
      sorter: (a, b) => a.createdBy.localeCompare(b.createdBy),
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      //@ts-ignore
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
       //@ts-ignore
       sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Cập nhật vào lúc",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => (
        <>{dayjs(date).format("YYYY-MM-DD HH:mm:ss")}</>
      ),
      sorter: (a, b) =>
      //@ts-ignore
        dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf(),
    },
    {
      title: "Cập nhật bởi",
      dataIndex: "updatedBy",
      key: "updatedBy",
      //@ts-ignore
      sorter: (a, b) => a.updatedBy.localeCompare(b.updatedBy),
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        scroll={{ x: 1000 }}
        dataSource={historyData?.map((history: any) => ({
          ...history,
          key: history.id,
        }))}
      />
    </>
  );
};
export default History;
