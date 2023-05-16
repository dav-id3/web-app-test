import { time } from "console";
import { Head as AtomHead } from "../atoms";

interface HeadProps {
  title: string;
}

export const Head = ({ title }: HeadProps) => {
  return (
    <AtomHead
      {...{
        data: {
          title: title,
          desc: "HouseHold Account Note",
          favicon: "favicon.ico",
        },
        interactions: {},
      }}
    />
  );
};
