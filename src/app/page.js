import Image from "next/image";
import PostsCount from "./components/PostsCount";
import PostTable from "./components/PostTable";

export default function Home() {
  return (
    <div style={{ marginTop: '0px', marginLeft: '80px', padding: '5px' }}>
      <PostsCount />
      <PostTable />
    </div>
  )
}
