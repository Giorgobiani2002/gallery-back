import React from 'react';

type Props = {
  record: {
    params: Record<string, any>;
  };
  property: {
    path: string;
  };
};

const ImageComponent: React.FC<Props> = ({ record, property }) => {
  const imageUrl = record?.params?.[property.path];

  if (!imageUrl) {
    return <span>No image</span>;
  }

  return (
    <img
      src={imageUrl}
      alt="Preview"
      style={{
        maxWidth: '100px',
        maxHeight: '100px',
        objectFit: 'contain',
        borderRadius: '6px',
      }}
    />
  );
};

export default ImageComponent;
