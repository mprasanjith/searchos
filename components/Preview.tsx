import { Command, Extension } from "@/sdk";
import { useEffect, useState } from "react";

interface Action {
  extension: Extension;
  command: Command;
}

interface PreviewProps {
  action: Action;
  query: string;
}

const Preview: React.FC<PreviewProps> = ({ action, query }) => {
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      const result = await action.command.handler(query);
      return result;
    }

    run().then(setResult);
  }, [action, query]);

  return (
    <div className="preview">
      <div>{result}</div>
    </div>
  );
};

export default Preview;
