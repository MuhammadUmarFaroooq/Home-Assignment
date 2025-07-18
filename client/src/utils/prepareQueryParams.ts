export const prepareQueryParams = (params: Record<string, any> | undefined): URLSearchParams | undefined => {
  if (!params || Object.keys(params).length === 0) {
    return undefined;
  }

  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const filtered = value.filter(
        (item) =>
          item !== "" && item !== null && item !== undefined && item !== 0
      );
      if (filtered.length > 0) {
        filtered.forEach((item) => queryParams.append(key, item));
      }
    } else if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== 0
    ) {
      queryParams.append(key, value);
    }
  });

  return queryParams;
};