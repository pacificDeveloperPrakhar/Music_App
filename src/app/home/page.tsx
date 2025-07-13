import { NextPage } from 'next'

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return <div className='min-h-screen bg-gray-950 flex flex-col'>
    <div className='bg-purple-50 flex-1'></div>
    <div>playbox</div>
  </div>
}

export default Page