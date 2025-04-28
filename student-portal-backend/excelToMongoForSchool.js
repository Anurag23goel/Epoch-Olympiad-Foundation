import fs from "fs";
import { parse } from "csv-parse";
import { School } from "./school.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

export async function convertXlsxToMongo(filePath) {
  try {
    // Read and parse the CSV file
    // CSV columns: School Code,School Name,Email Id,FAX,Area,City,Country,Incharge,Incharge DOB,Incharge Mob,Principal Name,Principal DOB,Principal Mob,Remark
    const schools = [];
    const invalidRecords = [];
    const parser = fs
      .createReadStream(filePath)
      .pipe(
        parse({
          columns: [
            "School Code",
            "School Name",
            "Email Id",
            "FAX",
            "Area",
            "City",
            "Country",
            "Incharge",
            "Incharge DOB",
            "Incharge Mob",
            "Principal Name",
            "Principal DOB",
            "Principal Mob",
            "Remark",
          ],
          skip_lines: 1, // Skip header row
          trim: true,
        })
      );

    for await (const record of parser) {
      schools.push(record);
    }

    // Process the data according to schema
    const processedSchools = schools.map((school, index) => {
      // Validate schoolCode
      let schoolCode = null;
      if (school["School Code"]) {
        const parsedCode = parseInt(school["School Code"]);
        if (!isNaN(parsedCode)) {
          schoolCode = parsedCode;
        } else {
          invalidRecords.push({
            row: index + 2, // +2 to account for header and 1-based indexing
            schoolCode: school["School Code"],
            message: `Invalid schoolCode value: "${school["School Code"]}"`,
          });
        }
      }

      return {
        schoolCode,
        schoolName: school["School Name"] || "",
        schoolEmail: school["Email Id"] || "",
        fax: school["FAX"] || "",
        area: school["Area"] || "",
        city: school["City"] || "",
        country: school["Country"] || "",
        incharge: school["Incharge"] || "",
        inchargeDob: school["Incharge DOB"] || "",
        schoolMobNo: school["Incharge Mob"] || "",
        principalName: school["Principal Name"] || "",
        principalDob: school["Principal DOB"] || "",
        principalMobNo: school["Principal Mob"] || "",
        remark: school["Remark"] || "",
      };
    });

    // Log invalid records if any
    if (invalidRecords.length > 0) {
      console.warn("Invalid records found:", invalidRecords);
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB is not connected");
    }

    // Insert data
    await School.insertMany(processedSchools);
    console.log(
      `Successfully inserted ${processedSchools.length} schools into MongoDB`
    );

    return {
      success: true,
      message: `Inserted ${processedSchools.length} schools`,
      invalidRecords: invalidRecords.length > 0 ? invalidRecords : undefined,
    };
  } catch (error) {
    console.error("Error processing CSV file:", error);
    throw error;
  }
}