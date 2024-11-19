"use server";

import { cookies } from "next/headers";
import * as cheerio from "cheerio";

const BASE_URL = "https://studentportal.green.edu.bd";

interface Semester {
  sl: number;
  trimester: string;
  creditProbation: number;
  termGPAProbation: number;
  cgpaProbation: number;
  creditTranscript: number;
  gpaTranscript: number;
  cgpaTranscript: number;
}

interface Course {
  semester: string;
  courseCode: string;
  courseTitle: string;
  credit: number;
  grade: string;
  point: number;
  courseStatus: string;
}

export interface ResultData {
  semesters: Semester[];
  courses: Course[];
}

export async function getResult() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth");

  if (!authToken) {
    return { error: "Unauthorized" };
  }

  console.log({ authToken: authToken.value.slice(0, 50) });

  const response = await fetch(`${BASE_URL}/Student/StudentCourseHistory`, {
    headers: {
      accept: "text/html; charset=utf-8",
      Cookie: authToken.value,
    },
  });

  const htmlResponse = await response.text();
  const data = parseHtmlToJson(htmlResponse);
  return data;
}

function parseHtmlToJson(html: string): ResultData {
  const $ = cheerio.load(html);
  const semesters: Semester[] = [];
  const courses: Course[] = [];

  // Parse semester data
  $("table.table-bordered tbody tr").each((index, row) => {
    const cells = $(row).find("td");
    if (cells.length === 8) {
      semesters.push({
        sl: index + 1,
        trimester: $(cells[1]).text().trim(),
        creditProbation: parseFloat($(cells[2]).text().trim() || "0"),
        termGPAProbation: parseFloat($(cells[3]).text().trim() || "0"),
        cgpaProbation: parseFloat($(cells[4]).text().trim() || "0"),
        creditTranscript: parseFloat($(cells[5]).text().trim() || "0"),
        gpaTranscript: parseFloat($(cells[6]).text().trim() || "0"),
        cgpaTranscript: parseFloat($(cells[7]).text().trim() || "0"),
      });
    }
  });

  // Parse course data
  $("#tblResultHistory tr")
    .slice(1)
    .each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length === 7) {
        courses.push({
          semester: $(cells[0]).text().trim(),
          courseCode: $(cells[1]).text().trim(),
          courseTitle: $(cells[2]).text().trim(),
          credit: parseFloat($(cells[3]).text().trim() || "0"),
          grade: $(cells[4]).text().trim(),
          point: parseFloat($(cells[5]).text().trim() || "0"),
          courseStatus: $(cells[6]).text().trim(),
        });
      }
    });

  return { semesters, courses };
}
