import { getParameters } from "@/lib/actions/addQuestions";
import { getHackById } from "@/lib/actions/getHackById";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

const OrganiserQuestion = async (props: Props) => {
  // get id from url
  console.log("id: ", props.params.id);
  try {
    // const defaultParameters = await getParameters(
    //   "Innovate-A-Thon",
    //   "Innovate-A-Thon is your chance to turn ideas into reality! This hackathon welcomes developers, designers, and entrepreneurs to collaborate and create innovative applications that can impact communities. Prizes include cash awards and internships with leading tech companies!"
    // );

    // console.log(defaultParameters);

    const hackathon = await getHackById(props.params.id);
    console.log(hackathon);
  } catch (error) {
    console.log(error);
  }
  return <div>page</div>;
};

export default OrganiserQuestion;
