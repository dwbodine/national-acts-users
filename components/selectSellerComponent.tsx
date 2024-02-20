import { ChangeEvent } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../src/lib/store';
import { setSellerId } from '@/lib/reportSelectionSlice';

export default function SelectSeller() {
    const dispatch = useDispatch(); 
    const currentUser = useSelector((state: RootState) => state.user);
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        currentReportSelection.sellerId = parseInt(event.currentTarget.value);
        dispatch(
            setSellerId(currentReportSelection)
        )
    };

    if (currentUser && currentUser.sellers && currentUser.sellers.length > 0) {
        if (currentUser.sellers.length > 1) {
            return (        
                <div>
                    <label htmlFor="seller">Select One:</label>
                    <select id="seller" value={currentReportSelection.sellerId} onChange={handleChange}>
                        <option value="0"> -- Select One --</option>
                        { currentUser.sellers.map((seller) => {
                            return <option key={seller.sellerId} value={seller.sellerId}>{seller.sellerName}</option>;                    
                        })}
                    </select>
                </div>        
            );
        }
        else {
            const seller = currentUser.sellers[0];
            if (seller.sellerId != currentReportSelection.sellerId) {
                currentReportSelection.sellerId = seller.sellerId;
                dispatch(
                    setSellerId(currentReportSelection)
                )
            }            
            return (
                <div><span>{ seller.sellerName }</span></div>
            );
        }
    } else {
        return (
            <div><span>No sellers returned</span></div>
        );        
    }
}
