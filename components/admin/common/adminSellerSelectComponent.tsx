import { Seller } from '@/types/event';
import { Role } from '@/types/user';
import { Col, Container, Row } from 'react-bootstrap';
import { FaMinus } from 'react-icons/fa';
import { SelectPicker } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/internals/types';

export default function AdminSellerSelect(props: any) {
  const sellers: Seller[] | undefined = props.Sellers as Seller[] | undefined;
  const roles: Role[] | undefined = props.Roles as Role[] | undefined;
  const sellerId: number = props.SellerId ? (props.SellerId as number) : 0;
  const roleId: number = props.RoleId ? (props.RoleId as number) : 0;
  const number: number | undefined = props.Number as number | undefined;
  const id: string = props.id;
  const onSellerChange = props.OnSellerChange;
  const onRoleChange = props.OnRoleChange;
  const onDelete = props.OnDelete;

  const sellerList: ItemDataType<number>[] = sellers ?
    sellers?.map((seller) => {
      return {
        label: `${seller.name}`,
        value: seller.sellerId
      }
  }) : [];

  const roleList: ItemDataType<number>[] = roles ?
    roles?.map((role) => {
      return {
        label: `${role.roleName}`,
        value: role.roleId
      }
  }) : [];

  return (
    <Row className="admin-select">
      <Col xs={1}>
        Seller<span hidden={!number}> # {number}</span>:
      </Col>
      <Col xs={5} sm={4} md={3} hidden={sellerList.length == 0 || !onSellerChange}>
        <SelectPicker
          className="admin-seller-select-value"
          menuAutoWidth={true}
          value={sellerId}
          data={sellerList}
          size="lg"        
          onChange={(sId) => onSellerChange(sId)}
          cleanable={false}
        />
      </Col>
      <Col xs={5} sm={4} md={3} hidden={roleList.length == 0 || !onRoleChange}>
      <SelectPicker
          className="admin-seller-select-value"
          menuAutoWidth={true}
          value={roleId}
          data={roleList}
          size="lg"        
          onChange={(rId) => onRoleChange(rId)}
          cleanable={false}
          searchable={false}
        />
      </Col>
      <Col xs={1} hidden={!onDelete}>
        <FaMinus
          title="Remove seller"
          className="admin-click-cell"
          id={`${id}_remove`}
          onClick={onDelete}
        ></FaMinus>
      </Col>
    </Row>
  );
}
