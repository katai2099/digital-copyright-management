export function clone<T = any>(whatToClone: T): T {
  return JSON.parse(JSON.stringify(whatToClone));
}

export function shallowCompare(
  body: Record<string, any>,
  comparable: Record<string, any>
): boolean {
  for (const field in comparable) {
    if (body[field] && comparable[field] !== body[field]) {
      console.log(
        "Fail request body " +
          field +
          " validation : 1." +
          body[field] +
          " 2." +
          comparable[field]
      );
      return false;
    }
  }
  return true;
}

export function hexToBin(hexString: string): string {
  // const hexBinLookup = {
  //      0:   "0000" ,
  //      1:   "0001" ,
  //      2:   "0010" ,
  //      3:   "0011" ,
  //      4:   "0100" ,
  //      5:   "0101" ,
  //      6:   "0110" ,
  //      7:   "0111" ,
  //      8:   "1000" ,
  //      9:   "1001" ,
  //      a:   "1010" ,
  //      b:   "1011" ,
  //      c:   "1100" ,
  //      d:   "1101" ,
  //      e:   "1110" ,
  //      f:   "1111" ,
  // }
  let result: string = "";
  for (let i = 0; i < hexString.length; i++) {
    switch (hexString[i]) {
      case "0":
        result += "0000";
        break;
      case "1":
        result += "0001";
        break;
      case "2":
        result += "0010";
        break;
      case "3":
        result += "0011";
        break;
      case "4":
        result += "0100";
        break;
      case "5":
        result += "0101";
        break;
      case "6":
        result += "0110";
        break;
      case "7":
        result += "0111";
        break;
      case "8":
        result += "1000";
        break;
      case "9":
        result += "1001";
        break;
      case "a":
        result += "1010";
        break;
      case "b":
        result += "1011";
        break;
      case "c":
        result += "1100";
        break;
      case "d":
        result += "1101";
        break;
      case "e":
        result += "1110";
        break;
      case "f":
        result += "1111";
        break;
      default:
        return "";
    }
  }
  return result;
}

export const toJSON = (data: any) => {
  return JSON.parse(data);
};
