"use client";

import { IShirtData, IShirtSizeData } from '@/types/event';
import React, { ReactElement } from 'react';
import { FaShirtsinbulk } from 'react-icons/fa';
import { ShirtSizesWidgetProps } from '@/types/props';

export default function ShirtSizesWidget(props: ShirtSizesWidgetProps) {
  const shirtPropData: IShirtData = props.ShirtData as IShirtData;
  const totalShirts: number = props.TotalShirts as number;

  const shirtSizes = shirtPropData?.ShirtSizes;

  const shirtMap = new Map<string, number>();
  if (shirtSizes?.length > 0) {
    shirtSizes.forEach((shirtSize: string) => {
      shirtPropData.ShirtData?.forEach((shirSizeData: IShirtSizeData[]) => {
        const data = shirSizeData.find((x) => x.ShirtSize === shirtSize);
        let number = shirtMap.get(shirtSize) ?? 0;
        if (data) {
          number += data.Number;
        }
        shirtMap.set(shirtSize, number);
      });
    });

    const sSizes: ReactElement[] = [];
    const sSizesTwo: ReactElement[] = [];
    let i = 0;
    for (const shirtSize of shirtSizes) {
      const key = `ssw${i}`;
      if (i > 2) {
        sSizesTwo.push(
          <div key={key}>
            {shirtSize} ({shirtMap.get(shirtSize)})
          </div>,
        );
      } else {
        sSizes.push(
          <div key={key}>
            {shirtSize} ({shirtMap.get(shirtSize)})
          </div>,
        );
      }

      i += 1;
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
  }
  return <></>;
}
