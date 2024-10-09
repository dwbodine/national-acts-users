import { useGetSellers } from "@/hooks/common/useGetSellers";
import { Seller } from "@/types/event";
import { Role } from "@/types/user";
import { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa";


export default function AdminSellerSelect(props: any) {
    const sellers: Seller[] | undefined = props.Sellers as Seller[] | undefined;
    const roles: Role[] | undefined = props.Roles as Role[] | undefined;
    const sellerId: number = props.SellerId ? props.SellerId as number : 0;
    const roleId: number = props.RoleId ? props.RoleId as number : 0;
    const number: number | undefined = props.Number as number | undefined;
    const id: string = props.id;
    const onSellerChange = props.OnSellerChange;
    const onRoleChange = props.OnRoleChange;
    const onDelete = props.OnDelete;

    let sellerOptions: any[] = [];
    if (sellers) {
        sellerOptions.push(<option key="s" value={0}> -- Select one --</option>)
        sellers.map((item, i) => {
            const key = `s${i}`;
            sellerOptions.push(<option key={key} value={item.sellerId}>{item.name}</option>)
        });
    }
    
    let roleOptions: any[] = [];
    if (roles) {
        roleOptions.push(<option key="r" value={0}> -- Select one --</option>)
        roles.map((item, i) => {
            const key = `r${i}`;
            roleOptions.push(<option key={key} value={item.roleId}>{item.roleName}</option>)
        });
    }    

    return (
        <div className="admin-select">
            <span>Seller<span hidden={!number}> # {number}</span>:</span>
            <select hidden={sellerOptions.length == 0 || !onSellerChange} id={`${id}_seller`} onChange={onSellerChange} defaultValue={sellerId}> { sellerOptions } </select>
            <select hidden={roleOptions.length == 0 || !onRoleChange} id={`${id}_role`} onChange={onRoleChange} defaultValue={roleId}> { roleOptions } </select>
            <span hidden={!onDelete}><FaMinus title="Remove seller" className="admin-click-cell" id={`${id}_remove`} onClick={onDelete}></FaMinus></span>
        </div>
    );
}