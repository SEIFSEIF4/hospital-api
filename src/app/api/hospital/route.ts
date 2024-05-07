import { NextRequest, NextResponse } from "next/server";

import connect from "@/lib/db";
import Hospital from "@/lib/modals/hospital";

type HospitalDocument = {
  hospitalName: string;
  imgSrc: string;
  pageUrl: string;
  hospitalInfo: {
    address: string;
    website: string;
    phoneNumber: string;
    postalCode: string;
  };
};

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalName = searchParams.get("hospitalName");

    if (!hospitalName) {
      return new NextResponse("Hospital name is required", { status: 400 });
    }

    await connect();

    const hospital = await Hospital.findOne({ hospitalName });

    if (!hospital) {
      return new NextResponse("Hospital not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(hospital), { status: 200 });
  } catch (error) {
    return new NextResponse(
      "Error in fetching hospital: " + (error as Error).message,
      {
        status: 500,
      }
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalName = searchParams.get("hospitalName");

    if (!hospitalName) {
      return new NextResponse("Hospital name is required", { status: 400 });
    }

    const updateData = await request.json();

    await connect();

    const hospital = await Hospital.findOneAndUpdate(
      { hospitalName },
      updateData,
      { new: true }
    );

    if (!hospital) {
      return new NextResponse("Hospital not found", { status: 404 });
    }

    return new NextResponse(
      JSON.stringify({
        message: "Hospital updated successfully",
        hospital,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      "Error in updating hospital: " + (error as Error).message,
      {
        status: 500,
      }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const hospitalsData: HospitalDocument[] = await request.json();

    await connect();

    const createdHospitals = await Promise.all(
      hospitalsData.map(async (hospitalData) => {
        const newHospital = new Hospital(hospitalData);
        return await newHospital.save();
      })
    );

    return new NextResponse(
      JSON.stringify({
        message: "Hospitals created successfully",
        hospitals: createdHospitals,
      }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Error in creating hospitals",
        error: error.message,
      }),
      {
        status: 500,
      }
    );
  }
};
