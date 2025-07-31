"use client"
import { NextPage } from 'next'
import "./register_page.css"
interface Props {}

const Page: NextPage<Props> = ({}) => {
  return <div className='absolute inset-0 bg-amber-300 register_background '>
    <div className='main'>
    <section className='demo_section'>
       <img src="./svg/circle.svg" alt="" width={270} className='illustrations_circle '/>
       <img src="./svg/circle.svg" alt="" width={270} className='illustrations_circle_1'/>
       </section>
    <section className='register_section'>hi</section>
    </div>
    <div className='absolute bg-amber-200 playbox'>gi</div>
  </div>
}

export default Page