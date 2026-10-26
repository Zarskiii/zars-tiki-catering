import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: 'Aloha! 🌺 I\'m your Tiki Shack assistant. I can help you choose the perfect shave ice catering package for your event. What type of event are you planning, and how many guests will be attending?'
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const mockApiCall = async (userMessage: string): Promise<string> => {
    // Simulate API call with predefined responses based on keywords
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userMessageLower = userMessage.toLowerCase();
    
    if (userMessageLower.includes('price') || userMessageLower.includes('cost') || userMessageLower.includes('pricing')) {
      return "Our packages start at $299 for up to 50 guests (Basic Package), $499 for up to 100 guests (Premium Package), and $799 for up to 200 guests (Deluxe Package). Each package includes various flavors and toppings. Would you like details on a specific package?";
    } else if (userMessageLower.includes('small') || userMessageLower.includes('50') || (userMessageLower.includes('basic') && !userMessageLower.includes('difference'))) {
      return "The Basic Package ($299) is perfect for smaller gatherings up to 50 people. It includes:\n• 6 flavors of your choice\n• 2 premium toppings\n• 2-hour service\n• 1 staff member\nThis is great for intimate gatherings or children's parties!";
    } else if (userMessageLower.includes('medium') || userMessageLower.includes('100') || (userMessageLower.includes('premium') && !userMessageLower.includes('difference'))) {
      return "The Premium Package ($499) is ideal for medium-sized events up to 100 people. It includes:\n• 10 flavors of your choice\n• 4 premium toppings\n• 3-hour service\n• 2 staff members\n• Custom flavor creation\nThis is our most popular option for birthday parties and corporate events!";
    } else if (userMessageLower.includes('large') || userMessageLower.includes('200') || (userMessageLower.includes('deluxe') && !userMessageLower.includes('difference'))) {
      return "The Deluxe Package ($799) is designed for large events up to 200 people. It includes:\n• 15 flavors of your choice\n• All premium toppings\n• 4-hour service\n• 3 staff members\n• Custom flavor creation\n• Branded cups and napkins\nPerfect for weddings and large corporate gatherings!";
    } else if (userMessageLower.includes('flavor')) {
      return "We offer over 30 flavors including tropical favorites like Blue Hawaii, Mango, Pineapple, and Coconut, as well as classics like Cherry, Grape, and Watermelon. We also offer sugar-free options and can create custom flavors for Premium and Deluxe packages!";
    } else if (userMessageLower.includes('topping')) {
      return "Our premium toppings include sweetened condensed milk, fresh fruit, coconut cream, azuki beans, and boba pearls. Each adds a unique texture and flavor to your shave ice experience!";
    } else if (userMessageLower.includes('book') || userMessageLower.includes('reserve') || userMessageLower.includes('schedule')) {
      return "Great! To book your event, please call us at (808) 234-5678 or email us at aloha@zarstikishack.com with your event details. We recommend booking at least 2 weeks in advance for small events and 4 weeks for larger events.";
    } else if (userMessageLower.includes('difference') || userMessageLower.includes('compare')) {
      return "The main differences between our packages are:\n\n• Number of guests: Basic (up to 50), Premium (up to 100), Deluxe (up to 200)\n• Flavor options: 6 for Basic, 10 for Premium, 15 for Deluxe\n• Toppings: 2 for Basic, 4 for Premium, all toppings for Deluxe\n• Service hours: 2 for Basic, 3 for Premium, 4 for Deluxe\n• Staff: 1 for Basic, 2 for Premium, 3 for Deluxe\n\nPremium and Deluxe also include custom flavor creation, and the Deluxe adds branded cups and napkins.";
    } else if (userMessageLower.includes('thanks') || userMessageLower.includes('thank you')) {
      return "You're welcome! Mahalo for considering Zar's Tiki Shack for your event. If you have any more questions or when you're ready to book, please call us at (808) 234-5678 or email aloha@zarstikishack.com. Have a wonderful day! 🌺";
    } else if (userMessageLower.includes('wedding') || userMessageLower.includes('corporate')) {
      return "For special events like weddings and corporate gatherings, our Deluxe Package ($799) is the perfect choice. We can also customize any package to meet your specific needs. Would you like to hear about add-ons like branded cups or custom flavors themed to your event?";
    } else if (userMessageLower.includes('cancel') || userMessageLower.includes('refund')) {
      return "Our cancellation policy allows for full refunds if canceled 14+ days before your event, 50% refund if canceled 7-13 days before, and no refund within 6 days of the event. We do understand that emergencies happen, so please contact us directly to discuss your situation.";
    } else {
      return "Thank you for sharing! To help you choose the perfect package, could you tell me approximately how many guests you're expecting and what type of occasion you're celebrating? Our packages range from Basic (up to 50 guests, $299), Premium (up to 100 guests, $499), to Deluxe (up to 200 guests, $799).";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    try {
      const response = await mockApiCall(input);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 sm:w-96 h-[500px] flex flex-col shadow-xl rounded-2xl overflow-hidden border-tiki-blue">
          <div className="bg-tiki-blue p-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <MessageSquare size={20} />
              <h3 className="font-medium">Catering Assistant</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-tiki-blue/20">
              <X size={20} />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.role === 'user' 
                        ? 'bg-tiki-blue text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !input.trim()}
                className="bg-tiki-blue hover:bg-tiki-blue/90"
              >
                <Send size={18} />
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full bg-tiki-blue hover:bg-tiki-blue/90 shadow-lg flex items-center justify-center"
        >
          <MessageSquare size={24} className="text-white" />
        </Button>
      )}
    </div>
  );
};

export default ChatBot; 