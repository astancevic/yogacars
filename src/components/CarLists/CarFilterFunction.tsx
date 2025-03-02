function CarFilterFunction(arr: Array<object>, sortByValue: string) {
  if (sortByValue === 'Highest Price') {
    return arr.sort((a: any, b: any) => Number(b.node.sellingPrice) - Number(a.node.sellingPrice));
  }

  if (sortByValue === 'Lowest Price') {
    return arr.sort((a: any, b: any) => Number(a.node.sellingPrice) - Number(b.node.sellingPrice));
  }

  if (sortByValue === 'Lowest Mileage') {
    return arr.sort((a: any, b: any) => Number(a.node.miles) - Number(b.node.miles));
  }

  if (sortByValue === 'Distance') {
    return arr.sort((a: any, b: any) => Number(b.node.miles) - Number(a.node.miles));
  }

  if (sortByValue === 'Newest') {
    return arr.sort(
      (a: any, b: any) =>
        new Date(b.node.dateInStock).valueOf() - new Date(a.node.dateInStock).valueOf()
    );
  }
}

export default CarFilterFunction;
