import React from 'react'
import Image from 'next/image'

const AppLogo = () => {
  return (
    <div>
      <Image src="/assets/images/logo.png" alt="ロゴ" width={100} height={100} />
    </div>
  )
}

export default AppLogo