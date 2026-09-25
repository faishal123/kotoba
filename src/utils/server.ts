const stringifyIfObject = (param: any) => {
  if (typeof param === "object") {
    return JSON.stringify(param);
  }
  return param;
};

export const checkForDuplicate = <T extends Record<string, any>>(
  existingData: T[],
  dataToCheck: Partial<T>,
  keysToIgnore?: (keyof T)[],
) => {
  const keysOfExistingObject = existingData?.reduce<string[]>((a, c) => {
    const currentObjectKeys = Object.keys(c).filter(
      (k) => !keysToIgnore?.includes(k),
    );

    if (a.length > 0) {
      const setA = new Set(a);
      const setC = new Set(currentObjectKeys);

      return Array.from(setA.intersection(setC));
    }
    return currentObjectKeys;
  }, []);

  return existingData?.reduce((a, c) => {
    const currentDataExist = keysOfExistingObject?.reduce((a2, c2) => {
      const currentValue = stringifyIfObject(c[c2]);
      const dataToCheckValue = stringifyIfObject(dataToCheck[c2]);

      const currentKeyHasSameValue = currentValue === dataToCheckValue;

      console.log(currentKeyHasSameValue, currentValue, dataToCheckValue, c2);

      return currentKeyHasSameValue && a2;
    }, true);

    if (currentDataExist) {
      return true;
    }
    return a;
  }, false);
};
