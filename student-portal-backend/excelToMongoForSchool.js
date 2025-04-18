const XLSX = require("xlsx");

async function convertXlsxToMongo(filePath) {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON
    const schools = XLSX.utils.sheet_to_json(worksheet, {
      header: [
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
      range: 1, // Skip header row
    });

    // Process the data to handle empty values and data types
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

    // Insert new data
    await School.insertMany(processedSchools);
    console.log(
      `Successfully inserted ${processedSchools.length} schools into MongoDB`
    );

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error processing XLSX file:", error);
    mongoose.connection.close();
  }
}

// Path to your XLSX file
const filePath =
  "C:/Users/anura/Desktop/student-portal-purav/student-portal-backend/copy.xlsx";

convertXlsxToMongo(filePath);
