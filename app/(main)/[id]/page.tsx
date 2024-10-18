import { getParameters } from "@/lib/actions/addQuestions";
import { getHackById } from "@/lib/actions/getHackById";
import React from "react";
import ParameterSelector from "@/components/ParameterSelector";

const escapeSpecialChars = (str: string) => {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");
};

type Props = {
  params: {
    id: string;
  };
};

const OrganiserQuestion = async (props: Props) => {
  // Get id from URL
  // console.log("id: ", props.params.id);
  let defaultParameters: string[] = [];

  try {
    const hackathon = await getHackById(props.params.id);

    if (!hackathon) {
      throw new Error("Hackathon not found.");
    }

    // Escape special characters in the description
    const escapedDescription = escapeSpecialChars(hackathon.description);

    // Get default parameters
    defaultParameters = await getParameters(hackathon.name, escapedDescription);
    // console.log(defaultParameters);
    // console.log(hackathon);
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Organiser Question</h1>
      <ParameterSelector
        hackId={props.params.id}
        defaultParameters={defaultParameters}
      />
    </div>
  );
};

export default OrganiserQuestion;
