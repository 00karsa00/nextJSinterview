"use client";

import React, { useState,useEffect } from 'react';
import { Pagination } from './Pagination'; 
import { api } from "~/trpc/react"; 
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";



export const CategoryList = () => {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const categoryListMutation = api.user.categoryList.useMutation();
    const selectCatMutation = api.user.saveCategory.useMutation();
    const token = localStorage.getItem('accessToken') || "exprie";
    const loadData = async (page: number, limit: number) => {
      const categoryList:any = await categoryListMutation.mutateAsync({ page: page, limit: limit, token });
      if(categoryList.error) {
        toast.info(categoryList.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        if(categoryList.invalidToken) {
          router.push('/login');
        }
        return
      }
      
      setCategories(categoryList.list);
      setTotalPage(categoryList.totalPage);
    }
   
    const onPageChange = (selectedPage: number) => {
      console.log("selected  pageb=> ",selectedPage)
        setPage(selectedPage);
        loadData(selectedPage, limit)
    };

    const updateCheckBox = async (isChecked: boolean, id: number, savedId: any) => {
      let input: any = {};
      console.log("isChecked => ",isChecked)
      if(isChecked) {
          input = {
              action: "save",
              id, token
          }
      } else {
        input = {
          action: "remove",
          id, token, savedId
        }
      }
      console.log("input => ",input)
      const categoryList:any = await selectCatMutation.mutateAsync(input);
      toast.info(categoryList.message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      if(categoryList.error) {
        if(categoryList.invalidToken) {
          router.push('/login');
        }
      }
      loadData(page, limit)
      return
    }

    useEffect(() => {
      loadData(page, limit)
    }, [])

    
    return (
      <>
        <ul>
          {categories && categories.length? categories.map((category: any, index: number) => (
            <li key={index}>
                  <input type='checkbox' id={`category-${index}`} onChange={(event) => updateCheckBox(event.target.checked, category.id, category.savedId)}  checked={category.savedId ? true : false}/>
                  <label className='ml-2' style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '26px' }}>{category.name}</label>
            </li>
          )): 'No Data'}
        </ul>
        <div className='text-center'>
            <Pagination totalPages={totalPage} currentPage={page} onPageChange={onPageChange} />
        </div>
      </>
    );
  }
