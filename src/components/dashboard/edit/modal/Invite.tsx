import CustomModal from "@/src/components/modal/CustomModal";
import Close from "@/public/icons/close.svg";
import {
  Button,
  ButtonContainer,
  CloseButton,
  Input,
  InputContainer,
  InputMessage,
  Label,
  ModalHead,
  ModalTitle,
} from "./Style";
import { ChangeEvent } from "react";

export function InviteModal({
  isModal,
  setIsModal,
  isValue,
  setIsValue,
  isErrorMessage,
  setIsUpdate,
  postInvitation,
  setUpdateInvite,
}: {
  isModal: boolean;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
  isValue: string;
  setIsValue: React.Dispatch<React.SetStateAction<string>>;
  isErrorMessage: string;
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  postInvitation?: () => Promise<void>;
  setUpdateInvite?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const closeModal = () => setIsModal(false);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setIsValue(e.target.value);
  };

  // input 입력 후 Enter Event 발생 시 모달 비활성화
  const enterChangeUpdate = () => {
    setIsUpdate(false);
  };

  return (
    <CustomModal isOpen={isModal} onClose={closeModal}>
      {/* width값 설정 추가 - 나겸 */}
      <div style={{ width: "568px" }}>
        <ModalHead>
          <ModalTitle>초대하기</ModalTitle>
          <CloseButton>
            <Close onClick={closeModal} />
          </CloseButton>
        </ModalHead>
        <form
          onChange={enterChangeUpdate}
          onSubmit={(e) => {
            e.preventDefault();
            postInvitation?.();
            setUpdateInvite?.(true);
            setIsValue("");
          }}
        >
          <InputContainer>
            <Label>이메일</Label>
            <Input
              placeholder="이메일을 입력해주세요"
              onChange={(e) => handleChangeValue(e)}
            />
            <InputMessage>{isErrorMessage}</InputMessage>
          </InputContainer>
          <ButtonContainer>
            <Button onClick={closeModal}>취소</Button>
            <Button
              disabled={isValue === "" ? true : false}
              $confirm
              onClick={() => {
                setIsUpdate(false);
                postInvitation?.();
                setUpdateInvite?.(true);
                setIsValue("");
              }}
            >
              생성
            </Button>
          </ButtonContainer>
        </form>
      </div>
    </CustomModal>
  );
}
