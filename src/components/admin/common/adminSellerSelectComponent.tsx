'use client';

import { Button, Col, Container, FormCheck, Row } from 'rsuite';
import { Country, PageSeller } from '@/types/public';
import { Modal, SelectPicker } from 'rsuite';
import { Seller, SellerType } from '@/types/event';
import { AdminSellerSelectProps } from '@/types/props';
import { FaMinus } from 'react-icons/fa';
import { ItemDataType } from 'rsuite/esm/internals/types';
import { Role } from '@/types/user';
import { useState } from 'react';

export default function AdminSellerSelect(props: AdminSellerSelectProps) {
  let sellers: Seller[] | undefined = props.Sellers as Seller[] | undefined;
  const roles: Role[] | undefined = props.Roles as Role[] | undefined;
  const sellerId: number = props.SellerId ? (props.SellerId as number) : 0;
  const sellerType: SellerType | undefined = props.SellerType
    ? (props.SellerType as SellerType)
    : undefined;
  const roleId: number = props.RoleId ? (props.RoleId as number) : 0;
  const number: number | undefined = props.Number as number | undefined;
  const id: string = props.Id;
  const onSellerChange = props.OnSellerChange;
  const onRoleChange = props.OnRoleChange;
  const onPageSellerChange = props.OnPageSellerChange;
  const onDelete = props.OnDelete;
  const pageSeller: PageSeller | undefined = props.PageSeller
    ? (props.PageSeller as PageSeller)
    : undefined;
  const countries: Country[] | undefined = props.Countries
    ? (props.Countries as Country[])
    : undefined;

  const [pageSellerSettingsOpen, setPageSellerSettingsOpen] = useState(false);
  const handlePageSellerSettingsOpen = () => setPageSellerSettingsOpen(true);
  const handlePageSellerSettingsClose = () => setPageSellerSettingsOpen(false);

  const [displayName, setDisplayName] = useState(pageSeller?.displayName ?? '');
  const [showDisplayName, setShowDisplayName] = useState(
    pageSeller?.showDisplayName ?? false,
  );
  const [address, setAddress] = useState(pageSeller?.address ?? '');
  const [city, setCity] = useState(pageSeller?.city ?? '');
  const [state, setState] = useState(pageSeller?.state ?? '');
  const [zip, setZip] = useState(pageSeller?.zip ?? '');
  const [countryId, setCountryId] = useState(pageSeller?.country?.countryId);
  const [phone, setPhone] = useState(pageSeller?.phone ?? '');
  const [email, setEmail] = useState(pageSeller?.email ?? '');
  const [twitter, setTwitter] = useState(pageSeller?.twitter ?? '');
  const [facebook, setFacebook] = useState(pageSeller?.facebook ?? '');
  const [instagram, setInstagram] = useState(pageSeller?.instagram ?? '');
  const [youtube, setYoutube] = useState(pageSeller?.youtube ?? '');
  const [spotify, setSpotify] = useState(pageSeller?.spotify ?? '');
  const [website, setWebsite] = useState(pageSeller?.website ?? '');
  const [websiteDisplayText, setWebsiteDisplayText] = useState(
    pageSeller?.websiteDisplayText ?? '',
  );

  if (sellers && sellerType) {
    sellers = sellers.filter((x) => x.sellerType === sellerType);
  }

  const isArtist = sellerType && sellerType === SellerType.Artist;
  const selectedSeller: Seller | undefined = sellers?.find(
    (x) => x.sellerId === sellerId,
  );

  const updatePageSellerSettings = () => {
    if (!pageSeller || !onPageSellerChange) {
      return;
    }
    const ps: PageSeller = { ...pageSeller };
    ps.displayName = displayName;
    ps.showDisplayName = showDisplayName;
    ps.address = isArtist ? undefined : address;
    ps.city = isArtist ? undefined : city;
    ps.state = isArtist ? undefined : state;
    ps.zip = isArtist ? undefined : zip;
    const country: Country | undefined = countryId ? { countryId } : undefined;
    ps.country = isArtist ? undefined : country;
    ps.phone = isArtist ? undefined : phone;
    ps.email = isArtist ? undefined : email;
    ps.twitter = twitter;
    ps.facebook = facebook;
    ps.instagram = instagram;
    ps.youtube = youtube;
    ps.spotify = spotify;
    ps.website = website;
    ps.websiteDisplayText = websiteDisplayText;
    onPageSellerChange(ps);
    handlePageSellerSettingsClose();
  };

  const onCountryChange = (cId: number | null) => {
    setCountryId(cId ?? undefined);
  };

  const sellerList: ItemDataType<number>[] = sellers
    ? sellers?.map((seller) => ({
        label: `${seller.name}`,
        value: seller.sellerId,
      }))
    : [];

  const roleList: ItemDataType<number>[] = roles
    ? roles?.map((role) => ({
        label: `${role.roleName}`,
        value: role.roleId,
      }))
    : [];

  const countryList: ItemDataType<number>[] = countries
    ? countries?.map((country) => ({
        label: `${country.countryName}`,
        value: country.countryId,
      }))
    : [];

  return (
    <Row className="admin-select">
      <Col xs={1}>
        Seller<span hidden={!number}> # {number}</span>:
      </Col>
      <Col xs={5} sm={4} md={3} hidden={sellerList.length === 0 || !onSellerChange}>
        <SelectPicker
          className="admin-seller-select-value"
          menuAutoWidth={true}
          value={sellerId}
          data={sellerList}
          size="lg"
          onChange={(sId) => (onSellerChange ? onSellerChange(sId) : null)}
          cleanable={false}
        />
      </Col>
      <Col xs={5} sm={4} md={3} hidden={roleList.length === 0 || !onRoleChange}>
        <SelectPicker
          className="admin-seller-select-value"
          menuAutoWidth={true}
          value={roleId}
          data={roleList}
          size="lg"
          onChange={(rId) => (onRoleChange ? onRoleChange(rId) : null)}
          cleanable={false}
          searchable={false}
        />
      </Col>
      <Col xs={1} hidden={!pageSeller || !onPageSellerChange}>
        <Button onClick={handlePageSellerSettingsOpen}>Page Seller Settings</Button>
        <Modal open={pageSellerSettingsOpen} onClose={handlePageSellerSettingsClose}>
          <Modal.Header>
            <Modal.Title>Seller Override Values</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="fluid">
              <Row>
                <Col>
                  <label className="page-seller-label">Display Name</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is &quot;{selectedSeller?.name}&quot;
                  </div>
                  <input
                    value={displayName ?? ''}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="Display Name override"
                    type="text"
                  />
                  <FormCheck
                    checked={showDisplayName}
                    onChange={(e) => setShowDisplayName(e.target.checked)}
                    label={'Show Display Name Override?'}
                  />
                </Col>
              </Row>
              <Row hidden={isArtist}>
                <Col>
                  <label className="page-seller-label">Address</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is {`${selectedSeller?.address ?? 'n/a'}`}
                  </div>
                  <input
                    value={address ?? ''}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="Street address override"
                    type="text"
                  />
                </Col>
              </Row>
              <Row hidden={isArtist}>
                <Col>
                  <label className="page-seller-label">City</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is {`${selectedSeller?.city ?? 'n/a'}`}
                  </div>
                  <input
                    value={city ?? ''}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="City override"
                    type="text"
                  />
                </Col>
              </Row>
              <Row hidden={isArtist}>
                <Col>
                  <label className="page-seller-label">State</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is {`${selectedSeller?.state ?? 'n/a'}`}
                  </div>
                  <input
                    value={state ?? ''}
                    onChange={(e) => setState(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="State override"
                    type="text"
                  />
                </Col>
              </Row>
              <Row hidden={isArtist}>
                <Col>
                  <label className="page-seller-label">Postal Code</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is {`${selectedSeller?.zip ?? 'n/a'}`}
                  </div>
                  <input
                    value={zip ?? ''}
                    onChange={(e) => setZip(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="Postal code override"
                    type="text"
                  />
                </Col>
              </Row>
              <Row hidden={isArtist}>
                <Col>
                  <label className="page-seller-label">Country</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is {`${selectedSeller?.country?.countryName ?? 'n/a'}`}
                  </div>
                  <SelectPicker
                    className="admin-seller-select-value"
                    menuAutoWidth={true}
                    value={countryId}
                    data={countryList}
                    size="lg"
                    onChange={(cId) => onCountryChange(cId)}
                    cleanable={false}
                  />
                </Col>
              </Row>
              <Row hidden={isArtist}>
                <Col>
                  <label className="page-seller-label">Phone</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is {`${selectedSeller?.phone ?? 'n/a'}`}
                  </div>
                  <input
                    value={phone ?? ''}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="Phone override"
                    type="text"
                  />
                </Col>
              </Row>
              <Row hidden={isArtist}>
                <Col>
                  <label className="page-seller-label">Email</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is {`${selectedSeller?.email ?? 'n/a'}`}
                  </div>
                  <input
                    value={email ?? ''}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="Email override"
                    type="text"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label className="page-seller-label">Twitter</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is {`${selectedSeller?.twitter ?? 'n/a'}`}
                  </div>
                  <input
                    value={twitter ?? ''}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="Twitter override"
                    type="text"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label className="page-seller-label">Facebook</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is {`${selectedSeller?.facebook ?? 'n/a'}`}
                  </div>
                  <input
                    value={facebook ?? ''}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="Facebook override"
                    type="text"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label className="page-seller-label">Instagram</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is {`${selectedSeller?.instagram ?? 'n/a'}`}
                  </div>
                  <input
                    value={instagram ?? ''}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="Instagram override"
                    type="text"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label className="page-seller-label">YouTube</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is {`${selectedSeller?.youtube ?? 'n/a'}`}
                  </div>
                  <input
                    value={youtube ?? ''}
                    onChange={(e) => setYoutube(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="YouTube override"
                    type="text"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label className="page-seller-label">Spotify</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is {`${selectedSeller?.spotify ?? 'n/a'}`}
                  </div>
                  <input
                    value={spotify ?? ''}
                    onChange={(e) => setSpotify(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="Spotify override"
                    type="text"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label className="page-seller-label">Website</label>
                  <div className="pageseller-default">
                    Default is {`${selectedSeller?.website ?? 'n/a'}`}
                  </div>
                  <input
                    value={website ?? ''}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="Website override"
                    type="text"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label className="page-seller-label">Website Display Text</label>
                  <div hidden={!selectedSeller} className="pageseller-default">
                    Default is {`${selectedSeller?.websiteDisplayText ?? '(none)'}`}
                  </div>
                  <input
                    value={websiteDisplayText ?? ''}
                    onChange={(e) => setWebsiteDisplayText(e.target.value)}
                    className="form-control form-control-half"
                    placeholder="Website display text override"
                    type="text"
                  />
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer className="modal-notes-footer">
            <Button onClick={updatePageSellerSettings}>Ok</Button>
            <Button onClick={handlePageSellerSettingsClose}>Cancel</Button>
          </Modal.Footer>
        </Modal>
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
