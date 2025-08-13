import styled from "styled-components";

interface TaskImageProps {
  imageUrl?: string;
}

const TaskImage: React.FC<TaskImageProps> = ({ imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <ImageContainer>
      <StyledImage src={imageUrl} alt="카드 이미지" />
    </ImageContainer>
  );
};

export default TaskImage;

// ✅ 스타일 적용
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled.img`
  width: 445.25px;
  height: 260px;
  border-radius: 6px;
`;
