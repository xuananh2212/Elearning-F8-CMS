import React from 'react'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SideBar from '@/components/SideBar';

export default function layout({ children }) {
     return (
          <>
               <Header />
               <main className='flex min-h-[100vh]'>
                    <SideBar />
                    <div className='mt-5 pr-10 pl-5 flex-1'>

                         {
                              children
                         }
                    </div>
               </main>
               <Footer />
          </>
     )
}
