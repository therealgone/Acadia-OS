"use client";
import { useState } from "react";


export default function Calculation() {


    const [internal , setInternal] = useState<number>(0) 


    return (
      <div className="text-white panel">

        <input type="number"
        placeholder="Internal"
        value={internal}
        onChange={e => setInternal(Number((e.target.value)))

        } />



      </div>
    )
}