import React, {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import axiosInstance from "../../../api/axios";
import { useEditPagination } from "../../../hooks/dashboard/edit/useEditPagination";

const EditContext = createContext({
  isDashboard: null,
  isMembers: null,
  isInvitations: null,
  memberPage: 1,
  invitePage: 1,
  setMemberPage: (value: SetStateAction<number>) => {},
  setInvitePage: (value: SetStateAction<number>) => {},
  getDashboardDetail: () => {},
  getMembers: () => {},
  getInvitations: () => {},
  handlePrevClick: (e: React.MouseEvent<HTMLButtonElement>) => {},
  handleNextClick: (e: React.MouseEvent<HTMLButtonElement>) => {},
});

export function EditProvider({
  children,
  dashboardId,
}: {
  children: ReactNode;
  dashboardId: string;
}) {
  const [values, setValues] = useState({
    isDashboard: null,
    isMembers: null,
    isInvitations: null,
  });

  const {
    memberPage,
    invitePage,
    setMemberPage,
    setInvitePage,
    handlePrevClick,
    handleNextClick,
  }: {
    memberPage: number;
    invitePage: number;
    setMemberPage: (value: SetStateAction<number>) => void;
    setInvitePage: (value: SetStateAction<number>) => void;
    handlePrevClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleNextClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  } = useEditPagination();

  async function getDashboardDetail() {
    const res = await axiosInstance.get(`/dashboards/${dashboardId}`);
    const dashboard = res.data;

    setValues((prevValues) => ({
      ...prevValues,
      isDashboard: dashboard,
    }));
  }

  async function getMembers() {
    const res = await axiosInstance.get(
      `/members?dashboardId=${dashboardId}&page=${memberPage}&size=4`
    );
    const members = res.data;

    setValues((prevValues) => ({
      ...prevValues,
      isMembers: members,
    }));
  }

  async function getInvitations() {
    const res = await axiosInstance.get(
      `/dashboards/${dashboardId}/invitations?page=${invitePage}&size=4`
    );
    const invitaions = res.data;

    setValues((prevValues) => ({
      ...prevValues,
      isInvitations: invitaions,
    }));
  }

  useEffect(() => {
    if (dashboardId) {
      getDashboardDetail();
      getMembers();
      getInvitations();
    }
  }, [dashboardId, memberPage, invitePage]);

  return (
    <EditContext.Provider
      value={{
        isDashboard: values.isDashboard,
        isMembers: values.isMembers,
        isInvitations: values.isInvitations,
        memberPage,
        invitePage,
        setMemberPage,
        setInvitePage,
        getDashboardDetail,
        getMembers,
        getInvitations,
        handlePrevClick,
        handleNextClick,
      }}
    >
      {children}
    </EditContext.Provider>
  );
}

export function useEdit() {
  const context = useContext(EditContext);

  if (!context) {
    throw new Error("반드시 EditDashboardProvider 안에서 사용해야 합니다.");
  }

  return context;
}
