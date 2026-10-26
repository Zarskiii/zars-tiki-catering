import { createPackageLink } from "@/lib/catering-inquiry";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TikiButton } from "@/components/ui/tiki-button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const CateringPage = () => {
  const cateringPackages = [
    {
      name: "Small Event Package",
      description: "Perfect for intimate gatherings and small parties",
      price: "$249",
      pricePerPerson: "$4",
      details: [
        "Up to 40 servings of snow cones from snowie machine",
        "20 flavors of your choice",
        "Sweetened condensed milk topping",
        "2-hour service window",
        "1 service attendant",
        "Simple setup with table cover and optional canopy",
        "All serving materials"
      ]
    },
    {
      name: "Standard Event Package",
      description: "Ideal for medium-sized gatherings and corporate events",
      price: "$399",
      pricePerPerson: "$3",
      featured: true,
      details: [
        "Up to 80 servings of authentic Hawaiian shave ice",
        "All flavors of your choice",
        "3 toppings included - Condensed Milk, Powdered Sugar, Heavy whipping cream",
        "3-hour service window",
        "1 to 2 service attendants",
        "Full tiki bar setup and 2 tiki torches",
        "Custom event and Flavor Combo Menu",
        "Simple setup with table cover and optional canopy",
        "All serving materials"
      ]
    },
    {
      name: "Premium Event Package",
      description: "The complete experience for large events and weddings",
      price: "$699",
      pricePerPerson: "$2.50",
      details: [
        "Up to 150 servings of shave ice",
        "All 16 flavors available",
        "All toppings included",
        "4-hour service window",
        "2 service attendants",
        "Premium tiki bar setup with decorations and Tiki Torches",
        "Custom branded menu and signage",
        "All serving materials"
      ]
    },
    {
      name: "Custom Event Package",
      description: "Tailored solutions for unique events and special requirements",
      price: "Custom",
      pricePerPerson: "Flexible",
      details: [
        "Unlimited servings available",
        "Custom flavor combinations",
        "All toppings available",
        "Flexible service window",
        "Multiple service attendants",
        "Custom tiki bar setup",
        "Branded experiences available",
        "Special discounts for schools and non-profits",
        "Community event pricing available"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-tiki-dark mb-4">
                Catering <span className="text-tiki-blue">Options</span>
              </h1>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Bring the tropical taste and fun of Hawaiian shave ice to your next event! 
                Our mobile catering service brings the full tiki experience right to you.
              </p>
              <div className="w-24 h-1 bg-tiki-blue mx-auto mt-4"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {cateringPackages.map((pkg, index) => (
                <Card key={index} className={`relative overflow-hidden shadow-lg ${pkg.featured ? 'ring-2 ring-tiki-blue' : ''}`}>
                  {pkg.featured && (
                    <div className="absolute top-0 right-0 bg-tiki-blue text-white py-1 px-4 text-sm font-medium">
                      Best Value
                    </div>
                  )}
                  <CardHeader className="bg-gradient-to-r from-tiki-blue/10 to-tiki-green/10 pb-4">
                    <CardTitle className="text-2xl font-bold text-tiki-dark">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-3xl font-bold text-tiki-dark mb-6">{pkg.price}</p>
                    <p className="text-sm text-gray-500 -mt-5 mb-4">Just <span className="font-medium">{pkg.pricePerPerson}</span> per person</p>
                    <ul className="space-y-3">
                      {pkg.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="w-5 h-5 text-tiki-green mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-2 pb-6">
                    <Link to={createPackageLink(pkg.name)}>
                      <TikiButton variant={index === 3 ? "secondary" : pkg.featured ? "default" : "outline"} className="w-full">
                        {index === 3 ? "Request Custom Quote" : "Book This Package"}
                      </TikiButton>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-16 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-tiki-dark mb-4">
                Customize Your <span className="text-tiki-blue">Experience</span>
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto mb-8">
                Want something special for your event? We can customize any package to meet your specific needs.
                Contact us directly to discuss your event requirements.
              </p>
              <Link to="/#contact">
                <TikiButton size="lg">
                  Contact Us About Catering
                </TikiButton>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CateringPage; 