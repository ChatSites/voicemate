
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Authentication would happen here. This is a placeholder.");
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-white inline-block bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</a>
        </div>
        
        <Card className="border border-gray-800 bg-voicemate-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-center">Welcome to VoiceMate</CardTitle>
            <CardDescription className="text-center">Login or claim your PulseID</CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 bg-black/20">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Claim ID</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="hello@example.com" className="bg-black/30 border-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" className="bg-black/30 border-gray-700" />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full bg-voicemate-purple hover:bg-voicemate-purple/90">
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input id="fullname" type="text" placeholder="John Doe" className="bg-black/30 border-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regemail">Email</Label>
                    <Input id="regemail" type="email" placeholder="hello@example.com" className="bg-black/30 border-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pulse-id">Desired PulseID</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm bg-black/50 rounded-l-md border border-r-0 border-gray-700 text-gray-400">
                        pulse/
                      </span>
                      <Input id="pulse-id" placeholder="yourname" className="rounded-l-none bg-black/30 border-gray-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regpassword">Password</Label>
                    <Input id="regpassword" type="password" className="bg-black/30 border-gray-700" />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full bg-voicemate-red hover:bg-red-600">
                    Claim Your PulseID
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="/" className="text-voicemate-purple hover:text-voicemate-red transition-colors">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
