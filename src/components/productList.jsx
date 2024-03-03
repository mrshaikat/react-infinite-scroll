import { Spinner } from "keep-react";
import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";

const productPerPage = 10;
export default function ProductList(){
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);
    useEffect(()=>{
        const fetchProducts = async () =>{
            const response = await fetch(`https://dummyjson.com/products?limit=${productPerPage}&skip=${page * productPerPage}`);
            const data = await response.json();
            if(data.products.length === 0){
                setHasMore(false)
            }else{
                setProducts((prevProducts)=> [...prevProducts, ...data.products]);
                setPage(prevPage => prevPage + 1)
            }

        }
        const onIntersection = (items) =>{
            const loaderItem = items[0];

            if(loaderItem.isIntersecting && hasMore){
                fetchProducts();
            }
        }
        const observer = new IntersectionObserver(onIntersection);

        if(observer && loaderRef.current ){
            observer.observe(loaderRef.current)
        }


        // cleanup function
        return () => {
          if(observer) observer.disconnect()
        }
    }, [hasMore, page]);

    return (
        <div>
            <h1>Product List</h1>
            {
                products.map((product) => <ProductCard title={product.title} price={product.price} thumbnail={product.thumbnail} key={product.id}/>)
            }
            {hasMore && <div ref={loaderRef}> Loading product <Spinner color="info" size="lg" /></div>}
        </div>
    );
}