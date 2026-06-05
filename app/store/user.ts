import cookie from 'js-cookie';
import { create } from 'zustand';

type State = {
  userInfo?: any;
  token: string;
  initLoading: boolean;
};

type Action = {
  init: () => void;
  setToken: (token: string) => void;
  clearStorage: () => Promise<void>;
  getUserInfo: () => Promise<boolean>;
  login: (loginInfo: any) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const useUserStore = create<State & Action>((set, get) => ({
  userInfo: undefined,
  token: '',
  initLoading: true,
  init: async () => {
    if (typeof window === 'undefined') {
      return;
    }
    const { clearStorage } = get();
    const token = localStorage.getItem('token') || cookie.get('x-token');
    if (token) {
      set({ token });
      const success = await get().getUserInfo();
      if (success) {
        set({ initLoading: false });
        return;
      }
      clearStorage();
    }
    set({ token: '', initLoading: false });
  },
  setToken: (token) => {
    set({ token });
  },
  clearStorage: async () => {
    set({ token: '' });
    sessionStorage.clear();
    localStorage.removeItem('token');
    cookie.remove('x-token');
  },
  getUserInfo: async () => {
    // try {
    //   const res = await apiClient.defaultModule.userGetUserInfoGet();
    //   const data = res.data;
    //   if (data.code === 0 && data.data) {
    //     set({ userInfo: data.data.userInfo });
    //     return true;
    //   }
    // } catch {
    //   //
    // }
    return false;
  },
  login: async (loginInfo: any) => {
    // const res = await apiClient.baseModule
    //   .baseLoginPost({ data: loginInfo })
    //   .catch(tipCatchError as never);
    // const data = res.data;
    // if (data?.code === 0 && data.data && data.data.user && data.data.token) {
    //   set({ userInfo: data.data.user, token: data.data.token });
    //   localStorage.setItem('token', data.data.token);
    //   cookie.set('x-token', data.data.token);
    //   return true;
    // }
    return false;
  },
  logout: async () => {
    // const { clearStorage } = get();
    // const res = await apiClient.jwtModule.jwtJsonInBlacklistPost();
    // if (res.data.code === 0) {
    //   clearStorage();
    // }
  },
}));
