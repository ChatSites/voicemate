
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '@/components/providers/ThemeProvider';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    document.title = 'Contact Us | VoiceMate ID';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real implementation, this would connect to an API/edge function
      // For now, just simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent",
        description: "We've received your message and will get back to you soon.",
      });
      
      // Reset the form
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later or email us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Have questions or need assistance? Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Get in Touch</h2>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                  We're here to help with any questions about VoiceMate ID, voice authentication, or our services.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Email</h3>
                <a href="mailto:support@chatsites.io" className="text-voicemate-red hover:text-voicemate-purple transition-colors">
                  support@chatsites.io
                </a>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Locations</h3>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>Phoenix, AZ, USA</p>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>Montreal, Quebec, Canada</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Hours</h3>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>Monday - Friday: 9am - 6pm PST</p>
              </div>
            </div>
            
            <div className={isDark ? "bg-voicemate-card/20 p-6 rounded-lg border border-gray-800" : "bg-gray-50 p-6 rounded-lg border border-gray-200"}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={isDark ? "bg-black/30 border-gray-700" : "bg-white border-gray-300"}
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={isDark ? "bg-black/30 border-gray-700" : "bg-white border-gray-300"}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={isDark ? "bg-black/30 border-gray-700 min-h-[120px]" : "bg-white border-gray-300 min-h-[120px]"}
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-voicemate-purple hover:bg-voicemate-purple/90"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
