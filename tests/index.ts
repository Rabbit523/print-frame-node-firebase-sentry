export * from "./db";
export * from "./run";

export const logger = (msg: any) => {
  console.log(JSON.stringify(msg, null, 4));
};
