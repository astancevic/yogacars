import React from 'react';
import type {StylableProp} from '../../../util/StylableProps';

export default function PlaceholderListViewCard() {
  return (
    <div className="flex cursor-pointer items-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg transition-shadow hover:rounded-2xl hover:shadow-2xl lg:p-3 xl:max-h-52">
      <PlaceholderSpan className="!block h-full w-full min-w-28 rounded-xl lg:min-w-32 lg:max-w-60" />

      <div className="w-full rounded-b-2xl bg-white p-4">
        <div className="flex items-center justify-between whitespace-nowrap text-xs text-pure-gray text-opacity-60 2xl:text-sm">
          <PlaceholderSpan className="w-32" />
          <PlaceholderSpan className="w-12" />
        </div>

        <span>
          <h2 className="mt-1 text-base font-medium sm:text-lg lg:text-2xl 3xl:text-3xl">
            <PlaceholderSpan className="w-48" />
          </h2>

          <span className="text-xs text-pure-gray text-opacity-60 sm:text-sm lg:text-base 3xl:text-lg ">
            <PlaceholderSpan className="w-24" />
          </span>
        </span>

        <span className="flex items-center justify-between">
          <span className="sm:text-basis text-xs text-pure-gray/65 lg:text-xs 3xl:text-sm">
            <PlaceholderSpan className="w-24" />
          </span>
          <h2 className="text-right text-base font-semibold text-primary sm:text-lg lg:text-2xl 3xl:text-3xl">
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
