import React from 'react';
import type {StylableProp} from '../../../util/StylableProps';

export default function PlaceholderCard() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-lg transition-shadow hover:rounded-2xl hover:shadow-2xl  md:max-xl:last:hidden">
      <PlaceholderSpan className="aspect-h-9 aspect-w-15 !block" />

      <div className="rounded-b-2xl bg-white p-4">
        <div className="flex items-center justify-between whitespace-nowrap text-sm text-pure-gray text-opacity-60">
          <PlaceholderSpan className="w-32" />
          <PlaceholderSpan className="w-12" />
        </div>

        <span>
          <h2 className="mt-1 text-xl font-medium">
            <PlaceholderSpan className="w-48" />
          </h2>

          <span className="text-md text-pure-gray text-opacity-60">
            <PlaceholderSpan className="w-24" />
          </span>
        </span>

        <span className="flex items-center justify-end">
          <h2 className="text-right text-lg font-semibold text-primary">
            <PlaceholderSpan className="w-24 bg-primary-50" />
          </h2>
        </span>
      </div>
    </div>
  );
}

const PlaceholderSpan = (props: StylableProp) => {
  return (
    <>
      <span
        className={`relative inline-block overflow-hidden rounded bg-gray-100 ${props.className} after:absolute after:-left-full after:top-0 after:h-full after:animate-glimmer after:shadow-[0_0_25px_9px_rgba(254,254,254)] after:content-['_']`}
      >
        &nbsp;
      </span>
    </>
  );
};
