import styled from "styled-components";

interface TaskHeaderProps {
  title: string;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ title }) => {
  return (
    <HeaderContainer>
      <Title>{title || "제목 없음"}</Title>
    </HeaderContainer>
  );
};

export default TaskHeader;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: #333;
`;
