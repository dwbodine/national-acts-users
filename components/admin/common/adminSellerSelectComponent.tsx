import { useGetSellers } from "@/hooks/common/useGetSellers";
import { Seller } from "@/types/event";
import { Role } from "@/types/user";
import { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa";


export default function AdminSellerSelect(props: any) {
    const sellers: Seller[] = props.Sellers as Seller[];
    const roles: Role[] = props.Roles as Role[];
    const sellerId: number = props.SellerId ? props.SellerId as number : 0;
    const roleId: number = props.RoleId ? props.RoleId as number : 0;
    const number: number = props.Number as number;
    const id: string = props.id;
    const onSellerChange = props.OnSellerChange;
    const onRoleChange = props.OnRoleChange;
    const onDelete = props.OnDelete;

    let sellerOptions: any[] = [];
    sellerOptions.push(<option key="s" value={0}> -- Select one --</option>)
    sellers.map((item, i) => {
        const key = `s${i}`;
        sellerOptions.push(<option key={key} value={item.sellerId}>{item.name}</option>)
    });

    let roleOptions: any[] = [];
    roleOptions.push(<option key="r" value={0}> -- Select one --</option>)
    roles.map((item, i) => {
        const key = `r${i}`;
        roleOptions.push(<option key={key} value={item.roleId}>{item.roleName}</option>)
    });

    return (<div className="admin-select">
            Seller # {number}: 
            <select id={`${id}_seller`} onChange={onSellerChange} value={sellerId}> { sellerOptions } </select>
            <select id={`${id}_role`} onChange={onRoleChange} value={roleId}> { roleOptions } </select>
            <FaMinus title="Remove seller" className="admin-click-cell" id={`${id}_remove`} onClick={onDelete}></FaMinus>
        </div>);
}