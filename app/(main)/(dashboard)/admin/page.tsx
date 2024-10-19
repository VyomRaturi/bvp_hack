"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

type Props = {};

const Page = (props: Props) => {
  const [orgname, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Organizer Name:", orgname);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="mx-auto w-[600px]">
      <div className="text-4xl underline mt-20 font-semibold">
        Admin Dashboard
      </div>

      <div className="py-12">
        <div className="text-3xl font-medium">Create Organiser</div>

        <form onSubmit={handleSubmit} className="flex gap-6 flex-col my-4">
          <div>
            <label
              htmlFor="orgname"
              className="block text-sm mb-2 font-medium text-gray-700"
            >
              Organizer Name
            </label>
            <Input
              id="orgname"
              type="text"
              placeholder="Organizer Name"
              value={orgname}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm mb-2 font-medium text-gray-700"
            >
              Organizer Mail
            </label>
            <Input
              id="email"
              type="text"
              placeholder="Organizer mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-2 font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-40">
            Create
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
