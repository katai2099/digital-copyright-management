import { clone } from "./controllers/utils";

export function isValidRequestBody(
  body: Record<string, any>,
  comparable: Record<string, any>
): boolean {
  const jsonComparable = clone(comparable);
  for (const field in jsonComparable) {
    if (
      !body.hasOwnProperty(field) ||
      typeof body[field] !== typeof comparable[field]
    ) {
      console.log(
        "Fail request body " +
          field +
          " validation : 1." +
          body[field] +
          " 2." +
          comparable[field] +
          " 3." +
          typeof body[field] +
          " 4." +
          typeof comparable[field]
      );
      return false;
    }
  }
  return true;
}
