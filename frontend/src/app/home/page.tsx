import { NextPage } from 'next'

interface Props {}
type SearchParamProps = {
  searchParams: Record<string, string> | null | undefined;
};
const Page: NextPage<Props> = ({searchParams }: SearchParamProps) => {
  console.log(searchParams,"mu log")
  return <div className='min-h-screen bg-gray-950 flex flex-col'>
    <div className='bg-purple-50 flex-1'></div>
    <div>playbox</div>
  </div>
}

export default Page