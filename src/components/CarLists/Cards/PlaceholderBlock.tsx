import React, { useState } from 'react';
import type {StylableProp} from '../../../util/StylableProps';
import PlaceholderCard from './PlaceholderCard';
import PlaceholderListViewCard from './PlaceholderListViewCard';

interface PlaceholderBlockProps {
  count: number;
  selectedView: 'grid' | 'list';
}

export default function PlaceholderBlock(props: StylableProp<PlaceholderBlockProps>) {
  const [items, setItems] = useState(new Array(props.count).fill('test'));

  return (
    <>
      {items.map((item, index) =>
        props.selectedView === 'grid' ? (
          <PlaceholderCard key={index} />
        ) : (
          <PlaceholderListViewCard key={index} />
        )
      )}
    </>
  );
}
