"use client"
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Loading from '../loading';
import axios from 'axios';
import dateFormat from 'dateformat';
import { useRouter } from 'next/navigation';

export default function SavedAddress() {
  const user = useSelector((state) => (state?.user));
  const [addressDetails, setAddressDetails] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function fetchAddressDetails() {
    setLoading(true);
    const form = new FormData();
    form.set('userId', user?._id);

    await axios.post('/api/fetch-address/', form)
      .then((response) => {
        if (response.data.status === 200) {

          setAddressDetails(response.data?.addDetails)
        }
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      })
    setLoading(false);
  }
  useEffect(() => {
    fetchAddressDetails();
  }, []);

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <>
        {error}
      </>
    )
  }

  if (!addressDetails[0]) {
    return (
      <>
      <div className='w-full h-80 flex flex-col justify-center items-center gap-4'>
        <p className='animate-bounce'>No address availabele</p>
        <button onClick={()=>{
          router.push('/add-address/');
        }} className='w-fit px-3 p-1 bg-blue-600 text-white mx-auto'>Add Address</button>
      </div>
      </>
    )
  }

  return (
    <>
      <div className='flex flex-col gap-2 px-4'>
        {
          addressDetails.map((value, index) => (
            <div key={index} className='w-full border-[1px] flex justify-between   rounded bg-gray-100 p-5'>
              <div className='flex flex-col text-nowrap'>
                <p className='w-full font-bold'>{value?.pincode}</p>
                <div className='w-full '>
                  <p>{value?.address_line}</p>
                  <p>{value?.city}</p>
                </div>
                <div className='w-full flex gap-2'>
                  <div className='w-full gap-2 flex justify-between'>
                    <i>{value?.state},</i>
                    <i>{value?.country}</i>
                  </div>
                  <p className='font-bold float-end'>{dateFormat(value?.createdAt, "dd, mmm, yyyy")}</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}
