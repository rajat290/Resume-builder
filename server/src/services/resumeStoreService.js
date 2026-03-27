import { Resume } from "../models/Resume.js";
import { resumeSeed } from "../data/resumeSeed.js";

export async function getResumeForUser(userId) {
  const record = await Resume.findOne({ user: userId }).lean();
  return record?.data || structuredClone(resumeSeed);
}

export async function saveResumeForUser(userId, data) {
  await Resume.findOneAndUpdate(
    { user: userId },
    { data },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return data;
}
