"use server";

import { cookies } from "next/headers";
import * as cheerio from 'cheerio';

const BASE_URL = "https://studentportal.green.edu.bd";

interface InstallmentInfo {
  number: string;
  dueDate: string;
  amount: number;
  payable: number;
  lateFee: number;
}

interface TransactionInfo {
  slNo: number;
  feeType: string;
  courseCode: string;
  credit: string | number;
  amount: string | number;
  discount: string | number;
  payment: string | number;
  trimesterName: string;
  date: string;
  remark: string;
}

interface BillingSummary {
  totalFee: number;
  totalBill: number;
  totalPaid: number;
  balance: number;
  totalDiscount: number;
}

export interface BillingHistory {
  installments: InstallmentInfo[];
  records: TransactionInfo[];
  summary: BillingSummary;
}

export async function getBilling() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth");

  if (!authToken) {
    return { error: "Unauthorized" };
  }

  const response = await fetch(`${BASE_URL}/Student/StudentBillHistory`, {
    headers: {
      accept: "text/html; charset=utf-8",
      Cookie: authToken.value,
    },
  });

  const htmlResponse = await response.text();
  const data = parseHtmlToJson(htmlResponse);
  console.log({billingData: data});
  return data;
}

function parseHtmlToJson(html: string): BillingHistory {
  const $ = cheerio.load(html);
  
  // Parse billing summary
  const summary: BillingSummary = {
    totalFee: parseFloat($('.card-body .row .col-md-4').eq(0).text().match(/Total Fee: (\d+)/)?.[1] || '0'),
    totalDiscount: parseFloat($('.card-body .row .col-md-4').eq(0).text().match(/Total Discount: -(\d+)/)?.[1] || '0') * -1,
    totalBill: parseFloat($('.card-body .row .col-md-4').eq(1).text().match(/Total Bill: (\d+)/)?.[1] || '0'),
    totalPaid: parseFloat($('.card-body .row .col-md-4').eq(1).text().match(/Total Paid: (\d+)/)?.[1] || '0'),
    balance: parseFloat($('.card-body .row .col-md-4').eq(2).text().match(/Balance \(Due\/Advance\): (-?\d+)/)?.[1] || '0'),
  };

  // Parse installments
  const installments: InstallmentInfo[] = [];
  $('.card-body .table tbody tr').each((i, elem) => {
    const tds = $(elem).find('td');
    if (tds.length === 6) {
      installments.push({
        number: $(tds[1]).text().trim(),
        dueDate: $(tds[2]).text().trim(),
        amount: parseFloat($(tds[3]).text().trim().replace(',', '') || '0'),
        payable: parseFloat($(tds[4]).text().trim().replace(',', '') || '0'),
        lateFee: parseFloat($(tds[5]).text().trim().replace(',', '') || '0'),
      });
    }
  });

  // Parse billing records
  const records: TransactionInfo[] = [];
  $('#tblBillHistory tr:gt(0)').each((i, elem) => {
    const tds = $(elem).find('td');
    if (tds.length === 10) {
      records.push({
        slNo: i + 1,
        feeType: $(tds[1]).text().trim(),
        courseCode: $(tds[2]).text().trim(),
        credit: $(tds[3]).text().trim(),
        amount: $(tds[4]).text().trim(),
        discount: $(tds[5]).text().trim(),
        payment: $(tds[6]).text().trim(),
        trimesterName: $(tds[7]).text().trim(),
        date: $(tds[8]).text().trim(),
        remark: $(tds[9]).text().trim(),
      });
    }
  });

  return {
    summary,
    installments,
    records,
  };
}