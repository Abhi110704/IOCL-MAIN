import React from 'react';
import { 
  Building2, 
  Users, 
  Award, 
  Target, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin,
  LogIn,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building2 className="h-10 w-10 text-orange-400" />
              <div>
                <h1 className="text-xl font-bold">Indian Oil Corporation Limited</h1>
                <p className="text-blue-200 text-sm">Intern Onboarding Portal</p>
              </div>
            </div>
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Empowering the Next Generation of 
                <span className="text-orange-400"> Energy Leaders</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join India's premier energy company and gain hands-on experience in cutting-edge 
                technologies, sustainable energy solutions, and industry-leading practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onLoginClick}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Access Portal</span>
                </button>
                <button className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-900 rounded-lg font-semibold transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <img 
                  src="https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Oil Refinery" 
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">World-Class Infrastructure</h3>
                <p className="text-blue-100">Experience cutting-edge technology and sustainable energy solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-900 mb-2">70+</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-900 mb-2">33,000+</div>
              <div className="text-gray-600">Employees</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-900 mb-2">11</div>
              <div className="text-gray-600">Refineries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-900 mb-2">15,000+</div>
              <div className="text-gray-600">Retail Outlets</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.pexels.com/photos/162568/oil-rig-sea-oil-production-162568.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Oil Production" 
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">About Indian Oil Corporation</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Indian Oil Corporation Limited (IOCL) is India's flagship national oil company, 
                ranking among the Fortune Global 500 companies. We are committed to providing 
                energy security to the nation and fostering sustainable development.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Our Mission</h3>
                    <p className="text-gray-600">To achieve international standards of excellence in all business activities.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="h-6 w-6 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Our Vision</h3>
                    <p className="text-gray-600">To be the Energy of India and a globally admired company.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internship Program Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Internship Program</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive internship program offers students real-world experience in the energy sector, 
              mentorship from industry experts, and exposure to cutting-edge technologies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Expert Mentorship</h3>
              <p className="text-gray-600 mb-4">
                Work directly with industry professionals and gain insights from experienced engineers and managers.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• One-on-one mentoring sessions</li>
                <li>• Regular feedback and guidance</li>
                <li>• Career development support</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Real Projects</h3>
              <p className="text-gray-600 mb-4">
                Contribute to actual business projects and see your work make a real impact on operations.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Live project assignments</li>
                <li>• Cross-functional collaboration</li>
                <li>• Innovation opportunities</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Certification</h3>
              <p className="text-gray-600 mb-4">
                Receive official certification upon successful completion of your internship program.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Industry-recognized certificates</li>
                <li>• Performance evaluations</li>
                <li>• Reference letters</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Facilities</h2>
            <p className="text-xl text-gray-600">State-of-the-art infrastructure and world-class facilities</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Refinery Operations" 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">Refinery Operations</h3>
                  <p className="text-sm">Advanced refining technology and processes</p>
                </div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Research Labs" 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">Research & Development</h3>
                  <p className="text-sm">Cutting-edge R&D facilities and laboratories</p>
                </div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Pipeline Network" 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">Pipeline Network</h3>
                  <p className="text-sm">Extensive pipeline infrastructure across India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Information</h2>
            <p className="text-xl text-gray-600">Get in touch with us for any queries or support</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Phone Support</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Toll Free:</strong> 1800-2333-555</p>
                <p><strong>LPG Helpline:</strong> 1860-5991-111</p>
                <p><strong>Emergency:</strong> 1906</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Email Support</h3>
              <div className="space-y-2 text-gray-600">
                <p>internship@iocl.in</p>
                <p>hr@iocl.in</p>
                <p>support@iocl.in</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Head Office</h3>
              <div className="space-y-2 text-gray-600">
                <p>Indian Oil Bhavan</p>
                <p>G-9, Ali Yavar Jung Marg</p>
                <p>Bandra (East), Mumbai - 400051</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Building2 className="h-8 w-8 text-orange-400" />
                <div>
                  <h3 className="text-xl font-bold">IOCL</h3>
                  <p className="text-blue-200 text-sm">Energy of India</p>
                </div>
              </div>
              <p className="text-blue-200 leading-relaxed">
                India's flagship national oil company, committed to providing energy security 
                and fostering sustainable development.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Investor Relations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Fuel Retail</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lubricants</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Petrochemicals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Natural Gas</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/IndianOilCorpLimited" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.twitter.com/indianOilcl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/company/indian-oil-corp-limited" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.instagram.com/indianoilcorp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.youtube.com/channel/UC5ho18VZHwEFSahW0Q_o-6g/feed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
              <div className="mt-6">
                <p className="text-blue-200 text-sm">
                  Last Updated: {new Date().toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-8 pt-8 text-center">
            <p className="text-blue-200">
              © 2025 Indian Oil Corporation Limited. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;