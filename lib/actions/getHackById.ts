// get hack by id from mongoDB

import connectDB from "../mongodb";
import { Hackathon } from "@/models";

export const getHackById = async (id: string) => {
  await connectDB();
  const hack = await Hackathon.findById(id);
  return hack;
};
