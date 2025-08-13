import styled, { css } from "styled-components";

type Props = {
  $confirm?: boolean;
  disabled?: boolean;
};

// 공통
export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const Button = styled.div<Props>`
  max-width: 50%;
  min-width: 50%;
  height: 54px;
  line-height: 54px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  color: #787486;
  cursor: pointer;
  ${(props) =>
    props.$confirm &&
    css`
      background: #5534da;
      color: #fff;
    `}
  ${(props) =>
    props.disabled &&
    css`
      background: #9fa6b2;
    `}
`;

// CheckModal
export const Contents = styled.div`
  width: 568px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: inherit;
`;

export const MessageText = styled.p`
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: 400;
  text-align: center;
`;

// InviteModal
export const ModalHead = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

export const ModalTitle = styled.div`
  font-size: 22px;
  font-weight: 500;
`;

export const CloseButton = styled.div`
  cursor: pointer;
`;

export const InputContainer = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 400;
`;

export const Input = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  font-size: 16px;

  &::placeholder {
    color: #8b8b8b;
  }
`;

export const InputMessage = styled.p`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 400;
  color: #d6173a;
`;
