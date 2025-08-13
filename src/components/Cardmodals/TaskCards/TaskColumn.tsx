import styled from "styled-components";

interface TaskColumnProps {
  columnTitle: string;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ columnTitle }) => {
  return <ColumnContainer>{columnTitle}</ColumnContainer>;
};

export default TaskColumn;

const ColumnContainer = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 26px;
  border-radius: 16px;
  padding: 4px 10px;
  color: #5534da;
  background-color: #f1effd;
  position: relative;
  min-width: 64px;
  max-width: fit-content;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background-color: #5534da;
    border-radius: 50%;
    display: inline-block;
  }
`;
