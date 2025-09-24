import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SimpleCard = (p: {
  title?: string;
  description?: string;
  headerChildren?: React.ReactNode;
  footerChildren?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Card>
      {(p.title || p.description || p.headerChildren) && (
        <CardHeader>
          {p.title && <CardTitle>{p.title}</CardTitle>}
          {p.description && <CardDescription>{p.description}</CardDescription>}
          {p.headerChildren}
        </CardHeader>
      )}
      <CardContent>{p.children}</CardContent>
      {p.footerChildren && <CardFooter>{p.footerChildren}</CardFooter>}
    </Card>
  );
};
