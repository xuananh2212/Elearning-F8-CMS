import React from 'react'
import Header from '@/app/component/Header/Header';
import Footer from '@/app/component/Footer/Footer';

export default function layout({ children }) {
     return (
          <>
               <Header />
               <main>
                    {
                         children
                    }
               </main>
               <Footer />
          </>
     )
}
