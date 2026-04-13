"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { sendToTelegram } from "@/lib/send-telegram-bot"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

const grades = ["1-sinf","2-sinf","3-sinf","4-sinf","5-sinf","6-sinf","7-sinf","8-sinf","9-sinf","10-sinf","11-sinf"]

const mobileSteps = [
  { id: "firstname",  label: "Ism",             placeholder: "Jasur",        hint: "O'quvchining ismi" },
  { id: "lastname",   label: "Familiya",         placeholder: "Toshmatov",    hint: "O'quvchining familiyasi" },
  { id: "fathername", label: "Otasining ismi",   placeholder: "Baxtiyor",     hint: "To'liq ota ismi" },
  { id: "phone",      label: "Telefon",          placeholder: "90 123 45 67", hint: "Asosiy telefon raqami" },
  { id: "school",     label: "Maktab",           placeholder: "15-maktab",    hint: "O'qiydigan maktab nomi" },
  { id: "grade",      label: "Sinf",             placeholder: "",             hint: "Hozirgi sinfi" },
]

export default function RegistrationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstname:"", lastname:"", fathername:"",
    phone:"", phone2:"", school:"", grade:"5-sinf",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [screenSize, setScreenSize] = useState("desktop")
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [focused, setFocused] = useState(null)

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      if (w < 640) setScreenSize("mobile")
      else if (w < 1024) setScreenSize("tablet")
      else setScreenSize("desktop")
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const formatPhone = (input) => {
    const d = input.replace(/\D/g,"").slice(0,9)
    if (d.length <= 2) return d
    if (d.length <= 5) return `${d.slice(0,2)} ${d.slice(2)}`
    if (d.length <= 7) return `${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5)}`
    return `${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5,7)} ${d.slice(7)}`
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: (id==="phone"||id==="phone2") ? formatPhone(value) : value }))
    if (errors[id]) setErrors(prev => { const n={...prev}; delete n[id]; return n })
  }

  const validateField = (id) => {
    if (id==="grade") return null
    if (id==="phone2") {
      if (!formData.phone2.trim()) return null
      if (formData.phone2.replace(/\D/g,"").length !== 9) return "9 ta raqam kiritilishi kerak"
      return null
    }
    if (id==="phone") {
      const d = formData.phone.replace(/\D/g,"")
      if (!formData.phone.trim()) return "Telefon raqamini kiriting"
      if (d.length !== 9) return "9 ta raqam kiritilishi kerak"
      if (!/^(9[01234789]|88|33|71|90|93|94|95|97|98|99|55|77)/.test(d)) return "Noto'g'ri operator kodi"
      return null
    }
    if (!formData[id]?.trim()) return "Maydonni to'ldiring"
    return null
  }

  const validateAll = () => {
    const newErrors = {}
    Object.keys(formData).forEach(id => {
      const err = validateField(id)
      if (err) newErrors[id] = err
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    if (!validateAll()) return
    setIsSubmitting(true)
    try {
      await sendToTelegram({ ...formData, phone: "+998 " + formData.phone })
      toast.success("Muvaffaqiyatli yuborildi!")
      router.push("/success")
    } catch {
      toast.error("Xatolik yuz berdi. Qayta urinib ko'ring.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const goNext = () => {
    const stepId = mobileSteps[currentStep].id
    const err = validateField(stepId)
    if (err) { setErrors(prev => ({ ...prev, [stepId]: err })); return }
    if (currentStep < mobileSteps.length - 1) { setDirection(1); setCurrentStep(p => p+1) }
    else handleSubmit(null)
  }
  const goBack = () => { if (currentStep > 0) { setDirection(-1); setCurrentStep(p => p-1) } }

  const requiredFields = ["firstname","lastname","fathername","phone","school"]
  const fillPct = Math.round(requiredFields.filter(id => formData[id]?.trim()).length / requiredFields.length * 100)

  // ─── MOBILE ──────────────────────────────────────────────────────────────
  if (screenSize === "mobile") {
    const step = mobileSteps[currentStep]
    const isLast = currentStep === mobileSteps.length - 1

    return (
      <div style={{
        minHeight:"100vh", background:"#F8F9FB",
        display:"flex", flexDirection:"column",
        fontFamily:"'Geist', 'DM Sans', system-ui, sans-serif",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
          * { box-sizing: border-box; }
          input, select { font-family: inherit; }
          input::placeholder { color: #BBC4D0; }
          input:focus, select:focus { outline: none; }
        `}</style>

        {/* Top bar */}
        <div style={{
          background:"#0D1117", padding:"1.125rem 1.25rem",
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div style={{display:"flex", gap:"0.5rem", alignItems:"center"}}>
            {["/logo1.png","/logo2.png","/logo3.png"].map((s,i) => (
              <motion.div key={i}
                style={{width:"2rem", height:"2rem", borderRadius:"6px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", overflow:"hidden", padding:"0.2rem"}}
                initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} transition={{delay:i*0.06, type:"spring", stiffness:300, damping:24}}>
                <img src={s} alt="" style={{width:"100%", height:"100%", objectFit:"contain"}}/>
              </motion.div>
            ))}
          </div>
          <motion.div style={{fontSize:"0.65rem", fontWeight:"600", color:"rgba(255,255,255,0.35)", letterSpacing:"0.1em", textTransform:"uppercase"}}
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}>
            Ro'yxat
          </motion.div>
        </div>

        {/* Progress */}
        <div style={{background:"#fff", borderBottom:"1px solid #EAECF0"}}>
          <div style={{height:"2px", background:"#F3F4F6"}}>
            <motion.div
              style={{height:"100%", background:"#0D1117", transformOrigin:"left"}}
              animate={{scaleX: (currentStep+1) / mobileSteps.length}}
              initial={{scaleX: 1/mobileSteps.length}}
              transition={{duration:0.4, ease:[0.32,0,0.67,0]}}
            />
          </div>
          <div style={{padding:"0.625rem 1.25rem", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <span style={{fontSize:"0.7rem", color:"#9BA5B4", fontWeight:"500"}}>
              {currentStep + 1} / {mobileSteps.length}
            </span>
            <span style={{fontSize:"0.7rem", color:"#0D1117", fontWeight:"600"}}>
              {step.hint}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1, display:"flex", flexDirection:"column", padding:"1.5rem 1.25rem 1.25rem"}}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step.id} custom={direction}
              initial={{x: direction*40, opacity:0}}
              animate={{x:0, opacity:1}}
              exit={{x: direction*-40, opacity:0}}
              transition={{type:"spring", stiffness:380, damping:34}}
              style={{flex:1, display:"flex", flexDirection:"column"}}>

              {/* Step label */}
              <motion.div style={{marginBottom:"2rem"}}
                initial={{y:8, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:0.05}}>
                <div style={{
                  fontSize:"0.6rem", fontWeight:"600", color:"#BBC4D0",
                  letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"0.5rem"
                }}>
                  Qadam {currentStep + 1}
                </div>
                <h1 style={{
                  fontSize:"1.75rem", fontWeight:"300", color:"#0D1117", margin:0,
                  fontFamily:"'DM Serif Display', Georgia, serif", letterSpacing:"-0.02em",
                  lineHeight:1.2,
                }}>
                  {step.label}
                </h1>
              </motion.div>

              {/* Input area */}
              <motion.div initial={{y:12, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:0.1}}>
                {step.id === "grade" ? (
                  <div style={{position:"relative"}}>
                    <select id="grade" value={formData.grade} onChange={handleChange}
                      style={{
                        width:"100%", background:"transparent", border:"none",
                        borderBottom:`2px solid ${focused==="grade" ? "#0D1117" : "#EAECF0"}`,
                        padding:"0.75rem 2rem 0.75rem 0", color:"#0D1117",
                        fontSize:"1.375rem", fontWeight:"300", cursor:"pointer",
                        appearance:"none", transition:"border-color 0.2s",
                        fontFamily:"'DM Serif Display', Georgia, serif",
                      }}
                      onFocus={()=>setFocused("grade")}
                      onBlur={()=>setFocused(null)}>
                      {grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <div style={{position:"absolute", right:0, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"#BBC4D0"}}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                ) : step.id === "phone" ? (
                  <div style={{display:"flex", flexDirection:"column", gap:"2rem"}}>
                    <div>
                      <div style={{
                        display:"flex", alignItems:"baseline",
                        borderBottom:`2px solid ${errors.phone ? "#EF4444" : focused==="phone" ? "#0D1117" : "#EAECF0"}`,
                        transition:"border-color 0.2s",
                      }}>
                        <span style={{fontSize:"1rem", color:"#BBC4D0", fontWeight:"400", marginRight:"0.5rem", paddingBottom:"0.75rem", flexShrink:0}}>+998</span>
                        <input id="phone" type="tel" placeholder="90 123 45 67" value={formData.phone} onChange={handleChange}
                          onFocus={()=>setFocused("phone")} onBlur={()=>setFocused(null)}
                          style={{
                            flex:1, background:"transparent", border:"none", padding:"0.75rem 0",
                            color:"#0D1117", fontSize:"1.375rem", fontWeight:"300",
                            fontFamily:"'DM Serif Display', Georgia, serif",
                          }}/>
                      </div>
                      {errors.phone && <p style={{color:"#EF4444", fontSize:"0.7rem", margin:"0.375rem 0 0", fontWeight:"500"}}>{errors.phone}</p>}
                    </div>
                    <div>
                      <div style={{fontSize:"0.65rem", fontWeight:"600", color:"#BBC4D0", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"0.875rem"}}>
                        Ikkinchi telefon <span style={{fontWeight:"400"}}>(ixtiyoriy)</span>
                      </div>
                      <div style={{
                        display:"flex", alignItems:"baseline",
                        borderBottom:`2px solid ${focused==="phone2" ? "#0D1117" : "#EAECF0"}`,
                        transition:"border-color 0.2s",
                      }}>
                        <span style={{fontSize:"1rem", color:"#BBC4D0", marginRight:"0.5rem", paddingBottom:"0.75rem", flexShrink:0}}>+998</span>
                        <input id="phone2" type="tel" placeholder="90 123 45 67" value={formData.phone2} onChange={handleChange}
                          onFocus={()=>setFocused("phone2")} onBlur={()=>setFocused(null)}
                          style={{
                            flex:1, background:"transparent", border:"none", padding:"0.75rem 0",
                            color:"#0D1117", fontSize:"1.375rem", fontWeight:"300",
                            fontFamily:"'DM Serif Display', Georgia, serif",
                          }}/>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      position:"relative",
                      background: focused===step.id ? "#F8F9FB" : formData[step.id] ? "#FAFBFC" : "#fff",
                      border:`2px solid ${errors[step.id] ? "#EF4444" : focused===step.id ? "#0D1117" : formData[step.id] ? "#D0D5DD" : "#E8ECF2"}`,
                      borderRadius:"1rem",
                      transition:"all 0.25s ease",
                      boxShadow: focused===step.id ? "0 0 0 4px rgba(13,17,23,0.06)" : "none",
                    }}>
                      {formData[step.id] && focused!==step.id && (
                        <div style={{
                          position:"absolute", right:"1rem", top:"50%", transform:"translateY(-50%)",
                          width:"1.5rem", height:"1.5rem", borderRadius:"50%",
                          background:"#0D1117", display:"flex", alignItems:"center", justifyContent:"center",
                        }}>
                          <svg width="10" height="10" viewBox="0 0 12 10" fill="none">
                            <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                      <input id={step.id} type="text" placeholder={step.placeholder} value={formData[step.id]} onChange={handleChange} autoFocus
                        onFocus={()=>setFocused(step.id)} onBlur={()=>setFocused(null)}
                        style={{
                          width:"100%", background:"transparent", border:"none",
                          padding:"1rem 1.25rem",
                          color:"#0D1117", fontSize:"1.375rem", fontWeight:"300",
                          fontFamily:"'DM Serif Display', Georgia, serif",
                        }}/>
                    </div>
                    {errors[step.id] && (
                      <p style={{color:"#EF4444", fontSize:"0.7rem", margin:"0.5rem 0 0 0.25rem", fontWeight:"500", display:"flex", alignItems:"center", gap:"0.3rem"}}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke="#EF4444" strokeWidth="1.5"/>
                          <path d="M8 5v3.5M8 11v.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {errors[step.id]}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>

              <div style={{flex:1}}/>

              {/* Dot indicators */}
              <div style={{display:"flex", gap:"0.375rem", justifyContent:"center", marginBottom:"1.5rem"}}>
                {mobileSteps.map((_,i) => (
                  <div key={i} style={{
                    width: i===currentStep ? "1.5rem" : "0.375rem",
                    height:"0.375rem", borderRadius:"9999px",
                    background: i===currentStep ? "#0D1117" : i<currentStep ? "#0D1117" : "#EAECF0",
                    transition:"all 0.3s ease", opacity: i<currentStep ? 0.35 : 1,
                  }}/>
                ))}
              </div>

              {/* Buttons */}
              <div style={{display:"flex", gap:"0.75rem"}}>
                {currentStep > 0 && (
                  <motion.button onClick={goBack} whileTap={{scale:0.97}}
                    style={{
                      width:"3.25rem", height:"3.25rem", borderRadius:"50%",
                      border:"1.5px solid #EAECF0", background:"#fff",
                      color:"#6B7280", cursor:"pointer", display:"flex",
                      alignItems:"center", justifyContent:"center", flexShrink:0,
                    }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/></svg>
                  </motion.button>
                )}
                <motion.button onClick={goNext} disabled={isSubmitting} whileTap={{scale:0.98}}
                  style={{
                    flex:1, height:"3.25rem", borderRadius:"0.875rem", border:"none",
                    background:"#0D1117", color:"#fff",
                    fontWeight:"500", fontSize:"0.9rem", cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
                    fontFamily:"'DM Sans', sans-serif", letterSpacing:"0.01em",
                  }}>
                  {isSubmitting ? <><Spinner/> Yuborilmoqda</> : isLast ? "Yuborish" : (
                    <>{mobileSteps[currentStep+1]?.label ?? "Yuborish"}
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // ─── TABLET & DESKTOP ────────────────────────────────────────────────────
  const isTablet = screenSize === "tablet"

  return (
    <div style={{
      minHeight:"100vh", background:"#F8F9FB",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding: isTablet ? "1.5rem" : "2rem",
      fontFamily:"'DM Sans', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; }
        input, select { font-family: inherit; }
        input::placeholder { color: #C4CBD8; }
        input:focus, select:focus { outline: none; }
      `}</style>

      <motion.div
        style={{
          width:"100%",
          maxWidth: isTablet ? "42rem" : "60rem",
          display:"flex",
          flexDirection: isTablet ? "column" : "row",
          background:"#fff",
          borderRadius: isTablet ? "1.25rem" : "1.5rem",
          overflow:"hidden",
          border:"1px solid #E8EBF0",
          boxShadow:"0 1px 3px rgba(0,0,0,0.04), 0 12px 48px rgba(0,0,0,0.06)",
        }}
        initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}
        transition={{duration:0.5, ease:[0.22,1,0.36,1]}}>

        {/* ── LEFT ── */}
        <div style={{
          background:"#0D1117",
          width: isTablet ? "100%" : "252px",
          flexShrink:0,
          padding: isTablet ? "2rem" : "2.5rem 2rem",
          display:"flex",
          flexDirection: isTablet ? "row" : "column",
          alignItems: isTablet ? "center" : "flex-start",
          justifyContent: isTablet ? "space-between" : "space-between",
          gap: isTablet ? "1.5rem" : 0,
          position:"relative",
          overflow:"hidden",
        }}>
          {/* Subtle noise texture */}
          <div style={{
            position:"absolute", inset:0, opacity:0.025,
            backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize:"200px",
          }}/>

          {/* Top section */}
          <div style={{position:"relative", zIndex:1}}>
            <div style={{display:"flex", gap:"0.5rem", marginBottom: isTablet ? 0 : "2.5rem"}}>
              {["/logo1.png","/logo2.png","/logo3.png"].map((s,i) => (
                <motion.div key={i}
                  style={{width:"2.25rem", height:"2.25rem", borderRadius:"8px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", overflow:"hidden", padding:"0.25rem"}}
                  initial={{opacity:0, y:8}} animate={{opacity:1, y:0}}
                  transition={{delay:0.1+i*0.06, type:"spring", stiffness:300, damping:22}}>
                  <img src={s} alt="" style={{width:"100%", height:"100%", objectFit:"contain"}}/>
                </motion.div>
              ))}
            </div>
          </div>

          {isTablet ? (
            <div style={{position:"relative", zIndex:1}}>
              <div style={{fontSize:"1.1rem", fontWeight:"300", color:"#fff", fontFamily:"'DM Serif Display', Georgia, serif", letterSpacing:"-0.01em"}}>
                Yosh Bilimdonlar Olimpiadasi
              </div>
              <div style={{fontSize:"0.62rem", color:"rgba(255,255,255,0.35)", marginTop:"0.25rem", letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:"500"}}>
                Ro'yxatdan o'tish
              </div>
            </div>
          ) : (
            <>
              <div style={{position:"relative", zIndex:1, flex:1}}>
                <motion.h1
                  style={{color:"#fff", fontSize:"1.625rem", fontWeight:"300", lineHeight:1.25, margin:"0 0 0.375rem", fontFamily:"'DM Serif Display', Georgia, serif", letterSpacing:"-0.025em"}}
                  initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}>
                  Yosh<br/>Bilimdonlar
                </motion.h1>
                <motion.p style={{color:"rgba(255,255,255,0.35)", fontSize:"0.6rem", fontWeight:"500", letterSpacing:"0.12em", textTransform:"uppercase", margin:"0 0 2.5rem"}}
                  initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.28}}>
                  Olimpiadasi
                </motion.p>

                <div style={{display:"flex", flexDirection:"column", gap:"0.875rem"}}>
                  {[
                    ["01", "O'quvchi ismi va familiyasi"],
                    ["02", "Otasining ismi"],
                    ["03", "Telefon raqami"],
                    ["04", "Maktab va sinfi"],
                  ].map(([num, text], i) => (
                    <motion.div key={i}
                      style={{display:"flex", alignItems:"center", gap:"0.75rem"}}
                      initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{delay:0.3+i*0.06}}>
                      <span style={{fontSize:"0.6rem", color:"rgba(255,255,255,0.2)", fontWeight:"600", fontVariantNumeric:"tabular-nums", minWidth:"1.25rem"}}>{num}</span>
                      <span style={{fontSize:"0.8rem", color:"rgba(255,255,255,0.4)", fontWeight:"400"}}>{text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Fill indicator */}
              <motion.div style={{position:"relative", zIndex:1, width:"100%"}}
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem"}}>
                  <span style={{fontSize:"0.62rem", color:"rgba(255,255,255,0.2)", fontWeight:"500", letterSpacing:"0.05em"}}>To'ldirildi</span>
                  <span style={{fontSize:"0.62rem", color:"rgba(255,255,255,0.5)", fontWeight:"600"}}>{fillPct}%</span>
                </div>
                <div style={{height:"1px", background:"rgba(255,255,255,0.07)", borderRadius:"9999px", overflow:"hidden"}}>
                  <motion.div
                    style={{height:"100%", background:"rgba(255,255,255,0.4)"}}
                    animate={{width:`${fillPct}%`}}
                    transition={{duration:0.5, ease:[0.32,0,0.67,0]}}/>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* ── RIGHT ── */}
        <div style={{flex:1, minWidth:0, padding: isTablet ? "2rem" : "2.5rem 2.75rem"}}>
          {!isTablet && (
            <motion.div style={{marginBottom:"2rem"}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.25}}>
              <h2 style={{fontSize:"1.125rem", fontWeight:"500", color:"#0D1117", margin:"0 0 0.25rem", letterSpacing:"-0.02em"}}>
                Ro'yxatdan o'tish
              </h2>
              <p style={{color:"#9BA5B4", fontSize:"0.8rem", margin:0, fontWeight:"400"}}>
                Barcha majburiy maydonlarni to'ldiring
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem 2rem", marginBottom:"1.75rem"}}>
              <FlatField id="firstname" label="Ism" placeholder="Jasur" value={formData.firstname} onChange={handleChange} error={errors.firstname} delay={0.3} focused={focused} onFocus={setFocused} onBlur={()=>setFocused(null)}/>
              <FlatField id="lastname" label="Familiya" placeholder="Toshmatov" value={formData.lastname} onChange={handleChange} error={errors.lastname} delay={0.34} focused={focused} onFocus={setFocused} onBlur={()=>setFocused(null)}/>
            </div>

            {/* Row 2 */}
            <div style={{marginBottom:"1.75rem"}}>
              <FlatField id="fathername" label="Otasining ismi" placeholder="Baxtiyor" value={formData.fathername} onChange={handleChange} error={errors.fathername} delay={0.38} focused={focused} onFocus={setFocused} onBlur={()=>setFocused(null)}/>
            </div>

            {/* Row 3 */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem 2rem", marginBottom:"1.75rem"}}>
              <FlatPhoneField id="phone" label="Telefon" value={formData.phone} onChange={handleChange} error={errors.phone} delay={0.42} focused={focused} onFocus={setFocused} onBlur={()=>setFocused(null)}/>
              <FlatPhoneField id="phone2" label="Ikkinchi telefon" optional value={formData.phone2} onChange={handleChange} error={errors.phone2} delay={0.46} focused={focused} onFocus={setFocused} onBlur={()=>setFocused(null)}/>
            </div>

            {/* Row 4 */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem 2rem", marginBottom:"2rem"}}>
              <FlatField id="school" label="Maktab" placeholder="15-maktab" value={formData.school} onChange={handleChange} error={errors.school} delay={0.5} focused={focused} onFocus={setFocused} onBlur={()=>setFocused(null)}/>

              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.54}}>
                <label style={{display:"block", fontSize:"0.65rem", fontWeight:"600", color:"#9BA5B4", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"0.5rem"}}>
                  Sinf
                </label>
                <div style={{position:"relative"}}>
                  <select id="grade" value={formData.grade} onChange={handleChange}
                    onFocus={()=>setFocused("grade")} onBlur={()=>setFocused(null)}
                    style={{
                      width:"100%", background:"transparent",
                      border:"none", borderBottom:`1.5px solid ${focused==="grade" ? "#0D1117" : "#E2E6EC"}`,
                      padding:"0.625rem 1.5rem 0.625rem 0",
                      color:"#0D1117", fontSize:"0.9rem", fontWeight:"500",
                      appearance:"none", cursor:"pointer", transition:"border-color 0.2s",
                    }}>
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <div style={{position:"absolute", right:0, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"#BBC4D0"}}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.button type="submit" disabled={isSubmitting}
              style={{
                width:"100%", height:"3rem", borderRadius:"0.75rem",
                border:"none", background:"#0D1117", color:"#fff",
                fontWeight:"500", fontSize:"0.875rem", cursor: isSubmitting ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
                opacity: isSubmitting ? 0.65 : 1, transition:"opacity 0.2s",
                fontFamily:"'DM Sans', sans-serif", letterSpacing:"0.01em",
              }}
              initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay:0.58}}
              whileHover={{opacity: isSubmitting ? 0.65 : 0.85}}
              whileTap={{scale: isSubmitting ? 1 : 0.99}}>
              {isSubmitting ? <><Spinner/> Yuborilmoqda</> : "Ro'yxatdan o'tish"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Flat underline field ─────────────────────────────────────────────────────
function FlatField({ id, label, placeholder, value, onChange, error, delay, focused, onFocus, onBlur }) {
  const isFocused = focused === id
  const hasValue = value && value.trim().length > 0
  return (
    <motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay}}>
      <label htmlFor={id} style={{
        display:"block",
        fontSize:"0.6rem",
        fontWeight:"700",
        color: isFocused ? "#0D1117" : "#9BA5B4",
        letterSpacing:"0.1em",
        textTransform:"uppercase",
        marginBottom:"0.625rem",
        transition:"color 0.2s",
      }}>
        {label}
      </label>
      <div style={{
        position:"relative",
        background: isFocused ? "#F8F9FB" : hasValue ? "#FAFBFC" : "transparent",
        border:`1.5px solid ${error ? "#EF4444" : isFocused ? "#0D1117" : hasValue ? "#D0D5DD" : "#E2E6EC"}`,
        borderRadius:"0.625rem",
        transition:"all 0.2s ease",
        boxShadow: isFocused ? "0 0 0 3px rgba(13,17,23,0.06)" : "none",
      }}>
        {hasValue && !isFocused && (
          <div style={{
            position:"absolute", right:"0.75rem", top:"50%", transform:"translateY(-50%)",
            width:"1.25rem", height:"1.25rem", borderRadius:"50%",
            background:"#0D1117", display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <svg width="8" height="8" viewBox="0 0 12 10" fill="none">
              <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        <input id={id} type="text" placeholder={placeholder} value={value} onChange={onChange}
          onFocus={()=>onFocus(id)} onBlur={onBlur}
          style={{
            width:"100%", background:"transparent", border:"none",
            padding:"0.75rem 2.25rem 0.75rem 0.875rem",
            color:"#0D1117", fontSize:"0.925rem", fontWeight:"500",
            letterSpacing:"-0.01em",
          }}/>
      </div>
      {error && (
        <motion.p
          initial={{opacity:0, y:-4}} animate={{opacity:1, y:0}}
          style={{color:"#EF4444", fontSize:"0.65rem", margin:"0.3rem 0 0 0.125rem", fontWeight:"500", display:"flex", alignItems:"center", gap:"0.25rem"}}>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#EF4444" strokeWidth="1.5"/>
            <path d="M8 5v3.5M8 11v.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}

function FlatPhoneField({ id, label, optional, value, onChange, error, delay, focused, onFocus, onBlur }) {
  const isFocused = focused === id
  return (
    <motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay}}>
      <label style={{display:"block", fontSize:"0.65rem", fontWeight:"600", color:"#9BA5B4", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"0.5rem"}}>
        {label} {optional && <span style={{fontWeight:"400", textTransform:"none", letterSpacing:0, color:"#C4CBD8"}}>(ixtiyoriy)</span>}
      </label>
      <div style={{
        display:"flex", alignItems:"baseline",
        borderBottom:`1.5px solid ${error ? "#EF4444" : isFocused ? "#0D1117" : "#E2E6EC"}`,
        transition:"border-color 0.2s",
      }}>
        <span style={{fontSize:"0.78rem", color:"#BBC4D0", fontWeight:"500", marginRight:"0.375rem", paddingBottom:"0.625rem", flexShrink:0}}>+998</span>
        <input id={id} type="tel" placeholder="90 123 45 67" value={value} onChange={onChange}
          onFocus={()=>onFocus(id)} onBlur={onBlur}
          style={{
            flex:1, background:"transparent", border:"none",
            padding:"0.625rem 0", color:"#0D1117", fontSize:"0.9rem", fontWeight:"500",
          }}/>
      </div>
      {error && <motion.p initial={{opacity:0, y:-4}} animate={{opacity:1, y:0}} style={{color:"#EF4444", fontSize:"0.65rem", margin:"0.3rem 0 0", fontWeight:"500"}}>{error}</motion.p>}
    </motion.div>
  )
}

function Spinner() {
  return (
    <svg style={{animation:"spin 0.8s linear infinite", width:"0.875rem", height:"0.875rem"}} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" style={{opacity:0.15}}/>
      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style={{opacity:0.75}}/>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </svg>
  )
}
