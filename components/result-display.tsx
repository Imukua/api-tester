import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResultDisplayProps {
  //eslint-disable-next-line
  result: any;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  return (
    <Card className="bg-white shadow-lg mt-4 flex-grow">
      <CardHeader className="bg-orange-100">
        <CardTitle className="text-orange-800">API Response</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <ScrollArea className="h-[300px] w-full rounded border border-orange-200">
          <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-words">
            {JSON.stringify(result, null, 2)}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
