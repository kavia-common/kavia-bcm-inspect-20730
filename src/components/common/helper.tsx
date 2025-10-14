export const objectToQueryString = (params: any) => {
  return new URLSearchParams(params).toString();
};
