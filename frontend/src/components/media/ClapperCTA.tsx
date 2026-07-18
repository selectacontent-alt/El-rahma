import { useState, useRef, FormEvent } from "react";
import { Camera, Film, Send, Compass, Smile, Radio } from "lucide-react";

interface ClapperCTAProps {
  isAr: boolean;
}

export default function ClapperCTA({ isAr }: ClapperCTAProps) {
  const [clapped, setClapped] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    service: "commercial",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleClap = () => {
    // Snap clapper arm down, then release or keep down to trigger submission
    setClapped(true);
    setTimeout(() => {
      setClapped(false);
    }, 450);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleClap();
    setTimeout(() => {
      setSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setFormData({ name: "", brand: "", service: "commercial", message: "" });
    setSubmitted(false);
    setClapped(false);
  };

  return (
    <section id="cta" className="relative bg-slate-900/40 py-12 px-6 lg:px-20 overflow-hidden border-t border-media-slate-50">
      
      {/* Visual blueprint background marks */}
      <div className="absolute inset-0 bg-media-slate-50/60 opacity-30 pointer-events-none" />


    </section>
  );
}
