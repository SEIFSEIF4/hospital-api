"use server";
import fs from "fs";
import csv from "csv-parser";

type Row = {
  hospitalName: string;
  hospitalMapAddress: string;
};

async function parseCSV(filePath: string): Promise<Row[]> {
  return new Promise((resolve, reject) => {
    const rows: Row[] = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: "," }))
      .on("data", (row) => rows.push(row))
      .on("error", (err) => reject(err))
      .on("end", () => resolve(rows));
  });
}

export const seed = async () => {
  const rows = await parseCSV("data/hospital_dataset_simple.csv");
  console.log(rows);
};
