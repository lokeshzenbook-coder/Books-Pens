import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';

interface ContactAboutProps {
  initialView?: 'about' | 'contact';
}

export default function ContactAbout({ initialView = 'about' }: ContactAboutProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'contact'>(initialView);

  // Contact Form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    
    // Simulate successful message submission
    setFormSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessage('');
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  const team = [
    {
      name: 'Thomas Wood',
      role: 'Founder &amp; Chief Curator',
      bio: 'Lifelong bibliophile and fountain pen restorer with a passion for traditional craftsmanship.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Elena Rostova',
      role: 'Creative Director',
      bio: 'Award-winning industrial designer specializing in premium writing utensils and ergonomic designs.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Marcus Chen',
      role: 'Head of Literary Sourcing',
      bio: 'Former editor at global publishing houses. Marcus hunts down rare collections and modern classics.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
    }
  ];

  return (
    <div id="contact-about-container" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Sub-navigation Tabs */}
      <div className="flex border-b border-gray-100 pb-px">
        <button
          onClick={() => setActiveTab('about')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'border-gray-900 text-gray-950 font-bold'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          Our Story &amp; Team
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'contact'
              ? 'border-gray-900 text-gray-950 font-bold'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          Contact Us &amp; Office
        </button>
      </div>

      {activeTab === 'about' ? (
        <div id="about-section" className="space-y-12 animate-in fade-in duration-300">
          {/* Cover Story block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100/50">
                OUR STORY
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-950 tracking-tight leading-tight">
                Restoring the Soul of Analog Communication
              </h2>
              <p className="text-xs text-gray-600 font-sans leading-relaxed">
                Ink &amp; Paper was founded in 2024 out of a simple, rebellious realization: as our screens grow brighter and notifications more frantic, we lose the sacred physical connection to our thoughts. There is an organic magic when a heavy nib glides smoothly across dense fiber paper, turning fleeting thoughts into durable artifacts.
              </p>
              <p className="text-xs text-gray-600 font-sans leading-relaxed">
                We believe that every word written is a conscious choice. Our mission is to procure and offer only the finest literary treasures and highest-grade writing instruments. Whether you are drafting a system blueprint, writing letters to family, or seeking escape in rich fiction, we support your commitment to creative precision.
              </p>
            </div>
            
            <div className="lg:col-span-5 h-[280px] bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-100 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600"
                alt="Ink and Paper Studio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Mission & Vision Bento grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111317] text-white p-8 rounded-3xl border border-gray-800 relative overflow-hidden shadow-md">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
              <h3 className="text-lg font-bold font-display text-amber-200 mb-3.5">Our Clear Mission</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                To serve as a sanctuary for analytical thinkers, creators, and writers. We do not sell commodity pens or mass-printed templates; we select exceptional, reliable artifacts that serve as lifetime conduits of thoughts, ideas, and stories.
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-3xl relative overflow-hidden shadow-xs">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl"></div>
              <h3 className="text-lg font-bold font-display text-teal-800 mb-3.5">Our Vision</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                We envision a future where high-performance digital workflows and elegant analog tools coexist harmoniously. By promoting slow writing, deep reading, and physical journaling, we foster cognitive focus, long-term memory, and mental clarity.
              </p>
            </div>
          </div>

          {/* Team Members List */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-xl font-bold font-display text-gray-900 tracking-tight">The Curation Council</h3>
              <p className="text-xs text-gray-400 font-sans">
                Meet the passionate bibliophiles, designers, and artisans responsible for evaluating every single book and pen we stock.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-50 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-3.5"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 ring-4 ring-gray-50"
                  />
                  <div>
                    <h4 className="text-sm font-bold font-display text-gray-900">{member.name}</h4>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-semibold">{member.role}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div id="contact-section" className="space-y-12 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contact Form (Left) */}
            <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
              <h3 className="text-lg font-bold font-display text-gray-950">Send Us a Message</h3>
              <p className="text-xs text-gray-400 font-sans">
                Have questions about nib sizing, custom paper grains, or bulk book orders? Drop us a line and our curation experts will reply within 12 hours.
              </p>

              {formSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl flex items-center space-x-3 text-xs font-sans animate-in zoom-in-95 duration-150">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold">Message Submitted!</p>
                    <p className="text-emerald-600 mt-0.5">We have received your request and will contact you shortly.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-4 text-xs font-sans">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g., John Doe"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g., john@example.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 font-medium mb-1">Subject (Optional)</label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="e.g., Fountain Pen Curation Inquiry"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-medium mb-1">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Specify your inquiry details..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

            {/* Quick Contact Info & Maps placeholder (Right) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quick Info details */}
              <div className="bg-[#111317] text-white p-6 rounded-3xl border border-gray-800 space-y-5 shadow-md">
                <h4 className="text-sm font-bold font-display text-amber-200">Contact Details</h4>
                
                <div className="space-y-4 text-xs text-gray-300 font-sans">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Email Addresses</p>
                      <p className="mt-0.5">curation@inkandpaper.com</p>
                      <p>support@inkandpaper.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Telephone Support</p>
                      <p className="mt-0.5">+1 (800) 555-ANALOG</p>
                      <p>Mon - Fri, 9:00 AM - 6:00 PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Curation Headquarters</p>
                      <p className="mt-0.5">74 Writers Square, Suite 400</p>
                      <p>Boston, MA 02108</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Showroom Hours</p>
                      <p className="mt-0.5">Mon - Sat: 10:00 AM - 7:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder Graphic */}
              <div className="border border-gray-100 rounded-3xl overflow-hidden h-[180px] relative bg-gray-50 flex items-center justify-center p-4">
                {/* Elegant vector mockup for maps */}
                <div className="absolute inset-0 bg-sky-100/30 bg-[radial-gradient(#94a3b8_0.8px,transparent_0.8px)] [background-size:12px_12px] opacity-60"></div>
                
                {/* Simulated streets lines and marker */}
                <div className="absolute top-1/2 left-1/3 w-36 h-0.5 bg-gray-300 transform -rotate-12"></div>
                <div className="absolute top-1/3 left-1/2 w-0.5 h-24 bg-gray-300"></div>
                <div className="absolute top-1/2 left-1/2 w-48 h-0.5 bg-gray-300 transform rotate-45"></div>

                <div className="relative flex flex-col items-center text-center space-y-1.5 z-10">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center ring-4 ring-red-100 animate-bounce">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-bold text-gray-700">74 Writers Square, Boston</p>
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider font-mono bg-white px-2 py-0.5 border border-gray-100 rounded-md">
                    GOOGLE MAPS PLACEHOLDER
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
