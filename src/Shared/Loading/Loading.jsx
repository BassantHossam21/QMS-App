import React from "react";
import { LineWave } from "react-loader-spinner";

export default function Loading({ height }) {
  return (
    <>
      <div className={`flex justify-center items-center ${height}`}>
        <LineWave
          visible={true}
          height="100"
          width="100"
          color="#4a5565"
          ariaLabel="line-wave-loading"
          wrapperStyle={{}}
          wrapperClass=""
          firstLineColor=""
          middleLineColor=""
          lastLineColor=""
        />
      </div>
    </>
  );
}
