import styled from "styled-components";

// Toast
export const ToastContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  width: calc(100vw * (200 / 1200));
  min-width: 270px;
  height: 50px;
  position: fixed;
  left: 50%;
  bottom: calc(env(safe-area-inset-bottom) + 50px);
  transform: translate(-50%);
  z-index: 1000;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;

  @media (max-width: 768px) {
    min-width: max-content;
    margin: 0 20px;
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;

  & > svg {
    margin-right: 10px;
  }
`;

export const Right = styled.div`
  & svg {
    margin-top: 3px;
    margin-left: 10px;
    cursor: pointer;
  }
`;

export const Text = styled.p`
  font-size: 16px;
  font-weight: 400;
`;
