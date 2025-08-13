import { ReactNode, SetStateAction, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import axiosInstance from "@/src/api/axios";
import axios from "axios";
import { Button } from "../../button/CustomButton2";
import IconAdd from "@/public/images/dashboard/edit/ic_invite.svg";
import { InviteModal } from "./modal/Invite";
import { useEdit } from "@/src/contexts/dashboard/edit/EditDashboardProvider";
import { useEditToast } from "@/src/hooks/dashboard/edit/useEditToast";
import { Toast } from "./toast/Toast";

type Props = {
  $nav?: boolean;
};

const ButtonContainer = styled(Button)<Props>`
  width: fit-content;
  padding: 0 15px;
  margin-left: 16px;
  height: 32px;
  line-height: 32px;
  background: #5534da;
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  svg {
    padding-top: 2px;
    margin-right: 3px;
  }

  ${(props) =>
    props.$nav &&
    css`
      display: flex;
      align-items: center;
      height: auto;
      line-height: normal;
      margin-left: 0;
      padding: 8px 12px;
      box-sizing: border-box;
      border-radius: 6px;
      background: #fff;
      color: #787486;

      img {
        margin-right: 5px;
      }

      &:hover {
        background-color: #eee;
      }
    `}
`;

export function InviteButton({
  $nav,
  children,
  dashboardId,
  setUpdateInvite,
}: {
  $nav?: boolean;
  children?: ReactNode;
  dashboardId: string | string[] | undefined;
  setUpdateInvite?: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isValue, setIsValue] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState("");

  const { getInvitations } = useEdit();

  const { isToast, setIsToast } = useEditToast();

  const handleShowModal = () => {
    setIsModal(true);
  };

  async function postInvitation() {
    try {
      await axiosInstance.post(`/dashboards/${dashboardId}/invitations`, {
        email: isValue,
      });
      getInvitations();
      setIsUpdate(true);
      setIsToast(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response)
          if (error.response.status === 400) {
            setIsErrorMessage("이메일 형식이 올바르지 않습니다.");
          } else if (error.response.status === 403) {
            setIsErrorMessage("대시보드 초대 권한이 없습니다.");
          } else if (error.response.status === 409) {
            setIsErrorMessage("이미 대시보드에 초대된 멤버입니다.");
          } else {
            setIsErrorMessage("이메일을 확인해주세요.");
          }
      }
    }
  }

  // input 입력 및 모달 비활성화 시 초대 API 리스폰스 에러 메세지 초기화
  useEffect(() => {
    setIsErrorMessage("");
  }, [isModal, isValue]);

  // 초대 API 전송 성공 시 모달 비활성화
  useEffect(() => {
    if (isUpdate) {
      setIsModal(false);
      getInvitations();
    }
  }, [isUpdate]);

  return (
    <>
      {isToast && <Toast setIsToast={setIsToast} createInvite />}
      {isModal && (
        <InviteModal
          isModal={isModal}
          setIsModal={setIsModal}
          isValue={isValue}
          setIsValue={setIsValue}
          isErrorMessage={isErrorMessage}
          postInvitation={postInvitation}
          setIsUpdate={setIsUpdate}
          setUpdateInvite={setUpdateInvite}
        />
      )}
      {$nav}
      <ButtonContainer {...($nav && { $nav })} onClick={handleShowModal}>
        {$nav ? (
          children
        ) : (
          <>
            <IconAdd /> 초대하기
          </>
        )}
      </ButtonContainer>
    </>
  );
}
