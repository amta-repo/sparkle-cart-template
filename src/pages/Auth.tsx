import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { storeName } from "@/data/catalog";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) toast({ title: "Login failed", description: error.message, variant: "destructive" });
      else {
        toast({ title: "Welcome back!" });
        navigate("/");
      }
    } else {
      const { error } = await signUp(email, password, fullName);
      if (error) toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      else toast({ title: "Account created!", description: "Please check your email to verify your account." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription>{isLogin ? "Sign in to access your cart and wishlist" : `Join ${storeName} for a faster, saved checkout experience`}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
              )}
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
              <Button type="submit" className="w-full btn-gradient" disabled={loading}>{loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}</Button>
            </form>
            <div className="mt-6 text-center">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
