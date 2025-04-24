"use client";
import dynamic from "next/dynamic"

const Calendar = dynamic(() => import('../components/Calendar'), {
  ssr: false,
});
const Home = () => {
  return <Calendar />
}

export default Home;