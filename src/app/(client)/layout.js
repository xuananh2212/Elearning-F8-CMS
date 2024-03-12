import React from 'react'
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import SideBar from '@/components/SideBar/SideBar';

export default function layout({ children }) {
     return (
          <>
               <Header />
               <main className='flex min-h-[100vh]'>
                    <SideBar />
                    <div className='pr-10 pl-5 flex-1'>

                         {
                              children
                         }
                    </div>
               </main>
               <Footer />
          </>
     )
}
