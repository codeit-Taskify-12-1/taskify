import React, { useMemo } from "react";
import styled from "styled-components";

interface TaskTagsProps {
  tags: string[];
}

const TAG_COLORS: { [key: string]: string } = {
  "#F9EEE3": "#FFA500",
  "#E7F7DB": "#7AC555",
  "#F7DBF0": "#E876EA",
  "#DBE6F7": "#76A5EA",
};

const getTagColor = (() => {
  const tagColorMap = new Map<string, string>();
  const availableColors = Object.keys(TAG_COLORS);

  return (tag: string) => {
    if (!tagColorMap.has(tag)) {
      const randomColor =
        availableColors[tagColorMap.size % availableColors.length];
      tagColorMap.set(tag, randomColor);
    }
    return tagColorMap.get(tag) || "#ddd";
  };
})();

const TaskTags: React.FC<TaskTagsProps> = ({ tags }) => {
  const uniqueTags = useMemo(() => [...new Set(tags)], [tags]);

  return (
    <TagsContainer>
      {uniqueTags.map((tag) => {
        const bgColor = getTagColor(tag);
        const textColor = TAG_COLORS[bgColor];

        return (
          <Tag key={tag} bgColor={bgColor} textColor={textColor}>
            {tag}
          </Tag>
        );
      })}
    </TagsContainer>
  );
};

export default TaskTags;

const TagsContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const Tag = styled.span<{ bgColor: string; textColor: string }>`
  background: ${(props) => props.bgColor};
  color: ${(props) => props.textColor};
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: space-arounds;
  justify-content: center;
  border-radius: 4px;
  padding: 5px 10px;
  min-width: 40px;
  height: 26px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #9fa6b2;
  font-size: 16px;
  font-weight: bold;
  margin-left: 12px;
  margin-bottom: 7px;
  cursor: pointer;

  top: 2px;
  right: 4px;
`;
