'use client'

import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from 'react-query'

export function Providers({ children }) {
     const queryClient = new QueryClient()
     return (
          <QueryClientProvider client={queryClient}>
               <NextUIProvider>
                    {children}
               </NextUIProvider>
          </QueryClientProvider>
     )
}