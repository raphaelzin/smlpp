const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
const alphaLength = alpha.length;

const randomString = (length: number, curr: string = ""): string => {
  var curr = curr ? curr : "";
  return length
    ? randomString(
        --length,
        alpha.charAt(Math.floor(Math.random() * alphaLength)) + curr
      )
    : curr;
};

export { randomString };
