// src/app/api/hackathons/create-full/route.ts

import { NextRequest, NextResponse } from "next/server";
import Hackathon from "@/models/Hackathon";
import User from "@/models/User";
import Team from "@/models/Team";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose, { Types } from "mongoose";
import { IHackathon } from "@/models/Hackathon";

interface JudgeInput {
  name: string;
  email: string;
}

interface TeamInput {
  name: string;
  email: string;
  members: string;
}

interface JudgeOutput {
  email: string;
  name: string;
  pass: string;
}

interface TeamOutput {
  email: string;
  name: string;
  pass: string;
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
    .replace(/\+/g, "0")
    .replace(/\//g, "1")
    .replace(/=/g, "2");
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("Received request body:", body);

    const {
      hackName: name,
      hackDesc: description,
      start,
      end,
      judges,
      teams,
    } = body;
    console.log("Parsed data:", { name, description, start, end });
    console.log("Judges:", judges);
    console.log("Teams:", teams);

    // Validate required fields
    if (!name || !description || !start || !end) {
      throw new Error(
        `Missing required fields. Got: name=${name}, description=${description}, start=${start}, end=${end}`
      );
    }

    // Create Hackathon with initialized arrays
    const hackathon = new Hackathon({
      name,
      description,
      startDate: new Date(start),
      endDate: new Date(end),
      judges: [] as Types.ObjectId[],
      teams: [] as Types.ObjectId[],
      questions: [] as Types.ObjectId[],
    });

    console.log("Created hackathon:", hackathon);

    const hackathonId = hackathon._id;
    const judgesOutput: JudgeOutput[] = [];
    const teamsOutput: TeamOutput[] = [];

    // Process Judges
    console.log("Processing judges...");
    for (const judge of judges as JudgeInput[]) {
      const { name, email } = judge;
      console.log("Processing judge:", { name, email });

      if (!name || !email) {
        throw new Error("Each judge must have a name and an email.");
      }

      const normalizedEmail = "judg" + email.toLowerCase();
      console.log("Normalized judge email:", normalizedEmail);

      // Check if judge already exists
      const existingJudge = await User.findOne({ email: normalizedEmail });
      if (existingJudge) {
        throw new Error(`Judge with email ${normalizedEmail} already exists.`);
      }

      const plainPassword = generatePassword(12);
      console.log("Generated password for judge:", plainPassword);

      // Create Judge User
      const newJudge = await User.create({
        name,
        email: normalizedEmail,
        password: plainPassword, // Password will be hashed by the User model's pre-save middleware
        role: "judge",
      });
      console.log("Created judge:", newJudge);

      // Associate Judge with Hackathon using proper typing
      const judgeId = newJudge._id as Types.ObjectId;
      hackathon.judges = [...hackathon.judges, judgeId];

      // Prepare Output
      judgesOutput.push({
        email: normalizedEmail,
        name,
        pass: plainPassword,
      });
    }

    // Process Teams
    console.log("Processing teams...");
    for (const team of teams as TeamInput[]) {
      const { name, email, members } = team;
      console.log("Processing team:", { name, email, members });

      if (!name || !email || !members) {
        throw new Error("Each team must have a name, an email, and members.");
      }

      const normalizedEmail = "team" + email.toLowerCase();
      console.log("Normalized team email:", normalizedEmail);

      // Check if team already exists
      const existingTeam = await Team.findOne({ email: normalizedEmail });
      if (existingTeam) {
        throw new Error(`Team with email ${normalizedEmail} already exists.`);
      }

      const plainPassword = generatePassword(12);
      console.log("Generated password for team:", plainPassword);

      // Create Team
      const newTeam = await Team.create({
        name,
        email: normalizedEmail,
        password: plainPassword, // Will be hashed by Team model's pre-save middleware if implemented
        members,
        hackathon: hackathonId,
      });
      console.log("Created team:", newTeam);

      // Add team to hackathon's teams array using proper typing
      const teamId = newTeam._id as Types.ObjectId;
      hackathon.teams = [...hackathon.teams, teamId];

      // Prepare Output
      teamsOutput.push({
        email: normalizedEmail,
        name,
        pass: plainPassword,
      });
    }

    // Save the hackathon with updated judges and teams
    console.log("Saving hackathon with judges and teams...");
    await hackathon.save();
    console.log("Hackathon saved successfully!");

    return NextResponse.json({
      success: true,
      hackathon: {
        id: hackathonId,
        name: hackathon.name,
      },
      judges: judgesOutput,
      teams: teamsOutput,
    });
  } catch (error: any) {
    console.error("Error in hackathon creation:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error.message || "An error occurred while creating the hackathon.",
      },
      { status: 400 }
    );
  }
}
