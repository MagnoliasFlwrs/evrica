import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstanceAll, baseAuthUrl } from '../store';
import { ClientCardBaseData, ClientLastCall, ClientsStoreState } from './types/clientsStoreTypes';

export const useClientsStore = create<ClientsStoreState>()(
  persist(
    (set, get) => ({
      error: false,
      clientsPhonesTotal: 0,
      clientsFoundTotal: 0,
      clientNumbers: [],
      clientsSearchLoading: false,
      clientCardLoading: false,
      clientCardBase: null,
      clientLastCalls: [],
      activeClientNumber: null,

      getClientPhonesList: async (orgId: number | string) => {
        set({ clientsSearchLoading: true, error: false });
        try {
          const res = await axiosInstanceAll.post(
            `${baseAuthUrl}/proxy-dashboard/get-client-phones-list`,
            {
              org_id: Number(orgId),
            },
            {
              headers: {
                'Content-Type': 'application/json',
                accept: '*/*',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            },
          );

          const total =
            res?.data?.data?.total ??
            res?.data?.data?.count ??
            (Array.isArray(res?.data?.data?.client_numbers)
              ? res.data.data.client_numbers.length
              : Array.isArray(res?.data?.data)
                ? res.data.data.length
                : 0);

          set({
            clientsPhonesTotal: total,
            clientsFoundTotal: total,
            clientsSearchLoading: false,
            error: false,
          });

          return total;
        } catch (error) {
          set({
            clientsSearchLoading: false,
            error: true,
          });

          return 0;
        }
      },

      findClient: async (orgId: number | string, clientNumber: string, page = 1, size = 20) => {
        set({ clientsSearchLoading: true, error: false });
        try {
          const res = await axiosInstanceAll.post(
            `${baseAuthUrl}/proxy-dashboard/find-client`,
            {
              org_id: Number(orgId),
              client_number: clientNumber,
              page,
              size,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                accept: '*/*',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            },
          );

          const total = Number(res?.data?.data?.total ?? 0);
          const clientNumbers = Array.isArray(res?.data?.data?.client_numbers)
            ? res.data.data.client_numbers
            : [];

          set({
            clientsFoundTotal: total,
            clientNumbers,
            clientsSearchLoading: false,
            error: false,
          });

          return { total, clientNumbers };
        } catch (error) {
          set({
            clientsSearchLoading: false,
            clientNumbers: [],
            clientsFoundTotal: 0,
            error: true,
          });

          return { total: 0, clientNumbers: [] };
        }
      },

      resetClientSearchResults: () => {
        set((state) => ({
          clientsFoundTotal: state.clientsPhonesTotal,
          clientNumbers: [],
          clientsSearchLoading: false,
        }));
      },

      getClientCardBase: async (orgId: number | string, clientNumber: string) => {
        try {
          const res = await axiosInstanceAll.post(
            `${baseAuthUrl}/proxy-dashboard/get-client-card-base`,
            {
              org_id: Number(orgId),
              client_number: clientNumber,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                accept: '*/*',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            },
          );

          return (res?.data?.data ?? null) as ClientCardBaseData | null;
        } catch (error) {
          return null;
        }
      },

      getClientCardLastCalls: async (orgId: number | string, clientNumber: string) => {
        try {
          const res = await axiosInstanceAll.post(
            `${baseAuthUrl}/proxy-dashboard/get-client-card-last-calls`,
            {
              org_id: Number(orgId),
              client_number: clientNumber,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                accept: '*/*',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            },
          );

          return Array.isArray(res?.data?.data?.calls)
            ? (res.data.data.calls as ClientLastCall[])
            : [];
        } catch (error) {
          return [];
        }
      },

      loadClientCard: async (orgId: number | string, clientNumber: string) => {
        set({ clientCardLoading: true, error: false, activeClientNumber: clientNumber });
        try {
          const [baseData, callsData] = await Promise.all([
            get().getClientCardBase(orgId, clientNumber),
            get().getClientCardLastCalls(orgId, clientNumber),
          ]);

          set({
            clientCardBase: baseData,
            clientLastCalls: callsData,
            clientCardLoading: false,
            error: false,
          });
        } catch (error) {
          set({
            clientCardLoading: false,
            error: true,
          });
        }
      },

      clearClientCard: () => {
        set({
          clientCardBase: null,
          clientLastCalls: [],
          activeClientNumber: null,
        });
      },
    }),
    {
      name: 'clients',
      partialize: (state) => ({
        clientsPhonesTotal: state.clientsPhonesTotal,
        clientsFoundTotal: state.clientsFoundTotal,
      }),
    },
  ),
);
