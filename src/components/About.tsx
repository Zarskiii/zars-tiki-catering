
const About = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-tiki-dark mb-4">
            About <span className="text-tiki-blue">Us</span>
          </h2>
          <div className="w-24 h-1 bg-tiki-blue mx-auto"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 relative">
            <div className="rounded-2xl overflow-hidden shadow-xl transform -rotate-3 w-full">
              <img 
                src="./images/o.jpg" 
                alt="Zar's Tiki Shack Logo and Branding" 
                className="w-full h-[400px] object-cover"
              />
            </div>
            
            {/* Decorations */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-tiki-green rounded-full opacity-70 shadow-lg"></div>
          </div>
          
          <div className="lg:w-1/2">
            <h3 className="text-2xl font-semibold text-tiki-dark mb-4">Our Story</h3>
            <p className="text-gray-700 mb-6">
              Since 2021, <em>Zar's Tiki Shack</em> has been serving delicious hawaiian shaved ice at Kuwahara's Thriller Park, in Draper, Utah. Since day one, our priority has been serving you only the highest quality Ice and Flavors. We strive to deliver the fluffiest, tastiest Shave Ice in the Valley.
            </p>
            <p className="text-gray-700 mb-6">
              <em>Zar's Tiki Shack</em> brings the authentic taste of Hawaii to your events through our premium mobile shave ice catering service. Founded by Chase Freedom Pierce, a passionate foodie with a love for Hawaiian Shave Ice, our mission is to share the joy of this refreshing treat at parties, corporate events, weddings, and gatherings all across the region.
            </p>
            <p className="text-gray-700 mb-6">
              Using only the finest ingredients and authentic techniques, we create deliciously fluffy shave ice topped with premium syrups in a rainbow of flavors. Our catering services bring the spirit of aloha directly to your event, creating a unique experience your guests will never forget.
            </p>
            <p className="text-gray-700 mb-6">
              We've recently partnered with <em>Snoasis</em> in Eagle Mountain! At <em>Snoasis,</em> we hope to even better serve the community! This season we've upgraded the quality of syrups and introduced Authentic Ice block Shavers. Come visit us at 3604 Pony Express Parkway! Aloha!
            </p>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-tiki-blue flex items-center justify-center text-white">
                  <span className="font-bold">1</span>
                </div>
                <span className="font-medium">Premium Ingredients</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-tiki-pink flex items-center justify-center text-white">
                  <span className="font-bold">2</span>
                </div>
                <span className="font-medium">Authentic Flavors</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-tiki-yellow flex items-center justify-center text-tiki-dark">
                  <span className="font-bold">3</span>
                </div>
                <span className="font-medium">Tiki Experience</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
