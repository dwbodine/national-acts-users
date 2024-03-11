import { ChangeEvent } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../src/lib/store';
import { setSeller } from '@/lib/reportSelectionSlice';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function SelectSeller() {
    const dispatch = useDispatch(); 
    const { user } = useCurrentUser();

    const getSelectedSeller = (sellerId: number) => {
        const seller = user.sellers?.find(x => x.sellerId == sellerId);
        return seller || {
            sellerId: 0,
            sellerName: ''
        };
    }

    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
    let selectedSellerId = currentReportSelection.seller.sellerId;

    if (selectedSellerId <= 0 && user && user.selectedSellerId && user.selectedSellerId > 0) {
        const seller = getSelectedSeller(user.selectedSellerId);
        dispatch(
            setSeller(seller)
        )
    }    

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const sellerId = parseInt(event.currentTarget.value);
        user.selectedSellerId = sellerId;
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        const seller = getSelectedSeller(sellerId);
        dispatch(
            setSeller(seller)
        )
    };

    if (user && user.sellers && user.sellers.length > 0) {
        if (user.sellers.length > 1) {
            return (        
                <select id="seller" value={selectedSellerId} onChange={handleChange}>
                    <option value="0"> -- Select One --</option>
                    { user.sellers.map((seller) => {
                        return <option key={seller.sellerId} value={seller.sellerId}>{seller.sellerName}</option>;                    
                    })}
                </select>
            );
        }
        else {
            const seller = user.sellers[0];
            if (seller.sellerId != selectedSellerId) {
                dispatch(
                    setSeller(seller)
                )
            }            
            return (
                <span>{ seller.sellerName }</span>
            );
        }
    } else {
        return (
            <span>No sellers returned</span>
        );        
    }
}
