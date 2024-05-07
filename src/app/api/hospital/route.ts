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

export const GET = async () => {
  try {
    await connect();
    const hospitals = await Hospital.find();
    return new NextResponse(JSON.stringify(hospitals), { status: 200 });
  } catch (error) {
    return new NextResponse("Error in fetching hospitals" + error, {
      status: 500,
    });
  }
};

// export const POST = async (request: Request) => {
//   try {
//     const body = await request.json();

//     await connect();
//     const newHospital = new Hospital(body);
//     await newHospital.save();

//     return new NextResponse(
//       JSON.stringify({ message: "Hospital is created", hospital: newHospital }),
//       { status: 201 }
//     );
//   } catch (error) {
//     return new NextResponse(
//       JSON.stringify({
//         message: "Error in creating hospital",
//         error,
//       }),
//       {
//         status: 500,
//       }
//     );
//   }
// };

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
