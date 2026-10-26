import { createPackageLink } from "@/lib/catering-inquiry";
import { TikiButton } from "@/components/ui/tiki-button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Star, ExternalLink } from "lucide-react";

const Catering = () => {
  const features = [
    "Professional setup and service",
    "Fresh and high-quality ingredients",
    "Trained and friendly staff",
    "Variety of flavor options",
    "Custom packages available",
    "Full tiki bar experience",
    "Service throughout the area"
  ];

  const testimonial = {
    quote: "Zar's Tiki Shack was the highlight of our company event! The setup was beautiful, the service was impeccable, and everyone loved the delicious shave ice. Highly recommended for any event!",
    author: "Emily Johnson",
    position: "Event Coordinator, Alpine Tech",
    date: "October 2023",
    rating: 5
  };
  
  // Google Business profile URL
  const googleReviewsUrl = "https://maps.app.goo.gl/DJWZDMWfGqufqpmu7";

  return (
    <section id="catering" className="py-20 bg-gradient-to-r from-tiki-light/50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-tiki-dark mb-4">
            Catering <span className="text-tiki-blue">Services</span>
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Bring the tropical taste and fun of Hawaiian shave ice to your next event! 
            Our mobile catering service brings the full tiki experience right to you.
          </p>
          <div className="w-24 h-1 bg-tiki-blue mx-auto mt-6"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
          <div className="md:w-1/2">
            <div className="relative">
              <img 
                src="./shave-ice-main.png"
                alt="Catering Event" 
                className="rounded-xl shadow-lg w-full"
              />
            </div>

            <Card className="mt-10 bg-white border border-gray-100 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-tiki-pink">
                    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H10V18H0Z" />
                    </svg>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 font-medium">
                        Google Review
                      </span>
                    </div>
                    <p className="text-gray-700 italic font-medium mb-4">{testimonial.quote}</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-tiki-dark font-bold">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.position}</p>
                      </div>
                      <p className="text-xs text-gray-500">{testimonial.date}</p>
                    </div>
                    <div className="mt-4 text-right">
                      <a 
                        href={googleReviewsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-tiki-blue text-sm hover:underline"
                      >
                        More Reviews 
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-1/2">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-tiki-dark mb-6">Professional Event Catering</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle2 className="text-tiki-green h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h4 className="font-bold text-lg text-tiki-dark mb-4">Catering Packages Available</h4>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <Link to={createPackageLink("Small Event Package")} className="block">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-tiki-blue/5 to-tiki-green/5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="font-bold text-tiki-dark">Small Events</div>
                      <p className="text-tiki-blue font-medium">From $249</p>
                      <p className="text-xs text-gray-500">Up to 40 servings</p>
                    </div>
                  </Link>
                  <Link to={createPackageLink("Standard Event Package")} className="block">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-tiki-blue/5 to-tiki-green/5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="font-bold text-tiki-dark">Standard Events</div>
                      <p className="text-tiki-blue font-medium">From $399</p>
                      <p className="text-xs text-gray-500">Up to 80 servings</p>
                    </div>
                  </Link>
                  <Link to={createPackageLink("Premium Event Package")} className="block">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-tiki-blue/5 to-tiki-green/5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="font-bold text-tiki-dark">Premium Events</div>
                      <p className="text-tiki-blue font-medium">From $699</p>
                      <p className="text-xs text-gray-500">Up to 150 servings</p>
                    </div>
                  </Link>
                  <Link to={createPackageLink("Custom Event Package")} className="block">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-tiki-blue/5 to-tiki-green/5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="font-bold text-tiki-dark">Custom Events</div>
                      <p className="text-tiki-blue font-medium">Custom pricing</p>
                      <p className="text-xs text-gray-500">Tailored to your needs</p>
                    </div>
                  </Link>
                </div>
                <Link to="/catering">
                  <TikiButton size="lg" className="w-full">
                    View Full Catering Options
                  </TikiButton>
                </Link>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Schools and non-profit organizations qualify for special discounts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Catering;
