import fs from "fs";
import { parse } from "csv-parse";
import { School } from "./school.js";
import mongoose from "mongoose";

export async function convertXlsxToMongo(filePath) {
  try {
    // Read and parse the CSV file
    const schools = [];
    const parser = fs
      .createReadStream(filePath)
      .pipe(
        parse({
          columns: [
            "schoolCode",
            "schoolName",
            "schoolMobNo",
            "schoolEmail",
            "area",
            "city",
            "zone",
            "state",
            "country",
            "principalName",
            "principalMobNo",
            "principalDob",
            "examCenterLevel1",
            "examCenterLandmarkLevel1",
            "examCenterLevel2",
            "examCenterLandmarkLevel2",
            "showAmountPaid",
            "showPerformance",
            "allowFreeDownload",
          ],
          skip_lines: 1, // Skip header row
          trim: true,
        })
      );

    for await (const record of parser) {
      schools.push(record);
    }

    // Process the data
    const processedSchools = schools.map((school) => ({
      schoolCode: school.schoolCode ? parseInt(school.schoolCode) : null,
      schoolName: school.schoolName || "",
      schoolMobNo: school.schoolMobNo || "",
      schoolEmail: school.schoolEmail || "",
      area: school.area || "",
      city: school.city || "",
      zone: school.zone || "",
      state: school.state || "",
      country: school.country || "",
      principalName: school.principalName || "",
      principalMobNo: school.principalMobNo || "",
      principalDob: school.principalDob || "",
      examCenterLevel1: school.examCenterLevel1 || "",
      examCenterLandmarkLevel1: school.examCenterLandmarkLevel1 || "",
      examCenterLevel2: school.examCenterLevel2 || "",
      examCenterLandmarkLevel2: school.examCenterLandmarkLevel2 || "",
      showAmountPaid: school.showAmountPaid
        ? parseInt(school.showAmountPaid)
        : 0,
      showPerformance: school.showPerformance
        ? parseInt(school.showPerformance)
        : 0,
      allowFreeDownload: school.allowFreeDownload || "",
    }));

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB is not connected");
    }

    // Insert data
    await School.insertMany(processedSchools);
    console.log(
      `Successfully inserted ${processedSchools.length} schools into MongoDB`
    );

    return { success: true, message: `Inserted ${processedSchools.length} schools` };
  } catch (error) {
    console.error("Error processing CSV file:", error);
    throw error;
  }
}