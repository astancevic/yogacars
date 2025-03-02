function CarsAdvanceFilterFunction(
  arr: Array<object>,
  makeMode: any,
  search: string,
  makeArray: string[],
  modelArray: string[],
  rangeSliderValue: { min: number; max: number },
  locationArray: String[],
  trimArray: String[],
  fuelArray: String[],
  MileageArray: String[],
  VIN?: string | undefined | number
) {
  // for VIN number
  const vinArr = arr?.filter((e: any) =>
    VIN && makeArray?.length === 0 && modelArray?.length === 0 ? VIN === e.node?.vin : arr
  );

  // for home search filter
  const searchArr = vinArr?.filter((e: any) =>
    search && makeArray?.length === 0 && modelArray?.length === 0
      ? e.node?.make?.toLowerCase()?.includes(search?.toLowerCase()) ||
        e.node?.model?.toLowerCase()?.includes(search?.toLowerCase())
      : vinArr
  );

  // for sidebar range slider filter
  const sliderMaxArr = searchArr?.filter((e: any) =>
    rangeSliderValue ? Number(e.node?.sellingPrice) < rangeSliderValue.max : searchArr
  );
  const sliderArr = sliderMaxArr?.filter((e: any) =>
    rangeSliderValue ? Number(e.node?.sellingPrice) > rangeSliderValue.min : sliderMaxArr
  );

  // for sidebar multiple makes
  const _makeArr = sliderArr?.filter((e: any) =>
    makeArray?.length > 0 ? makeArray.indexOf(e.node.make) >= 0 : sliderArr
  );

  // for sidebar multiple models of makes
  const _modelArr = _makeArr?.filter((e: any) =>
    modelArray?.length > 0 ? modelArray.indexOf(e.node.model) >= 0 : _makeArr
  );

  // for sidebar multiple locations
  const locationArr = _modelArr?.filter((e: any) =>
    locationArray?.length > 0 ? locationArray.indexOf(e.node.dealerCity) >= 0 : _modelArr
  );

  // for sidebar multiple trim
  const trimArr = locationArr?.filter((e: any) =>
    trimArray?.length > 0 ? trimArray.indexOf(e.node.trim) >= 0 : locationArr
  );

  // for sidebar multiple fuel
  const fuelArr = trimArr?.filter((e: any) =>
    fuelArray?.length > 0 ? fuelArray.indexOf(e.node.fuelType) >= 0 : trimArr
  );

  // for sidebar multiple Miles
  const mileArr = fuelArr?.filter((e: any) =>
    MileageArray?.length > 0 ? MileageArray.indexOf(e.node.miles) >= 0 : fuelArr
  );

  // for home make filter
  const makeArr = mileArr?.filter((e: any) =>
    makeMode?.make &&
    makeArray?.length === 0 &&
    modelArray?.length === 0 &&
    locationArray?.length === 0 &&
    trimArray?.length === 0
      ? e.node?.make === makeMode?.make
      : mileArr
  );

  // for home model filter
  const modelArr = makeArr?.filter((e: any) =>
    makeMode?.model &&
    makeArray?.length === 0 &&
    modelArray?.length === 0 &&
    locationArray?.length === 0 &&
    trimArray?.length === 0
      ? e.node?.model?.toLowerCase()?.replace(/^\s+|\s+$/g, '') === makeMode?.model?.toLowerCase()
      : makeArr
  );

  // for home model filter
  const priceArr = modelArr?.filter((e: any) =>
    makeMode?.price && makeArray?.length === 0 && modelArray?.length === 0
      ? Number(e.node?.sellingPrice) <= Number(makeMode?.price?.substring(1)?.replace(',', ''))
      : modelArr
  );

  return priceArr;
}

export default CarsAdvanceFilterFunction;
