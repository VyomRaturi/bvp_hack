// src/app/api/hackathons/create-full/route.ts

import { NextRequest, NextResponse } from "next/server";
import Hackathon from "@/models/Hackathon";
import User from "@/models/User";
import Team from "@/models/Team";
import connectDB from "@/lib/mongodb";
// import bcrypt from "bcrypt";
import crypto from "crypto";

// interface JudgeInput {
//   name: string;
//   email: string;
// }

// interface TeamInput {
//   name: string;
//   email: string;
//   members: string; // Comma-separated string
// }

interface JudgeOutput {
  email: string;
  name: string;
  pass: string;
}

interface TeamOutput {
  email: string;
  teamName: string;
  pass: string;
  members: string;
}

/**
 * Generates a secure random password.
 * @param length Number of characters in the password.
 * @returns A randomly generated password string.
 */
const generatePassword = (length: number = 12): string => {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .slice(0, length)
    .replace(/\+/g, "0") // Replace '+' with '0'
    .replace(/\//g, "0"); // Replace '/' with '0'
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { hackName, hackDesc, start, end, judges, teams } = data;
    console.log(data);

    // Input validation
    if (
      !hackName ||
      !hackDesc ||
      !start ||
      !end ||
      !Array.isArray(judges) ||
      !Array.isArray(teams)
    ) {
      return NextResponse.json(
        { message: "Invalid input data. Please provide all required fields." },
        { status: 400 }
      );
    }

    await connectDB();

    // Create Hackathon
    const hackathon = await Hackathon.create({
      name: hackName,
      description: hackDesc,
      startDate: new Date(start),
      endDate: new Date(end),
      judges: [],
      teams: [],
      questions: [],
    });

    const hackathonId = hackathon._id;

    const judgesOutput: JudgeOutput[] = [];
    const teamsOutput: TeamOutput[] = [];

    // Process Judges
    for (const judge of judges) {
      const { name, email } = judge;

      if (!name || !email) {
        throw new Error("Each judge must have a name and an email.");
      }

      const normalizedEmail = "jud4" + email.toLowerCase();

      // Check if judge already exists
      const existingJudge = await User.findOne({ email: normalizedEmail });
      if (existingJudge) {
        throw new Error(`Judge with email ${normalizedEmail} already exists.`);
      }

      const plainPassword = generatePassword(12);
      //   const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Create Judge User
      const newJudge = await User.create({
        name,
        email: normalizedEmail,
        password: plainPassword,
        role: "judge",
      });

      // Associate Judge with Hackathon
      hackathon.judges?.push(newJudge.id);

      // Prepare Output
      judgesOutput.push({
        email: normalizedEmail,
        name,
        pass: plainPassword,
      });
    }

    // Process Teams
    for (const team of teams) {
      const { name, email, members } = team;
      if (!name || !email || !members) {
        throw new Error("Each team must have a name, an email, and members.");
      }

      const normalizedEmail = "team" + email.toLowerCase();

      // Check if team already exists
      const existingTeam = await Team.findOne({ email: normalizedEmail });
      if (existingTeam) {
        throw new Error(`Team with email ${normalizedEmail} already exists.`);
      }

      const plainPassword = generatePassword(12);
      //   const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Create Team
      const newTeam = await Team.create({
        name,
        email: normalizedEmail,
        password: plainPassword,
        members, // Stored as a comma-separated string
        hackathon: hackathonId,
      });
      console.log("new team, ", newTeam);
      // Associate Team with Hackathon
      // if (newTeam._id)
      hackathon.teams?.push(newTeam.id);

      // Prepare Output
      teamsOutput.push({
        email: normalizedEmail,
        teamName: name,
        pass: plainPassword,
        members,
      });
    }

    // Save Hackathon with associated Judges and Teams
    await hackathon.save();

    // Return the Outputs
    return NextResponse.json(
      {
        hack: hackathonId,
        judges: judgesOutput,
        teams: teamsOutput,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating hackathon:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error." },
      { status: 500 }
    );
  }
}
