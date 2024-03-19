import React from 'react';

export default function ShirtSizeBreakdown(props: any) {
    const shirtSize = props.ShirtSize as string;
    const numShirts = props.NumShirts as number;
        
    return (
        <div>{shirtSize} ({numShirts})</div>
    );
}