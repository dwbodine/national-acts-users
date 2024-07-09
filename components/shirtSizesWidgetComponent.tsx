import React from 'react';
import { IShirtData, IShirtSizeData } from '@/types/event';
import { FaShirtsinbulk } from 'react-icons/fa';

export default function ShirtSizesWidget(props: any) {

    const shirtPropData: IShirtData = props.ShirtData as IShirtData;
    const totalShirts: number = props.TotalShirts as number;

  
    const shirtSizes = shirtPropData?.ShirtSizes;
    
    let arr: any = [];
    if (shirtSizes?.length > 0) {
        shirtPropData.ShirtData?.forEach((shirSizeData: IShirtSizeData[], key: string) => {
            shirtSizes.forEach((shirtSize: string) => {
                var data = shirSizeData.find(x => x.ShirtSize == shirtSize);
                var number = arr[shirtSize] ?? 0;
                if (data) {
                    number += data.Number;
                }
                arr[shirtSize] = number;
            });
        });
    

        var sSizes = [];
        let i = 0;
        for (const shirtSize of shirtSizes) {
            const key = `ssw${i}`;
            sSizes.push(<div key={key}>{shirtSize} ({arr[shirtSize]})</div>);
            i++;
        }

        return (
            <div className="stat-block">
                <FaShirtsinbulk size="2em" />
                <div>Shirt sizes sold:</div>
                {sSizes}
                <span>Total: {totalShirts}</span>
            </div>
        );
    } else {
        return (<></>);
    }
}