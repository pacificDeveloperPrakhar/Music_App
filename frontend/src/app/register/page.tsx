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
    <section className='register_section flex justify-center items-center'>
      <button
      onClick={()=>{window.location.href="http://127.0.0.1:3000/users/authenticate_with_google"}}
      className="flex items-center justify-center gap-2 px-4 py-2 glow-button  transition duration-200  text-sm font-medium"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
        className="w-5 h-5"
      />
      <span className=" text-white">Sign in with Google</span>
    </button>
    </section>
    </div>

  </div>
}

export default Page