'use client';

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Col, Input, Row, Table } from 'rsuite';

import ConfirmationDialog from '@/components/common/confirmationDialogComponent';
import PageHeader from '@/components/common/PageHeaderComponent';
import { useGetFeaturedArtists } from '@/hooks/admin/useGetFeaturedArtists';
import { useUpdateFeaturedArtistsOrder } from '@/hooks/admin/useUpdateFeaturedArtistsOrder';
import { setFeaturedArtists } from '@/lib/adminDataSelectionSlice';
import {
  setMustSaveFeaturedArtistOrder,
  setReloadFeaturedArtists,
  setSelectedFeaturedArtist,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { FeaturedArtist } from '@/types/public';
import { GetFeaturedArtistsResponse } from '@/types/responses';

export default function AdminFeaturedArtistsIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const currentAdminDataSelection = useSelector((state: RootState) => state.adminDataSelection);
  const dispatch = useDispatch();
  const { getFeaturedArtists } = useGetFeaturedArtists();
  const router = useRouter();
  const { updateFeaturedArtistsOrder } = useUpdateFeaturedArtistsOrder();
  const { Column, HeaderCell, Cell } = Table;
  const [tableLoading, setTableLoading] = useState(true);
  const [currentFaMap, setCurrentFaMap] = useState<Map<number, FeaturedArtist> | undefined>(
    undefined,
  );

  const markDirty = () => {
    dispatch(setMustSaveFeaturedArtistOrder(true));
  };

  const setFeaturedArtistOrder = (faId: number, faOrder: number | undefined) => {
    if (
      !currentAdminDataSelection.featuredArtists ||
      currentAdminDataSelection.featuredArtists.length === 0 ||
      !faId ||
      isNaN(faId)
    ) {
      return;
    }
    const newFaOrder: number | undefined = faOrder && !isNaN(faOrder) ? faOrder : undefined;
    if (!currentFaMap || !newFaOrder) {
      return;
    }
    const updatedFaMap = new Map<number, FeaturedArtist>(currentFaMap);
    const fa = updatedFaMap.get(faId);
    const oldFaOrder = fa?.featuredArtistOrder;
    if (fa && oldFaOrder && oldFaOrder !== newFaOrder) {
      const lastUpdate =
        oldFaOrder < newFaOrder
          ? moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
          : moment().format('YYYY-MM-DD HH:mm:ss');
      const newFa = {
        ...fa,
        featuredArtistOrder: newFaOrder,
        lastUpdate: lastUpdate,
      };
      updatedFaMap.set(faId, newFa);
      reorderArtists(updatedFaMap);
      markDirty();
    }
  };

  const getArtistsSorted = (faMap: Map<number, FeaturedArtist>) => {
    const mapArray = [...faMap];
    const newMap = new Map(
      mapArray.sort(([key1, fa1], [key2, fa2]) => {
        if ((fa1.featuredArtistOrder ?? 0) > (fa2.featuredArtistOrder ?? 0)) {
          return 1;
        }
        if ((fa1.featuredArtistOrder ?? 0) < (fa2.featuredArtistOrder ?? 0)) {
          return -1;
        }
        if (fa1.lastUpdate && fa2.lastUpdate) {
          const p1 = moment(fa1.lastUpdate).unix();
          const p2 = moment(fa2.lastUpdate).unix();
          if (p1 < p2) {
            return 1;
          }
          if (p1 > p2) {
            return -1;
          }
        }
        if (key1 > key2) {
          return 1;
        }
        if (key2 < key1) {
          return -1;
        }
        return 0;
      }),
    );
    return newMap;
  };

  const reorderArtists = useCallback(
    (faOrders: Map<number, FeaturedArtist> | undefined) => {
      if (!faOrders || faOrders.size === 0) {
        return;
      }
      let faMap = new Map<number, FeaturedArtist>(faOrders);
      faMap = getArtistsSorted(faMap);

      // Reset lastUpdate and pageOrder on all after sort
      const lastUpdate = moment().format('YYYY-MM-DD HH:mm:ss');
      const faMapKeys = [...faMap.keys()];
      faMapKeys.forEach((key, i) => {
        const fa = faMap.get(key);
        if (fa) {
          const newFa = {
            ...fa,
            featuredArtistOrder: i + 1,
            lastUpdate,
          };
          faMap.set(key, newFa);
        }
      });
      setCurrentFaMap(faMap);
      const updatedFaOrders = Array.from(faMap.values());

      dispatch(setFeaturedArtists(updatedFaOrders));
    },
    [dispatch],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        currentAdminSelection.reloadFeaturedArtists &&
        !currentAdminDataSelection.featuredArtists
      ) {
        dispatch(setReloadFeaturedArtists(false));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        void getFeaturedArtists().then((response: GetFeaturedArtistsResponse) => {
          if (!response.error && response.featuredArtists) {
            const faMap = new Map<number, FeaturedArtist>();
            response.featuredArtists.forEach((fa) => {
              faMap.set(fa.featuredArtistId, fa);
            });
            setCurrentFaMap(faMap);
            reorderArtists(faMap);
          }
          dispatch(setIsLoading(false));
          dispatch(setMustSaveFeaturedArtistOrder(false));
          setTableLoading(false);
        });
      } else if (tableLoading) {
        setTimeout(() => {
          setTableLoading(false);
        }, 300);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    dispatch,
    currentAdminSelection.reloadFeaturedArtists,
    currentAdminSelection.selectedFeaturedArtist,
    currentAdminDataSelection.featuredArtists,
    tableLoading,
    reorderArtists,
  ]);

  const editFeaturedArtist = (featuredArtistId: number) => {
    if (
      !featuredArtistId ||
      isNaN(featuredArtistId) ||
      !currentAdminDataSelection.featuredArtists ||
      currentAdminDataSelection.featuredArtists.length === 0
    ) {
      return;
    }
    const fa = currentAdminDataSelection.featuredArtists.find(
      (x) => x.featuredArtistId === featuredArtistId,
    );
    if (!fa) {
      return;
    }
    dispatch(setSelectedFeaturedArtist(fa));
    router.push('/admin/featured-artists/edit');
  };

  const moveUp = (faId: number) => {
    if (!faId || isNaN(faId) || !currentAdminDataSelection.featuredArtists || !currentFaMap) {
      return;
    }
    const fa = currentFaMap.get(faId);
    if (fa && fa.featuredArtistOrder) {
      const updatedFaMap = new Map<number, FeaturedArtist>(currentFaMap);
      const order = fa.featuredArtistOrder;
      if (order > 1) {
        const newFa = {
          ...fa,
          featuredArtistOrder: order - 1,
          lastUpdate: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        updatedFaMap.set(faId, newFa);
        reorderArtists(updatedFaMap);
        markDirty();
      }
    }
  };

  const moveDown = (faId: number) => {
    if (!faId || isNaN(faId) || !currentAdminDataSelection.featuredArtists || !currentFaMap) {
      return;
    }
    const fa = currentFaMap.get(faId);
    if (fa && fa.featuredArtistOrder) {
      const updatedFaMap = new Map<number, FeaturedArtist>(currentFaMap);
      const order = fa.featuredArtistOrder;
      if (order < updatedFaMap.size) {
        const newFa = {
          ...fa,
          featuredArtistOrder: order + 1,
          lastUpdate: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        };
        updatedFaMap.set(faId, newFa);
        reorderArtists(updatedFaMap);
        markDirty();
      }
    }
  };

  const onSubmit = async () => {
    if (!currentAdminDataSelection.featuredArtists) {
      return;
    }
    const featuredArtists = [...currentAdminDataSelection.featuredArtists.values()];
    dispatch(setIsLoading(true));
    try {
      const response = await updateFeaturedArtistsOrder(featuredArtists);
      if (response.success) {
        dispatch(setReloadFeaturedArtists(true));
        dispatch(setFeaturedArtists(undefined));
        toast.success('Featured artist order save succeeded');
      } else if (response.error) {
        dispatch(setIsLoading(false));
        toast.error(response.error);
      } else {
        dispatch(setIsLoading(false));
        toast.error('Page order save failed');
      }
    } catch {
      dispatch(setIsLoading(false));
      toast.error('An error occurred while saving featured artist order');
    }
  };

  const reload = () => {
    toast.dismiss();
    dispatch(setFeaturedArtists(undefined));
    dispatch(setReloadFeaturedArtists(true));
  };

  const confirmReload = () => {
    if (!currentAdminSelection?.mustSaveFeaturedArtistOrder) {
      reload();
      return;
    }

    const message: string =
      'You have made changes to the featured artist order, are you sure you want to discard them and reload?';
    toast.warning(
      <ConfirmationDialog
        Message={message}
        ConfirmText="Yes"
        CancelText="No"
        OnConfirm={reload}
        OnCancel={() => {
          toast.dismiss();
        }}
      />,
      {
        autoClose: false,
        closeOnClick: false,
        position: 'top-center',
      },
    );
  };

  const featuredArtists = currentAdminDataSelection?.featuredArtists
    ? [...currentAdminDataSelection.featuredArtists.values()]
    : [];

  const pageHeader = `Manage Featured Artists Order`;

  return (
    <>
      <PageHeader pageTitle={pageHeader} />
      <Col xs={24} className="admin-container">
        <Row>
          <Col xs={24}>
            <Table autoHeight data={featuredArtists} bordered cellBordered loading={tableLoading}>
              <Column flexGrow={1}>
                <HeaderCell>Order</HeaderCell>
                <Cell className="page-order-cell">
                  {(rowData) => (
                    <Input
                      className="page-order-input"
                      id={`${rowData['featuredArtistId']}`}
                      value={`${rowData['featuredArtistOrder']}`}
                      onChange={(value) =>
                        setFeaturedArtistOrder(
                          parseInt(`${rowData['featuredArtistId']}`),
                          parseInt(value),
                        )
                      }
                      onBlur={() => reorderArtists(currentFaMap)}
                    />
                  )}
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell> </HeaderCell>
                <Cell>
                  {(rowData: FeaturedArtist) => (
                    <>
                      <span>
                        <FaArrowUp
                          className="admin-up-down-button"
                          onClick={() => moveUp(parseInt(`${rowData['featuredArtistId']}`))}
                          title="Move Up"
                        />
                      </span>
                      <span>
                        <FaArrowDown
                          className="admin-up-down-button"
                          onClick={() => moveDown(parseInt(`${rowData['featuredArtistId']}`))}
                          title="Move Down"
                        />
                      </span>
                    </>
                  )}
                </Cell>
              </Column>
              <Column flexGrow={3}>
                <HeaderCell>Artist</HeaderCell>
                <Cell dataKey="title"></Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>&nbsp;</HeaderCell>
                <Cell>
                  {(rowData: FeaturedArtist) => (
                    <a
                      href="#"
                      id={`${rowData.featuredArtistId}_featuredArtist`}
                      onClick={() => editFeaturedArtist(parseInt(`${rowData.featuredArtistId}`))}
                    >
                      Edit
                    </a>
                  )}
                </Cell>
              </Column>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={() => void onSubmit()}>Save</Button>
            <Button onClick={confirmReload}>Reload</Button>
          </Col>
        </Row>
      </Col>
    </>
  );
}
