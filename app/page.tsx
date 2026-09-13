import Image from "next/image";
import Link from "next/link";
import Featured from "./components/featured/Featured";
import Category from "./components/categoryList/Category";
import CardList from "./components/cardList/CardList";
import MenuMP from "./components/sidebar/Sidebar";

interface HomeProps {
  searchParams: Promise<{
    page?: string,
    cat?: string
  }>
}

export default async function Home({ searchParams }: HomeProps) {
  
  const resolvedParams = await searchParams;
  const page = resolvedParams.page || '1';
  const cat = resolvedParams.cat || '';

  return (
    <>
      <Featured />
      <Category />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-8">
          <CardList page={page} cat={cat} />
        </div>
        <div className="lg:col-span-4 lg:sticky lg:top-20">
          <MenuMP />
        </div>

        
        
      </div>
    </>
  );
}
