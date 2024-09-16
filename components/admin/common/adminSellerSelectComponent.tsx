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
    sellerOptions.push(<option value={0}> -- Select one --</option>)
    sellers.map((item) => {
        const selected: boolean = (sellerId > 0) && sellerId == item.sellerId;
        sellerOptions.push(<option value={item.sellerId} selected={selected}>{item.name}</option>)
    });

    let roleOptions: any[] = [];
    roleOptions.push(<option value={0}> -- Select one --</option>)
    roles.map((item) => {
        const selected: boolean = (roleId > 0) && roleId == item.roleId;
        roleOptions.push(<option value={item.roleId} selected={selected}>{item.roleName}</option>)
    });

    return (<div className="admin-select">
            Seller # {number}: 
            <select id={`${id}_seller`} onChange={onSellerChange}> { sellerOptions } </select>
            <select id={`${id}_role`} onChange={onRoleChange}> { roleOptions } </select>
            <FaMinus title="Remove seller" className="admin-click-cell" id={`${id}_remove`} onClick={onDelete}></FaMinus>
        </div>);
}