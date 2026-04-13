"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { sendToTelegram } from "@/lib/send-telegram-bot"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

const grades = ["1-sinf","2-sinf","3-sinf","4-sinf","5-sinf","6-sinf","7-sinf","8-sinf","9-sinf","10-sinf","11-sinf"]

const steps = [
  { id: "firstname",  label: "Ismi",              placeholder: "Ismingizni kiriting",         icon: "👤" },
  { id: "lastname",   label: "Familiyasi",         placeholder: "Familiyangizni kiriting",     icon: "📝" },
  { id: "fathername", label: "Otasining ismi",     placeholder: "Otangizning ismini kiriting", icon: "👨" },
  { id: "mothername", label: "Onasining ismi",     placeholder: "Onangizning ismini kiriting", icon: "👩" },
  { id: "school",     label: "Maktab nomi",        placeholder: "Maktab nomini kiriting",      icon: "🏫" },
  { id: "grade",      label: "Sinfi",              placeholder: "",                            icon: "📚" },
  { id: "phone",      label: "Telefon raqami",     placeholder: "90 123 45 67",                icon: "📱" },
]

export default function RegistrationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstname: "", lastname: "", fathername: "", mothername: "",
    phone: "", phone2: "", school: "", grade: "5-sinf",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [isMobile, setIsMobile] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const formatPhoneNumber = (input) => {
    const d = input.replace(/\D/g, "").slice(0, 9)
    if (d.length <= 2) return d
    if (d.length <= 5) return `${d.slice(0,2)} ${d.slice(2)}`
    if (d.length <= 7) return `${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5)}`
    return `${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5,7)} ${d.slice(7)}`
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    if (id === "phone" || id === "phone2") {
      setFormData(prev => ({ ...prev, [id]: formatPhoneNumber(value) }))
    } else {
      setFormData(prev => ({ ...prev, [id]: value }))
    }
    if (errors[id]) setErrors(prev => { const n = {...prev}; delete n[id]; return n })
  }

  const validateStep = (stepId) => {
    if (stepId === "phone") {
      const d = formData.phone.replace(/\D/g,"")
      if (!formData.phone.trim()) return "Iltimos, telefon raqamingizni kiriting"
      if (d.length !== 9) return "Telefon raqami 9 raqamdan iborat bo'lishi kerak"
      if (!/^(9[01234789]|88|33|71|90|93|94|95|97|98|99|55|77)/.test(d)) return "Noto'g'ri telefon kodi"
    } else if (stepId !== "grade" && stepId !== "phone2") {
      const step = steps.find(s => s.id === stepId)
      if (!formData[stepId]?.trim()) return `Iltimos, ${step?.label?.toLowerCase()}ni kiriting`
    }
    return null
  }

  const validateForm = () => {
    const newErrors = {}
    steps.forEach(step => {
      if (step.id === "grade") return
      const err = validateStep(step.id)
      if (err) newErrors[step.id] = err
    })
    if (formData.phone2.trim()) {
      const d = formData.phone2.replace(/\D/g,"")
      if (d.length !== 9) newErrors.phone2 = "Telefon raqami 9 raqamdan iborat bo'lishi kerak"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      await sendToTelegram({ ...formData, phone: "+998 " + formData.phone })
      toast.success("O'quvchi ma'lumotlari muvaffaqiyatli yuborildi!")
      router.push("/success")
    } catch (error) {
      toast.error("Ma'lumotlarni yuborishda xatolik yuz berdi. Qayta urinib ko'ring.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const goNext = () => {
    const stepId = steps[currentStep].id
    if (stepId !== "grade") {
      const err = validateStep(stepId)
      if (err) { setErrors(prev => ({ ...prev, [stepId]: err })); return }
    }
    if (currentStep < steps.length - 1) {
      setDirection(1)
      setCurrentStep(prev => prev + 1)
    } else {
      handleSubmit(null)
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(prev => prev - 1)
    }
  }

  const progress = (currentStep / (steps.length - 1)) * 100

  // ─── MOBILE ───────────────────────────────────────────────────────────────
  if (isMobile) {
    const step = steps[currentStep]
    const isLast = currentStep === steps.length - 1

    return (
      <div className="min-h-screen flex flex-col" style={{background:"#0a0a1a", fontFamily:"Georgia, serif", color:"white"}}>
        {/* Header */}
        <div style={{background:"linear-gradient(145deg,#1a0a3a,#0a1230)", padding:"2.5rem 1.5rem 2rem", position:"relative", overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-30%",left:"-20%",width:"18rem",height:"18rem",borderRadius:"50%",background:"radial-gradient(circle,rgba(124,58,237,0.35),transparent 70%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:"-20%",right:"-10%",width:"14rem",height:"14rem",borderRadius:"50%",background:"radial-gradient(circle,rgba(14,165,233,0.25),transparent 70%)",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",justifyContent:"center",gap:"0.75rem",marginBottom:"1.5rem"}}>
              {["/logo1.png","/logo2.png","/logo3.png"].map((src,i) => (
                <motion.div key={i} style={{width:"3rem",height:"3rem",borderRadius:"0.875rem",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",padding:"0.375rem"}}
                  initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.1,type:"spring"}}>
                  <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                </motion.div>
              ))}
            </div>
            <h1 style={{fontSize:"1.5rem",fontWeight:"700",textAlign:"center",margin:"0 0 0.25rem"}}>Yosh Bilimdonlar</h1>
            <p style={{textAlign:"center",color:"#7c3aed",fontSize:"0.65rem",fontWeight:"700",letterSpacing:"0.15em",textTransform:"uppercase",margin:0}}>
              Olimpiadasi Ro'yxati
            </p>
          </div>
        </div>

        {/* Progress */}
        <div style={{padding:"1rem 1.5rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.4rem"}}>
            <span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{currentStep+1} / {steps.length}</span>
            <span style={{fontSize:"0.7rem",color:"#7c3aed",fontWeight:"600"}}>{Math.round(progress)}%</span>
          </div>
          <div style={{height:"3px",background:"rgba(255,255,255,0.1)",borderRadius:"9999px",overflow:"hidden"}}>
            <motion.div style={{height:"100%",background:"linear-gradient(90deg,#7c3aed,#0ea5e9)",borderRadius:"9999px"}}
              animate={{width:`${progress}%`}} transition={{duration:0.4}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:"0.5rem"}}>
            {steps.map((_,i) => (
              <div key={i} style={{width:"0.5rem",height:"0.5rem",borderRadius:"50%",transition:"all 0.3s",
                background: i < currentStep ? "#7c3aed" : i === currentStep ? "#0ea5e9" : "rgba(255,255,255,0.15)",
                transform: i === currentStep ? "scale(1.3)" : "scale(1)"}}/>
            ))}
          </div>
        </div>

        {/* Step card */}
        <div style={{flex:1,padding:"0 1.5rem 2rem"}}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step.id} custom={direction}
              initial={{x: direction * 60, opacity:0}}
              animate={{x:0, opacity:1}}
              exit={{x: direction * -60, opacity:0}}
              transition={{type:"spring",stiffness:300,damping:28}}
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"1.25rem",padding:"1.5rem",backdropFilter:"blur(10px)"}}>

              <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1.25rem"}}>
                <div style={{width:"2.5rem",height:"2.5rem",borderRadius:"0.75rem",background:"linear-gradient(135deg,rgba(124,58,237,0.25),rgba(14,165,233,0.25))",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem"}}>
                  {step.icon}
                </div>
                <div>
                  <label style={{display:"block",color:"white",fontWeight:"600",fontSize:"1rem"}}>{step.label}</label>
                  {step.id === "phone2" && <span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.35)"}}>Ixtiyoriy</span>}
                </div>
              </div>

              {step.id === "grade" ? (
                <select id="grade" value={formData.grade} onChange={handleChange}
                  style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"0.75rem",padding:"0.875rem 1rem",color:"white",fontSize:"1rem",outline:"none",appearance:"none"}}>
                  {grades.map(g => <option key={g} value={g} style={{backgroundColor:"#1a1a3a"}}>{g}</option>)}
                </select>
              ) : step.id === "phone" ? (
                <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem",background:"rgba(255,255,255,0.05)",border:`1px solid ${errors.phone ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.12)"}`,borderRadius:"0.75rem",padding:"0.875rem 1rem"}}>
                    <span style={{color:"rgba(255,255,255,0.45)",fontSize:"0.85rem",fontFamily:"monospace",flexShrink:0}}>+998</span>
                    <div style={{width:"1px",height:"1rem",background:"rgba(255,255,255,0.15)"}}/>
                    <input id="phone" type="tel" placeholder="90 123 45 67" value={formData.phone} onChange={handleChange}
                      style={{flex:1,background:"transparent",color:"white",fontSize:"1rem",outline:"none",border:"none"}}/>
                  </div>
                  {errors.phone && <motion.p initial={{opacity:0}} animate={{opacity:1}} style={{color:"#f87171",fontSize:"0.7rem",margin:"0"}}>{errors.phone}</motion.p>}
                  <label style={{color:"rgba(255,255,255,0.5)",fontSize:"0.8rem",display:"block",marginTop:"0.5rem"}}>Ikkinchi telefon <span style={{color:"rgba(255,255,255,0.25)"}}>ixtiyoriy</span></label>
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"0.75rem",padding:"0.875rem 1rem"}}>
                    <span style={{color:"rgba(255,255,255,0.45)",fontSize:"0.85rem",fontFamily:"monospace",flexShrink:0}}>+998</span>
                    <div style={{width:"1px",height:"1rem",background:"rgba(255,255,255,0.15)"}}/>
                    <input id="phone2" type="tel" placeholder="90 123 45 67" value={formData.phone2} onChange={handleChange}
                      style={{flex:1,background:"transparent",color:"white",fontSize:"1rem",outline:"none",border:"none"}}/>
                  </div>
                  {errors.phone2 && <motion.p initial={{opacity:0}} animate={{opacity:1}} style={{color:"#f87171",fontSize:"0.7rem",margin:"0"}}>{errors.phone2}</motion.p>}
                </div>
              ) : (
                <>
                  <input id={step.id} type="text" placeholder={step.placeholder} value={formData[step.id]} onChange={handleChange} autoFocus
                    style={{width:"100%",background:"rgba(255,255,255,0.05)",border:`1px solid ${errors[step.id] ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.12)"}`,borderRadius:"0.75rem",padding:"0.875rem 1rem",color:"white",fontSize:"1rem",outline:"none",boxSizing:"border-box"}}/>
                  {errors[step.id] && <motion.p initial={{opacity:0}} animate={{opacity:1}} style={{color:"#f87171",fontSize:"0.7rem",marginTop:"0.4rem"}}>{errors[step.id]}</motion.p>}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div style={{display:"flex",gap:"0.75rem",marginTop:"1.25rem"}}>
            {currentStep > 0 && (
              <motion.button onClick={goBack} whileTap={{scale:0.96}}
                style={{flex:1,padding:"0.875rem",borderRadius:"0.875rem",border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.55)",fontWeight:"500",fontSize:"0.85rem",cursor:"pointer"}}>
                ← Orqaga
              </motion.button>
            )}
            <motion.button onClick={goNext} whileTap={{scale:0.96}} disabled={isSubmitting}
              style={{flex:1,padding:"0.875rem",borderRadius:"0.875rem",border:"none",
                background: isLast ? "linear-gradient(135deg,#7c3aed,#0ea5e9)" : "white",
                color: isLast ? "white" : "#0a0a1a",fontWeight:"600",fontSize:"0.85rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",
                boxShadow: isLast ? "0 8px 24px rgba(124,58,237,0.35)" : "none"}}>
              {isSubmitting
                ? <><svg style={{animation:"spin 1s linear infinite",width:"1rem",height:"1rem"}} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{opacity:0.25}}/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style={{opacity:0.75}}/></svg> Yuborilmoqda...</>
                : isLast ? "✓ Yuborish" : "Keyingi →"}
            </motion.button>
          </div>
        </div>

        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    )
  }

  // ─── DESKTOP ──────────────────────────────────────────────────────────────
  const filledCount = Object.values(formData).filter(v => v.trim()).length
  const fillPct = Math.round((filledCount / Object.keys(formData).length) * 100)

  return (
    <div style={{minHeight:"100vh",background:"#06060f",display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem",fontFamily:"Georgia, serif"}}>
      <motion.div style={{width:"100%",maxWidth:"60rem",background:"#0d0d24",borderRadius:"1.5rem",overflow:"hidden",border:"1px solid rgba(255,255,255,0.07)",boxShadow:"0 40px 100px rgba(0,0,0,0.7)",display:"flex"}}
        initial={{opacity:0,scale:0.97,y:20}} animate={{opacity:1,scale:1,y:0}} transition={{duration:0.6}}>

        {/* LEFT */}
        <div style={{width:"40%",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"2.5rem",
          background:"linear-gradient(145deg,#1a0a3a 0%,#0a1230 50%,#0a1a3a 100%)"}}>
          <div style={{position:"absolute",top:"-15%",left:"-15%",width:"20rem",height:"20rem",borderRadius:"50%",background:"radial-gradient(circle,rgba(124,58,237,0.3),transparent 70%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:"-10%",right:"-15%",width:"16rem",height:"16rem",borderRadius:"50%",background:"radial-gradient(circle,rgba(14,165,233,0.2),transparent 70%)",pointerEvents:"none"}}/>

          <div style={{position:"relative",zIndex:1}}>
            <motion.div style={{display:"flex",gap:"0.75rem",marginBottom:"2rem"}} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}>
              {["/logo1.png","/logo2.png","/logo3.png"].map((src,i) => (
                <motion.div key={i} style={{width:"3.5rem",height:"3.5rem",borderRadius:"1rem",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",padding:"0.5rem"}}
                  initial={{scale:0,rotate:-15}} animate={{scale:1,rotate:0}} transition={{delay:0.4+i*0.1,type:"spring",stiffness:260}}>
                  <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                </motion.div>
              ))}
            </motion.div>

            <motion.h1 style={{fontSize:"1.875rem",fontWeight:"700",color:"white",lineHeight:1.2,margin:"0 0 0.25rem"}} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.5}}>
              Yosh<br/>Bilimdonlar
            </motion.h1>
            <motion.p style={{color:"#7c3aed",fontSize:"0.6rem",fontWeight:"700",letterSpacing:"0.15em",textTransform:"uppercase",margin:"0 0 2rem"}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}>
              Olimpiadasi Ro'yxati
            </motion.p>

            <div style={{display:"flex",flexDirection:"column",gap:"0.625rem"}}>
              {["To'liq ism va familiya","Ota-ona ismlari","Maktab va sinfi","Telefon raqamlar"].map((item,i) => (
                <motion.div key={i} style={{display:"flex",alignItems:"center",gap:"0.625rem",fontSize:"0.8rem",color:"rgba(255,255,255,0.55)"}}
                  initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:0.7+i*0.1}}>
                  <div style={{width:"5px",height:"5px",borderRadius:"50%",background:"#7c3aed",flexShrink:0}}/>
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div style={{position:"relative",zIndex:1}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}}>
            <div style={{height:"1px",background:"rgba(255,255,255,0.08)",marginBottom:"1rem"}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.7rem",color:"rgba(255,255,255,0.3)",marginBottom:"0.5rem"}}>
              <span>Jarayon</span>
              <span>{fillPct}% to'ldirildi</span>
            </div>
            <div style={{height:"3px",background:"rgba(255,255,255,0.08)",borderRadius:"9999px",overflow:"hidden"}}>
              <motion.div style={{height:"100%",background:"linear-gradient(90deg,#7c3aed,#0ea5e9)",borderRadius:"9999px"}}
                animate={{width:`${fillPct}%`}} transition={{duration:0.5}}/>
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div style={{flex:1,padding:"2.5rem",overflowY:"auto"}}>
          <motion.h2 style={{fontSize:"1.25rem",fontWeight:"600",color:"white",margin:"0 0 0.25rem"}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}>
            Ro'yxatdan o'tish
          </motion.h2>
          <motion.p style={{color:"rgba(255,255,255,0.35)",fontSize:"0.8rem",margin:"0 0 2rem"}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}>
            Barcha ma'lumotlarni to'g'ri to'ldiring
          </motion.p>

          <form onSubmit={handleSubmit}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
              <DField id="firstname" label="Ismi" placeholder="Ismingizni kiriting" value={formData.firstname} onChange={handleChange} error={errors.firstname} delay={0.5}/>
              <DField id="lastname" label="Familiyasi" placeholder="Familiyangizni kiriting" value={formData.lastname} onChange={handleChange} error={errors.lastname} delay={0.55}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
              <DField id="fathername" label="Otasining ismi" placeholder="Otangizning ismini kiriting" value={formData.fathername} onChange={handleChange} error={errors.fathername} delay={0.6}/>
              <DField id="mothername" label="Onasining ismi" placeholder="Onangizning ismini kiriting" value={formData.mothername} onChange={handleChange} error={errors.mothername} delay={0.65}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
              <DField id="school" label="Maktab nomi" placeholder="Maktab nomini kiriting" value={formData.school} onChange={handleChange} error={errors.school} delay={0.7}/>
              <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.75}}>
                <label style={{display:"block",color:"rgba(255,255,255,0.5)",fontSize:"0.65rem",fontWeight:"600",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.4rem"}}>Sinfi</label>
                <select id="grade" value={formData.grade} onChange={handleChange}
                  style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"0.75rem",padding:"0.7rem 1rem",color:"white",fontSize:"0.85rem",outline:"none",appearance:"none",boxSizing:"border-box"}}>
                  {grades.map(g => <option key={g} value={g} style={{backgroundColor:"#0d0d24"}}>{g}</option>)}
                </select>
              </motion.div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.5rem"}}>
              <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.8}}>
                <label style={{display:"block",color:"rgba(255,255,255,0.5)",fontSize:"0.65rem",fontWeight:"600",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.4rem"}}>Telefon raqami</label>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",background:"rgba(255,255,255,0.05)",border:`1px solid ${errors.phone ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)"}`,borderRadius:"0.75rem",padding:"0.7rem 1rem"}}>
                  <span style={{color:"rgba(255,255,255,0.4)",fontSize:"0.8rem",fontFamily:"monospace",flexShrink:0}}>+998</span>
                  <div style={{width:"1px",height:"1rem",background:"rgba(255,255,255,0.12)"}}/>
                  <input id="phone" type="tel" placeholder="90 123 45 67" value={formData.phone} onChange={handleChange}
                    style={{flex:1,background:"transparent",color:"white",fontSize:"0.85rem",outline:"none",border:"none"}}/>
                </div>
                {errors.phone && <motion.p initial={{opacity:0}} animate={{opacity:1}} style={{color:"#f87171",fontSize:"0.7rem",marginTop:"0.25rem"}}>{errors.phone}</motion.p>}
              </motion.div>
              <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.85}}>
                <label style={{display:"block",color:"rgba(255,255,255,0.5)",fontSize:"0.65rem",fontWeight:"600",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.4rem"}}>Ikkinchi telefon <span style={{color:"rgba(255,255,255,0.25)",fontWeight:"400",textTransform:"none",letterSpacing:0}}>(ixtiyoriy)</span></label>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",background:"rgba(255,255,255,0.05)",border:`1px solid ${errors.phone2 ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)"}`,borderRadius:"0.75rem",padding:"0.7rem 1rem"}}>
                  <span style={{color:"rgba(255,255,255,0.4)",fontSize:"0.8rem",fontFamily:"monospace",flexShrink:0}}>+998</span>
                  <div style={{width:"1px",height:"1rem",background:"rgba(255,255,255,0.12)"}}/>
                  <input id="phone2" type="tel" placeholder="90 123 45 67" value={formData.phone2} onChange={handleChange}
                    style={{flex:1,background:"transparent",color:"white",fontSize:"0.85rem",outline:"none",border:"none"}}/>
                </div>
                {errors.phone2 && <motion.p initial={{opacity:0}} animate={{opacity:1}} style={{color:"#f87171",fontSize:"0.7rem",marginTop:"0.25rem"}}>{errors.phone2}</motion.p>}
              </motion.div>
            </div>

            <motion.button type="submit" disabled={isSubmitting}
              style={{width:"100%",padding:"1rem",borderRadius:"1rem",border:"none",background:"linear-gradient(135deg,#7c3aed,#0ea5e9)",color:"white",fontWeight:"600",fontSize:"0.9rem",cursor:isSubmitting?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",boxShadow:"0 8px 32px rgba(124,58,237,0.3)",opacity:isSubmitting?0.65:1,transition:"all 0.2s"}}
              initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.9}}
              whileHover={{scale:isSubmitting?1:1.02,boxShadow:"0 12px 40px rgba(124,58,237,0.45)"}}
              whileTap={{scale:isSubmitting?1:0.98}}>
              {isSubmitting
                ? <><svg style={{animation:"spin 1s linear infinite",width:"1rem",height:"1rem"}} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{opacity:0.25}}/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style={{opacity:0.75}}/></svg> Yuborilmoqda...</>
                : "Ro'yxatdan o'tish →"}
            </motion.button>
          </form>
        </div>
      </motion.div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}

function DField({ id, label, placeholder, value, onChange, error, delay }) {
  return (
    <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay}}>
      <label htmlFor={id} style={{display:"block",color:"rgba(255,255,255,0.5)",fontSize:"0.65rem",fontWeight:"600",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.4rem"}}>{label}</label>
      <input id={id} type="text" placeholder={placeholder} value={value} onChange={onChange}
        style={{width:"100%",background:"rgba(255,255,255,0.05)",border:`1px solid ${error ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)"}`,borderRadius:"0.75rem",padding:"0.7rem 1rem",color:"white",fontSize:"0.85rem",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"}}
        onFocus={e=>e.target.style.borderColor="rgba(124,58,237,0.7)"}
        onBlur={e=>e.target.style.borderColor=error?"rgba(239,68,68,0.6)":"rgba(255,255,255,0.1)"}/>
      {error && <motion.p initial={{opacity:0}} animate={{opacity:1}} style={{color:"#f87171",fontSize:"0.7rem",marginTop:"0.25rem"}}>{error}</motion.p>}
    </motion.div>
  )
}
