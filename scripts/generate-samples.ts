import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

// Sample data for judges
const judgesData = [
  ["Name", "Email"],
  ["John Doe", "johndoe@example.com"],
  ["Jane Smith", "janesmith@example.com"],
  ["Robert Johnson", "robertj@example.com"],
  ["Sarah Williams", "sarahw@example.com"],
];

// Sample data for teams
const teamsData = [
  ["Name", "Email", "Members"],
  ["Team Alpha", "alpha@example.com", "John Smith, Mary Johnson, Alex Brown"],
  ["Team Beta", "beta@example.com", "Bob Wilson, Alice Brown, Charlie Davis"],
  ["Team Gamma", "gamma@example.com", "David Miller, Emma Wilson, Frank Lee"],
  ["Team Delta", "delta@example.com", "Grace Taylor, Henry Moore, Irene Clark"],
];

// Function to create and save Excel file
function createExcelFile(data: any[][], filename: string) {
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Create the samples directory if it doesn't exist
  const samplesDir = path.join(process.cwd(), "public", "samples");
  if (!fs.existsSync(samplesDir)) {
    fs.mkdirSync(samplesDir, { recursive: true });
  }

  // Write the file
  const filePath = path.join(samplesDir, filename);
  XLSX.writeFile(workbook, filePath);
  console.log(`Created ${filename} at ${filePath}`);
}

// Generate the sample files
createExcelFile(judgesData, "sample-judges.xlsx");
createExcelFile(teamsData, "sample-teams.xlsx");
