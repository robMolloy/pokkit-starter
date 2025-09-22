import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { AuthSignin } from "./AuthSignin";
import { AuthSignup } from "./AuthSignup";
import { PocketBase } from "@/config/pocketbaseConfig";

const classMap: Record<string, string> = {
  error: "bg-destructive/20 text-destructive",
  success: "bg-green-500/20 text-green-500",
};

export function AuthForm(p: { pb: PocketBase }) {
  const [messages, setMessages] = useState<string[] | null>(null);
  const [status, setStatus] = useState<"error" | "success" | "init">("init");

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>Sign in to your account or create a new one</CardDescription>
      </CardHeader>
      <CardContent>
        {messages &&
          (() => {
            const [title, ...otherMessages] = messages;

            return (
              <div className={`mb-4 rounded-md p-3 text-center text-sm ${classMap[status] ?? ""}`}>
                <div className="text-lg font-bold">{title}</div>
                {otherMessages && otherMessages.map((message, i) => <div key={i}>{message}</div>)}
              </div>
            );
          })()}

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <AuthSignin
              pb={p.pb}
              onSignInError={(messages) => {
                setMessages(messages);
                setStatus("error");
              }}
              onSignInSuccess={(messages) => {
                setMessages(messages);
                setStatus("success");
              }}
            />
          </TabsContent>
          <TabsContent value="signup">
            <AuthSignup
              pb={p.pb}
              onSignUpError={(messages) => {
                setMessages(messages);
                setStatus("error");
              }}
              onSignUpSuccess={(messages) => {
                setMessages(messages);
                setStatus("success");
              }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </CardFooter>
    </Card>
  );
}
