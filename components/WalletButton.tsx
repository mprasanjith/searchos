import { Flex } from '@mantine/core';
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FC } from 'react'

export const WalletButton: FC = () => {
  return (
    <>
      <Flex
        display="flex"
        direction={'row'}
        justify={'flex-end'}
        p={'16px'}
        align={'center'}
        mt={0}
        bg={'#f0f3f5'}
        gap={'1px solid #E5E5E5'}
      >
          <ConnectButton label="Connect" />
      </Flex>
    </>
  )
}
