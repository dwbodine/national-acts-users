import React from 'react';
import { IShirtData, IShirtSizeData } from '@/types/event';
import { FaShirtsinbulk } from 'react-icons/fa';

export default function ShirtSizesWidget(props: any) {
  const shirtPropData: IShirtData = props.ShirtData as IShirtData;
  const totalShirts: number = props.TotalShirts as number;

  const shirtSizes = shirtPropData?.ShirtSizes;

  let arr: any = [];
  if (shirtSizes?.length > 0) {
    shirtSizes.forEach((shirtSize: string) => {
      shirtPropData.ShirtData?.forEach((shirSizeData: IShirtSizeData[], key: string) => {
        var data = shirSizeData.find((x) => x.ShirtSize == shirtSize);
        var number = arr[shirtSize] ?? 0;
        if (data) {
          number += data.Number;
        }
        arr[shirtSize] = number;
      });
    });

    var sSizes = [];
    var sSizesTwo = [];
    let i = 0;
    for (const shirtSize of shirtSizes) {
      const key = `ssw${i}`;
      if (i > 2) {
        sSizesTwo.push(
          <div key={key}>
            {shirtSize} ({arr[shirtSize]})
          </div>,
        );
      } else {
        sSizes.push(
          <div key={key}>
            {shirtSize} ({arr[shirtSize]})
          </div>,
        );
      }
      
      i++;
    }

    return (
      <>
        <FaShirtsinbulk size="2em" />
        <div>Shirt sizes sold:</div>
        <div className="shirt-size-container">
          <div className="shirt-sizes">
            {sSizes}
          </div>
          <div className="shirt-sizes">
            {sSizesTwo}
          </div>        
        </div>
        <span>Total: {totalShirts}</span>
      </>
    );
  } else {
    return <></>;
  }
}
