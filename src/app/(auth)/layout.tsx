import React from 'react'
import { Card, Col, Layout, Row } from 'antd'
import '@/style/global.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const layoutStyle = {
    backgroundImage: 
    // 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://firebasestorage.googleapis.com/v0/b/leafy-emblem-385311.appspot.com/o/closeup-billiard-balls-sticks-table.jpg?alt=media&token=673054f7-3e12-42be-b98c-ca7894de4f49")',

    'url("https://firebasestorage.googleapis.com/v0/b/leafy-emblem-385311.appspot.com/o/closeup-billiard-balls-sticks-table.jpg?alt=media&token=673054f7-3e12-42be-b98c-ca7894de4f49")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    
  };
  return (
    <Layout style={layoutStyle}>
      <Row style={{minHeight: '100vh'}} justify={'center'} >
        <Col style={{marginTop:60}} span={10}>{children}</Col>
      </Row>
    </Layout>
  )
}
