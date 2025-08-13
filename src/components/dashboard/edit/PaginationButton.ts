import styled, { css } from "styled-components";
import { Button } from "../../button/CustomButton2";
import { ArrowButton } from "@/src/components/dashboard/edit/PaginationType";

export const PaginationButton = styled(Button)<ArrowButton>`
  width: 40px;
  height: 40px;
  line-height: 43px;
  ${(props) =>
    props.$left
      ? css`
          border-radius: 4px 0 0 4px;
          background: url("/images/dashboard/edit/ic_prevArrow.svg") center
            center no-repeat #fff;
        `
      : props.$right
      ? css`
          border-radius: 0 4px 4px 0;
          background: url("/images/dashboard/edit/ic_nextArrow.svg") center
            center no-repeat #fff;
        `
      : ""}
  background-color:${(props) => (props.disabled ? "#f9f9f9" : "")};
  @media (min-width: 769px) and (max-width: 840px) {
    width: 30px;
    height: 30px;
    line-height: 33px;
  }
`;
