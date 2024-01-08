import React from 'react'
import { Inter } from 'next/font/google'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import StyledComponentsRegistry from '../lib/AntdRegistry'

import '@/style/global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Billiard Manager',
  description: 'Quản lý quán Billiard',
}

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <body className={inter.className}>
      <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
    </body>
  </html>
)

export default RootLayout
